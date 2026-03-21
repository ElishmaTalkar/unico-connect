import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Component } from "../../components/ui/sign-in-flo";

export const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { push } = useToast();

  return (
    <Component
      initialMode="signup"
      onSignup={async ({ name, email, password }) => {
        try {
          await signup({ name, email, password });
          push("Account created successfully", "success");
          navigate("/dashboard");
        } catch (error) {
          const dataErr = error.response?.data;
          const errMsg =
            dataErr?.error || (dataErr?.errors && dataErr.errors[0]?.message) || "Failed to create account";
          push(errMsg, "error");
          throw error;
        }
      }}
    />
  );
};
