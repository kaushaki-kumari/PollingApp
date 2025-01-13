import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../reducer/authSlice";
import { handleError } from "../utils/errorHandler";
import { validateEmail } from "../utils/validateEmail";
import { resetError } from "../reducer/authSlice";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    emailError: "",
    passwordError: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  const validateForm = () => {
    const newErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.emailError = emailError;
    }

    if (!formData.password) {
      newErrors.passwordError = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    dispatch(login(formData))
      .unwrap()
      .then(() => {
        navigate("/polls");
      })
      .catch((err) => {
        const errorMessage = handleError(err);
        setErrors((prevErrors) => ({ ...prevErrors, formError: errorMessage }));
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors((prevState) => ({ ...prevState, formError: "" }));
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    const newErrors = { ...errors };
    if (name === "email") {
      newErrors.emailError = validateEmail(value);
    }

    if (name === "password") {
      newErrors.passwordError = value ? "" : "Password is required";
    }

    setErrors(newErrors);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-11/12 space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">Login</h2>
        <form className="mt-8 space-y-3" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                disabled={isLoading}
                className={`mt-1 block w-full px-3 py-2 border rounded-md disabled:bg-gray-100 ${
                  errors.emailError ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.email}
                onChange={handleInputChange}
                onBlur={validateForm}
              />
              {errors.emailError && (
                <p className="text-red-500 text-sm">{errors.emailError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  disabled={isLoading}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md disabled:bg-gray-100 ${
                    errors.passwordError ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEye size={20} />
                  ) : (
                    <FaEyeSlash size={20} />
                  )}
                </button>
              </div>
              {errors.passwordError && (
                <p className="text-red-500 text-sm">{errors.passwordError}</p>
              )}
            </div>
          </div>

          {!errors.emailError && !errors.passwordError && errors.formError && (
            <p className="text-red-500 text-sm">{errors.formError}</p>
          )}

          {error && !errors.emailError && !errors.passwordError && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signUp"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
