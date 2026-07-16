import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../../constants/categories";

const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

const CategoryBadge = ({ category, icon }) => {
  const meta = ALL_CATEGORIES.find((c) => c.label === category);
  const color = meta?.color || "#8A93A6";

  return (
    <span
      className="pill"
      style={{ backgroundColor: `${color}1A`, color }}
    >
      <span>{icon || meta?.icon || "•"}</span>
      {category}
    </span>
  );
};

export default CategoryBadge;
