import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = "Are you sure?", description, loading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-rose/10 flex items-center justify-center shrink-0">
          <AlertTriangle size={18} className="text-rose" />
        </div>
        <p className="text-sm text-ink-muted leading-relaxed">
          {description || "This action cannot be undone."}
        </p>
      </div>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn-secondary" disabled={loading}>
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="btn-primary bg-rose hover:bg-rose/90 hover:shadow-none"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
