import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode } from 'primereact/api';
import { getParticipantsApi, sendNotificationApi } from '../../../api/ParticipantAPI.js';
import { useGlobalContext } from "../../../contexts/index.js";
import { toast_success, toast_error } from '../../../utils/index.js';
import { _ERROR_CODES } from '../../../config/index.js';
import { Badge } from 'primereact/badge';

const SendToParticipants = () => {
    const [participants, setParticipants] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState('');
    const [notificationContent, setNotificationContent] = useState('');
    const [query, setQuery] = useState('');
    const { setLoading, confirmDialog } = useGlobalContext();
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        fetchParticipants();

        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchParticipants = () => {
        setLoading(true);
        getParticipantsApi()
            .then(res => {
                if (isMounted.current) {
                    setParticipants(res.data);
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

    const handleSend = async () => {
        if (!notificationTitle || !notificationContent) {
            toast_error('Please fill in both title and content', _ERROR_CODES.VALIDATION_ERROR);
            return;
        }

        const isConfirm = await confirmDialog('Send', 'Are you sure you want to send this notification?');
        if (!isConfirm) return;

        setLoading(true);
        try {
            await Promise.all(
                selectedParticipants.map(participant =>
                    sendNotificationApi(participant.id, notificationTitle, notificationContent)
                )
            );
            if (isMounted.current) {
                toast_success('Notification sent successfully');
                setShowModal(false);
                setSelectedParticipants([]);
            }
        } catch (err) {
            if (isMounted.current) {
                toast_error(err, _ERROR_CODES.NETWORK_ERROR);
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };

    const statusBadge = (rowData) => {
        const severity = rowData.status === 'Active' ? 'success' :
            rowData.status === 'Disenrolled' ? 'danger' : 'warning';
        return (
            <Badge
                value={rowData.status}
                severity={severity}
                size="small"
            />
        );
    };

    const noTemplate = (_, { rowIndex }) => <span>{rowIndex + 1}</span>;

    return (
        <div className='container'>
            <h3>Send To Participants</h3>
            <DataTable
                value={participants}
                selection={selectedParticipants}
                onSelectionChange={(e) => setSelectedParticipants(e.value)}
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
                emptyMessage="No participants found."
                header={() => (
                    <div className="d-flex">
                        <button onClick={fetchParticipants} className="btn btn-default">
                            <i className="fa fa-refresh" /> Reload
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowModal(true)}
                            disabled={selectedParticipants.length === 0}
                        >
                            <i className='fa fa-plane' /> Send
                        </button>

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
                    selectionMode="multiple"
                    headerStyle={{ width: '3em' }}
                />
                <Column
                    header="No"
                    body={noTemplate}
                    style={{ width: '100px', textAlign: 'center' }}
                />
                <Column
                    field="userID"
                    header="ParticipantID"
                    sortable
                    style={{ textAlign: 'center' }}
                />
                <Column
                    field="status"
                    header="Status"
                    body={statusBadge}
                    sortable
                    style={{ textAlign: 'center' }}
                />
            </DataTable>

            <Dialog
                header="Send Notification"
                visible={showModal}
                style={{ width: '50vw' }}
                modal
                onHide={() => setShowModal(false)}
                footer={
                    <div>
                        <Button
                            label="Cancel"
                            onClick={() => setShowModal(false)}
                            className="p-button-secondary"
                        />
                        <Button
                            label="Send"
                            onClick={handleSend}
                            autoFocus
                        />
                    </div>
                }
            >
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="title">Title</label>
                        <InputText
                            id="title"
                            value={notificationTitle}
                            onChange={(e) => setNotificationTitle(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="p-field mt-3">
                        <label htmlFor="content">Content</label>
                        <InputTextarea
                            id="content"
                            value={notificationContent}
                            onChange={(e) => setNotificationContent(e.target.value)}
                            rows={4}
                            className="w-full"
                            autoResize
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default SendToParticipants;