import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './app/store';
import LoginPage from './pages/LoginPage.jsx';
import Poll_Page from './pages/Poll_Page.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import NavBar from './components/NavBar.jsx';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/pollPage" element={<Poll_Page />} />  
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/nav" element={<NavBar />} /> 
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
