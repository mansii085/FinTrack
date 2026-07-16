import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, ShieldCheck, Sparkles } from "lucide-react";
import Logo from "../components/common/Logo";

const HIGHLIGHTS = [
  { icon: TrendingUp, text: "Visualize spending patterns across every category" },
  { icon: Sparkles, text: "Get intelligent, data-driven financial insights" },
  { icon: ShieldCheck, text: "Bank-grade security with encrypted authentication" },
];

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-base">
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden border-r border-surface-border p-12 flex-col justify-between">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, rgba(52,229,168,0.12), transparent 45%), radial-gradient(circle at 80% 80%, rgba(129,140,248,0.12), transparent 45%)",
          }}
        />
        <Logo size="lg" />

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl font-semibold text-ink leading-tight mb-6 max-w-md"
          >
            Your money,
            <br />
            <span className="text-mint">finally in focus.</span>
          </motion.h2>

          <div className="space-y-4">
            {HIGHLIGHTS.map((h, i) => (
              <motion.div
                key={h.text}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-surface-border flex items-center justify-center shrink-0">
                  <h.icon size={16} className="text-mint" />
                </div>
                <p className="text-sm text-ink-muted">{h.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-xs text-ink-faint">© {new Date().getFullYear()} FinTrack. All rights reserved.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="md" />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
