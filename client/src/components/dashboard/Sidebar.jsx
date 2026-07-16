import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  Receipt,
  BarChart3,
  PiggyBank,
  Target,
  User,
  LogOut,
} from "lucide-react";
import Logo from "../common/Logo";
import { useAuth } from "../../hooks/useAuth";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/income", label: "Income", icon: ArrowUpCircle },
  { to: "/expense", label: "Expenses", icon: ArrowDownCircle },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/budget", label: "Budget Planner", icon: PiggyBank },
  { to: "/goals", label: "Savings Goals", icon: Target },
  { to: "/profile", label: "Profile", icon: User },
];

const Sidebar = ({ mobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onCloseMobile} />
      )}
      <motion.aside
        initial={false}
        animate={{ x: 0 }}
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 shrink-0 z-50 lg:z-0 bg-surface/80 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none border-r border-surface-border flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 pb-4">
          <Logo />
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-mint/10 text-mint"
                    : "text-ink-muted hover:text-ink hover:bg-white/5"
                }`
              }
            >
              <item.icon size={17} strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-surface-border">
          <div className="flex items-center gap-3 px-2 py-2 mb-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-mint/30 to-indigo/30 flex items-center justify-center overflow-hidden shrink-0">
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-semibold text-ink">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink truncate">{user?.fullName}</p>
              <p className="text-xs text-ink-faint truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-ink-muted hover:text-rose hover:bg-rose/10 transition-colors"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
