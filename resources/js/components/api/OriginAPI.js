import { _REQUEST_ORIGIN, _REQ_METHOD } from './index';

export const getBitqueryApi = () => _REQUEST_ORIGIN(`/bitquery`, _REQ_METHOD.GET)
export const updateBitqueryApi = (data) => _REQUEST_ORIGIN(`/bitquery`, _REQ_METHOD.POST, data)
export const deleteBitqueryApi = (id) => _REQUEST_ORIGIN(`/bitquery/${id}`, _REQ_METHOD.DELETE)

export const getBitqueryTemplateSettings = () => _REQUEST_ORIGIN(`/bitquery/getTemplateSettings`, _REQ_METHOD.GET)
export const updateBitqueryTemplateSettingApi = (data) => _REQUEST_ORIGIN(`/bitquery/updateTemplateSettings`, _REQ_METHOD.POST, data)

export const loginApi = (username, password) => _REQUEST_ORIGIN('login', _REQ_METHOD.POST, { username, password })
export const getUserApi = () => _REQUEST_ORIGIN('user', _REQ_METHOD.GET)
export const getUsersApi = () => _REQUEST_ORIGIN('users', _REQ_METHOD.GET)
export const getUsersNumber = () => _REQUEST_ORIGIN('userNumber', _REQ_METHOD.GET);
export const updatUserAutoPay = (data) => _REQUEST_ORIGIN('updateAutoPay', _REQ_METHOD.POST, data);
export const registerApi = (data) => _REQUEST_ORIGIN('register', _REQ_METHOD.POST, data)
export const refCheckApi = (key) => _REQUEST_ORIGIN(`referral/${key}`, _REQ_METHOD.GET)
export const pwdCheckApi = (password) => _REQUEST_ORIGIN('check-password', _REQ_METHOD.POST, { password })

export const updatePwdApi = (data) => _REQUEST_ORIGIN('updatePassword', _REQ_METHOD.POST, data)
export const updateSecPwdApi = (data) => _REQUEST_ORIGIN('updateSecPassword', _REQ_METHOD.POST, data)
export const updateProfileApi = (data) => _REQUEST_ORIGIN('updateProfile', _REQ_METHOD.POST, data)

export const walletsApi = () => _REQUEST_ORIGIN('wallet', _REQ_METHOD.GET)
export const getSupportCreditsApi = (data) => _REQUEST_ORIGIN('getSupportCredits', _REQ_METHOD.POST, data)

export const confDepositApi = (data) => _REQUEST_ORIGIN('confirmdeposit', _REQ_METHOD.POST, data)
export const confWithdrawApi = (data) => _REQUEST_ORIGIN('confirmwithdrawal', _REQ_METHOD.POST, data)
export const confTransferApi = (data) => _REQUEST_ORIGIN('conformtranfer', _REQ_METHOD.POST, data)
export const support_confTransferApi = (data) => _REQUEST_ORIGIN('support_conformtranfer', _REQ_METHOD.POST, data)
export const confSwapApi = (data) => _REQUEST_ORIGIN('confirmswap', _REQ_METHOD.POST, data)
export const confSupportSwapApi = (data) => _REQUEST_ORIGIN('confirmsupportswap', _REQ_METHOD.POST, data)
export const confCancelSupportApi = (data) => _REQUEST_ORIGIN('confirmcancelsupport', _REQ_METHOD.POST, data)

export const getCryptosApi = () => _REQUEST_ORIGIN('cryptos', _REQ_METHOD.GET)

export const stakedApi = () => _REQUEST_ORIGIN('staked', _REQ_METHOD.GET)
export const confStakeApi = (data) => _REQUEST_ORIGIN('confirmstake', _REQ_METHOD.POST, data)
export const confUnStakeApi = (data) => _REQUEST_ORIGIN('confirmunstake', _REQ_METHOD.POST, data)
export const purchasesApi = () => _REQUEST_ORIGIN('purchases', _REQ_METHOD.GET)
export const packagesApi = (id = null) => _REQUEST_ORIGIN(`packages${id ? `/${id}` : ''}`, _REQ_METHOD.GET)
export const discussionsApi = (id) => _REQUEST_ORIGIN(`discussions${id ? `/${id}` : ''}`, _REQ_METHOD.GET);
export const buyPackageApi = (data) => _REQUEST_ORIGIN('buy-package', _REQ_METHOD.POST, data)
export const renewPackageApi = (data) => _REQUEST_ORIGIN('renew-package', _REQ_METHOD.POST, data)

export const coinPulsesApi = (type) => _REQUEST_ORIGIN(`coin-pulses/${type}`, _REQ_METHOD.GET)
export const deleteCoinPulsesApi = (id) => _REQUEST_ORIGIN(`coin-pulses/${id}`, _REQ_METHOD.DELETE)

