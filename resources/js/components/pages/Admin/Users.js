import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import { getUsersApi, allowUserApi, blockUserApi, deleteUserApi } from '../../api/UserAPI.js'; // Import API functions
import { useGlobalContext } from "../../contexts/index.js";
import { toast_error, toast_success } from '../../utils/index.js';
import { _ERROR_CODES } from '../../config/index.js';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState('');
    const { setLoading, confirmDialog } = useGlobalContext();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true);
        getUsersApi()
            .then(res => {
                // Map the role field to "Admin" or "Researcher"
                const processedUsers = res.data.map(user => ({
                    ...user,
                    role: user.role === "1" ? 'Admin' : user.role === "0" ? 'Researcher' : 'Unknown',
                }));
                setUsers(processedUsers);
            })
            .catch(err => {
                toast_error(err, _ERROR_CODES.NETWORK_ERROR);
            })
            .finally(() => setLoading(false));
    };

    const handleAllow = (userId) => {
        setLoading(true);
        allowUserApi(userId)
            .then(() => {
                toast_success('User allowed successfully.');
                fetchUsers(); // Refresh the user list
            })
            .catch(err => {
                toast_error(err, _ERROR_CODES.NETWORK_ERROR);
            })
            .finally(() => setLoading(false));
    };

    const handleBlock = (userId) => {
        setLoading(true);
        blockUserApi(userId)
            .then(() => {
                toast_success('User blocked successfully.');
                fetchUsers(); // Refresh the user list
            })
            .catch(err => {
                toast_error(err, _ERROR_CODES.NETWORK_ERROR);
            })
            .finally(() => setLoading(false));
    };

    const handleDelete = async (userId) => {
        const isDelete = await confirmDialog();
        if (!isDelete) return;
        setLoading(true);
        deleteUserApi(userId)
            .then(() => {
                toast_success('User deleted successfully.');
                fetchUsers(); // Refresh the user list
            })
            .catch(err => {
                toast_error(err, _ERROR_CODES.NETWORK_ERROR);
            })
            .finally(() => setLoading(false));
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex gap-1">
                <Button
                    icon="pi pi-check"
                    className="p-button-success p-button-sm"
                    tooltip="Allow"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => handleAllow(rowData.id)}
                />
                <Button
                    icon="pi pi-ban"
                    className="p-button-warning p-button-sm"
                    tooltip="Block"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => handleBlock(rowData.id)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-danger p-button-sm"
                    tooltip="Delete"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => handleDelete(rowData.id)}
                />
            </div>
        );
    };

    return (
        <div>
            <h3>Users</h3>
            <DataTable
                value={users}
                responsiveLayout="scroll"
                stripedRows
                paginator
                resizableColumns
                columnResizeMode="fit"
                showGridlines
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                rows={10}
                rowsPerPageOptions={[10, 20, 50]}
                filters={{ global: { value: query, matchMode: FilterMatchMode.CONTAINS } }}
                header={() => (
                    <div className="d-flex">
                        <button onClick={fetchUsers} className="btn btn-default"><i className="fa fa-refresh" /> Reload</button>
                        <div className="ms-auto p-2">
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search by keyword"
                                />
                            </span>
                        </div>
                    </div>
                )}
            >
                <Column
                    key="no"
                    header="No"
                    field="no"
                    sortable
                />
                <Column
                    key="fullname"
                    header="Full Name"
                    field="fullname"
                    sortable
                />
                <Column
                    key="email"
                    header="Email"
                    field="email"
                    sortable
                />
                <Column
                    key="phone"
                    header="Phone"
                    field="phone"
                    sortable
                />
                <Column
                    key="status"
                    header="Status"
                    field="status"
                    body={(rowData) => (
                        <span
                            className={`${
                                rowData.status === 'Active'
                                    ? 'bg-primary text-white'
                                    : rowData.status === 'Block'
                                    ? 'bg-danger text-white'
                                    : 'bg-warning text-white'
                            } px-2 py-1 rounded`}
                        >
                            {rowData.status}
                        </span>
                    )}
                    sortable
                />
                <Column
                    key="role"
                    header="Role"
                    field="role"
                    body={(rowData) => (
                        <span
                            className={`${
                                rowData.role === 'Admin'
                                    ? 'bg-success text-white'
                                    : rowData.role === 'Researcher'
                                    ? 'bg-info text-white'
                                    : 'bg-secondary text-white'
                            } px-2 py-1 rounded`}
                        >
                            {rowData.role}
                        </span>
                    )}
                    sortable
                />
                <Column
                    key="registeredTime"
                    header="Registered Time"
                    field="registeredTime"
                    sortable
                />
                <Column
                    key="actions"
                    header="Actions"
                    body={actionBodyTemplate}
                />
            </DataTable>
        </div>
    );
};

export default Users;