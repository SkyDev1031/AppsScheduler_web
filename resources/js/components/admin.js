import { lazy } from '@loadable/component';
import { MetaMaskProvider } from "metamask-react";
import React, { Component, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { GlobalContextProvider } from './contexts';
import { useAuth } from './hooks';
import { Navigate } from './utils';
import 'primeicons/primeicons.css';

const MainContainer = lazy(() => import("./pages/Container/MainContainer"))
const NoPage = lazy(() => import("./pages/Errors/NoPage"))

const AdminNav = [  
    { path: '/dashboard', Component: lazy(() => import("./pages/Admin/Dashboard")) },
    { path: '/users', Component: lazy(() => import("./pages/Admin/Users")) },
    { path: '/participants', Component: lazy(() => import("./pages/Admin/Participants")) },
    { path: '/reportApp', Component: lazy(() => import("./pages/Admin/ReportApp")) },
    { path: '/reportApp/details/:encryptedPhoneNumber', Component: lazy(() => import("./pages/Admin/ReportAppDetails")) },
    { path: '/reportApp/details2/:encryptedPhoneNumber', Component: lazy(() => import("./pages/Admin/ReportAppDetails2")) },
    { path: '/reportPhone', Component: lazy(() => import("./pages/Admin/ReportPhone")) },
    { path: '/reportPhone/details/:encryptedPhoneNumber', Component: lazy(() => import("./pages/Admin/ReportPhoneDetails")) },
];

function App() {
    const { _token, isAdmin } = useAuth();
    const SecurityRouter = ({ Component, auth, userRole, adminRole, params = {} }) => {
        if (!auth && _token) return <Navigate to={isAdmin ? '/admin' : '/user'} />;
        if (auth && !_token) return <Navigate to={'/login'} />;
        if ((!userRole && !adminRole) || (userRole && !isAdmin) || (adminRole && isAdmin)) return <Component {...params} />
        return <Navigate to={'/'} />;
    }
    return (
        <BrowserRouter>
            <GlobalContextProvider>
                <ToastContainer />
                <Suspense fallback={<div className="preloader react-preloader"></div>}>
                    <Routes>
                        <Route path="/admin" element={<MainContainer />}>
                            <Route index element={<Navigate to={'/admin/dashboard'} />} />
                            {/* <Route path="/admin/reportApp/details/:phonenumber" element={<ReportAppDetails />} /> */}
                            {AdminNav.map((item, index) => (
                                <Route
                                    path={`/admin/${item.path}`}
                                    key={index}
                                    element={item.redirect ?
                                        <Navigate to={item.redirect} />
                                        :
                                        <SecurityRouter {...item} auth adminRole />
                                    }
                                />
                            ))}
                            <Route path="*" element={<NoPage />} />
                        </Route>
                    </Routes>
                </Suspense>
            </GlobalContextProvider>
        </BrowserRouter>
    )
}
if (document.getElementById('app')) {
    ReactDOM.render(
        <React.StrictMode>
            <MetaMaskProvider>
                <App />
            </MetaMaskProvider>
        </React.StrictMode>,
        document.getElementById('app')
    );
}