export const transfersApi = () => _REQUEST_ORIGIN('transfers', _REQ_METHOD.GET)
export const transferPackageApi = (data) => _REQUEST_ORIGIN('transfer', _REQ_METHOD.POST, data)
export const acceptPackageTransfer = (tid) => _REQUEST_ORIGIN(`acceptTransfer/${tid}`, _REQ_METHOD.GET)
export const cancelPackageTransfer = (tid) => _REQUEST_ORIGIN(`cancelTransfer/${tid}`, _REQ_METHOD.GET)
export const acceptTransaction = (tid) => _REQUEST_ORIGIN(`acceptTransaction/${tid}`, _REQ_METHOD.GET)
export const cancelTransaction = (tid) => _REQUEST_ORIGIN(`cancelTransaction/${tid}`, _REQ_METHOD.GET)

export const productApi = (id = 0) => _REQUEST_ORIGIN(`product/${id}`, _REQ_METHOD.GET)
export const buyProductApi = (data) => _REQUEST_ORIGIN(`product`, _REQ_METHOD.POST, data)

export const marketplaceApi = (id = 0) => _REQUEST_ORIGIN(`marketplace/${id}`, _REQ_METHOD.GET)
export const allMarketplaceApi = (id = 0) => _REQUEST_ORIGIN(`all_marketplace/${id}`, _REQ_METHOD.GET)
export const deleteMarketplaceApi = (id) => _REQUEST_ORIGIN(`marketplace/${id}`, _REQ_METHOD.DELETE)
export const createMarketplaceApi = (data) => _REQUEST_ORIGIN(`marketplace`, _REQ_METHOD.POST, data)

export const salesLogApi = () => _REQUEST_ORIGIN('saleslog', _REQ_METHOD.GET)
export const myOrderApi = () => _REQUEST_ORIGIN('myorder', _REQ_METHOD.GET)
export const salesFeedbackApi = () => _REQUEST_ORIGIN('salesfeedback', _REQ_METHOD.GET)
export const getRefLinkApi = () => _REQUEST_ORIGIN('referralLink', _REQ_METHOD.GET)
export const addRefLinkApi = (data) => _REQUEST_ORIGIN('referralLink', _REQ_METHOD.POST, data)
export const updateRefLinkApi = (data) => _REQUEST_ORIGIN('referralLink/update', _REQ_METHOD.POST, data)
export const refLinksApi = () => _REQUEST_ORIGIN('cryptoreferrallinklog', _REQ_METHOD.GET)

export const cancelRefLinksApi = (id) => _REQUEST_ORIGIN(`reflink/${id}`, _REQ_METHOD.DELETE)

export const networkLogApi = () => _REQUEST_ORIGIN('networklog', _REQ_METHOD.GET)
export const payoutPercentApi = () => _REQUEST_ORIGIN("payoutpercent", _REQ_METHOD.GET);
export const depositLogApi = () => _REQUEST_ORIGIN('depositlog', _REQ_METHOD.GET)
export const SponsorLogApi = () => _REQUEST_ORIGIN('sponsorlog', _REQ_METHOD.GET)
export const withdraLogApi = () => _REQUEST_ORIGIN('withdrawallog', _REQ_METHOD.GET)
export const transferLogApi = () => _REQUEST_ORIGIN('transferlog', _REQ_METHOD.GET)
export const swapLogApi = () => _REQUEST_ORIGIN('swaplog', _REQ_METHOD.GET)
export const swapFeeLogApi = () => _REQUEST_ORIGIN('swapfeecollectedlog', _REQ_METHOD.GET)
export const stakedLogApi = () => _REQUEST_ORIGIN('stakedlog', _REQ_METHOD.GET)
export const c2aTransferLogApi = () => _REQUEST_ORIGIN('clienttoadmintransferlog', _REQ_METHOD.GET)
export const profileApi = () => _REQUEST_ORIGIN('profile', _REQ_METHOD.GET)
export const getSettingsApi = () => _REQUEST_ORIGIN('settings', _REQ_METHOD.GET)
export const getNetworkApi = () => _REQUEST_ORIGIN('network', _REQ_METHOD.GET)

export const getTransactionApi = () => _REQUEST_ORIGIN('transaction', _REQ_METHOD.GET)

export const getAdminApi = () => _REQUEST_ORIGIN('admin', _REQ_METHOD.GET)
export const updateAdminApi = (data) => _REQUEST_ORIGIN('admin', _REQ_METHOD.POST, data)
export const getContractsApi = () => _REQUEST_ORIGIN('admin/contracts', _REQ_METHOD.GET)
export const getAdminWalletsApi = (id) => _REQUEST_ORIGIN(`admin/wallets/${id}`, _REQ_METHOD.GET)
export const confPayoutApi = (data) => _REQUEST_ORIGIN('admin/payout', _REQ_METHOD.POST, data)
export const transfer2AdminApi = (data) => _REQUEST_ORIGIN('admin/transfer', _REQ_METHOD.POST, data)
export const getClientsApi = () => _REQUEST_ORIGIN('admin/clients', _REQ_METHOD.GET)

