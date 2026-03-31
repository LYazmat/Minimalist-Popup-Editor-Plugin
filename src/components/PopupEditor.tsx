import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';

interface Position {
  top?: number;
  left?: number;
  transformOrigin: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

interface PopupEditorProps {
  trigger: React.ReactElement;
  render: (close: () => void) => React.ReactNode;
  onSave?: (data: any) => void;
  onCancel?: () => void;
  className?: string;
}

export const PopupEditor: React.FC<PopupEditorProps> = ({
  trigger,
  render,
  onSave,
  onCancel,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const popupWidth = 280; // Estimated width
    const popupHeight = 200; // Estimated height
    const margin = 10;

    let placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
    let top = rect.bottom + scrollY + margin;
    let left = rect.left + scrollX + (rect.width / 2) - (popupWidth / 2);

    // Smart positioning logic
    if (rect.bottom + popupHeight > viewportHeight && rect.top > popupHeight) {
      placement = 'top';
      top = rect.top + scrollY - popupHeight - margin;
    } else if (rect.right + popupWidth > viewportWidth && rect.left > popupWidth) {
      placement = 'left';
      left = rect.left + scrollX - popupWidth - margin;
      top = rect.top + scrollY + (rect.height / 2) - (popupHeight / 2);
    } else if (rect.left - popupWidth < 0 && rect.right + popupWidth < viewportWidth) {
      placement = 'right';
      left = rect.right + scrollX + margin;
      top = rect.top + scrollY + (rect.height / 2) - (popupHeight / 2);
    }

    // Boundary checks for left/right alignment
    left = Math.max(margin, Math.min(left, viewportWidth - popupWidth - margin));

    setPosition({
      top,
      left,
      placement,
      transformOrigin: placement === 'top' ? 'bottom center' : 
                       placement === 'bottom' ? 'top center' :
                       placement === 'left' ? 'right center' : 'left center'
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      calculatePosition();
      window.addEventListener('resize', calculatePosition);
      window.addEventListener('scroll', calculatePosition, true);
    }
    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition, true);
    };
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current && 
        !popupRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onCancel?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onCancel]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const close = () => setIsOpen(false);

  return (
    <div className="relative inline-block">
      <div 
        ref={triggerRef} 
        onClick={handleTriggerClick}
        className={`cursor-pointer transition-all duration-200 ${isOpen ? 'ring-2 ring-blue-500 rounded-sm' : ''}`}
      >
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && position && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: position.top! - (triggerRef.current?.getBoundingClientRect().top! + window.scrollY),
              left: position.left! - (triggerRef.current?.getBoundingClientRect().left! + window.scrollX),
              zIndex: 1060, // Higher than Bootstrap modal (1050)
              transformOrigin: position.transformOrigin,
            }}
            className={`bg-white border border-gray-200 rounded-lg shadow-xl p-4 min-w-[260px] ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Arrow indicator */}
            <div 
              className={`absolute w-3 h-3 bg-white border-t border-l border-gray-200 transform rotate-45 
                ${position.placement === 'bottom' ? '-top-1.5 left-1/2 -translate-x-1/2' : ''}
                ${position.placement === 'top' ? '-bottom-1.5 left-1/2 -translate-x-1/2 border-t-0 border-l-0 border-b border-r' : ''}
                ${position.placement === 'right' ? '-left-1.5 top-1/2 -translate-y-1/2 border-t-0 border-l-1 border-b-1 border-r-0' : ''}
                ${position.placement === 'left' ? '-right-1.5 top-1/2 -translate-y-1/2 border-t-1 border-l-0 border-b-0 border-r-1' : ''}
              `}
            />
            
            <div className="relative z-10">
              {render(close)}
              
              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => {
                    onCancel?.();
                    close();
                  }}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1"
                >
                  <X size={14} /> Cancelar
                </button>
                <button
                  onClick={() => {
                    onSave?.({}); // Data should be handled by the render function's internal state
                    close();
                  }}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors flex items-center gap-1"
                >
                  <Check size={14} /> Salvar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
