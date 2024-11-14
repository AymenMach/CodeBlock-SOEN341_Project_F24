import React, { useEffect, useState } from 'react';
import './Notification.css';

const ToastNotification = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose && typeof onClose === 'function') {
          onClose();
        }
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`toast-notification ${type}`}>
      <p>{message}</p>
    </div>
  );
};

export default ToastNotification;
