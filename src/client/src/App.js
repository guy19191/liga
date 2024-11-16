import React, { useState } from 'react';
import AuthForm from './components/AuthForm';
import EventListing from './components/EventListing';
import './App.css';
import ManagerBetControl from "./components/ManagerBetControl";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import Router from "./routes/Router";



const App = () => {
  return (
      <div className = "container">
        <Router />
      </div>
  );
};

export default App;