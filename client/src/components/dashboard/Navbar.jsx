import { Menu } from "lucide-react";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/income": "Income",
  "/expense": "Expenses",
  "/transactions": "Transactions",
  "/analytics": "Analytics",
  "/budget": "Budget Planner",
  "/goals": "Savings Goals",
  "/profile": "Profile",
};

const Navbar = ({ onMenuClick, pathname }) => {
  const title = PAGE_TITLES[pathname] || "FinTrack";
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <header className="sticky top-0 z-30 bg-base/80 backdrop-blur-xl border-b border-surface-border">
      <div className="flex items-center justify-between px-5 md:px-8 h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-white/5"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="font-display font-semibold text-lg text-ink leading-tight">{title}</h1>
            <p className="text-xs text-ink-faint hidden sm:block">{today}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
