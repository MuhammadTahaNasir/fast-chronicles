from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from core.file_watcher import FileWatcher
from core.snapshot import take_snapshot, list_snapshots, get_snapshot, diff_snapshots, restore_snapshot
import threading

app = FastAPI()

# Allow frontend (Vite) to access the backend
import os

# Get CORS origins from environment variable or use default
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

watcher = FileWatcher()
watcher_thread = None
watcher_running = False
watcher_lock = threading.Lock()

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/watcher/start")
def start_watcher():
    global watcher_running
    with watcher_lock:
        if not watcher_running:
            watcher.start()
            watcher_running = True
            return {"status": "started"}
        else:
            return {"status": "already running"}

@app.post("/watcher/stop")
def stop_watcher():
    global watcher_running
    with watcher_lock:
        if watcher_running:
            watcher.stop()
            watcher_running = False
            return {"status": "stopped"}
        else:
            return {"status": "not running"}

@app.get("/watcher/events")
def get_events():
    return JSONResponse(content={"events": watcher.get_events()})

@app.get("/watcher/anomaly-stats")
def get_anomaly_statistics():
    return watcher.get_anomaly_statistics()

@app.get("/watcher/anomaly-reports")
def get_anomaly_reports():
    events = watcher.get_events()
    anomaly_reports = [event for event in events if event.get('type') == 'anomaly_report']
    return {"anomaly_reports": [report['data'] for report in anomaly_reports]}

# --- Snapshot Endpoints ---
@app.post("/snapshots/create")
def create_snapshot():
    snap = take_snapshot()
    return {"timestamp": snap["timestamp"], "file_count": len(snap["files"])}

@app.get("/snapshots/list")
def api_list_snapshots():
    return {"snapshots": list_snapshots()}

@app.get("/snapshots/get")
def api_get_snapshot(index: int = Query(..., description="Snapshot index")):
    snap = get_snapshot(index)
    if snap:
        return snap
    return JSONResponse(content={"error": "Snapshot not found"}, status_code=404)

@app.get("/snapshots/diff")
def api_diff_snapshots(index1: int = Query(..., description="First snapshot index"), index2: int = Query(..., description="Second snapshot index")):
    diff = diff_snapshots(index1, index2)
    if diff is not None:
        return diff
    return JSONResponse(content={"error": "One or both snapshots not found"}, status_code=404)

@app.post("/snapshots/restore")
def api_restore_snapshot(index: int = Query(..., description="Snapshot index")):
    ok = restore_snapshot(index)
    if ok:
        return {"status": "restored", "index": index}
    return JSONResponse(content={"error": "Snapshot not found or restore failed"}, status_code=404) 