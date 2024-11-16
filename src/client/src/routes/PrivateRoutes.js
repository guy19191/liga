import { Navigate, Outlet } from "react-router-dom";
import React from 'react';

const Protected = () => {
    const token = localStorage.getItem("accessToken");
    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default Protected;