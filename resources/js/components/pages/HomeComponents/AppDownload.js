import { IMAGES } from "../../assets";
import { Link } from 'react-router-dom'

export const AppDownload = () => {
    return (
        <section className="app-download mt-3">
            <div className="overlay pb-120">
                <div className="container wow fadeInUp">
                    <div className="row justify-content-between align-items-center">
                        <div className="col-lg-6 order-lg-0 order-1">
                            <div className="image-area d-rtl left-side">
                                <img
                                    src={IMAGES.app_download}
                                    alt="images"
                                    className="max-un"
                                />
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="section-area">
                                <h5 className="sub-title">App Download</h5>
                                <p>
                                    Download and install the app in your phone.
                                </p>
                            </div>
                            <ul className="features">
                                <li>
                                    <img src={IMAGES.ic_check} alt="icon" />
                                    Set init pattern or pin for secure.
                                </li>
                                <li>
                                    <img src={IMAGES.ic_check} alt="icon" />
                                    Allow all permission for full access.
                                </li>
                                <li>
                                    <img src={IMAGES.ic_check} alt="icon" />
                                    Schedule the apps.
                                </li>
                                <li>
                                    <img src={IMAGES.ic_check} alt="icon" />
                                    Block the apps which you are want to secure.
                                </li>
                            </ul>
                            <div className="brand-area mt-40">
                                <Link to="#">
                                    Free Download
                                </Link>
                                <Link to="#">
                                    <img src={IMAGES.google_play} alt="icon" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};