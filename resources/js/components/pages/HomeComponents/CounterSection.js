import { IMAGES } from "../../assets";

export const CounterSection = () => {
    return (
        <div className="counter-section">
            <div className="container wow fadeInUp">
                <div className="row cus-mar">
                    <div className="col-xl-3 col-md-3 col-sm-6">
                        <div className="single-area d-flex align-items-center justify-content-center">
                            <div className="text-area text-center">
                                <h2>
                                    <span className="counter">50</span>
                                    <span>+</span>
                                </h2>
                                <p>Supported Currencies</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-3 col-sm-6">
                        <div className="single-area d-flex align-items-center justify-content-center">
                            <div className="text-area text-center">
                                <h2>
                                    <span className="counter">100</span>
                                    <span>+</span>
                                </h2>
                                <p>Available Countries</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-3 col-sm-6">
                        <div className="single-area d-flex align-items-center justify-content-center">
                            <div className="text-area text-center">
                                <h2>
                                    <span className="counter">70</span>
                                    <span>+</span>
                                </h2>
                                <p>Payment Methods</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-3 col-sm-6">
                        <div className="single-area d-flex align-items-center justify-content-center">
                            <div className="text-area text-center">
                                <h2>
                                    <span className="counter">7</span>
                                    <span>/</span>
                                    <span className="counter">24</span>
                                    <span>+</span>
                                </h2>
                                <p>Support Team</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};