import {
    Autocomplete, Dialog, DialogActions, DialogContent,
    DialogTitle, FormControl, IconButton, InputAdornment,
    InputLabel, OutlinedInput, TextField, FormControlLabel
} from '@mui/material';


import { Button, DataTable, InputMask, InputSwitch, InputText } from 'primereact';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getApprovedParticipantsApi } from '../../../api/ParticipantAPI.js';
import {getAppUsageFreqApi, getAppUsageDurationApi, downloadCSV} from '../../../api/AppClientAPI.js'
import { _ERROR_CODES } from '../../../config/index.js';
import { useGlobalContext } from "../../../contexts/index.js";
import { toast_error, toast_warning } from '../../../utils/index.js';
import { encryptParam, decryptParam } from '../../../utils/cryptoUtils.js'
import { Button as PrimeButton } from 'primereact/button';

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

const ViewStudyGroup = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(null);
    const [downloadInfos, setDownloadInfos] = useState([])
    const [participantsList, setParticipantsList] = useState([])
    const [query, setQuery] = useState('')
    const { setLoading, confirmDialog } = useGlobalContext()
    const { studyId } = useParams()
    // console.log("StudyId=> ", studyId)
    useEffect(() => {
        getApprovedParticipantsList();
    }, [])
    const getApprovedParticipantsList = () => {
        setLoading(true);
        getApprovedParticipantsApi(studyId)
            .then(res => { setParticipantsList(res.data) })
            .catch(err => { toast_error(err, _ERROR_CODES.NETWORK_ERROR); })
            .finally(() => setLoading(false));
    }

    // // Handle row click event
    const handleRowClick = (event) => {
        const rowData = event.data; // Get the data of the clicked row
        // Example: Navigate to a details page for the clicked row
        const encryptedPhoneNumber = encryptParam(rowData.phonenumber)
        navigate(`/user/reportApp/details/${encryptedPhoneNumber}`);
    };
    const onBack = () => {
        navigate(`/user/study`);
    }
    const handleDownloadAllDuration = () => {
        getAppUsageDurationApi("", "", "", studyId)
            .then(res => {
                if (!res.data || res.data.length === 0) {
                    toast_warning("No app usage duration data found for this study.");
                    return;
                }
                const cleanedData = res.data.map(({ phonenumber, ...rest }) => rest);
                downloadCSV(cleanedData);
            })
            .catch(err => {
                console.log(err);
                toast_error("Failed to fetch duration data.");
            });
    };
    
    const handleDownloadAllFrequency = () => {
        getAppUsageFreqApi("", "", "", studyId)
            .then(res => {
                if (!res.data || res.data.length === 0) {
                    toast_warning("No app usage frequency data found for this study.");
                    return;
                }
                const cleanedData = res.data.map(({ phonenumber, ...rest }) => rest);
                downloadCSV(cleanedData);
            })
            .catch(err => {
                console.log(err);
                toast_error("Failed to fetch frequency data.");
            });
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2 justify-content-center">
                <PrimeButton 
                    icon="pi pi-mobile"
                    className="p-button-rounded p-button-info p-button-sm" 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent row click event
                        navigate(`/user/reportPhone/details/${encryptParam(rowData.phonenumber)}`);
                    }}
                    tooltip="View Phone Usage"
                    tooltipOptions={{ position: 'top' }}
                />
                <PrimeButton 
                    icon="pi pi-list"
                    className="p-button-rounded p-button-success p-button-sm"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent row click event
                        navigate(`/user/reportApp/details/${encryptParam(rowData.phonenumber)}`);
                    }}
                    tooltip="View App Usage"
                    tooltipOptions={{ position: 'top' }}
                />
            </div>
        );
    };

    return (
        <>
            <h4>View Study Group (Approved Participants List)</h4>
            <DataTable value={participantsList} responsiveLayout="scroll" stripedRows paginator
                resizableColumns columnResizeMode="fit" showGridlines
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]}
                filters={{ 'global': { value: query, matchMode: FilterMatchMode.CONTAINS } }}
                rowClassName={(rowData) => 'custom-hover-row'}
                header={() => (
                    <div className='d-flex'>
                        <div className="p-2">
                            <button onClick={onBack} className="btn btn-default"><i className="fas fa-angle-double-left" /> Back</button>
                            <button onClick={getApprovedParticipantsList} className='btn btn-default'><i className='fa fa-refresh' /> Reload</button>
                            <button onClick={handleDownloadAllDuration} className='btn btn-default'><i className='fa fa-download' /> CSV Duration</button>
                            <button onClick={handleDownloadAllFrequency} className='btn btn-default'><i className='fa fa-download' /> CSV Frequency</button>
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
                <Column key={'created_at'} header={'Registered Time'} field={'created_at'} sortable />
                <Column key={'updated_at'} header={'Last Updated Time'} field={'updated_at'} sortable />
                <Column 
                    key="actions"
                    header="View Details" 
                    body={actionBodyTemplate} 
                    style={{ width: '10rem' }}
                    className="text-center"
                />
            </DataTable>
        </>
    )
}
export default ViewStudyGroup;