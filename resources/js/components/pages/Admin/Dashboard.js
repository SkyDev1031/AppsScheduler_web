import moment from "moment";
import { Fragment, useCallback } from "react";
import { Dropdown } from 'primereact/dropdown';
import { ProgressBar } from 'primereact/progressbar';
import { useEffect, useState } from "react";
import { IMAGES } from "../../assets";
import { NumberView } from "../../components";
import { useGlobalContext } from "../../contexts";
import { getUsersNumber } from '../../api/OriginAPI.js';
import { toast_error } from "../../utils";

export default function dashboard() {
    const { user, isAdmin, cryptos, setLoading, getInitialData, transactions, holdings } = useGlobalContext();
    return (
        <div className="dashboard-container">
            <h2>Dashboard</h2>
        </div>
    )
}