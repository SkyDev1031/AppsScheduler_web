import { Link } from "react-router-dom";
import { IMAGES } from "../../assets";

export const Banner = () => {
    return (
        <section className="banner-section index mt-3">
            <div className="overlay">
                <div className="shape-area">
                    <img src={IMAGES.banner_box} className="obj-1" alt="image" />
                    <img src={IMAGES.banner_human} className="obj-2" alt="image" />
                    <img src={IMAGES.banner_rocket} className="obj-3" alt="image" />
                    <img src={IMAGES.banner_clock} className="obj-4" alt="image" />
                </div>
                <div className="banner-content">
                    <div className="container wow fadeInUp">
                        <div className="content-shape">
                            <img src={IMAGES.banner_wallet} className="obj-1" alt="image" />
                        </div>
                        <div className="row justify-content-between align-items-center">
                            <div className="col-lg-5 col-md-6">
                                <div className="main-content">
                                    <div className="top-area section-text">
                                        <h5 className="sub-title">Improve your experience</h5>
                                        <h1 className="title">Apps Scheduler</h1>
                                        <p className="xlr">
                                            Apps Scheduler can control all apps by scheduling
                                        </p>
                                    </div>
                                    <div className="bottom-area d-xxl-flex">
                                        <Link to={'/login'} className="cmn-btn">
                                            Login
                                        </Link>
                                        <Link to={'/register'} className="cmn-btn active mfp-iframe popupvideo">
                                            Register
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};