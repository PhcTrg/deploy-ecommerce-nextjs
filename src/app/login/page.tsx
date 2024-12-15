"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState } from "react";
import LoginForm from "./components/login-form";
import RegisterFormComponent from "./components/register-form";
import ForgotPasswordForm from "./components/forgot-password-form";
import { MODE } from "./types";

const LoginPage = () => {
  const router = useRouter();
  const [mode, setMode] = useState(MODE.LOGIN);
  const isLoggedIn = false;

  if (isLoggedIn) {
    router.push("/");
  }

  const renderFormFields = () => {
    switch (mode) {
      case MODE.REGISTER:
        return <RegisterFormComponent setMode={(val: MODE) => setMode(val)} />;
      case MODE.LOGIN:
        return <LoginForm setMode={(val: MODE) => setMode(val)} />;
      case MODE.SEND_EMAIL:
        return (
          <ForgotPasswordForm
            setMode={(val: MODE) => setMode(val)}
            currentMode={MODE.SEND_EMAIL}
          />
        );
      case MODE.RESET_PASSWORD:
        return (
          <ForgotPasswordForm
            setMode={(val: MODE) => setMode(val)}
            currentMode={MODE.RESET_PASSWORD}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <div className="mt-10 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
      {renderFormFields()}
    </div>
  );
};

export default LoginPage;
