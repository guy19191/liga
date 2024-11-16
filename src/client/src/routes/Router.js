import {
    Route,
    BrowserRouter,
    Routes
} from "react-router-dom";
import AuthForm from '../components/AuthForm';
import Protected from "./PrivateRoutes";
import ManagerRoutes from './managerRoutes'
import ManagerBetControl from "../components/ManagerBetControl";
import EventListing from "../components/EventListing";
import React from 'react';
import {LoginChecker, checkLogin} from "./helpers";
import LeagueTable from "../components/LeagueTable";
import UserProfile from "../components/UserProfile";
import RulesComponent from "../components/RulesComponent";
import SignupForm from "../components/SignupForm";

const Router = () => {
    return(
        <BrowserRouter>
            <Routes>
            <Route path="/">
                <Route element={<Protected />}>
                    <Route element={<ManagerRoutes/>}>
                    <Route path="manager" element={<ManagerBetControl />} />
                </Route>
                <Route index element={<EventListing />} />
                    <Route path="league" element={<LeagueTable />} />
                    <Route path="rules" element={<RulesComponent />} />
                    <Route path="profile" element={<UserProfile />} />
                </Route>
                <Route path="login"  element={
                    <LoginChecker>
                        <AuthForm loginCheck={checkLogin} />
                    </LoginChecker>
                } />
                <Route path="Signup"  element={
                    <LoginChecker>
                        <SignupForm loginCheck={checkLogin} />
                    </LoginChecker>
                } />
            </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;