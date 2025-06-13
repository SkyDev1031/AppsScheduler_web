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
import { downloadCSV, getPhoneUsageInfosByPhoneNumberApi } from '../../api/AppClientAPI.js';
import { _ERROR_CODES } from '../../config';
import { useGlobalContext } from "../../contexts";
import { toast_error, toast_success } from '../../utils';
import { decryptParam } from '../../utils/cryptoUtils';

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

const ReportPhoneDetails = () => {
    const navigate = useNavigate();
    const { encryptedPhoneNumber } = useParams()
    const [phonenumber, setPhonenumber] = useState(decryptParam(encryptedPhoneNumber))
    const [phoneUsageInfos, setPhoneUsageInfos] = useState([])
    const [query, setQuery] = useState('')
    const { setLoading, confirmDialog } = useGlobalContext();

    const getPhoneUsageInfos = () => {
        setLoading(true);
        getPhoneUsageInfosByPhoneNumberApi(phonenumber)
            .then(res => { setPhoneUsageInfos(res.data) })
            .catch(err => { toast_error(err, _ERROR_CODES.NETWORK_ERROR); })
            .finally(() => setLoading(false));
    }
    useEffect(() => {
        getPhoneUsageInfos()
    }, [phonenumber])


    const handleDownload = () => {
        getPhoneUsageInfosByPhoneNumberApi(phonenumber)
            .then(res => {
                const cleanedData = res.data.map(({ id, created_at, updated_at, phonenumber, ...rest }) => rest);
                downloadCSV(cleanedData)
            })
            .catch(err => console.log(err))
    }
    const removeFields = (array, fieldsToRemove) => {
        return array.map((item) => {
            const newItem = { ...item };
            fieldsToRemove.forEach((field) => delete newItem[field]);
            return newItem;
        });
    };
    const onBack = () => {
        navigate(`/admin/reportPhone`);
    }
    return (
        <>
            <h3>Show Report Phone Usage Details</h3>
            <DataTable value={phoneUsageInfos} responsiveLayout="scroll" stripedRows paginator
                resizableColumns columnResizeMode="fit" showGridlines
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]}
                filters={{ 'global': { value: query, matchMode: FilterMatchMode.CONTAINS } }}
                header={() => (
                    <div className="d-flex">
                        <div className='me-auto p-2'>
                            <button className="btn btn-default" onClick={onBack} ><i className='fas fa-angle-double-left' /> Back</button>
                            <button className="btn btn-default" onClick={getPhoneUsageInfos} ><i className='fa fa-refresh' /> Refresh</button>
                            <button className="btn btn-default" onClick={handleDownload} ><i className='fa fa-download' /> CSV</button>
                        </div>
                        <div className='p-2'>
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
                <Column key={'phone_frequency_unlock'} header={'Phone Opening Frequency'} field={'phone_frequency_unlock'} sortable />
                <Column key={'date'} header={'Date'} field={'date'} sortable />
            </DataTable>
        </>
    )
}
export default ReportPhoneDetails;