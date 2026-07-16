import { Search, SlidersHorizontal, Download, Plus } from "lucide-react";
import Select from "../ui/Select";

const FilterBar = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories = [],
  showFilters,
  onToggleFilters,
  onDownload,
  onAddNew,
  addLabel = "Add New",
  children,
}) => {
  return (
    <div className="glass-card p-4 mb-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search transactions..."
            className="input-field pl-10"
          />
        </div>

        <Select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          options={[{ label: "All Categories", value: "" }, ...categories.map((c) => ({ label: c.label, value: c.label, icon: c.icon }))]}
          className="sm:w-52"
        />

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={onToggleFilters} className={`btn-secondary ${showFilters ? "border-mint/50 text-mint" : ""}`}>
            <SlidersHorizontal size={15} />
          </button>
          {onDownload && (
            <button onClick={onDownload} className="btn-secondary">
              <Download size={15} />
              <span className="hidden md:inline">Export</span>
            </button>
          )}
          {onAddNew && (
            <button onClick={onAddNew} className="btn-primary">
              <Plus size={15} />
              <span className="hidden sm:inline">{addLabel}</span>
            </button>
          )}
        </div>
      </div>

      {showFilters && <div className="mt-4 pt-4 border-t border-surface-border">{children}</div>}
    </div>
  );
};

export default FilterBar;
