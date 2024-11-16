import { Navigate, Outlet } from "react-router-dom";
import React, {useEffect, useState} from 'react';
import {axiosInstance} from "../store/request";

const hasPermission = async () => {
    let hasPermit;
     try {
            const manager = await axiosInstance.get('/auth/v1/getPermission?role=manager');
            hasPermit = manager.data;
            } catch (e) {
            hasPermit = false
            }
    return hasPermit;
}
const ManagerRoutes = () => {

    const manager =  hasPermission();
    return manager ? <Outlet /> : <Navigate to="/" />;
};

export default ManagerRoutes;

