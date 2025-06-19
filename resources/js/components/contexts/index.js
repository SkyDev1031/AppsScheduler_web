import { useMetaMask } from "metamask-react";
import { confirmDialog, ConfirmDialog } from "primereact";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import Web3 from "web3";
import { contractABI, minABI, _ERROR_CODES, _NETWORK_CHAINS, _TESTING } from "../config";
import { useAuth } from "../hooks";
import { toast_error } from "../utils";

export const GlobalContext = createContext({});
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalContextProvider = ({ children }) => {
    const { _user, _token, isAdmin, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false)
    const [conf2ndPwd, setConf2ndPwd] = useState(false)
    const [transactions, setTransactions] = useState([])
    const [holdings, setHoldings] = useState([])
    const web3 = useRef(new (Web3)(window.ethereum)).current;
    const [click_count, setClickCount] = useState(0);
    const [buy_credits, setBuyCredits] = useState(0);
    const [sellerId, setSellerId] = useState({});

    const [notifications, setNotifications] = useState([]);
    // Add a new notification
    const addNotification = (notification) => {
        setNotifications((prev) => [...prev, notification]);
    };
    // Remove a specific notification
    const removeNotification = (notificationId) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId));
    };
    // Clear all notifications
    const clearNotifications = () => {
        setNotifications([]);
    };

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
                confirmDialog: customConfirmDialog,
                notifications, addNotification, clearNotifications
            }}>
            <ConfirmDialog />
            {children}
            <div id="site_header"></div>
        </GlobalContext.Provider>
    )
};