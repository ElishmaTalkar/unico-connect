import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Component } from "../../components/ui/sign-in-flo";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { push } = useToast();

  return (
    <Component
      initialMode="login"
      onLogin={async ({ email, password }) => {
        try {
          await login({ email, password });
          push("Logged in successfully", "success");
          navigate("/dashboard");
        } catch (error) {
          const dataErr = error.response?.data;
          const errMsg = dataErr?.error || (dataErr?.errors && dataErr.errors[0]?.message) || "Failed to login";
          push(errMsg, "error");
          throw error;
        }
      }}
    />
  );
};
