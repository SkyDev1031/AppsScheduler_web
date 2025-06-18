import { lazy } from '@loadable/component';
import { MetaMaskProvider } from "metamask-react";
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { GlobalContextProvider } from './contexts';
import { ChatContextProvider } from './Chat';
import { useAuth } from './hooks';
import { Navigate } from './utils';
import { MESSAGE_SERVER } from './config';
import 'primeicons/primeicons.css';
import NotificationsSocket from './NotificationSocket';
import { toast_success, toast_error } from './utils';

const BaseContainer = lazy(() => import("./pages/Container/BaseContainer"))
const MainContainer = lazy(() => import("./pages/Container/MainContainer"))
const NoPage = lazy(() => import("./pages/Errors/NoPage"))
const Chat = lazy(() => import("./pages/Chat"))

const UserNav = [
    { path: '/dashboard', Component: lazy(() => import("./pages/Users/Dashboard")) },
    { path: '/study', Component: lazy(() => import("./pages/Users/Study/StudyManagement")) },
    { path: '/study/view/:studyId', Component: lazy(() => import("./pages/Users/Study/ViewStudyGroup")) },
    { path: '/reportApp/details/:encryptedPhoneNumber', Component: lazy(() => import("./pages/Users/Study/ReportUserAppDetails")) },
    { path: '/reportApp/details2/:encryptedPhoneNumber', Component: lazy(() => import("./pages/Users/Study/ReportUserAppDetails2")) },
    { path: '/categories', Component: lazy(() => import("./pages/Users/CategoryManagement")) },
    { path: '/notifications', Component: lazy(() => import("./pages/Users/NotificationManagement")) },
    { path: '/sendtoparticipants', Component: lazy(() => import("./pages/Users/SendToParticipants")) },
    { path: '/recommendations', Component: lazy(() => import("./pages/Users/Recommendation/RecommendationManagement")) },
    { path: '/questionnaires', Component: lazy(() => import("./pages/Users/Questionnaire/QuestionnaireManagement")) },
]
function App() {
    const { _token, _user, isAdmin } = useAuth();

    const SecurityRouter = ({ Component, auth, userRole, adminRole, params = {} }) => {
        if (!auth && _token) return <Navigate to={isAdmin ? '/admin' : '/user'} />;
        if (auth && !_token) return <Navigate to={'/login'} />;
        if ((!userRole && !adminRole) || (userRole && !isAdmin) || (adminRole && isAdmin)) return <Component {...params} />;
        return <Navigate to={'/'} />;
    };

    return (
        <BrowserRouter>
            <GlobalContextProvider>
                <ToastContainer />
                <Suspense fallback={<div className="preloader react-preloader"></div>}>
                    <Routes>
                        <Route path="/user" element={<MainContainer />}>
                            <Route index element={<Navigate to={'/user/dashboard'} />} />
                            {UserNav.map((item, index) => (
                                <Route
                                    path={`/user/${item.path}`}
                                    key={index}
                                    element={item.redirect ?
                                        <Navigate to={item.redirect} />
                                        :
                                        <SecurityRouter {...item} auth userRole />
                                    }
                                />
                            ))}
                            <Route path="*" element={<NoPage />} />
                        </Route>
                    </Routes>
                </Suspense>

            </GlobalContextProvider>
        </BrowserRouter>
    );
}
if (document.getElementById('app')) {
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );
}
