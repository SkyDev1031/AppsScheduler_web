import { IMAGES } from "../assets";

export * from "./contractAbi";
export * from "./nav";
export const MESSAGE_SERVER = 'https://nodes.gold'
// export const MESSAGE_SERVER =  'http://localhost:3333'
export const DEF_IMAGE = {
    coin: IMAGES.coin,
    marketplace: IMAGES.noimage,
    file: IMAGES.file,
}

export const SITE_KEY = process.env.MIX_CAPTCHA_SITE_KEY;
export const SECRET_KEY = process.env.MIX_CAPTCHA_SECRET_KEY;
export const _TESTING = process.env.MIX_APP_ENV == 'dev';

export const _NETWORK_CHAINS = {
    ERC: {
        chainName: "Ethereum Mainnet",
        chainId: '0x1',
        nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
        rpcUrls: ['https://eth.llamarpc.com'],
    },
    BSC: {
        chainName: "Binance Smart Chain Mainnet",
        chainId: '0x38',
        nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
        rpcUrls: ['https://endpoints.omniatech.io/v1/bsc/mainnet/public']
    },
    BSCTEST: {
        chainName: "Binance Smart Chain Testnet",
        chainId: "0x61",
        nativeCurrency: { name: 'tBNB', decimals: 18, symbol: 'tBNB' },
        rpcUrls: ['https://endpoints.omniatech.io/v1/bsc/testnet/public']
    },
}
export const _ERROR_CODES = {
    INVALID_INPUT: 4001,
    NO_ENOUGH_BALANCE: 4002,
    NO_PRICE: 4003,
    NO_REFERRAL_LINK: 4004,

    METAMASK_NETWORK_ERROR: 4010,

    UKNOWN_ERROR: 3000,

    NETWORK_ERROR: 5001,
    AUTH_NETWORK_ERROR: 5002,
    CHECK_2ND_ERROR: 5003,
    DEPOSIT_ERROR: 5004,
    WITHDRAW_ERROR: 5005,
    PAYOUT_ERROR: 5006,
    UPDATE_USER_ERROR: 5007,
    SEND_TEXT_ERROR: 5008,
    DELETE_PURCHASE_ERROR: 5009,
    CONTRACT_ERROR: 5010,

    INVALID_TWILIO: 6001,
}
export const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],

    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']
];