import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { Avatar } from 'primereact/avatar';
import { IMAGES } from "../assets";
import { AdminProfileItem } from "../config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const HeaderNavbar = ({ isAdmin, user, holdings, onAction, logoutUser, _role_prefix, isSubItem, subNav, location }) => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null); // Reference for the dropdown area
    const avatarRef = useRef(null); // Reference for the avatar area

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target) &&
            avatarRef.current &&
            !avatarRef.current.contains(event.target)
        ) {
            setDropdownVisible(false); // Close dropdown if clicked outside both dropdown and avatar
        }
    };

    useEffect(() => {
        // Add event listener for clicks outside the dropdown
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Cleanup event listener on component unmount
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="header-navbar">
            {/* Search Form */}
            <form action="#" className="header-navbar__search-form flex-fill">
                <div className="form-group d-flex align-items-center">
                    <img src={IMAGES.ic_search} alt="Search Icon" />
                    <input type="text" placeholder="Type to search..." />
                </div>
            </form>

            {/* User Profile Section */}
            <div className="header-navbar__user">
                {/* Avatar Click to Toggle Dropdown */}
                <div
                    ref={avatarRef} // Attach reference to the avatar
                    className="header-navbar__profile"
                    onClick={toggleDropdown}
                >
                    <span className="header-navbar__avatar">
                        <Avatar>
                            <FontAwesomeIcon icon={faUser} />
                        </Avatar>
                    </span>
                </div>

                {/* Dropdown Menu */}
                <div
                    ref={dropdownRef} // Attach reference to the dropdown
                    className={`header-navbar__dropdown ${isDropdownVisible ? 'header-navbar__dropdown--visible' : 'header-navbar__dropdown--hidden'}`}
                >
                    <div className="header-navbar__dropdown-header d-flex align-items-center">
                        <div className="header-navbar__dropdown-avatar">
                            <Avatar>
                                <FontAwesomeIcon icon={faUser} />
                            </Avatar>
                        </div>
                        <div className="header-navbar__dropdown-info">
                            <a href="#">
                                <h6>{user.ScreenName || ''}</h6>
                            </a>
                        </div>
                    </div>
                    <ul>
                        {isAdmin && AdminProfileItem.map((item, index) => (
                            <li key={index} className="header-navbar__dropdown-item">
                                {item.action ? (
                                    <a onClick={() => onAction(item.action)}>
                                        <i className={`fas ${item.icon}`} />
                                        <span>{item.label}</span>
                                    </a>
                                ) : (
                                    <Link to={`${_role_prefix}/${item.prefix || item.link}`}>
                                        <i className={`fas ${item.icon}`} />
                                        <span>{item.label}</span>
                                    </Link>
                                )}
                            </li>
                        ))}
                        <li className="header-navbar__dropdown-item">
                            <a href="#" onClick={logoutUser}>
                                <i className="fas fa-sign-out" />
                                Logout
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Navigation Tabs */}
            {isSubItem && (
                <div className="header-navbar__tabs">
                    <ul className="nav nav-tabs">
                        {subNav.items.map((item, index) => {
                            const link = `${_role_prefix}/${subNav.prefix}${item.link}`;
                            return (
                                <li key={index} className="nav-item">
                                    <Link to={link} className={`nav-link ${location === link ? 'active' : ''}`}>{item.label}</Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default HeaderNavbar;