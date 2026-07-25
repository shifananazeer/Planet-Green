import { createPortal } from "react-dom";

export default function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: any) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-2xl">
        <h3 className="text-xl font-bold mb-3">
          {title}
        </h3>

        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border py-3 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-3 rounded-xl"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}