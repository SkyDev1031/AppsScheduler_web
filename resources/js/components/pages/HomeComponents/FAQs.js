export const FAQs = () => {
    return (
        <section className="faqs-section">
            <div className="overlay pt-120 pb-120">
                <div className="container">
                    <div className="row d-flex justify-content-center">
                        <div className="col-lg-7">
                            <div className="section-header text-center">
                                <h5 className="sub-title">Frequently Asked Questions</h5>
                                <h2 className="title">If you got questions we have answer</h2>
                                <p>We have a list of frequently asked questions about us</p>
                            </div>
                        </div>
                    </div>
                    <div className="row cus-mar">
                        <div className="col-lg-6">
                            <div className="accordion" id="accordionLeft">
                                {/* Accordion items */}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="accordion" id="accordionRight">
                                {/* Accordion items */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};