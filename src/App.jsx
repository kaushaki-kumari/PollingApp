import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage.jsx";
import PollPage from "./pages/PollPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import AddPollPage from "./pages/AddPollPage.jsx";
import CreateUserPage from "./pages/CreateUserPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import RouteWrapper from "./routes/CustomRoute.jsx";
import EditPoll from "./components/EditPoll.jsx";

const App = () => {
  return (
    <Router>
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
          <Route path="/polls" element={<PollPage />} />

          <Route
            element={
              <RouteWrapper type="admin">
                <Outlet />
              </RouteWrapper>
            }
          >
            <Route path="/addPoll" element={<AddPollPage />} />
            <Route path="/poll/edit/:pollId" element={<EditPoll />} />
            <Route path="/createUser" element={<CreateUserPage />} />
            <Route path="/listUsers" element={<UsersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
