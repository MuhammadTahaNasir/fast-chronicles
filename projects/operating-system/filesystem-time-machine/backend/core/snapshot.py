import os
import time
import shutil
from typing import List, Dict

# Ensure the snapshot logic uses the correct 'tests' directory
WATCHED_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../tests'))
print(f"[Snapshot] Scanning directory: {WATCHED_DIR}")

_snapshots: List[Dict] = []

def take_snapshot(path=WATCHED_DIR):
    print(f"[Snapshot] Taking snapshot of: {path}")
    snapshot = {
        'timestamp': time.time(),
        'files': []
    }
    
    for root, dirs, files in os.walk(path):
        for name in files:
            file_path = os.path.join(root, name)
            rel_path = os.path.relpath(file_path, path)
            stat = os.stat(file_path)
            
            # Read file content
            try:
                with open(file_path, 'rb') as f:
                    content = f.read()
                file_data = {
                    'path': rel_path,
                    'size': stat.st_size,
                    'mtime': stat.st_mtime,
                    'content': content,
                    'permissions': oct(stat.st_mode)[-3:],
                    'uid': stat.st_uid if hasattr(stat, 'st_uid') else None,
                    'gid': stat.st_gid if hasattr(stat, 'st_gid') else None
                }
            except Exception as e:
                print(f"[Snapshot] Error reading file {file_path}: {e}")
                file_data = {
                    'path': rel_path,
                    'size': stat.st_size,
                    'mtime': stat.st_mtime,
                    'content': b'',  # Empty content if can't read
                    'permissions': oct(stat.st_mode)[-3:],
                    'uid': stat.st_uid if hasattr(stat, 'st_uid') else None,
                    'gid': stat.st_gid if hasattr(stat, 'st_gid') else None
                }
            
            snapshot['files'].append(file_data)
    
    _snapshots.append(snapshot)
    print(f"[Snapshot] Created snapshot with {len(snapshot['files'])} files")
    return snapshot

def list_snapshots():
    return [
        {
            'timestamp': s['timestamp'],
            'file_count': len(s['files'])
        } for s in _snapshots
    ]

def get_snapshot(index):
    if 0 <= index < len(_snapshots):
        return _snapshots[index]
    return None

def diff_snapshots(index1, index2):
    s1 = get_snapshot(index1)
    s2 = get_snapshot(index2)
    if not s1 or not s2:
        return None
    
    files1 = {f['path']: f for f in s1['files']}
    files2 = {f['path']: f for f in s2['files']}
    
    added = [files2[p] for p in files2 if p not in files1]
    removed = [files1[p] for p in files1 if p not in files2]
    changed = [
        files2[p] for p in files1 if p in files2 and (
            files1[p]['size'] != files2[p]['size'] or 
            files1[p]['mtime'] != files2[p]['mtime'] or
            files1[p]['content'] != files2[p]['content']
        )
    ]
    
    return {
        'added': added,
        'removed': removed,
        'changed': changed
    }

def restore_snapshot(index, path=WATCHED_DIR):
    snap = get_snapshot(index)
    if not snap:
        return False
    
    print(f"[Snapshot] Restoring to snapshot #{index} with {len(snap['files'])} files")
    
    # Remove all files in the watched directory
    for root, dirs, files in os.walk(path):
        for name in files:
            try:
                os.remove(os.path.join(root, name))
                print(f"[Snapshot] Removed: {os.path.join(root, name)}")
            except Exception as e:
                print(f"[Snapshot] Error removing file: {e}")
    
    # Restore files from snapshot with their content
    restored_count = 0
    for f in snap['files']:
        file_path = os.path.join(path, f['path'])
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            
            # Write file with its original content
            with open(file_path, 'wb') as out:
                out.write(f['content'])
            
            # Restore original modification time
            os.utime(file_path, (f['mtime'], f['mtime']))
            
            restored_count += 1
            print(f"[Snapshot] Restored: {f['path']} ({len(f['content'])} bytes)")
            
        except Exception as e:
            print(f"[Snapshot] Error restoring file {f['path']}: {e}")
    
    print(f"[Snapshot] Successfully restored {restored_count} files to snapshot #{index}")
    return True 