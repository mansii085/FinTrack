import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Lock, KeyRound } from "lucide-react";
import Input from "../../components/ui/Input";
import { resetPasswordRequest } from "../../services/authService";

const schema = z
  .object({
    password: z.string().min(8, "At least 8 characters").regex(/\d/, "Must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ password }) => {
    setSubmitting(true);
    try {
      const { data } = await resetPasswordRequest(token, { password });
      toast.success(data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset link is invalid or expired.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="font-display font-semibold text-2xl text-ink mb-1.5">Reset your password</h2>
      <p className="text-sm text-ink-muted mb-8">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="New password"
          type="password"
          icon={Lock}
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm new password"
          type="password"
          icon={KeyRound}
          placeholder="Re-enter password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Resetting..." : "Reset password"}
        </button>
      </form>

      <p className="text-sm text-ink-muted text-center mt-6">
        Remembered it?{" "}
        <Link to="/login" className="text-mint font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default ResetPassword;
