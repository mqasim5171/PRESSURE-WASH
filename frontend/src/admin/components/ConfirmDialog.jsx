import React from "react";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ open, title, description, confirmLabel = "Delete", onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <h3 className="font-bold text-slate-900">{title}</h3>
        {description && <p className="text-sm text-slate-500 mt-1.5">{description}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
