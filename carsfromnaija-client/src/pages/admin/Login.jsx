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
    loading,
    setLoading,
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Admin
          Portal
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          Sign
          in
          to
          manage
          inventory
          and
          leads.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg font-semibold">
            {
              error
            }
          </div>
        )}

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
      </div>
    </div>
  );
}
