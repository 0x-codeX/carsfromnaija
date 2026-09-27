import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function Login() {
  const [
    email,
    setEmail,
  ] =
    useState(
      "",
    );
  const [
    password,
    setPassword,
  ] =
    useState(
      "",
    );
  const [
    error,
    setError,
  ] =
    useState(
      "",
    );
  const [
    success,
    setSuccess,
  ] =
    useState(
      "",
    );
  const [
    loading,
    setLoading,
  ] =
    useState(
      false,
    );
  const [
    isForgotPassword,
    setIsForgotPassword,
  ] =
    useState(
      false,
    );
  const navigate =
    useNavigate();

  const handleLogin =
    async (
      e,
    ) => {
      e.preventDefault();
      setError(
        "",
      );
      setLoading(
        true,
      );
      try {
        const res =
          await API.post(
            "/auth/login",
            {
              email,
              password,
            },
          );
        localStorage.setItem(
          "token",
          res
            .data
            .token,
        );
        navigate(
          "/admin",
        );
      } catch (err) {
        setError(
          err
            .response
            ?.data
            ?.message ||
            "Invalid credentials.",
        );
      } finally {
        setLoading(
          false,
        );
      }
    };

  const handleForgotSubmit =
    async (
      e,
    ) => {
      e.preventDefault();
      setError(
        "",
      );
      setSuccess(
        "",
      );
      setLoading(
        true,
      );
      try {
        const res =
          await API.post(
            "/auth/forgotpassword",
            {
              email,
            },
          );
        setSuccess(
          res
            .data
            .message,
        );
      } catch (err) {
        setError(
          err
            .response
            ?.data
            ?.message ||
            "Error processing request.",
        );
      } finally {
        setLoading(
          false,
        );
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Admin
          Portal
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          {isForgotPassword
            ? "Enter your email to receive a secure reset link."
            : "Sign in to manage inventory and leads."}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg font-semibold">
            {
              error
            }
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 text-sm rounded-lg font-semibold">
            {
              success
            }
          </div>
        )}

        {!isForgotPassword ? (
          <form
            onSubmit={
              handleLogin
            }
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Email
                Address
              </label>
              <input
                type="email"
                required
                value={
                  email
                }
                onChange={(
                  e,
                ) =>
                  setEmail(
                    e
                      .target
                      .value,
                  )
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={
                  password
                }
                onChange={(
                  e,
                ) =>
                  setPassword(
                    e
                      .target
                      .value,
                  )
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={() =>
                setIsForgotPassword(
                  true,
                )
              }
              className="text-sm font-bold text-blue-600 hover:text-blue-800"
            >
              Forgot
              Password?
            </button>
            <button
              type="submit"
              disabled={
                loading
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md disabled:bg-blue-300"
            >
              {loading
                ? "Authenticating..."
                : "Sign In"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={
              handleForgotSubmit
            }
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Account
                Email
              </label>
              <input
                type="email"
                required
                value={
                  email
                }
                onChange={(
                  e,
                ) =>
                  setEmail(
                    e
                      .target
                      .value,
                  )
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() =>
                  setIsForgotPassword(
                    false,
                  )
                }
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={
                  loading
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md disabled:bg-blue-300"
              >
                {loading
                  ? "Sending..."
                  : "Send Link"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
