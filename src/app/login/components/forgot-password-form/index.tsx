"use client";

import React, { useState } from "react";
import { MODE } from "../../types";
import { Button, Input } from "@nextui-org/react";
import authAPIs from "@/api/auth";
import ResultModal from "@/components/modal/result-modal";

interface IForgotPasswordForm {
  setMode: (val: MODE) => void;
  currentMode: MODE;
}

const ForgotPasswordForm: React.FC<IForgotPasswordForm> = ({
  setMode,
  currentMode,
}) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleSendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const reqBody = { email };
      const res = await authAPIs.forgotPassword(reqBody);

      if (res) {
        setMode(MODE.RESET_PASSWORD);
        setModalContent("OTP has been sent to your email.");
        setIsSuccess(true);
        setIsModalOpen(true);
      }
    } catch (err: any) {
      console.log(err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const reqBody = {
        email,
        otp,
        newPassword,
      };

      const res = await authAPIs.resetPassword(reqBody);

      if (res) {
        setModalContent("Password has been reset successfully.");
        setIsSuccess(true);
        setIsModalOpen(true);
      }
    } catch (err: any) {
      console.log(err);
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <>
        {currentMode === MODE.SEND_EMAIL ? (
          <form className="flex flex-col gap-8" onSubmit={handleSendEmail}>
            <h1 className="text-2xl font-semibold">Forgot Password</h1>

            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="Enter your email"
              labelPlacement="outside"
              className="font-bold"
              isClearable
              onClear={() => setEmail("")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {error && (
              <div className="text-red-500 text-sm" role="alert">
                {error}
              </div>
            )}

            <Button
              className="bg-lama text-white p-2 rounded-md disabled:bg-pink-200 disabled:cursor-not-allowed"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>

            <div
              className="text-sm underline cursor-pointer"
              onClick={() => setMode(MODE.LOGIN)}
            >
              Go back to Login
            </div>
          </form>
        ) : currentMode === MODE.RESET_PASSWORD ? (
          <form className="flex flex-col gap-8" onSubmit={handleResetPassword}>
            <h1 className="text-2xl font-semibold">Reset Password</h1>

            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="Enter your email"
              labelPlacement="outside"
              className="font-bold"
              value={email}
              isReadOnly
            />

            <Input
              type="text"
              name="otp"
              label="OTP"
              placeholder="Enter OTP from your email"
              labelPlacement="outside"
              className="font-bold"
              isClearable
              onClear={() => setOtp("")}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <Input
              type="password"
              name="newPassword"
              label="New Password"
              placeholder="Enter new password"
              labelPlacement="outside"
              className="font-bold"
              isClearable
              onClear={() => setNewPassword("")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Input
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm new password"
              labelPlacement="outside"
              className="font-bold"
              isClearable
              onClear={() => setConfirmPassword("")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {error && (
              <div className="text-red-500 text-sm" role="alert">
                {error}
              </div>
            )}

            <Button
              className="bg-lama text-white p-2 rounded-md disabled:bg-pink-200 disabled:cursor-not-allowed"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>

            <div
              className="text-sm underline cursor-pointer"
              onClick={() => setMode(MODE.SEND_EMAIL)}
            >
              Resend OTP
            </div>
          </form>
        ) : (
          <></>
        )}
      </>

      <ResultModal
        isOpen={isModalOpen}
        onOpenChange={() => setIsModalOpen(false)}
        isSuccess={isSuccess}
        successContent={modalContent}
        onAction={() => {
          if (modalContent == "Password has been reset successfully.")
            setMode(MODE.LOGIN);
        }}
      />
    </>
  );
};

export default ForgotPasswordForm;
