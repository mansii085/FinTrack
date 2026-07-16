import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { setCredentials, logout as logoutAction } from "../redux/slices/authSlice";
import { loginRequest, registerRequest } from "../services/authService";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  const login = async (payload) => {
    const { data } = await loginRequest(payload);
    dispatch(setCredentials(data.data));
    toast.success(data.message || "Welcome back!");
    navigate("/dashboard");
  };

  const register = async (payload) => {
    const { data } = await registerRequest(payload);
    dispatch(setCredentials(data.data));
    toast.success(data.message || "Account created!");
    navigate("/dashboard");
  };

  const logout = () => {
    dispatch(logoutAction());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return { user, token, isAuthenticated, login, register, logout };
};
