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
import RouteWrapper from "./routes/CustomRoute.jsx";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route
            element={
              <RouteWrapper type="public">
                <Outlet />
              </RouteWrapper>
            }
          >
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Route>

          <Route
            element={
              <RouteWrapper type="protected">
                <Outlet />
              </RouteWrapper>
            }
          >
            <Route path="/polls" element={<Poll_Page />} />

            <Route
              element={
                <RouteWrapper type="admin">
                  <Outlet />
                </RouteWrapper>
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
