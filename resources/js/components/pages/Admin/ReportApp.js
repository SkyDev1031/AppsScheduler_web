import {
    Autocomplete, Dialog, DialogActions, DialogContent,
    DialogTitle, FormControl, IconButton, InputAdornment,
    InputLabel, OutlinedInput, TextField, FormControlLabel
} from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { Button, DataTable, InputMask, InputSwitch, InputText } from 'primereact';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppUsageInfosApi, downloadCSV, deleteAppUseInfosApi, getAppUsageFreqApi, getAppUsageDurationApi } from '../../api/AppClientAPI.js';
import { _ERROR_CODES } from '../../config';
import { useGlobalContext } from "../../contexts";
import { toast_error, toast_success } from '../../utils';
import { encryptParam, decryptParam } from '../../utils/cryptoUtils'

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

const ReportApp = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(null);
    const [downloadInfos, setDownloadInfos] = useState([])
    const [appUsageInfos, setAppUsageInfos] = useState([])
    const [query, setQuery] = useState('')
    const { setLoading, confirmDialog } = useGlobalContext()

    useEffect(() => {
        getAppUsageInfos();
    }, [])
    const getAppUsageInfos = () => {
        setLoading(true);
        getAppUsageInfosApi()
            .then(res => { setAppUsageInfos(res.data) })
            .catch(err => { toast_error(err, _ERROR_CODES.NETWORK_ERROR); })
            .finally(() => setLoading(false));
    }
    const updateSelectionData = (item) => setSelectedItem(bef => ({ ...bef, data: { ...bef.data, ...item } }));
    const initSelection = (item = {}) => setSelectedItem({ ...item });

    const handleClose = () => {
        initSelection();
    };
    const OnActions = async (data, type) => {
        if (type === _ACT_TYPE.DELETE) {
            const isDelete = await confirmDialog('Delete', 'Are you sure you want to delete this data?');
            if (!isDelete) return;
            deleteAppUseInfosApi(data.phonenumber)
                .then(res => {
                    toast_success(res?.message)
                    getAppUsageInfos();
                })
                .catch(err => {
                    toast_error(err, _ERROR_CODES.NETWORK_ERROR)
                })
        }
    }

    // Handle row click event
    const handleRowClick = (event) => {
        const rowData = event.data; // Get the data of the clicked row
        // Example: Navigate to a details page for the clicked row
        const encryptedPhoneNumber = encryptParam(rowData.phonenumber)
        navigate(`/admin/reportApp/details/${encryptedPhoneNumber}`);
    };
    const handleDownloadAllDuration = () => {
        getAppUsageDurationApi()
            .then(res => {
                const cleanedData = res.data.map(({ phonenumber, ...rest }) => rest);
                downloadCSV(cleanedData)
            })
            .catch(err => console.log(err))
    }
    const handleDownloadAllFrequency = () => {
        getAppUsageFreqApi()
            .then(res => {
                const cleanedData = res.data.map(({ phonenumber, ...rest }) => rest);
                downloadCSV(cleanedData)
            })
            .catch(err => console.log(err))
    }
    return (
        <>
            <h3>Show Report App Usage Info</h3>
            <DataTable value={appUsageInfos} responsiveLayout="scroll" stripedRows paginator
                resizableColumns columnResizeMode="fit" showGridlines
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]}
                filters={{ 'global': { value: query, matchMode: FilterMatchMode.CONTAINS } }}
                onRowClick={handleRowClick}
                rowClassName={(rowData) => 'custom-hover-row'}
                header={() => (
                    <div className='d-flex'>
                        <div className="p-2">
                            <button className='btn btn-default' onClick={getAppUsageInfos}><i className='fa fa-refresh' /> Reload</button>
                            <button className='btn btn-default' onClick={handleDownloadAllDuration}><i className='fa fa-download' /> CSV Duration</button>
                            <button className='btn btn-default' onClick={handleDownloadAllFrequency}><i className='fa fa-download' /> CSV Frequency</button>
                        </div>
                        <div className='ms-auto p-2'>
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by keyword" />
                            </span>
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
                <Column key={'from_period'} header={'From'} field={'from_period'} sortable />
                <Column key={'to_period'} header={'To'} field={'to_period'} sortable />
                <Column key={'id'} header={''} field={'id'}
                    body={(data) => (
                        <div className='table-action'>
                            {data.role != 1 && <Button
                                icon="pi pi-trash"
                                className="p-button-danger p-button-sm"
                                tooltip="Delete"
                                tooltipOptions={{ position: 'top' }}
                                onClick={() => OnActions(data, _ACT_TYPE.DELETE)}
                            />}
                        </div>
                    )} />
            </DataTable>
        </>
    )
}
export default ReportApp;