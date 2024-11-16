import React from "react";
import {
    Navigate
} from "react-router-dom";
const LoginChecker = ({ children }) => {
    if (isAuth()) {
        return <Navigate to="/" replace />;
    }
    return children;
};

const isAuth = () => localStorage.getItem('accessToken');

const checkLogin = () => {
    if (isAuth()) {
        window.location.href = '/';  // Force refresh to update auth state
    }
};

export {LoginChecker, checkLogin}