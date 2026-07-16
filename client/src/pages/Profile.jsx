import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Camera, User, Lock, Settings2 } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import { updateProfile, changePassword, updateAvatar } from "../services/miscService";
import { updateUser } from "../redux/slices/authSlice";
import { CURRENCIES } from "../constants/categories";

const TABS = [
  { key: "general", label: "General", icon: User },
  { key: "security", label: "Security", icon: Lock },
  { key: "preferences", label: "Preferences", icon: Settings2 },
];

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [tab, setTab] = useState("general");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [profileForm, setProfileForm] = useState({ fullName: user?.fullName || "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [prefForm, setPrefForm] = useState({
    currency: user?.currency || "INR",
    theme: user?.theme || "dark",
    monthlyBudget: user?.monthlyBudget || 0,
  });

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const { data } = await updateAvatar(formData);
      dispatch(updateUser({ avatar: data.data.avatar }));
      toast.success("Avatar updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not upload avatar.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await updateProfile(profileForm);
      dispatch(updateUser(data.data.user));
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await changePassword(passwordForm);
      toast.success("Password changed successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not change password.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrefSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await updateProfile(prefForm);
      dispatch(updateUser(data.data.user));
      toast.success("Preferences saved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save preferences.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <GlassCard className="mb-5">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-mint/30 to-indigo/30 flex items-center justify-center overflow-hidden">
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-semibold text-ink">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <button
              onClick={handleAvatarClick}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-mint text-base flex items-center justify-center shadow-glow"
            >
              <Camera size={13} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-ink">{user?.fullName}</h2>
            <p className="text-sm text-ink-muted">{user?.email}</p>
          </div>
        </div>
      </GlassCard>

      <div className="flex gap-1 mb-5 border-b border-surface-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key ? "border-mint text-mint" : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      <GlassCard>
        {tab === "general" && (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <Input
              label="Full name"
              value={profileForm.fullName}
              onChange={(e) => setProfileForm({ fullName: e.target.value })}
            />
            <Input label="Email address" value={user?.email} disabled className="opacity-60" />
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Saving..." : "Save changes"}
            </button>
          </form>
        )}

        {tab === "security" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Current password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
            />
            <Input
              label="New password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
            />
            <Input
              label="Confirm new password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            />
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Updating..." : "Change password"}
            </button>
          </form>
        )}

        {tab === "preferences" && (
          <form onSubmit={handlePrefSubmit} className="space-y-4">
            <Select
              label="Currency"
              value={prefForm.currency}
              onChange={(e) => setPrefForm((f) => ({ ...f, currency: e.target.value }))}
              options={CURRENCIES}
            />
            <Select
              label="Theme"
              value={prefForm.theme}
              onChange={(e) => setPrefForm((f) => ({ ...f, theme: e.target.value }))}
              options={[
                { label: "Dark", value: "dark" },
                { label: "Light (coming soon)", value: "light" },
              ]}
            />
            <Input
              label="Monthly budget goal"
              type="number"
              value={prefForm.monthlyBudget}
              onChange={(e) => setPrefForm((f) => ({ ...f, monthlyBudget: e.target.value }))}
            />
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Saving..." : "Save preferences"}
            </button>
          </form>
        )}
      </GlassCard>
    </div>
  );
};

export default Profile;
