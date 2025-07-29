import time
import statistics
from typing import List, Dict, Optional
from collections import deque

class AnomalyDetector:
    def __init__(self, window_size: int = 50):
        """
        Initialize the anomaly detector with a sliding window approach.
        
        Args:
            window_size: Number of recent events to consider for baseline
        """
        self.window_size = window_size
        self.event_history = deque(maxlen=window_size)
        self.file_activity_counts = {}  # Track file activity frequency
        self.suspicious_patterns = []
        
    def add_event(self, event: Dict) -> Optional[Dict]:
        """
        Add a new file system event and check for anomalies.
        
        Args:
            event: Dictionary containing event details
            
        Returns:
            Anomaly report if detected, None otherwise
        """
        timestamp = time.time()
        event_with_time = {
            **event,
            'detection_time': timestamp
        }
        
        self.event_history.append(event_with_time)
        
        # Update file activity counts
        file_path = event.get('src_path', '')
        if file_path:
            self.file_activity_counts[file_path] = self.file_activity_counts.get(file_path, 0) + 1
        
        # Only start detecting after we have enough data
        if len(self.event_history) < 10:
            return None
            
        return self._detect_anomalies()
    
    def _detect_anomalies(self) -> Optional[Dict]:
        """
        Detect anomalies using multiple heuristics.
        
        Returns:
            Anomaly report if detected
        """
        anomalies = []
        
        # 1. Rapid file creation/deletion detection
        rapid_changes = self._detect_rapid_changes()
        if rapid_changes:
            anomalies.append(rapid_changes)
        
        # 2. Suspicious file patterns
        suspicious_files = self._detect_suspicious_patterns()
        if suspicious_files:
            anomalies.append(suspicious_files)
        
        # 3. Unusual file activity frequency
        unusual_activity = self._detect_unusual_activity()
        if unusual_activity:
            anomalies.append(unusual_activity)
        
        if anomalies:
            return {
                'timestamp': time.time(),
                'anomalies': anomalies,
                'severity': self._calculate_severity(anomalies),
                'recommendation': self._generate_recommendation(anomalies)
            }
        
        return None
    
    def _detect_rapid_changes(self) -> Optional[Dict]:
        """Detect rapid file creation/deletion patterns."""
        if len(self.event_history) < 5:
            return None
            
        recent_events = list(self.event_history)[-10:]  # Last 10 events
        time_window = 30  # 30 seconds
        
        # Count events in recent window
        recent_time = time.time()
        events_in_window = [
            e for e in recent_events 
            if recent_time - e['detection_time'] <= time_window
        ]
        
        if len(events_in_window) > 8:  # More than 8 events in 30 seconds
            return {
                'type': 'rapid_changes',
                'description': f'High file activity detected: {len(events_in_window)} events in {time_window}s',
                'events_count': len(events_in_window),
                'time_window': time_window
            }
        
        return None
    
    def _detect_suspicious_patterns(self) -> Optional[Dict]:
        """Detect suspicious file patterns (e.g., ransomware-like behavior)."""
        suspicious_extensions = {'.encrypted', '.locked', '.crypto', '.crypt'}
        suspicious_keywords = {'ransom', 'encrypt', 'decrypt', 'pay', 'bitcoin'}
        
        recent_events = list(self.event_history)[-20:]  # Last 20 events
        
        suspicious_files = []
        for event in recent_events:
            file_path = event.get('src_path', '').lower()
            
            # Check for suspicious extensions
            if any(ext in file_path for ext in suspicious_extensions):
                suspicious_files.append({
                    'file': file_path,
                    'reason': 'suspicious_extension',
                    'event_type': event.get('event_type', 'unknown')
                })
            
            # Check for suspicious keywords in filename
            if any(keyword in file_path for keyword in suspicious_keywords):
                suspicious_files.append({
                    'file': file_path,
                    'reason': 'suspicious_keyword',
                    'event_type': event.get('event_type', 'unknown')
                })
        
        if suspicious_files:
            return {
                'type': 'suspicious_patterns',
                'description': f'Found {len(suspicious_files)} suspicious files',
                'suspicious_files': suspicious_files
            }
        
        return None
    
    def _detect_unusual_activity(self) -> Optional[Dict]:
        """Detect unusual file activity patterns."""
        if len(self.event_history) < 20:
            return None
            
        # Calculate baseline activity
        all_events = list(self.event_history)
        event_types = [e.get('event_type', 'unknown') for e in all_events]
        
        # Count event types
        event_counts = {}
        for event_type in event_types:
            event_counts[event_type] = event_counts.get(event_type, 0) + 1
        
        # Check for unusual patterns
        unusual_patterns = []
        
        # Too many deletions
        if event_counts.get('deleted', 0) > len(all_events) * 0.7:  # More than 70% deletions
            unusual_patterns.append({
                'pattern': 'mass_deletion',
                'description': f'High deletion rate: {event_counts.get("deleted", 0)} deletions',
                'percentage': (event_counts.get('deleted', 0) / len(all_events)) * 100
            })
        
        # Too many creations
        if event_counts.get('created', 0) > len(all_events) * 0.8:  # More than 80% creations
            unusual_patterns.append({
                'pattern': 'mass_creation',
                'description': f'High creation rate: {event_counts.get("created", 0)} creations',
                'percentage': (event_counts.get('created', 0) / len(all_events)) * 100
            })
        
        if unusual_patterns:
            return {
                'type': 'unusual_activity',
                'description': f'Detected {len(unusual_patterns)} unusual activity patterns',
                'patterns': unusual_patterns
            }
        
        return None
    
    def _calculate_severity(self, anomalies: List[Dict]) -> str:
        """Calculate overall severity of detected anomalies."""
        severity_scores = {
            'rapid_changes': 2,
            'suspicious_patterns': 3,
            'unusual_activity': 2
        }
        
        total_score = 0
        for anomaly in anomalies:
            total_score += severity_scores.get(anomaly['type'], 1)
        
        if total_score >= 5:
            return 'HIGH'
        elif total_score >= 3:
            return 'MEDIUM'
        else:
            return 'LOW'
    
    def _generate_recommendation(self, anomalies: List[Dict]) -> str:
        """Generate recommendations based on detected anomalies."""
        recommendations = []
        
        for anomaly in anomalies:
            if anomaly['type'] == 'rapid_changes':
                recommendations.append("Monitor file activity closely - high change rate detected")
            elif anomaly['type'] == 'suspicious_patterns':
                recommendations.append("Check for potential ransomware activity - suspicious files detected")
            elif anomaly['type'] == 'unusual_activity':
                recommendations.append("Review file operations - unusual activity patterns detected")
        
        return "; ".join(recommendations) if recommendations else "No immediate action required"
    
    def get_statistics(self) -> Dict:
        """Get current detection statistics."""
        return {
            'total_events_processed': len(self.event_history),
            'suspicious_patterns_detected': len(self.suspicious_patterns),
            'file_activity_count': len(self.file_activity_counts),
            'window_size': self.window_size
        } 