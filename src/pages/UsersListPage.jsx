import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../reducer/usersSlice";
import { FaSpinner } from "react-icons/fa";

const UsersListPage = () => {
  const dispatch = useDispatch();
  const { users, isLoading, error, currentPage, hasMore } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    dispatch(fetchUsers({ pageNo: 1 }));
  }, [dispatch]);

  const loadMoreUsers = () => {
    if (hasMore && !isLoading) {
      dispatch(fetchUsers({ pageNo: currentPage + 1 }));
    }
  };

  const renderUsers = () => {
    if (error) return <p className="text-red-500">{error}</p>;
    if (!users.length && !isLoading) return <tr><td><p>No users found.</p></td></tr>;

    return users.map((user) => (
      <tr key={user.id}>
        <td className="border px-4 py-2">{user.id}</td>
        <td className="border px-4 py-2">{user.firstName}</td>
        <td className="border px-4 py-2">{user.lastName}</td>
        <td className="border px-4 py-2">{user.email}</td>
        <td className="border px-4 py-2">{user.companyId || "null"}</td>
        <td className="border px-4 py-2">{user.roleId}</td>
        <td className="border px-4 py-2">
          {new Date(user.createdAt).toLocaleString()}
        </td>
        <td className="border px-4 py-2">
          {new Date(user.updatedAt).toLocaleString()}
        </td>
      </tr>
    ));
  };

  return (
    <div className="p-4">
      <h1 className="text-center text-2xl font-bold mb-4">User List</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">First Name</th>
              <th className="border px-4 py-2">Last Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Company ID</th>
              <th className="border px-4 py-2">Role ID</th>
              <th className="border px-4 py-2">Created At</th>
              <th className="border px-4 py-2">Updated At</th>
            </tr>
          </thead>
          <tbody>{renderUsers()}</tbody>
        </table>
      </div>
      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMoreUsers}
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersListPage;
