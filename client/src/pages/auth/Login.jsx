import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import Input from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await login(values);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="font-display font-semibold text-2xl text-ink mb-1.5">Welcome back</h2>
      <p className="text-sm text-ink-muted mb-8">Log in to continue tracking your finances.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            icon={Lock}
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3.5 top-[38px] text-ink-faint hover:text-ink-muted"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-mint hover:underline">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          <LogIn size={16} />
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="text-sm text-ink-muted text-center mt-6">
        Don't have an account?{" "}
        <Link to="/signup" className="text-mint font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
