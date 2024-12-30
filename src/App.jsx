import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./app/store";
import LoginPage from "./pages/LoginPage.jsx";
import Poll_Page from "./pages/Poll_Page.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import AddPollPage from "./pages/AddPollPage.jsx";
import CreateUserPage from "./pages/CreateUserPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import PublicRoute from "./routes/PublicRouted.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route
            element={
              <PublicRoute>
                <Outlet />
              </PublicRoute>
            }
          >
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/polls" element={<Poll_Page />} />

            <Route
              element={
                <AdminRoute>
                  <Outlet />
                </AdminRoute>
              }
            >
              <Route path="/addPoll" element={<AddPollPage />} />
              <Route path="/createUser" element={<CreateUserPage />} />
              <Route path="/listUsers" element={<UsersPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
