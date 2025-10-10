import { createContext, useContext, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import {AlertCircle, AlertTriangle, CheckSquare, Info} from "lucide-react";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const newToast = { id, message, type, duration };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message, duration) => showToast(message, 'success', duration);
  const error = (message, duration) => showToast(message, 'danger', duration);
  const warning = (message, duration) => showToast(message, 'warning', duration);
  const info = (message, duration) => showToast(message, 'info', duration);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckSquare size={18} strokeWidth={2} />;
      case 'danger':
        return <AlertCircle size={18} color="#dc3545" strokeWidth={2} />;
      case 'warning':
        return <AlertTriangle size={18} color="#eab308" strokeWidth={2} />;
      case 'info':
      default:
        return <Info size={18} color="#0d7ef0ff" strokeWidth={2} />;
    }
  };

  const getBackgroundClass = (type) => {
    switch (type) {
      case 'success':
        return 'bg-success';
      case 'danger':
        return 'bg-danger';
      case 'warning':
        return 'bg-warning';
      case 'info':
      default:
        return 'bg-info';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      
      <ToastContainer 
        position="top-end" 
        className="p-3" 
        style={{ zIndex: 9999, position: "fixed" }}
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            onClose={() => removeToast(toast.id)}
            show={true}
            autohide
            delay={toast.duration}
            className={`${getBackgroundClass(toast.type)} text-white`}
          >
            <Toast.Header closeButton={true}>
              <span className="me-2 fs-5">{getIcon(toast.type)}</span>
              <strong className="me-auto text-capitalize">{toast.type}</strong>
            </Toast.Header>
            <Toast.Body>{toast.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};