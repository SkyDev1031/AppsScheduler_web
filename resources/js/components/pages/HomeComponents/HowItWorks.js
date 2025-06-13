import { IMAGES } from "../../assets";

export const HowItWorks = () => {
    return (
        <section className="how-it-works">
            <div className="overlay pb-120">
                <div className="container wow fadeInUp">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="section-header text-center">
                                <h5 className="sub-title">How it works?</h5>
                                <h2 className="title">Just few steps to start</h2>
                                <p>It's easier than you think. Follow 3 simple easy steps</p>
                            </div>
                        </div>
                    </div>
                    <div className="row cus-mar">
                        <div className="col-xl-3 col-sm-6 col-6">
                            <div className="single-item first text-center">
                                <img src={IMAGES.ic_howworks1} alt="icon" />
                                <h5>Register for free</h5>
                                <p>Simply sign up online for free and verify your identity</p>
                            </div>
                        </div>
                        <div className="col-xl-3 col-sm-6 col-6">
                            <div className="single-item second text-center">
                                <img src={IMAGES.ic_howworks2} alt="icon" />
                                <h5>Set up your transfer</h5>
                                <p>Add a recipient's details and choose which currency ...</p>
                            </div>
                        </div>
                        <div className="col-xl-3 col-sm-6 col-6">
                            <div className="single-item first text-center">
                                <img src={IMAGES.ic_howworks3} alt="icon" />
                                <h5>Make your payment</h5>
                                <p>Send us your funds with a bank transfer and we'll notify..</p>
                            </div>
                        </div>
                        <div className="col-xl-3 col-sm-6 col-6">
                            <div className="single-item text-center">
                                <img src={IMAGES.ic_howworks4} alt="icon" />
                                <h5>You're all done!</h5>
                                <p>We inform you when the money has been sent and can also ...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};