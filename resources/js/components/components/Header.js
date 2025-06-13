import React from 'react';
import { IMAGES } from "../assets";
import SideNavbar from './SideNavbar';
import HeaderNavbar from './HeaderNavbar';
import { useGlobalContext } from "../contexts";
import { logoutUser } from "../utils"; // Import logoutUser from the utils file

export default function Header({ isSubItem, location, subNav }) {
    const { user, isAdmin, holdings } = useGlobalContext();
    const _role_prefix = isAdmin ? '/admin' : '/user';
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