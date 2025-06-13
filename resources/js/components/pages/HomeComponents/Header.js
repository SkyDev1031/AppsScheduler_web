import { Link } from "react-router-dom";
import { IMAGES } from "../../assets";
import { useState, useEffect } from 'react'

export const Header = () => {

    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Check if the user has scrolled past a certain point (e.g., 50px)
            if (window.scrollY > 60) {
                console.log("sticky nav bar true")
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        // Attach scroll event listener
        window.addEventListener("scroll", handleScroll);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <header className="header-section">
            <div className="overlay">
                <div className="container">
                    <div className="row d-flex header-area">
                        <nav className="navbar navbar-expand-lg navbar-light">
                            <Link className="navbar-brand" to="/">
                                Apps Scheduler
                            </Link>
                            <button
                                className="navbar-toggler collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navbar-content"
                            >
                                <i className="fas fa-bars" />
                            </button>
                            <div
                                className="collapse navbar-collapse justify-content-end"
                                id="navbar-content"
                            >
                                <div className="right-area header-action d-flex align-items-center max-un">
                                    <Link className="login" to={'/login'}>Login</Link>
                                    <Link className="cmn-btn" to={'/register'}>
                                        Sign Up
                                        <i className="icon-d-right-arrow-2" />
                                    </Link>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};