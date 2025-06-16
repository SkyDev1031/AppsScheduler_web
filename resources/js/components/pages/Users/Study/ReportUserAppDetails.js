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
import { getAppUsageDurationApi, downloadCSV, getAppUseInfosTotalApi, getAppUsageInfosByDate } from '../../../api/AppClientAPI.js';
import { _ERROR_CODES } from '../../../config/index.js';
import { useGlobalContext } from "../../../contexts/index.js";
import { toast_error, toast_success } from '../../../utils/index.js';
import SimpleDatePicker from '../../../components/SimpleDatePicker.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { encryptParam, decryptParam } from '../../../utils/cryptoUtils.js'
// const location = useLocation();

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

const preprocessAppUsageInfos = (data) => {
    return data.map((item, index) => {
        // Split app_start_time and app_end_time into date and time
        const [startDate, startTime] = item.app_start_time.split(' ');
        const [endDate, endTime] = item.app_end_time.split(' ');

        // Parse app_start_time and app_end_time into Date objects
        const fromDate = new Date(item.app_start_time);
        const toDate = new Date(item.app_end_time);

        // Calculate the duration in milliseconds
        const durationMs = toDate - fromDate;

        // Convert duration to hours, minutes, and seconds
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

        // Format the duration into a human-readable format
        let duration = '';
        if (hours > 0) duration += `${hours}h `;
        if (minutes > 0) duration += `${minutes}m `;
        if (seconds > 0 || duration === '') duration += `${seconds}s`; // Include seconds even if 0

        // Return the updated object with the fields in the desired order
        return {
            no: index + 1, // Order number
            userID: item.userID, // userID
            app_start_date: startDate, // StartDate
            app_start_time: startTime, // StartTime
            app_end_date: endDate, // EndDate
            app_end_time: endTime, // EndTime
            app_name: item.app_name, // AppName
            app_duration: duration.trim(), // Duration
            app_scheduled_status: item.app_scheduled_status, // ScheduledStatus
            saved_time: item.saved_time // SavedTime
        };
    });
};

const ReportAppDetails = () => {
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
    // const [studyId, setStudyId] = useState(location.state?.studyId || '');
    const getAppUsageInfos = () => {    
        setLoading(true);
        getAppUsageDurationApi(phonenumber, "", "")
            .then(res => {
                const processedData = preprocessAppUsageInfos(res.data); // Preprocess data
                setAppUsageInfos(processedData);
            })
            .catch(err => {
                toast_error(err, _ERROR_CODES.NETWORK_ERROR);
            })
            .finally(() => setLoading(false));
    };

    const getAppUsageByDateInfos = () => {
        setLoading(true);
        getAppUsageDurationApi(phonenumber, startDate, endDate)
            .then(res => {
                const processedData = preprocessAppUsageInfos(res.data); // Preprocess data
                setAppUsageInfos(processedData);
            })
            .catch(err => {
                toast_error(err, _ERROR_CODES.NETWORK_ERROR);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false; // Update the flag after the first render
            return; // Exit the effect without executing further logic
        }
        console.log("detail Get", phonenumber)
        getAppUsageInfos();
    }, [phonenumber])

    useEffect(() => {
        setPhonenumber(decryptParam(encryptedPhoneNumber))
    }, [encryptedPhoneNumber])

    const handleDownload = () => {
        // getAppUsageDurationApi(phonenumber, startDate, endDate)
        //     .then(res => {
        //         const cleanedData = res.data.map(({ phonenumber, ...rest }) => rest);
        //         downloadCSV(cleanedData)
        //     })
        //     .catch(err => console.log(err))
        const cleanedData = appUsageInfos.map(({ phonenumber, ...rest }) => rest);
        downloadCSV(cleanedData)
    }

    const goFreq = () => {
        navigate(`/user/reportApp/details2/${encryptParam(phonenumber)}`);
    }
    const onBack = () => {
        navigate(-1); // Just go back to previous page
    };
    const viewByDate = () => {
        getAppUsageByDateInfos()
    }
    return (
        <>
            <h3>Show Report App Usage Duration Details</h3>
            <DataTable value={appUsageInfos} responsiveLayout="scroll" stripedRows paginator
                resizableColumns columnResizeMode="fit" showGridlines
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]}
                filters={{ 'global': { value: query, matchMode: FilterMatchMode.CONTAINS } }}
                header={() => (
                    <div className='d-flex'>
                        <div className="me-auto p-2">
                            <button onClick={onBack} className="btn btn-default"><i className="fas fa-angle-double-left" /> Back</button>
                            <button onClick={getAppUsageInfos} className="btn btn-default"><i className="fa fa-refresh" /> Reload</button>
                            <button onClick={handleDownload} className="btn btn-default"><i className="fas fa-download" /> CSV</button>
                            <button onClick={goFreq} className="btn btn-success"><i className="fas fa-binoculars"></i> View Frequency</button>
                        </div>
                        <div className="p-2">
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by keyword" />
                            </span>
                            <SimpleDatePicker
                                onChange={(newDate) => setStartDate(newDate)}
                            />
                            <SimpleDatePicker
                                onChange={(newDate) => setEndDate(newDate)}
                            />
                            <button onClick={viewByDate} className="btn btn-primary"><i className="fa fa-refresh" /> Search</button>
                        </div>
                    </div>
                )}
            >
                <Column key={'no'} header={'No'} field={'no'} sortable className="text-center" />
                <Column key={'userID'} header={'UserID'} field={'userID'} sortable className="text-right" />
                <Column key={'app_start_date'} header={'Start Date'} field={'app_start_date'} sortable className="text-right" />
                <Column key={'app_start_time'} header={'Start Time'} field={'app_start_time'} sortable className="text-right" />
                <Column key={'app_end_date'} header={'End Date'} field={'app_end_date'} sortable className="text-right" />
                <Column key={'app_end_time'} header={'End Time'} field={'app_end_time'} sortable className="text-right" />
                <Column key={'app_name'} header={'AppName'} field={'app_name'} sortable className="text-right" />
                <Column key={'app_duration'} header={'Duration'} field={'app_duration'} sortable className="text-right" />
                <Column key={'app_scheduled_status'} header={'ScheduledStatus'} field={'app_scheduled_status'} sortable className="text-right" />
                <Column key={'saved_time'} header={'SavedTime'} field={'saved_time'} sortable className="text-right" />
            </DataTable>
        </>
    )
}
export default ReportAppDetails;