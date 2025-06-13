import { Captcha } from "primereact";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Splitter, SplitterPanel } from 'primereact';
import { refCheckApi, registerApi, getBitqueryTemplateSettings } from '../../api/OriginAPI.js';
import { IMAGES } from "../../assets";
import { SITE_KEY, _ERROR_CODES } from "../../config";
import { useGlobalContext } from "../../contexts";
import { useAuth } from "../../hooks";
import { toast_error, toast_success, validateEmail } from "../../utils";

const Register = (props) => {
    const { setAuth } = useAuth();
    const { key } = useParams()
    const { setLoading } = useGlobalContext();
    const navigation = useNavigate();

    const [isRegistration, setRegistration] = useState(true);
    const [email, setEmail] = useState('')
    const [screenName, setScreenName] = useState('')
    const [password, setPassword] = useState('')
    const [acceptTerms, setAcceptTerms] = useState(false)
    const [captureValue, setCaptureValue] = useState('')
    const [secPassword, setSecPassword] = useState('')

    // useEffect(() => {
    //     getTemplateSettings();
    // }, [])

    // const getTemplateSettings = useCallback(async () => {
    //     try {
    //         let res = await getBitqueryTemplateSettings();
    //         if (res.success) {
    //             setRegistration(res.data.isRegistration === 1 ? true : false);
    //         }
    //     } catch (error) {
    //         toast_error("Invalid Server Connection!");
    //     }
    // }, []);

    useEffect(() => {
        if (!key) return;
        refCheckApi(key)
            .then(res => console.log(res))
            .catch(err => {
                toast_error(err, _ERROR_CODES.NO_REFERRAL_LINK);
                navigation('/register');
            })
    }, [key])

    const onRegister = async () => {
        if (!acceptTerms) toast_error('You have to accept terms', _ERROR_CODES.INVALID_INPUT);
        else if (!email) toast_error('Put your email address', _ERROR_CODES.INVALID_INPUT);
        else if (!validateEmail(email)) toast_error('Put vaild email address', _ERROR_CODES.INVALID_INPUT);
        else if (!screenName) toast_error('Put your screenName', _ERROR_CODES.INVALID_INPUT);
        else if (!password) toast_error('Put your password', _ERROR_CODES.INVALID_INPUT);
        else if (!secPassword) toast_error('Put your secondary password', _ERROR_CODES.INVALID_INPUT);
        else if (!captureValue) toast_error('Please check reCAPTCHA', _ERROR_CODES.INVALID_INPUT);
        else {
            try {
                const data = { email, screenName, password, secPassword, key };
                const res = await registerApi(data);
                toast_success(res.message);
                setAuth({ user: res.user, token: res.token });
                navigation('/login');
            } catch (error) {
                toast_error(error, _ERROR_CODES.AUTH_NETWORK_ERROR);
            }
        }
    }
    return (
        <section className="login-reg mt-5">
            <div className="overlay pt-60">
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
                        <div className="col-xl-5 mt-5">
                            <div className="section-text text-center">
                                <h3 className="title mb-0">AppsScheduler Sign up</h3>
                                <p className="dont-acc">
                                    Have already an account? <Link to={'/login'}>Login</Link>
                                </p>
                                {/* <Splitter className="d-flex w-75 mx-auto" style={{ height: '40px' }}>
                                    <SplitterPanel className={`flex align-items-center justify-content-center m-auto rounded color-white ${isRegistration ? "bg-green" : "bg-gray"}`}>
                                        OPEN
                                    </SplitterPanel>
                                    <SplitterPanel className={`flex align-items-center justify-content-center m-auto rounded color-white ${isRegistration ? "bg-gray" : "bg-red"}`}>
                                        CLOSE
                                    </SplitterPanel>
                                </Splitter> */}
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="single-input">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="Enter Your Email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            disabled={!isRegistration}
                                        />
                                    </div>
                                    <div className="single-input">
                                        <label htmlFor="screenname">Screen Name</label>
                                        <input
                                            type="text"
                                            id="screenname"
                                            placeholder="Enter Your Screen Name"
                                            value={screenName}
                                            onChange={e => setScreenName(e.target.value)}
                                            disabled={!isRegistration}
                                        />
                                    </div>
                                    <div className="single-input">
                                        <label htmlFor="password">Password</label>
                                        <input
                                            type="password"
                                            id="password"
                                            placeholder="Enter Your Password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            disabled={!isRegistration}
                                        />
                                    </div>

                                    <div className="single-input">
                                        <label htmlFor="secPassword">Secondary Password</label>
                                        <input
                                            type="password"
                                            id="secPassword"
                                            placeholder="Enter Your Secondary Password"
                                            value={secPassword}
                                            onChange={e => setSecPassword(e.target.value)}
                                            disabled={!isRegistration}
                                        />
                                    </div>
                                    {props.referral &&
                                        <div className="single-input">
                                            <label htmlFor="ref_code">Referral code</label>
                                            <input
                                                type="text"
                                                id="ref_code"
                                                placeholder="Referral code"
                                                defaultValue={key}
                                                disabled={!isRegistration}
                                            />
                                        </div>
                                    }
                                    <div className="d-flex mb-30">
                                        <input type={'checkbox'} id="terms" checked={acceptTerms} onChange={e => setAcceptTerms(!acceptTerms)} />
                                        <span htmlFor="terms">
                                            &nbsp;&nbsp;I agree To the <a href="#">Terms Of Use</a>
                                        </span>
                                    </div>
                                    <Captcha
                                        siteKey={SITE_KEY}
                                        onResponse={({ response }) => setCaptureValue(response)} />
                                    <button onClick={onRegister} className="cmn-btn w-100 mt-4">Join Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}
export default Register;