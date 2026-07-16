import { motion } from "framer-motion";
import { useCountUp } from "../../hooks/useCountUp";
import { formatCurrency } from "../../utils/formatters";

/**
 * BalancePulse — the dashboard's signature element.
 * A large mono-font balance figure with a live sparkline drawn through it
 * and an ambient glow that shifts hue based on trend direction.
 */
const BalancePulse = ({ balance = 0, trendPositive = true, currency = "INR", sparkline = [] }) => {
  const animated = useCountUp(balance, 900);

  const points = sparkline.length > 1 ? sparkline : [0, 0.3, 0.2, 0.5, 0.4, 0.7, 0.6, 1];
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const w = 320;
  const h = 64;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - ((p - min) / range) * h}`)
    .join(" ");

  const glow = trendPositive ? "rgba(52,229,168,0.35)" : "rgba(251,113,133,0.3)";
  const stroke = trendPositive ? "#34E5A8" : "#FB7185";

  return (
    <div className="relative overflow-hidden glass-card p-6 md:p-8">
      <div
        className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl animate-pulseGlow pointer-events-none"
        style={{ background: glow }}
      />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium tracking-wider text-ink-muted uppercase mb-2">
            Total Balance
          </p>
          <div className="flex items-baseline gap-2">
            <span className="stat-number text-4xl md:text-5xl font-semibold text-ink">
              {formatCurrency(animated, currency)}
            </span>
          </div>
          <p className={`text-xs mt-2 ${trendPositive ? "text-mint" : "text-rose"}`}>
            {trendPositive ? "↑ Trending up this month" : "↓ Trending down this month"}
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-6 -mx-2">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pulseFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d={`${path} L ${w} ${h} L 0 ${h} Z`}
            fill="url(#pulseFill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
          <motion.path
            d={path}
            fill="none"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />
        </svg>
      </div>
    </div>
  );
};

export default BalancePulse;
