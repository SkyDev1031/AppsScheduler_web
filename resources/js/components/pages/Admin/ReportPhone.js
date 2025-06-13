import {
    Autocomplete, Dialog, DialogActions, DialogContent,
    DialogTitle, FormControl, IconButton, InputAdornment,
    InputLabel, OutlinedInput, TextField, FormControlLabel
} from '@mui/material';
import { Button, DataTable, InputMask, InputSwitch, InputText } from 'primereact';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPhoneUsageInfosApi, deletePhoneUseInfosApi, getPhoneUsageInfosByPhoneNumberApi, downloadCSV } from '../../api/AppClientAPI.js';
import { _ERROR_CODES } from '../../config';
import { useGlobalContext } from "../../contexts";
import { toast_error, toast_success } from '../../utils';
import { encryptParam } from '../../utils/cryptoUtils';

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

const ReportPhone = () => {
    const navigate = useNavigate();

    const [phoneUsageInfos, setPhoneUsageInfos] = useState([])
    const [query, setQuery] = useState('')
    const { setLoading, confirmDialog } = useGlobalContext();

    const [selectedItem, setSelectedItem] = useState({
        visible: false,
        type: _ACT_TYPE.DEFAULT,
        data: {}
    })

    useEffect(() => {
        getPhoneUsageInfos();
    }, [])
    const getPhoneUsageInfos = () => {
        setLoading(true);
        getPhoneUsageInfosApi()
            .then(res => { setPhoneUsageInfos(res.data) })
            .catch(err => { toast_error(err, _ERROR_CODES.NETWORK_ERROR); })
            .finally(() => setLoading(false));
    }

    const handleDownload = () => {
        getPhoneUsageInfosByPhoneNumberApi("")
            // .then(res => {
            //     const cleanedData = removeFields(res.data, ["id", "created_at", "updated_at"]);
            //     console.log(cleanedData)
            //     downloadCSV(cleanedData)
            // })
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

    const OnActions = async (data, type) => {
        if (type === _ACT_TYPE.DELETE) {
            const isDelete = await confirmDialog('Are you sure you want to delete this data?');
            if (!isDelete) return;
            deletePhoneUseInfosApi(data.phonenumber)
                .then(res => {
                    toast_success(res?.message)
                    getPhoneUsageInfos();
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
        navigate(`/admin/reportPhone/details/${encryptParam(rowData.phonenumber)}`);
    };
    return (
        <>
            <h3>Show Report Phone Usage Info</h3>
            <DataTable value={phoneUsageInfos} responsiveLayout="scroll" stripedRows paginator
                resizableColumns columnResizeMode="fit" showGridlines
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]}
                filters={{ 'global': { value: query, matchMode: FilterMatchMode.CONTAINS } }}
                onRowClick={handleRowClick}
                rowClassName={(rowData) => 'custom-hover-row'}
                header={() => (
                    <div className="d-flex">
                        <div className='me-auto p-2'>
                            <button className='btn btn-default' onClick={getPhoneUsageInfos}><i className='fa fa-refresh' /> Reload</button>
                            <button className='btn btn-default' onClick={handleDownload}><i className='fa fa-download' /> CSV ALL</button>
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
                <Column key={'periodFrom'} header={'From'} field={'periodFrom'} sortable />
                <Column key={'periodTo'} header={'To'} field={'periodTo'} sortable />
                <Column key={'id'} header={''} field={'id'} sortable
                    body={(data) => (
                        <div className='table-action'>
                            {data.role != 1 && <Button icon="pi pi-trash"
                                className="p-button-danger p-button-sm"
                                tooltip="Delete"
                                tooltipOptions={{ position: 'top' }}
                                onClick={() => OnActions(data, _ACT_TYPE.DELETE)} />}
                        </div>
                    )} />
            </DataTable>
        </>
    )
}
export default ReportPhone;