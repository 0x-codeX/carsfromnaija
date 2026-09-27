import { useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";
import API from "../../api/axios";

export default function ResetPassword() {
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
      false,
    );
  const {
    token,
  } =
    useParams();
  const navigate =
    useNavigate();

  const handleReset =
    async (
      e,
    ) => {
      e.preventDefault();
      try {
        await API.put(
          `/auth/resetpassword/${token}`,
          {
            password,
          },
        );
        setSuccess(
          true,
        );
        setTimeout(
          () =>
            navigate(
              "/admin/login",
            ),
          3000,
        );
      } catch (err) {
        setError(
          err
            .response
            ?.data
            ?.message ||
            "Invalid or expired token.",
        );
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Set
          New
          Password
        </h1>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg font-semibold">
            {
              error
            }
          </div>
        )}
        {success ? (
          <div className="p-3 bg-green-100 text-green-700 text-sm rounded-lg font-semibold">
            Password
            updated
            successfully.
            Redirecting
            to
            login...
          </div>
        ) : (
          <form
            onSubmit={
              handleReset
            }
            className="space-y-4"
          >
            <input
              type="password"
              required
              placeholder="New Password"
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
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Save
              Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
