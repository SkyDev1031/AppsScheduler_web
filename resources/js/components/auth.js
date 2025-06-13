import { lazy } from '@loadable/component';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { useAuth } from './hooks';
import { Navigate } from './utils';
import 'primeicons/primeicons.css';

const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const BaseContainer = lazy(() => import("./pages/Container/BaseContainer"));
const Home = lazy(() => import("./pages/Home"));

function App() {
    const { _token, isAdmin } = useAuth();
    const SecurityRouter = ({ Component, auth, userRole, adminRole }) => {
        if (!auth && _token) return <Navigate to={isAdmin ? '/admin' : '/user'} />;
        if (auth && !_token) return <Navigate to={'/login'} />;
        if ((!userRole && !adminRole) || (userRole && !isAdmin) || (adminRole && isAdmin)) return Component
        return <Navigate to={'/'} />;
    }
    return (
        <BrowserRouter>
            <ToastContainer />
            <Suspense fallback={<div className="preloader react-preloader"></div>}>
                <Routes>
                    <Route path="/" element={<SecurityRouter Component={<BaseContainer />} />}>
                        <Route index element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/:key" element={<Register referral />} />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}
if (document.getElementById('app')) {
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );
}
