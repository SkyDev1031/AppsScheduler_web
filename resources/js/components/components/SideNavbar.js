import React from 'react';
import { Link } from "react-router-dom";
import { AdminNavbar, UserNavbar } from "../config";
import { logoutUser } from "../utils";
import { useGlobalContext } from "../contexts"; // Import global context
import { Badge } from 'primereact/badge'; // Import Badge component

const SideNavbar = ({ isAdmin, user, location, _role_prefix, toggleSidebar }) => {
    const { notifications } = useGlobalContext(); // Access notifications from global context

    return (
        <div className="sidebar-wrapper">
            {/* Sidebar Logo */}
            <div className="sidebar-logo">
                <a href="/">
                    <h5>Apps Scheduler</h5>
                </a>
            </div>

            {/* Navigation Items */}
            <ul>
                {(isAdmin ? AdminNavbar : UserNavbar).filter(function (item) {
                    if (item.prefix === "moderator" && user.support === "0") {
                        return false; // Skip moderator items if user support is "0"
                    }
                    return true;
                }).map((item, index) => {
                    const isActive = location.startsWith(`${_role_prefix}/${item.prefix || item.link}`);
                    return (
                        <li className={isActive ? 'active' : ''} key={index}>
                            <Link to={`${_role_prefix}/${item.prefix || item.link}`}>
                                <i className={item.icon} /> {/* Use Font Awesome icon */}
                                <span>{item.label}</span>
                                {/* Show badge for NotificationNav */}
                                {item.prefix === "notifications" && notifications.filter(notification => notification.read_status == 0).length > 0 && (
                                    <Badge value={notifications.filter(notification => notification.read_status == 0).length} severity="info" className="notification-badge" />
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            {/* Bottom Items */}
            <ul className="bottom-item">
                <li>
                    <Link to={isAdmin ? `/admin/profile` : `/user/profile`}>
                        <i className="fa-solid fa-user" /> {/* Font Awesome icon for Account */}
                        <span>Account</span>
                    </Link>
                </li>
                {isAdmin && (
                    <li>
                        <Link to={`/admin/settings`}>
                            <i className="fa-solid fa-cog" /> {/* Font Awesome icon for Settings */}
                            <span>Settings</span>
                        </Link>
                    </li>
                )}
                <li>
                    <a href="#" onClick={logoutUser}>
                        <i className="fa-solid fa-right-from-bracket" /> {/* Font Awesome icon for Logout */}
                        <span>Logout</span>
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default SideNavbar;