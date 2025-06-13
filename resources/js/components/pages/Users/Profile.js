import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { profileApi, updateProfileApi, updatePwdApi, updateSecPwdApi } from '../../api/OriginAPI.js';
import { IMAGES } from "../../assets";
import { _ERROR_CODES } from "../../config";
import { useGlobalContext } from "../../contexts";
import { logoutUser, toast_error, toast_success } from "../../utils";
export default function Profile() {
    const [profile, setProfile] = useState({})
    const { setLoading } = useGlobalContext();

    const [password, setPassword] = useState({})
    const [secPassword, setSecPassword] = useState({})

    useEffect(() => {
        getData();
    }, [getData])

    const getData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await profileApi();
            setProfile(res.profile);
        } catch (error) {
            toast_error(error, _ERROR_CODES.NETWORK_ERROR);
        } finally {
            setLoading(false);
        }
    }, [profile])

    const updatePwd = () => {
        setLoading(true);
        updatePwdApi(password)
            .then(res => toast_success(res.message || 'Successfully update the password'))
            .catch(err => toast_error(err, _ERROR_CODES.NETWORK_ERROR))
            .finally(() => setLoading(false))
    }
    const updateSecPwd = () => {
        setLoading(true);
        updateSecPwdApi(secPassword)
            .then(res => toast_success(res.message || 'Successfully update the  secondary password'))
            .catch(err => toast_error(err, _ERROR_CODES.NETWORK_ERROR))
            .finally(() => setLoading(false))
    }
    const updateProfile = () => {
        if (!profile.ScreenName) return toast_error('Put your screen name', _ERROR_CODES.INVALID_INPUT);
        if (!profile.username) return toast_error('Put your user name', _ERROR_CODES.INVALID_INPUT);
        setLoading(true);
        updateProfileApi(profile)
            .then(res => toast_success(res.message || 'Successfully update the profile'))
            .catch(err => toast_error(err, _ERROR_CODES.NETWORK_ERROR))
            .finally(() => setLoading(false))
    }

    return (
        <>
            <div className="account" >
                <div className="main-content" style={{ padding: 40 }}>
                    <div className="row">
                        <div className="col-xxl-3 col-xl-4 col-md-6">
                            <div className="owner-details">
                                <div className="profile-area">
                                    <div className="profile-img">
                                        <img src={IMAGES.avatar} alt="image" />
                                    </div>
                                    <div className="name-area">
                                        <h6>{`${profile.fullname || ''}(${profile.ScreenName || ''})`}</h6>
                                        <p className="active-status">Active</p>
                                    </div>
                                </div>
                                <div className="owner-info">
                                    <ul>
                                        <li>
                                            <p>Account ID:</p>
                                            <span className="mdr">{`#${profile.id || 'xxx'}`}</span>
                                        </li>
                                        <li>
                                            <p>Joined:</p>
                                            <span className="mdr">{moment(profile.created_at).format('lll')}</span>
                                        </li>
                                        <li>
                                            <p>Confirm status:</p>
                                            <span className="mdr">100%</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="owner-action">
                                    <a href="#" className="warning-text">Forgot password</a>
                                    <a href="#" onClick={logoutUser}>
                                        <img src={IMAGES.ic_quit} alt="image" />
                                        Logout
                                    </a>
                                    <a href="#" className="delete">
                                        <img src={IMAGES.ic_delete} alt="image" />
                                        Delete Account
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-9 col-xl-8">
                            <div className="tab-main">
                                <ul className="nav nav-tabs" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className="nav-link active"
                                            id="account-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#account"
                                            type="button"
                                            role="tab"
                                            aria-controls="account"
                                            aria-selected="true"
                                        >
                                            Account
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className="nav-link"
                                            id="security-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#security"
                                            type="button"
                                            role="tab"
                                            aria-controls="security"
                                            aria-selected="false"
                                        >
                                            Security
                                        </button>
                                    </li>
                                </ul>
                                <div className="tab-content mt-40">
                                    <div
                                        className="tab-pane fade show active"
                                        id="account"
                                        role="tabpanel"
                                        aria-labelledby="account-tab"
                                    >
                                        <div className="upload-avatar">
                                            <div className="avatar-left d-flex align-items-center">
                                                <div className="profile-img">
                                                    <img
                                                        src={IMAGES.avatar}
                                                        alt="image"
                                                    />
                                                </div>
                                                <div className="instraction">
                                                    <h6>Your Avatar</h6>
                                                </div>
                                            </div>
                                            <div className="avatar-right">
                                                <div className="file-upload">
                                                    <div className="right-area">
                                                        <label className="file">
                                                            <input type="file" />
                                                            <span className="file-custom" />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <form action="#">
                                            <div className="row justify-content-center">
                                                <div className="col-md-6">
                                                    <div className="single-input">
                                                        <label htmlFor="screen_name">Screen Name</label>
                                                        <input type="text" id="screen_name" placeholder="Screen Name"
                                                            value={profile.ScreenName || ''}
                                                            onChange={e => setProfile({ ...profile, ScreenName: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="single-input">
                                                        <label htmlFor="user_name">User Name</label>
                                                        <div className="row input-status d-flex align-items-center">
                                                            <div className="col-6">
                                                                <input
                                                                    disabled
                                                                    type="text"
                                                                    id="user_name"
                                                                    placeholder="User Name"
                                                                    value={profile.username || ''}
                                                                    onChange={e => setProfile({ ...profile, username: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className="col-6">
                                                                <span className="pending">
                                                                    <img src={IMAGES.ic_pending} alt="icon" />
                                                                    E-mail confirmation in pending
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="single-input">
                                                        <label htmlFor="address">Address</label>
                                                        <input
                                                            type="text"
                                                            id="address"
                                                            placeholder="2972 Westheimer Rd. Santa Ana, Illinois 85486"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="btn-border">
                                                        <button className="cmn-btn" onClick={updateProfile}>Update</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div
                                        className="tab-pane fade"
                                        id="security"
                                        role="tabpanel"
                                        aria-labelledby="security-tab"
                                    >
                                        <div className="single-content authentication d-flex align-items-center justify-content-between">
                                            <div className="left">
                                                <h5>Two Factor Authentication</h5>
                                                <p>
                                                    Two-Factor Authentication (2FA) can be used to help
                                                    protect your account
                                                </p>
                                            </div>
                                            <div className="right">
                                                <button>Enable</button>
                                            </div>
                                        </div>
                                        <div className="change-pass mb-40">
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <h5>Change Password</h5>
                                                    <form action="#">
                                                        <div className="row justify-content-center">
                                                            <div className="col-md-12">
                                                                <div className="single-input">
                                                                    <label htmlFor="current-password">
                                                                        Current password
                                                                    </label>
                                                                    <input
                                                                        type="password"
                                                                        id="current-password"
                                                                        placeholder="Current password"
                                                                        value={password.cur_pwd || ''}
                                                                        onChange={e => setPassword(prv => ({ ...prv, cur_pwd: e.target.value }))}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="single-input">
                                                                    <label htmlFor="new-password">
                                                                        New password
                                                                    </label>
                                                                    <input
                                                                        type="password"
                                                                        id="new-password"
                                                                        placeholder="New password"
                                                                        value={password.new_pwd || ''}
                                                                        onChange={e => setPassword(prv => ({ ...prv, new_pwd: e.target.value }))}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="single-input">
                                                                    <label htmlFor="confirm-password">
                                                                        Confirm New password
                                                                    </label>
                                                                    <input
                                                                        type="password"
                                                                        id="confirm-password"
                                                                        placeholder="Confirm New password"
                                                                        value={password.conf_new_pwd || ''}
                                                                        onChange={e => setPassword(prv => ({ ...prv, conf_new_pwd: e.target.value }))}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="btn-border w-100 mt-5">
                                                                    <button className="cmn-btn w-100" onClick={updatePwd}>
                                                                        Update password
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="col-sm-6">
                                                    <h5>Change Secondary Password</h5>
                                                    <form action="#">
                                                        <div className="row justify-content-center">
                                                            <div className="col-md-12">
                                                                <div className="single-input">
                                                                    <label htmlFor="current-sec-password">
                                                                        Current Secondary password
                                                                    </label>
                                                                    <input
                                                                        type="password"
                                                                        id="current-sec-password"
                                                                        placeholder="Current password"
                                                                        value={secPassword.cur_pwd || ''}
                                                                        onChange={e => setSecPassword(prv => ({ ...prv, cur_pwd: e.target.value }))}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="single-input">
                                                                    <label htmlFor="new-sec-password">
                                                                        New Secondary password
                                                                    </label>
                                                                    <input
                                                                        type="password"
                                                                        id="new-sec-password"
                                                                        placeholder="New password"
                                                                        value={secPassword.new_pwd || ''}
                                                                        onChange={e => setSecPassword(prv => ({ ...prv, new_pwd: e.target.value }))}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="single-input">
                                                                    <label htmlFor="confirm-sec-password">
                                                                        Confirm New Secondary password
                                                                    </label>
                                                                    <input
                                                                        type="password"
                                                                        id="confirm-sec-password"
                                                                        placeholder="Confirm New password"
                                                                        value={secPassword.conf_new_pwd || ''}
                                                                        onChange={e => setSecPassword(prv => ({ ...prv, conf_new_pwd: e.target.value }))}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="btn-border w-100 mt-5">
                                                                    <button className="cmn-btn w-100" onClick={updateSecPwd}>
                                                                        Update Secondary password
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="add-card">
                <div className="container-fruid">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="modal fade" id="addcardMod" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header justify-content-between">
                                            <h6>Add Card</h6>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            >
                                                <i className="fa-solid fa-xmark" />
                                            </button>
                                        </div>
                                        <form action="#">
                                            <div className="row justify-content-center">
                                                <div className="col-md-12">
                                                    <div className="single-input">
                                                        <label htmlFor="cardNumber">Card Number</label>
                                                        <input
                                                            type="text"
                                                            id="cardNumber"
                                                            placeholder="5890 - 6858 - 6332 - 9843"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="single-input">
                                                        <label htmlFor="cardHolder">Card Holder</label>
                                                        <input
                                                            type="text"
                                                            id="cardHolder"
                                                            placeholder="Alfred Davis"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="single-input">
                                                        <label htmlFor="month">Month</label>
                                                        <input type="text" id="month" placeholder={12} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="single-input">
                                                        <label htmlFor="year">Year</label>
                                                        <input type="text" id="year" placeholder={2025} />
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="btn-border w-100">
                                                        <button className="cmn-btn w-100">Add Card</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="transactions-popup mycard">
                <div className="container-fruid">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="modal fade" id="transactionsMod" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header justify-content-between">
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            >
                                                <i className="fa-solid fa-xmark" />
                                            </button>
                                        </div>
                                        <div className="main-content">
                                            <div className="row">
                                                <div className="col-sm-4">
                                                    <h5>My Cards</h5>
                                                    <div className="icon-area">
                                                        <img src={IMAGES.popup_card} alt="image" className="w-100" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-8">
                                                    <div className="right-area">
                                                        <div className="top-area d-flex align-items-center justify-content-between">
                                                            <div className="card-details d-flex align-items-center">
                                                                <img src={IMAGES.ic_mastercard} alt="image" />
                                                                <span>5880 **** **** 8854</span>
                                                            </div>
                                                            <a href="#">
                                                                <i className="icon-h-edit" />
                                                                Edit
                                                            </a>
                                                        </div>
                                                        <ul className="payment-details">
                                                            <li>
                                                                <span>Card Type:</span>
                                                                <span>Visa</span>
                                                            </li>
                                                            <li>
                                                                <span>Card Holder:</span>
                                                                <span>Alfred Davis</span>
                                                            </li>
                                                            <li>
                                                                <span>Expires:</span>
                                                                <span>12/19</span>
                                                            </li>
                                                            <li>
                                                                <span>Card Number:</span>
                                                                <span>5880 5087 3288 8854</span>
                                                            </li>
                                                            <li>
                                                                <span>Total Balance:</span>
                                                                <span>80,700.00</span>
                                                            </li>
                                                            <li>
                                                                <span>Total Debt:</span>
                                                                <span>8,250.00</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}