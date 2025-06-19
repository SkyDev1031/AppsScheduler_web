import React, { useEffect } from 'react';
import { IMAGES } from "../assets";
import SideNavbar from './SideNavbar';
import HeaderNavbar from './HeaderNavbar';
import { useGlobalContext } from "../contexts";
import { logoutUser } from "../utils"; // Import logoutUser from the utils file
import { getNotificationsApi } from '../api/NotificationAPI';

export default function Header({ isSubItem, location, subNav }) {
    const { user, isAdmin, holdings, addNotification, clearNotifications, setLoading } = useGlobalContext();
    const _role_prefix = isAdmin ? '/admin' : '/user';
    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                clearNotifications()
                const response = await getNotificationsApi(); // Replace with your API call
                response.data.forEach((res) => addNotification(res)); // Add notifications to context
            } catch (err) {
                if (isMounted.current) {
                    toast_error(err, _ERROR_CODES.NETWORK_ERROR);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications()
    }, [])
    const toggleSidebar = () => {
        // const sidebar = document.querySelector('.header-section');
        // if (sidebar) {
        //     sidebar.classList.toggle('body-collapse');
        // }
    }
    return (
        <div className={`${isSubItem ? 'no-border' : ''}`} id="site_header">
            <header className={`header-section body-collapse`}>
                <div className="overlay">
                    <div className="container-fruid">
                        <div className="row d-flex header-area ml-0 mr-0">
                            <div className="navbar-area">
                                <HeaderNavbar
                                    isAdmin={isAdmin}
                                    user={user}
                                    holdings={holdings}
                                    _role_prefix={_role_prefix}
                                    logoutUser={logoutUser}
                                    isSubItem={isSubItem}
                                    subNav={subNav}
                                    location={location}
                                />
                            </div>
                            <SideNavbar
                                isAdmin={isAdmin}
                                user={user}
                                location={location}
                                _role_prefix={_role_prefix}
                                toggleSidebar={toggleSidebar}
                            />
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}