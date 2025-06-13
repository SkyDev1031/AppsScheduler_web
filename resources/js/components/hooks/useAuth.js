import { useState, useEffect } from 'react';
import { getUserApi, loginApi } from "../api/OriginAPI.js";
import { _ERROR_CODES } from '../config';
import { getAuth, saveAuth, toast_error, toast_success } from "../utils";

export default function useAuth() {
    const [auth, setAuth] = useState(() => getAuth()); // Lazy initialization
    const _token = auth?.token;
    const _user = auth?.user || {};
    const isAdmin = _user?.role == 1;

    useEffect(() => {
        // Refresh auth state when the component mounts
        const storedAuth = getAuth();
        if (storedAuth) {
            setAuth(storedAuth);
        } else {
            setAuth(null); // Clear auth state if token is expired
        }
    }, []);

    const saveAuthData = (auth_data) => {
        setAuth(auth_data);
        saveAuth(auth_data, true, true); // Prevent automatic redirection
    };

    const updateAuth = (user) => {
        const tmp_auth = { ...auth, user };
        setAuth(tmp_auth);
        saveAuth(tmp_auth, false, false); // Prevent automatic redirection
    };

    const login = async (username, password) => {
        try {
            const res = await loginApi(username, password);
            if (res && res.token) {
                toast_success("Login success");
                saveAuthData(res); // Save valid auth data
            } else {
                toast_error("Login failed", "Invalid credentials");
                throw new Error("Invalid credentials");
            }
        } catch (err) {
            toast_error(err.message || "Login failed", _ERROR_CODES.AUTH_NETWORK_ERROR);
            setAuth(null); // Clear auth state on invalid login
        }
    };

    const refreshUser = async () => {
        try {
            const res = await getUserApi();
            updateAuth(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return {
        login,
        setAuth: saveAuthData,
        refreshUser,
        _token,
        _user,
        isAdmin,
    };
}