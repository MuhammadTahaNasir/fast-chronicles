import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import threading
from .anomaly_detector import AnomalyDetector

# Ensure the watcher is set to the correct tests directory inside the project
WATCHED_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../tests'))
print(f"[FileWatcher] Watching directory: {WATCHED_DIR}")

class ChangeHandler(FileSystemEventHandler):
    def __init__(self, event_list, anomaly_detector):
        self.event_list = event_list
        self.anomaly_detector = anomaly_detector

    def on_any_event(self, event):
        print(f"[FileWatcher] Event: {event.event_type} - {event.src_path}")
        event_data = {
            'event_type': event.event_type,
            'src_path': event.src_path,
            'is_directory': event.is_directory
        }
        self.event_list.append(event_data)
        
        # Check for anomalies
        anomaly_report = self.anomaly_detector.add_event(event_data)
        if anomaly_report:
            print(f"[AnomalyDetector] ALERT: {anomaly_report['severity']} severity anomaly detected!")
            print(f"[AnomalyDetector] Recommendation: {anomaly_report['recommendation']}")
            # Store anomaly report for API access
            self.event_list.append({
                'type': 'anomaly_report',
                'data': anomaly_report
            })

class FileWatcher:
    def __init__(self, path=WATCHED_DIR):
        self.path = path
        self.event_list = []
        self.observer = Observer()
        self.anomaly_detector = AnomalyDetector()
        self.handler = ChangeHandler(self.event_list, self.anomaly_detector)
        self.thread = None
        self.running = False

    def start(self):
        if not self.running:
            print(f"[FileWatcher] Starting observer for: {self.path}")
            self.observer.schedule(self.handler, self.path, recursive=True)
            self.thread = threading.Thread(target=self.observer.start)
            self.thread.start()
            self.running = True

    def stop(self):
        if self.running:
            print(f"[FileWatcher] Stopping observer for: {self.path}")
            if self.observer.is_alive():
                self.observer.stop()
                self.observer.join()
            if self.thread and self.thread.is_alive():
                self.thread.join()
            self.thread = None
            self.observer = Observer()  # Reset observer for next start
            self.running = False

    def get_events(self):
        return list(self.event_list)
    
    def get_anomaly_statistics(self):
        return self.anomaly_detector.get_statistics() 