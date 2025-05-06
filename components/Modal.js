// components/Modal.js
import { useEffect } from 'react';
import ReactDOM from 'react-dom';

export default function Modal({ open, onClose, children }) {
  /* lock background scroll when modal is open */
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else      document.body.style.overflow = '';
  }, [open]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}   // prevent backdrop click
      >
        <button className="modal-close" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>,
    document.body
  );
}
