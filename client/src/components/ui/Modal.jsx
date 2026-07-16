import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full ${maxWidth} glass-panel bg-surface-elevated border border-surface-border rounded-xl2 shadow-glass p-6 max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-lg text-ink">{title}</h3>
              <button
                onClick={onClose}
                className="text-ink-muted hover:text-ink rounded-lg p-1 hover:bg-white/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
