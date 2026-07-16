import { motion } from "framer-motion";

const GlassCard = ({ children, className = "", hover = false, delay = 0, as = "div" }) => {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={hover ? { y: -3, transition: { duration: 0.2 } } : undefined}
      className={`glass-card p-5 ${className}`}
    >
      {children}
    </Comp>
  );
};

export default GlassCard;
