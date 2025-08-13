import React, { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Show modal immediately when opening
      setIsVisible(true);
      
      // Small delay to ensure proper positioning before scroll
      setTimeout(() => {
        if (modalRef.current) {
          // Scroll to modal with smooth animation
          modalRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
          });
          
          // Also scroll the modal content to top if it has scrollable content
          const modalContent = modalRef.current.querySelector('.modal');
          if (modalContent) {
            modalContent.scrollTop = 0;
          }
        }
      }, 10);
    } else {
      // Hide modal when closing
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal ${isVisible ? 'show' : ''}`} 
        ref={modalRef} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
