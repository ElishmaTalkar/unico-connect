import { X } from 'lucide-react';
import '../../styles/toast.css';
import { useToast } from '../../context/ToastContext';
import { createPortal } from 'react-dom';

export const ToastContainer = () => {
    const { toasts, dismiss } = useToast();

    if (toasts.length === 0) return null;

    return createPortal(
        <div className="toast-container">
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast toast-${toast.type}`}>
                    <span>{toast.message}</span>
                    <button className="toast-close" onClick={() => dismiss(toast.id)}>
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>,
        document.body
    );
};
