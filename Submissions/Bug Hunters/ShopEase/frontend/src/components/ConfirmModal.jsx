// src/components/ConfirmModal.jsx
import React from "react";

export default function ConfirmModal({ open, title = "Are you sure?", onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-700 rounded">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 rounded">Delete</button>
        </div>
      </div>
    </div>
  );
}
