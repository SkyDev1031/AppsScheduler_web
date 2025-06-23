import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import { getParticipantsApi, allowParticipantApi, blockParticipantApi, deleteParticipantApi } from '../../api/ParticipantAPI.js';
import { useGlobalContext } from "../../contexts";
import { toast_success, toast_error } from '../../utils/index.js';
import { _ERROR_CODES } from '../../config';
import { Menu } from 'primereact/menu';

const ParticipantRow = ({ participant, onAllow, onBlock, onDelete }) => {
    const menuRef = useRef(null); // Use useRef to initialize the menu reference

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return '#007bff'; // Primary (blue)
            case 'disenrolled':
                return '#dc3545'; // Danger (red)
            case 'pending':
                return '#ffc107'; // Warning (yellow)
            default:
                return '#007bff'; // Default (blue)
        }
    };

    const menuItems = [
        {
            label: 'Allow',
            icon: 'pi pi-check',
            style: { color: getStatusColor(participant.status) }, // Set icon color dynamically
            command: () => onAllow(participant),
        },
        {
            label: 'Disenroll',
            icon: 'pi pi-ban',
            style: { color: getStatusColor(participant.status) }, // Set icon color dynamically
            command: () => onBlock(participant),
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash',
            style: { color: getStatusColor(participant.status) }, // Set icon color dynamically
            command: () => onDelete(participant),
        },
    ];

    return (
        <div className="participant-row">
            <span>{participant.name}</span>
            <Menu model={menuItems} popup ref={menuRef} /> {/* Attach ref to Menu */}
            <Button
                icon="pi pi-ellipsis-v"
                className="p-button-rounded p-button-primary"
                onClick={(event) => menuRef.current.toggle(event)} // Use menuRef.current to access the menu
            />
        </div>
    );
};

const Participants = () => {
    const [participants, setParticipants] = useState([]);
    const [query, setQuery] = useState('');
    const { setLoading, confirmDialog } = useGlobalContext();
    const isMounted = useRef(true); // Track if the component is mounted

    useEffect(() => {
        isMounted.current = true; // Set mounted to true
        getParticipants();

        return () => {
            isMounted.current = false; // Set mounted to false on unmount
        };
    }, []);

    const getParticipants = () => {
        setLoading(true);
        getParticipantsApi()
            .then(res => {
                if (isMounted.current) {
                    setParticipants(res.data); // Update state only if the component is mounted
                }
            })
            .catch(err => {
                if (isMounted.current) {
                    toast_error(err, _ERROR_CODES.NETWORK_ERROR);
                }
            })
            .finally(() => {
                if (isMounted.current) {
                    setLoading(false);
                }
            });
    };

    const handleAllow = (participant) => {
        setLoading(true);
        const id = participant.id;
        allowParticipantApi(id)
            .then(res => {
                if (isMounted.current && res.status === true) {
                    setParticipants(prevParticipants =>
                        prevParticipants.map(p =>
                            p.id === id ? { ...p, status: 'Active' } : p
                        )
                    );
                    toast_success(res.message);
                } else if (isMounted.current) {
                    toast_error(res.message, _ERROR_CODES.NETWORK_ERROR);
                }
            })
            .catch(err => {
                if (isMounted.current) {
                    toast_error(err, _ERROR_CODES.NETWORK_ERROR);
                }
            })
            .finally(() => {
                if (isMounted.current) {
                    setLoading(false);
                }
            });
    };

    const handleBlock = (participant) => {
        setLoading(true);
        const id = participant.id;
        blockParticipantApi(id)
            .then(res => {
                if (isMounted.current && res.status === true) {
                    setParticipants(prevParticipants =>
                        prevParticipants.map(p =>
                            p.id === id ? { ...p, status: 'Disenrolled' } : p
                        )
                    );
                    toast_success(res.message);
                } else if (isMounted.current) {
                    toast_error(res.message, _ERROR_CODES.NETWORK_ERROR);
                }
            })
            .catch(err => {
                if (isMounted.current) {
                    toast_error(err, _ERROR_CODES.NETWORK_ERROR);
                }
            })
            .finally(() => {
                if (isMounted.current) {
                    setLoading(false);
                }
            });
    };

    const handleDelete = async (participant) => {
        const isDelete = await confirmDialog('Delete', 'Are you sure you want to delete this participant?');
        if (!isDelete) return;
        
        setLoading(true);
        const id = participant.id;
        deleteParticipantApi(id)
            .then(res => {
                if (isMounted.current && res.status === true) {
                    // Remove the participant from the state
                    setParticipants(prevParticipants =>
                        prevParticipants.filter(p => p.id !== id)
                    );
                    toast_success(res.message);
                } else if (isMounted.current) {
                    toast_error(res.message, _ERROR_CODES.NETWORK_ERROR);
                }
            })
            .catch(err => {
                if (isMounted.current) {
                    toast_error(err, _ERROR_CODES.NETWORK_ERROR);
                }
            })
            .finally(() => {
                if (isMounted.current) {
                    setLoading(false);
                }
            });
    };

    return (
        <div>
            <h3>Participants</h3>
            <DataTable
                value={participants}
                responsiveLayout="scroll"
                stripedRows
                paginator
                resizableColumns
                columnResizeMode="fit"
                showGridlines
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                rows={10}
                className="p-datatable-sm"
                rowsPerPageOptions={[10, 20, 50]}
                filters={{ global: { value: query, matchMode: FilterMatchMode.CONTAINS } }}
                header={() => (
                    <div className="d-flex">
                        <button onClick={getParticipants} className="btn btn-default"><i className="fa fa-refresh" /> Reload</button>
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
                    key="userID"
                    header="ParticipantID"
                    field="userID"
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
                                    : rowData.status === 'Disenrolled'
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
                    key="created_at"
                    header="RegisteredTime"
                    field="created_at"
                    sortable
                />
                <Column
                    key="actions"
                    header="Actions"
                    body={(rowData) => (
                        <ParticipantRow
                            participant={rowData}
                            onAllow={handleAllow}
                            onBlock={handleBlock}
                            onDelete={handleDelete}
                        />
                    )}
                    className="p-column-header-actions" // Add class for styling
                />
            </DataTable>
        </div>
    );
};

export default Participants;