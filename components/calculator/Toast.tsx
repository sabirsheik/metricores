"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div
      className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      id="toast-container"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          let Icon = Info;
          let iconColor = 'text-blue-500';
          let borderColor = 'border-zinc-200';

          if (isSuccess) {
            Icon = CheckCircle;
            iconColor = 'text-green-600';
          } else if (isError) {
            Icon = AlertTriangle;
            iconColor = 'text-red-500';
          } else if (isWarning) {
            Icon = AlertTriangle;
            iconColor = 'text-amber-500';
          }

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={`pointer-events-auto flex items-center justify-between p-3.5 bg-white border ${borderColor} rounded-xl shadow-lg ring-1 ring-black/5`}
              id={`toast-item-${toast.id}`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4.5 h-4.5 ${iconColor} shrink-0`} />
                <span className="text-xs font-semibold font-sans text-zinc-800 leading-normal">
                  {toast.message}
                </span>
              </div>
              <button
                onClick={() => onRemove(toast.id)}
                className="ml-4 text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-200 rounded p-0.5"
                id={`toast-close-${toast.id}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
