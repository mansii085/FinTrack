import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Mail, Lock, User, Eye, EyeOff, UserPlus } from "lucide-react";
import Input from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";

const schema = z.object({
  fullName: z.string().min(2, "Full name is required").max(60),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/\d/, "Must contain a number")
    .regex(/[A-Z]/, "Must contain an uppercase letter"),
});

const SignUp = () => {
  const { register: registerUser } = useAuth();
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
      await registerUser(values);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="font-display font-semibold text-2xl text-ink mb-1.5">Create your account</h2>
      <p className="text-sm text-ink-muted mb-8">Start tracking your finances in minutes.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full name"
          icon={User}
          placeholder="Jane Doe"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
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
            placeholder="At least 8 characters"
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

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          <UserPlus size={16} />
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-sm text-ink-muted text-center mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-mint font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
