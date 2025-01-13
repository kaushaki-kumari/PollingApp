import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles, signup } from "../reducer/authSlice";
import SuccessMessageModal from "../components/SuccessMessageModal";
import NewUsersForm from "../components/NewUsersForm";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const dispatch = useDispatch();
  const { roles, rolesLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleSubmit = async (formData) => {
    const formDataToSend = {
      ...formData,
    };

    try {
      await dispatch(signup(formDataToSend)).unwrap();
      setShowConfirmation(true);
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {!showConfirmation ? (
        <div className="max-w-md w-full space-y-6 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Sign Up
          </h2>
          <NewUsersForm
            onSubmit={handleSubmit}
            roles={roles}
            rolesLoading={rolesLoading}
            submitText="Sign Up"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account ?
              <Link
                to="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      ) : (
        <SuccessMessageModal
          message="Account Successfully Created! Welcome to the Poll Management System."
          buttonText="Go to Login"
          redirectUrl="/login"
        />
      )}
    </div>
  );
};

export default SignUpPage;
