import { useEffect } from 'react';
import '../app.css';

function Notification({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="notification-overlay">
      <div className="notification-popup">
        <p>{message}</p>
        <button onClick={onClose} className="notification-button">OK</button>
      </div>
    </div>
  );
}

export default Notification;