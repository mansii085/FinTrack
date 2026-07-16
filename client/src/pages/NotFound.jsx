import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-base text-center px-6">
    <div>
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-5">
        <Compass size={28} className="text-ink-faint" />
      </div>
      <h1 className="font-display font-semibold text-3xl text-ink mb-2">404</h1>
      <p className="text-ink-muted mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="btn-primary inline-flex">
        Back to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFound;
