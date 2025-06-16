import {
    Autocomplete, Dialog, DialogActions, DialogContent,
    DialogTitle, FormControl, IconButton, InputAdornment,
    InputLabel, OutlinedInput, TextField, FormControlLabel
} from '@mui/material';
import { Button, DataTable, InputMask, InputSwitch, InputText } from 'primereact';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAppUsageFreqApi, downloadCSV, getAppUseFreqInfosTotalApi } from '../../../api/AppClientAPI.js';
import { _ERROR_CODES } from '../../../config/index.js';
import { useGlobalContext } from "../../../contexts/index.js";
import { toast_error, toast_success } from '../../../utils/index.js';
import SimpleDatePicker from '../../../components/SimpleDatePicker.js';
import { encryptParam, decryptParam } from '../../../utils/cryptoUtils.js'

const _ACT_TYPE = {
    DEFAULT: -1,
    ADD: 0,
    EDIT: 1,
    TEXT: 2,
    PURCHASES: 3,
    WALLETS: 4,
    DELETE: 5,
    NETWORK: 6
}

const ReportAppDetails2 = () => {
    const navigate = useNavigate();
    const { encryptedPhoneNumber } = useParams()
    const [phonenumber, setPhonenumber] = useState('')
    const [appUsageInfos, setAppUsageInfos] = useState([])
    const [query, setQuery] = useState('')
    const { setLoading, confirmDialog } = useGlobalContext();
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const isFirstRender = useRef(true); // Create a ref to track the first render

    const getAppUsageInfos = () => {
        setLoading(true);
        getAppUsageFreqApi(phonenumber, "", "")
            .then(res => { setAppUsageInfos(res.data) })
            .catch(err => { toast_error(err, _ERROR_CODES.NETWORK_ERROR); })
            .finally(() => setLoading(false));
    }
    const getAppUsageByDateInfos = () => {
        setLoading(true);
        getAppUsageFreqApi(phonenumber, startDate, endDate)
            .then(res => { setAppUsageInfos(res.data) })
            .catch(err => { toast_error(err, _ERROR_CODES.NETWORK_ERROR); })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        setPhonenumber(decryptParam(encryptedPhoneNumber))
    }, [encryptedPhoneNumber])

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false; // Update the flag after the first render
            return; // Exit the effect without executing further logic
        }
        getAppUsageInfos();
        console.log("freqdetail ", phonenumber)
    }, [phonenumber])

    const handleDownload = () => {
        getAppUsageFreqApi(phonenumber, startDate, endDate)
            .then(res => {
                const cleanedData = res.data.map(({ phonenumber, ...rest }) => rest);
                downloadCSV(cleanedData)
            })
            .catch(err => console.log(err))
    }
    const goDuration = () => {
        navigate(`/user/reportApp/details/${encryptParam(phonenumber)}`);
    }
    const onBack = () => {
        navigate(`/user/reportApp`);
    }
    const viewByDate = () => {
        getAppUsageByDateInfos()
    }

    return (
        <>
            <h3>Show Report Freauency of App Openings</h3>
            <DataTable value={appUsageInfos} responsiveLayout="scroll" stripedRows paginator
                resizableColumns columnResizeMode="fit" showGridlines
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]}
                filters={{ 'global': { value: query, matchMode: FilterMatchMode.CONTAINS } }}
                header={() => (
                    <div className='d-flex'>
                        <div className="me-auto p-2">
                            <button label='Back' onClick={onBack} className="btn btn-default"><i className='fas fa-angle-double-left' /> Back</button>
                            <button label='Reload' onClick={getAppUsageInfos} className="btn btn-default"><i className='fa fa-refresh' /> Reload</button>
                            <button label='Download CSV' onClick={handleDownload} className="btn btn-default"><i className='fas fa-download' /> CSV</button>
                            <button label='View duration of app usage' onClick={goDuration} className="btn btn-success"><i className='fas fa-binoculars'></i> View Duration</button>
                        </div>
                        <div className="p-2">
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by keyword" />
                            </span>
                            <SimpleDatePicker
                                onChange={(newDate) => setStartDate(newDate)} // Pass a callback to handle changes
                            />
                            <SimpleDatePicker
                                onChange={(newDate) => setEndDate(newDate)} // Pass a callback to handle changes
                            />
                            <button label='View by date' onClick={viewByDate} className="btn btn-primary"><i className='fa fa-refresh' /> Search</button>
                        </div>
                    </div>

                )}
            >
                <Column key={'no'} header={'No'} field={'no'} sortable body={(rowData, options) => {
                    // Calculate the index based on the current page and rows per page
                    const index = options.rowIndex + 1; // rowIndex is zero-based, so add 1
                    return <span>{index}</span>;
                }} />
                {/* <Column key={'phonenumber'} header={'PhoneNumber'} field={'phonenumber'} sortable /> */}
                <Column key={'userID'} header={'UserID'} field={'userID'} sortable />
                <Column key={'app_name'} header={'AppName'} field={'app_name'} sortable />
                <Column key={'frequency_app_openings'} header={'Count'} field={'frequency_app_openings'} sortable />
                <Column key={'scheduled_status'} header={'Scheduled Status'} field={'scheduled_status'} sortable />
                <Column key={'savedTime'} header={'Date'} field={'savedTime'} sortable />
            </DataTable>
        </>
    )
}
export default ReportAppDetails2;