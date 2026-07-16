const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-14 px-6">
    {Icon && (
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
        <Icon size={24} className="text-ink-faint" />
      </div>
    )}
    <h4 className="font-display font-medium text-ink mb-1">{title}</h4>
    {description && <p className="text-sm text-ink-muted max-w-xs mb-5">{description}</p>}
    {action}
  </div>
);

export default EmptyState;
