import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NewUsersForm from "../components/NewUsersForm";
import { fetchRoles, createUser } from "../reducer/usersSlice";
import SuccessMessageModal from "../components/SuccessMessageModal";
import { ROLE_USER, ROLE_ADMIN } from "../utils/constant";

const CreateUserPage = () => {
  const dispatch = useDispatch();
  const { roles, isLoading } = useSelector((state) => state.users);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleSubmit = async (formData) => {
    setErrorMessage(null);
    const formDataToSend = {
      ...formData,
      roleId: formData.role === "user" ? ROLE_ADMIN : ROLE_USER,
    };

    try {
      await dispatch(createUser(formDataToSend)).unwrap();
      setShowConfirmation(true);
    } catch (err) {
      setErrorMessage(err);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 bg-gray-50 max-w-lg mx-auto mt-6">
      <h1 className="text-xl font-bold text-center">Create User</h1>
      <NewUsersForm
        onSubmit={handleSubmit}
        roles={roles}
        rolesLoading={isLoading}
        submitText="Create User"
      />
      {errorMessage && <p className="text-red-700 p-3 mb-4">{errorMessage}</p>}

      {showConfirmation && (
        <SuccessMessageModal
          message="User Account Created Successfully! 😌😌"
          buttonText="Okay"
          redirectUrl="/createUser"
        />
      )}
    </div>
  );
};

export default CreateUserPage;