export const updateUserApi = (data) => _REQUEST_ORIGIN('admin/user', _REQ_METHOD.POST, data)
export const sendTextApi = (data) => _REQUEST_ORIGIN('admin/user/text', _REQ_METHOD.POST, data)
export const deleteUserApi = (userid) => _REQUEST_ORIGIN(`admin/user/${userid}`, _REQ_METHOD.DELETE)

export const deletePackageApi = (id) => _REQUEST_ORIGIN(`admin/package/${id}`, _REQ_METHOD.DELETE)
export const updatePackageApi = (data) => _REQUEST_ORIGIN(`admin/package`, _REQ_METHOD.POST, data)

export const getPurchasesApi = (id) => _REQUEST_ORIGIN(`admin/purchases/${id}`, _REQ_METHOD.GET)
export const deletePurchasesApi = (id) => _REQUEST_ORIGIN(`admin/purchases/${id}`, _REQ_METHOD.DELETE)
export const updateDiscussionApi = (data) => _REQUEST_ORIGIN(`admin/discussion`, _REQ_METHOD.POST, data)
export const deleteDiscussionApi = (id) => _REQUEST_ORIGIN(`admin/discussions/${id}`, _REQ_METHOD.DELETE)

export const getCategoriesApi = () => _REQUEST_ORIGIN('admin/categories', _REQ_METHOD.GET)
export const updateCategoryApi = (data) => _REQUEST_ORIGIN('admin/categories', _REQ_METHOD.POST, data)
export const deleteCategoryApi = (id) => _REQUEST_ORIGIN(`admin/categories/${id}`, _REQ_METHOD.DELETE)
export const getTwilioAccountsApi = () => _REQUEST_ORIGIN('admin/twilio', _REQ_METHOD.GET)
export const updateTwilioApi = (data) => _REQUEST_ORIGIN('admin/twilio', _REQ_METHOD.POST, data)
export const updateNumberApi = (data) => _REQUEST_ORIGIN('admin/twilio/number', _REQ_METHOD.POST, data)
export const deleteNumberApi = (id) => _REQUEST_ORIGIN(`admin/twilio/number/${id}`, _REQ_METHOD.DELETE)
export const getTwilioLogsApi = () => _REQUEST_ORIGIN('admin/twilio-logs', _REQ_METHOD.GET)
export const deleteTwilioLogsApi = (id) => _REQUEST_ORIGIN(`admin/twilio-logs/${id}`, _REQ_METHOD.DELETE)
export const getFaqApi = () => _REQUEST_ORIGIN('admin/faq', _REQ_METHOD.GET)
export const updateFaqApi = (data) => _REQUEST_ORIGIN('admin/faq', _REQ_METHOD.POST, data)
export const deleteFaqApi = (id) => _REQUEST_ORIGIN(`admin/faq/${id}`, _REQ_METHOD.DELETE)
export const contractApi = (data) => _REQUEST_ORIGIN('admin/contract', _REQ_METHOD.POST, data)
export const updateCryptoApi = (data) => _REQUEST_ORIGIN('admin/crypto', _REQ_METHOD.POST, data)
export const updateCryptoOptionsApi = (data) => _REQUEST_ORIGIN(`admin/update-crypto`, _REQ_METHOD.POST, data)
export const deleteCryptoApi = (id) => _REQUEST_ORIGIN(`admin/crypto/${id}`, _REQ_METHOD.DELETE)
export const deleteTransferApi = (id) => _REQUEST_ORIGIN(`admin/transfer/${id}`, _REQ_METHOD.DELETE)
export const updateNetworkApi = (data) => _REQUEST_ORIGIN(`admin/network`, _REQ_METHOD.POST, data)
export const runBinaryPayoutApi = () => _REQUEST_ORIGIN(`admin/binary-payout`, _REQ_METHOD.GET)
export const getNonReferralApi = () => _REQUEST_ORIGIN(`admin/referral`, _REQ_METHOD.GET)
export const updateNonReferralApi = (data) => _REQUEST_ORIGIN(`admin/referral`, _REQ_METHOD.POST, data)
export const getAllContacts = () => _REQUEST_ORIGIN(`contacts`)

export const uploadApi = (formdata) => {
    if (!window.navigator.onLine) return Promise.reject("You are offline, Please check your network connection");
    const userInfo = getAuth();

    return new Promise((resolve, reject) => {
        fetch(`${window.location.origin}/api/upload-media`, {
            method: _REQ_METHOD.POST,
            headers: {
                ...(userInfo?.token && { 'Authorization': `Bearer ${userInfo?.token}` })
            },
            body: formdata
        })
            .then(res => res.json())
            .then(res => {
                if (res?.logout) logoutUser();
                if (res?.success) return resolve(res)
                reject(res.message || 'Something went wrong')
            })
            .catch(err => reject(err.message || 'Something went wrong'))
    })
}