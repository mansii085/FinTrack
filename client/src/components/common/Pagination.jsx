import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4 mt-2 border-t border-surface-border">
      <p className="text-xs text-ink-muted">
        Page <span className="text-ink font-medium">{page}</span> of {pages}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="btn-ghost disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronLeft size={16} />
          Prev
        </button>
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= pages}
          className="btn-ghost disabled:opacity-30 disabled:pointer-events-none"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
