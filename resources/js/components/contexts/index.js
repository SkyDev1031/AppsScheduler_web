import { useMetaMask } from "metamask-react";
import { confirmDialog, ConfirmDialog } from "primereact";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import Web3 from "web3";
import { getContractsApi, getCryptosApi, getSettingsApi, getTransactionApi, pwdCheckApi } from "../api/OriginAPI.js";
import { contractABI, minABI, _ERROR_CODES, _NETWORK_CHAINS, _TESTING } from "../config";
import { useAuth } from "../hooks";
import { toast_error } from "../utils";

export const GlobalContext = createContext({});
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalContextProvider = ({ children }) => {
    const { _user, _token, isAdmin, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false)
    const { status, connect, account, chainId, addChain, switchChain, ethereum } = useMetaMask();
    const [conf2ndPwd, setConf2ndPwd] = useState(false)
    const [cryptos, setCryptos] = useState([])
    const [settings, setSettings] = useState({})
    const [contracts, setContracts] = useState([])
    const [activeContracts, setActiveContracts] = useState([])
    const [transactions, setTransactions] = useState([])
    const [holdings, setHoldings] = useState([])
    const web3 = useRef(new (Web3)(window.ethereum)).current;
    const [click_count, setClickCount] = useState(0);
    const [buy_credits, setBuyCredits] = useState(0);
    const [sellerId, setSellerId] = useState({});

    const check2ndPassword = async (pwd) => {
        if (!pwd) {
            toast_error("Put your secondary password", _ERROR_CODES.INVALID_INPUT);
            return false;
        }
        setLoading(true);
        try {
            const res = await pwdCheckApi(pwd)
            setConf2ndPwd(res.success);
            if (res.success) {
                setTimeout(() => setConf2ndPwd(false), 20 * 60 * 1000);
            }
            return res.success;
        } catch (error) {
            toast_error(error, _ERROR_CODES.CHECK_2ND_ERROR)
        } finally {
            setLoading(false);
        }
        return false;
    }
    const onApprove = (token, currentAccount) => {
        return new Promise(async (resolve, reject) => {
            try {
                const contract = new web3.eth.Contract(minABI, token.contract_address);
                const amount = web3.utils.toBN('0xfffffffffffffffffffffffffffffffffffffffffffff');
                await contract.methods.approve(token.address, amount).send({ from: currentAccount });
                resolve(true);
            } catch (error) {
                resolve(false);
            }
        })
    }
    const switchNetwork = (_chain) => {
        return switchChain(_chain.chainId)
            .catch(err => {
                if (err.code === 4902) return addChain(_chain)
                throw err;
            })
    }
    const checkNetwork = async (network) => {
        try {
            network = network.toLowerCase();
            if (_TESTING) {
                if (chainId != _NETWORK_CHAINS.BSCTEST.chainId) await switchNetwork(_NETWORK_CHAINS.BSCTEST);
            } else if (network == "erc") {
                if (chainId != _NETWORK_CHAINS.ERC.chainId) await switchNetwork(_NETWORK_CHAINS.ERC);
            } else if (network == "bsc") {
                if (chainId != _NETWORK_CHAINS.BSC.chainId) await switchNetwork(_NETWORK_CHAINS.BSC);
            }
            return true;
        } catch (error) {
            return false;
        }
    }
    const convertAmount = (amount, decimal, ismul = true) => {
        amount = Math.abs(amount)
        let value = 0
        if (ismul) {
            value = amount * Math.pow(10, decimal);
            if (value < 0) {
                value = 0xFFFFFFFF + value + 1;
            }
            return web3.utils.toBN('0x' + value.toString(16).toUpperCase())
        }
        value = web3.utils.toBN(amount) / web3.utils.toBN(Math.pow(10, decimal));
        return value.toFixed(3);
    }
    const getApproveStatus = async (token, balance = "0", currentAccount) => {
        try {
            const contract = new web3.eth.Contract(minABI, token.contract_address);
            const approved = await contract.methods.allowance(currentAccount, token.address).call();
            return parseInt(approved) > parseInt(balance);
        } catch (error) {
            console.log("Context index getApproveStatus error = : ", error);
            if (error.toString().includes("eth_call is not supported")) {
                return null;
            }
        }
        return false;
    }
    const onDeposit = async (token, amount) => {
        try {
            setLoading(true);
            let currentAccount = "";
            if (!account) {
                let resultConnect = await connect();
                currentAccount = resultConnect[0];
            } else {
                currentAccount = account
            }
            if (!token.address) return setLoading(false);
            const checkNet = await checkNetwork(token.network);
            if (!checkNet) {
                setLoading(false);
                return toast_error("Can't find network, please check your wallet", _ERROR_CODES.METAMASK_NETWORK_ERROR);
            }

            amount = convertAmount(amount, token.decimal ?? 18);
            const approved = await getApproveStatus(token, amount, currentAccount);
            if (!approved) await onApprove(token, currentAccount);
            // console.log("contexts index onDeposit amount = : ", amount, token, account);
            const contract = new web3.eth.Contract(contractABI, token.address);
            if (!account) {
                const deposit = await contract.methods.deposit(amount, token.contract_address).send({ from: currentAccount });
                setLoading(false);
                return deposit;
            } else {
                const deposit = await contract.methods.deposit(amount, token.contract_address).send({ from: account });
                setLoading(false);
                return deposit;
            }
        } catch (error) {
            console.log("index.js onDeposit error = : ", error);
            setLoading(false);
            return false;
        }
    }
    const onWithdraw = async (token, amount) => {
        setLoading(true);
        try {
            let resultConnect = [];
            if (!account) {
                resultConnect = await connect();
            }
            if (!token.address) return setLoading(false);
            const checkNet = await checkNetwork(token.network);
            if (!checkNet) {
                setLoading(false);
                return toast_error("Can't find network, please check your wallet", _ERROR_CODES.METAMASK_NETWORK_ERROR);
            }
            const contract = new web3.eth.Contract(contractABI, token.address);
            amount = convertAmount(amount, token.decimal ?? 18);
            if (!account) {
                const withdraw = await contract.methods.withdraw(amount, token.contract_address).send({ from: resultConnect[0] });
                setLoading(false);
                return withdraw;
            } else {
                const withdraw = await contract.methods.withdraw(amount, token.contract_address).send({ from: account });
                setLoading(false);
                return withdraw;
            }
        } catch (error) {
            setLoading(false);
            return false;
        }
    }

    const customConfirmDialog = (title = 'Delete Confirmation', message = 'Do you want to delete this user?') => {
        return new Promise(resolve => {
            confirmDialog({
                header: title,
                message,
                icon: 'pi pi-info-circle',
                acceptClassName: 'p-button-danger',
                rejectClassName: 'p-button-secondary',
                accept: () => resolve(true),
                reject: () => resolve(false),
                onHide: () => resolve(false),
            });
        });
    }
    return (
        <GlobalContext.Provider
            value={{
                user: _user || {}, isAdmin, _token,
                loading, setLoading, refreshUser,
                onDeposit, onWithdraw,
                conf2ndPwd, check2ndPassword,
                // cryptos, settings, contracts, activeContracts,
                // getInitialData,
                confirmDialog: customConfirmDialog,
                transactions, holdings,
                click_count, setClickCount,
                buy_credits, setBuyCredits,
                sellerId, setSellerId
            }}>
            <ConfirmDialog />
            {children}
            <div id="site_header"></div>
        </GlobalContext.Provider>
    )
};