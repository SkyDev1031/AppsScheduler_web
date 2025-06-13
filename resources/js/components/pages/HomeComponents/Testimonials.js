import { IMAGES } from "../../assets";

export const Testimonials = () => {
    return (
        <section className="testimonials">
            <div className="overlay pt-120 pb-120">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="section-header text-center">
                                <h5 className="sub-title">Testimonials</h5>
                                <h2 className="title">What Our Customers Say</h2>
                                <p>
                                    245m+ happy clients all around the world. Donâ€™t just take our
                                    word for it
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid wow fadeInUp">
                    <div className="testimonials-carousel">
                        <div className="single-slide">
                            <div className="single-content">
                                <div className="start-area">
                                    {[...Array(5)].map((_, i) => (
                                        <a href="#" key={i}>
                                            <i className="fas fa-star" />
                                        </a>
                                    ))}
                                </div>
                                <h5 className="title-area">Great Fast Reliable Service</h5>
                                <div className="profile-area d-flex align-items-center">
                                    <div className="icon-area">
                                        <img src={IMAGES.avatar} alt="icon" />
                                    </div>
                                    <div className="text-area">
                                        <h5>Aspen Press</h5>
                                        <p>Web Designer</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Repeat for other testimonials */}
                    </div>
                </div>
            </div>
        </section>
    );
};