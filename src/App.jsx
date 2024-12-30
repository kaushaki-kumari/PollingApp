import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Provider } from "react-redux";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./app/store";
import LoginPage from "./pages/LoginPage.jsx";
import Poll_Page from "./pages/Poll_Page.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import NavBar from "./components/NavBar.jsx";
import AddPollPage from "./pages/AddPollPage.jsx";
import CreateUserPage from "./pages/CreateUserPage.jsx";
import ListUsersPage from "./pages/ListUsersPage.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  return isAuthenticated ? (
    <>
      <NavBar />
      {children}
    </>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  return isAuthenticated ? (
    <Navigate to="/polls" state={{ from: location }} replace />
  ) : (
    children
  );
};

const App = () => {
  return (  
    <Provider store={store}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signUp"
            element={
              <PublicRoute>
                <SignUpPage />
              </PublicRoute>
            }
          />
          <Route
            path="/polls"
            element={
              <ProtectedRoute>
                <Poll_Page />               
              </ProtectedRoute>
            }
          />
           <Route
            path="/addPoll"
            element={
              <ProtectedRoute>
                <AddPollPage />               
              </ProtectedRoute>
            }
          />
          <Route
            path="/CreateUser"
            element={
              <ProtectedRoute>
                <CreateUserPage />               
              </ProtectedRoute>
            }
          />
           <Route
            path="/listUsers"
            element={
              <ProtectedRoute>
                <ListUsersPage />               
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
