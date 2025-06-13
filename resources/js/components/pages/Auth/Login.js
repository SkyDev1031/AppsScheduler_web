import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IMAGES } from "../../assets";
import { _ERROR_CODES } from "../../config";
import { useAuth } from '../../hooks';
import { toast_error } from "../../utils";

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login, refreshUser } = useAuth();
    useEffect(() => {
        // Refresh user data when the login page is loaded
        refreshUser();
    }, []);
    const loginAuth = async () => {
        if (!email || password.length < 1) {
            toast_error('Put correct email or password', _ERROR_CODES.INVALID_INPUT);
            return;
        }
        await login(email, password)
    }
    return (
        <section className="login-reg">
            <div className="overlay mt-40">
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-xl-6 order-xl-0 order-1">
                            <div className="sec-img d-rtl">
                                <img
                                    src={IMAGES.app_download}
                                    className="max-un"
                                    alt="image"
                                />
                            </div>
                        </div>
                        <div className="col-xl-5">
                            <div className="section-text text-center">
                                <h5 className="sub-title">AppsScheduler Login</h5>
                                <h2 className="title">Log in to Continue</h2>
                                <p className="dont-acc">
                                    Don’t have an account? <Link to={'/register'}>Sign up</Link>
                                </p>
                            </div>
                            <form action="#">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="single-input">
                                            <label htmlFor="logemail">Your Email</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Your Email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="single-input">
                                            <label htmlFor="logpassword">Your Password</label>
                                            <input
                                                type="password"
                                                placeholder="Enter Your Password"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <button className="cmn-btn w-100" onClick={loginAuth}>Login</button>
                                    </div>
                                </div>
                            </form>
                            <div className="forgot-pass mt-30 text-center">
                                <a href="#">Forgot Password</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}
export default Login;