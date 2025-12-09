
import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type: AlertType;
  onClose: () => void;
  onConfirm?: () => void; // For confirmation dialogs
  confirmText?: string;
  cancelText?: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ 
  visible, 
  title, 
  message, 
  type, 
  onClose, 
  onConfirm,
  confirmText = "Tamam",
  cancelText = "İptal"
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!show && !visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={32} className="text-green-500" />;
      case 'error': return <AlertOctagon size={32} className="text-red-500" />;
      case 'warning': return <AlertTriangle size={32} className="text-orange-500" />;
      case 'info': return <Info size={32} className="text-blue-500" />;
    }
  };

  const getColors = () => {
      switch (type) {
      case 'success': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning': return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'info': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  }

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border transform transition-all duration-300 ${visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'} overflow-hidden`} style={{borderColor: 'var(--color-border)'}}>
        
        <div className={`p-6 flex flex-col items-center text-center ${getColors()} border-b-0`}>
             <div className="mb-4 p-3 bg-white dark:bg-slate-900 rounded-full shadow-sm">
                 {getIcon()}
             </div>
             <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">{title}</h3>
             <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                 {message}
             </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 flex gap-3">
            {onConfirm ? (
                <>
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                        {cancelText}
                    </button>
                    <button 
                        onClick={() => { onConfirm(); onClose(); }}
                        className={`flex-1 py-3 text-white rounded-xl font-bold transition-colors shadow-lg ${type === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {confirmText}
                    </button>
                </>
            ) : (
                <button 
                    onClick={onClose}
                    className={`w-full py-3 text-white rounded-xl font-bold transition-colors shadow-lg active:scale-95 ${type === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                    Tamam
                </button>
            )}
        </div>

      </div>
    </div>
  );
};

export default CustomAlert;
