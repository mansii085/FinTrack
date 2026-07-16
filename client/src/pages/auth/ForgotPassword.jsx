import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Mail, ArrowLeft, SendHorizontal } from "lucide-react";
import Input from "../../components/ui/Input";
import { forgotPasswordRequest } from "../../services/authService";

const schema = z.object({ email: z.string().email("Enter a valid email") });

const ForgotPassword = () => {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const { data } = await forgotPasswordRequest(values);
      setSent(true);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink mb-6">
        <ArrowLeft size={14} /> Back to login
      </Link>
      <h2 className="font-display font-semibold text-2xl text-ink mb-1.5">Forgot password?</h2>
      <p className="text-sm text-ink-muted mb-8">
        Enter your email and we'll send you a link to reset your password.
      </p>

      {sent ? (
        <div className="glass-card p-5 text-sm text-ink-muted">
          Reset link sent successfully.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            <SendHorizontal size={16} />
            {submitting ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
