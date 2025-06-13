import { IMAGES } from "../../assets";

export const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="newsletter">
                            <div className="section-area mb-30 dark-sec text-center">
                                <h3 className="title">Subscribe to Our Newsletter</h3>
                            </div>
                            <form action="#">
                                <div className="form-group d-flex align-items-center">
                                    <input type="text" placeholder="Your Email Address" />
                                    <button>
                                        <img src={IMAGES.ic_arrow_right2} alt="icon" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="footer-area pt-120">
                    <div className="footer-top">
                        <div className="row align-items-center">
                            <div className="col-sm-6 d-flex justify-content-center justify-content-sm-start">
                                <div className="menu-item">
                                    <ul className="footer-link d-flex align-items-center">
                                        <li>
                                            <a href="#">About Us</a>
                                        </li>
                                        <li>
                                            <a href="#">Support</a>
                                        </li>
                                        <li>
                                            <a href="#">Fees</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="social-link d-flex justify-content-sm-end justify-content-center align-items-center">
                                    <a href="#">
                                        <img src={IMAGES.ic_facebook} alt="icon" />
                                    </a>
                                    <a href="#">
                                        <img src={IMAGES.ic_linkedin} alt="icon" />
                                    </a>
                                    <a href="#">
                                        <img src={IMAGES.ic_instagram} alt="icon" />
                                    </a>
                                    <a href="#">
                                        <img src={IMAGES.ic_twitter} alt="icon" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <div className="row justify-content-between align-items-center">
                            <div className="col-md-6 col-sm-8 d-flex justify-content-center justify-content-sm-start order-sm-0 order-1">
                                <div className="copyright text-center text-sm-start">
                                    <p>
                                        Copyright© 2025{" "}
                                        <a href="#">Apps Scheduler</a> All Rights Reserved
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-4">
                                <div className="menu-item">
                                    <ul className="footer-link d-flex justify-content-sm-end justify-content-center align-items-center">
                                        <li>
                                            <a href="#">Terms</a>
                                        </li>
                                        <li>
                                            <a href="#">Privacy</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};