import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, fetchRoles } from "../reducer/usersSlice";
import { GrPrevious, GrNext } from "react-icons/gr";
import { TableSkeleton } from "../components/Skeleton";

const UsersListPage = () => {
  const dispatch = useDispatch();
<<<<<<< HEAD
  const { users,roles, isLoading, error, currentPage, totalPages } = useSelector(
    (state) => state.users
  );

  const [pageSize, setPageSize] = useState(10);

=======
  const { users, roles, isLoading, error, currentPage, totalPages } =
    useSelector((state) => state.users);

  const [pageSize, setPageSize] = useState(10);
>>>>>>> main
  const pageSizes = [5, 10, 20, 50];

  useEffect(() => {
    dispatch(fetchUsers({ pageNo: 1, pageSize }));
    dispatch(fetchRoles());
<<<<<<< HEAD
  }, []);
=======
  }, [dispatch, pageSize]);
>>>>>>> main

  const loadPage = (pageNo) => {
    if (!isLoading && pageNo > 0 && pageNo <= totalPages) {
      dispatch(fetchUsers({ pageNo, pageSize }));
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
    dispatch(fetchUsers({ pageNo: 1, pageSize: newSize }));
  };

  const renderPagination = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => loadPage(currentPage - 1)}
          className={`px-3 py-2 mx-1 rounded ${
            currentPage === 1 || isLoading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          }`}
          disabled={currentPage === 1 || isLoading}
        >
          <GrPrevious />
        </button>
        {startPage > 1 && (
          <>
            <button
              onClick={() => loadPage(1)}
              className={`px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300 ${
                isLoading ? "cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => loadPage(page)}
            className={`px-3 py-1 mx-1 rounded ${
              page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            } ${isLoading ? "cursor-not-allowed" : ""}`}
            disabled={isLoading}
          >
            {page}
          </button>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => loadPage(totalPages)}
              className={`px-3 py-1 mx-1 rounded ${
                isLoading
                  ? " bg-gray-200 cursor-not-allowed"
                  : "bg-gray-300 hover:bg-gray-200"
              }`}
              disabled={isLoading}
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => loadPage(currentPage + 1)}
          className={`px-3 py-2 mx-1 rounded ${
            currentPage === totalPages || isLoading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          }`}
          disabled={currentPage === totalPages || isLoading}
        >
          <GrNext />
        </button>
      </div>
    );
  };

  const renderUsers = () => {
    if (error) return <p className="text-red-500">{error}</p>;
    if (!users.length && !isLoading)
      return (
        <tr>
          <td colSpan="7" className="text-center py-4">
            No users found.
          </td>
        </tr>
      );

<<<<<<< HEAD
    return users.map((user) => {
      const userRole = roles.find((role) => role.id === user.roleId);
      return (
        <tr key={user.id}>
          <td className="border px-4 py-2">{user.id}</td>
          <td className="border px-4 py-2">{user.firstName}</td>
          <td className="border px-4 py-2">{user.lastName}</td>
          <td className="border px-4 py-2">{user.email}</td>
          <td className="border px-4 py-2">
          {userRole ? userRole.name : "Unknown"}
          </td>
          <td className="border px-4 py-2">
            {new Date(user.createdAt).toLocaleString()}
          </td>
          <td className="border px-4 py-2">
            {new Date(user.updatedAt).toLocaleString()}
          </td>
        </tr>
      );
    });
=======
    return users.map((user) => (
      <tr key={user.id}>
        <td className="border px-4 py-2">{user.id}</td>
        <td className="border px-4 py-2">{user.firstName}</td>
        <td className="border px-4 py-2">{user.lastName}</td>
        <td className="border px-4 py-2">{user.email}</td>
        <td className="border px-4 py-2">
          {roles.find((role) => role.id === user.roleId)?.name || "Unknown"}
        </td>
        <td className="border px-4 py-2">
          {new Date(user.createdAt).toLocaleString()}
        </td>
        <td className="border px-4 py-2">
          {new Date(user.updatedAt).toLocaleString()}
        </td>
      </tr>
    ));
>>>>>>> main
  };

  return (
    <div className=" min-h-screen pt-20 pb-8 px-4 bg-gray-50 p-4">
      <h1 className="text-center text-2xl font-bold mb-4">User List</h1>

      <div className="overflow-x-auto">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">First Name</th>
                <th className="border px-4 py-2">Last Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Created At</th>
                <th className="border px-4 py-2">Updated At</th>
              </tr>
            </thead>
            <tbody>{renderUsers()}</tbody>
          </table>
        )}
      </div>

      <div className="block md:flex justify-center gap-6">
        <div className="mt-4 flex justify-center">
          <label htmlFor="pageSize" className="mr-2 font-bold">
            Users per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="px-2 py-1 border rounded"
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        {renderPagination()}
      </div>
    </div>
  );
};

export default UsersListPage;
