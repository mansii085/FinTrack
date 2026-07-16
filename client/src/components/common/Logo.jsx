const PulseRupeeMark = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className="text-base shrink-0"
    aria-hidden="true"
  >
    <text
      x="11"
      y="15"
      textAnchor="middle"
      fontSize="17"
      fontWeight="800"
      fill="currentColor"
      fontFamily="'Space Grotesk', sans-serif"
    >
      ₹
    </text>
    <polyline
      points="2,21 6,21 8,17.5 10.5,22 13,18.5 15.5,21 22,21"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Logo = ({ size = "md" }) => {
  const sizes = {
    sm: { box: "w-7 h-7", icon: 18, text: "text-base" },
    md: { box: "w-9 h-9", icon: 23, text: "text-lg" },
    lg: { box: "w-12 h-12", icon: 30, text: "text-2xl" },
  };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${s.box} rounded-lg bg-gradient-to-br from-mint to-indigo flex items-center justify-center shadow-glow shrink-0`}
      >
        <PulseRupeeMark size={s.icon} />
      </div>
      <span className={`font-display font-semibold ${s.text} tracking-tight text-ink`}>
        Fin<span className="text-mint">Track</span>
      </span>
    </div>
  );
};

export default Logo;
