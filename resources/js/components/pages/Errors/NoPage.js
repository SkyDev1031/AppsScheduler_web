const NoPage = () => {
    return (
        <section className="error">
            <div className="overlay pt-120">
                <div className="container wow fadeInUp">
                    <div className="row align-items-end justify-content-center">
                        <div className="col-xl-6">
                            <div className="section-text text-center">
                                <h2 className="title">Oops!Page Not Found</h2>
                                <p>We can’t seem to find the page you’re looking for</p>
                                <a href="/" className="cmn-btn mt-30">
                                    Back To Home
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}
export default NoPage;