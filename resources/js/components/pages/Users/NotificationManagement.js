import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import { getNotificationsApi, deleteNotificationApi, markAsReadApi, createNotificationApi } from '../../api/NotificationAPI';
import { useGlobalContext } from "../../contexts";
import { toast_success, toast_error } from '../../utils';
import { _ERROR_CODES } from '../../config';
import useAuth from '../../hooks/useAuth';
import NotificationsSocket from '../../NotificationSocket';

const NotificationManagement = () => {
    const [notifications, setNotifications] = useState([]);
    const [query, setQuery] = useState('');
    const { setLoading, confirmDialog } = useGlobalContext();
    const isMounted = useRef(true);
    const { _token, _user } = useAuth();

    useEffect(() => {
        isMounted.current = true;
        fetchNotifications();

        return () => {
            isMounted.current = false;
        };
    }, []);
	const createNotification = async () => {
		const res = await createNotificationApi({
			id_appuser: 5,
			title: "Test",
			content: "This is test notification."
		});
		console.log(res);
	}

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await getNotificationsApi(_user.id);
            if (isMounted.current) {
                setNotifications(res.data || []);
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

    const handleDelete = async (notification) => {
        const isDelete = await confirmDialog('Are you sure you want to delete this notification?');
        if (!isDelete) return;

        setLoading(true);
        try {
            await deleteNotificationApi(notification.id);
            if (isMounted.current) {
                setNotifications(prev => prev.filter(n => n.id !== notification.id));
                toast_success('Notification deleted successfully');
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

    const handleMarkAsRead = async (notification) => {
        if (notification.read_status) return;

        setLoading(true);
        try {
            // Add your mark as read API call here if available
            await markAsReadApi(notification.id);
            if (isMounted.current) {
                setNotifications(prev =>
                    prev.map(n =>
                        n.id === notification.id
                            ? { ...n, read_status: true, read_time: n.read_time || new Date().toISOString() }
                            : n
                    )
                );
                toast_success('Notification marked as read');
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

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(/(\d+)\/(\d+)\/(\d+),\s(\d+:\d+:\d+)/, '$3-$1-$2 $4');
    };

    const actionButtons = (rowData) => (
        <div className="flex gap-2">
            <Button
                icon="pi pi-check"
                className="p-button-success p-button-sm"
                tooltip="Mark as read"
                tooltipOptions={{ position: 'top' }}
                onClick={() => handleMarkAsRead(rowData)}
                disabled={rowData.read_status}
                style={{ marginRight: '5px' }}
            />
            <Button
                icon="pi pi-trash"
                className="p-button-danger p-button-sm"
                tooltip="Delete notification"
                tooltipOptions={{ position: 'top' }}
                onClick={() => handleDelete(rowData)}
            />
        </div>
    );

    return (<>
        <NotificationsSocket
            userId={_user.id}
            onMessage={(res) => {
                console.log("New notification received:", res);
                setNotifications((prev) => [res?.message, ...prev]); // prepend new res
                // Optional: Show a toast notification
                toast_success('New Notification: ' + res?.message.title || 'You got a message');
            }}
        />

        <div className="p-4">
            <h3 className="mb-4">Notification Management</h3>

            <DataTable
                value={notifications}
                responsiveLayout="scroll"
                paginator
                resizableColumns
                columnResizeMode="fit"
                showGridlines
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                rows={10}
                rowsPerPageOptions={[10, 20, 50]}
                filters={{ global: { value: query, matchMode: FilterMatchMode.CONTAINS } }}
                emptyMessage="No notifications found."
                className="p-datatable-sm"
                rowClassName={(rowData) => rowData.read_status ? 'read-row' : ''}
                header={
                    <div className='d-flex'>
                        <div className="me-auto p-2">
                            <button label='Reload' onClick={fetchNotifications} className="btn btn-default"><i className='fa fa-refresh' /> Reload</button>
					        {/* <button onClick={createNotification} className="btn btn-default">Test Create</button> */}
                        </div>
                        <div className="p-2">
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by keyword" />
                            </span>
                        </div>
                    </div>
                }
            >
                <Column
                    header="No"
                    body={(_, { rowIndex }) => rowIndex + 1}
                    style={{ width: '80px' }}
                />
                <Column
                    field="title"
                    header="Title"
                    sortable
                />
                <Column
                    field="content"
                    header="Content"
                    sortable
                    body={(rowData) => (
                        <div className="text-overflow-ellipsis" style={{ maxWidth: '300px' }}>
                            {rowData.content}
                        </div>
                    )}
                />
                <Column
                    field="userID"
                    header="By Participant"
                    sortable
                />
                <Column
                    field="accept_time"
                    header="Arrived Time"
                    sortable
                    body={(rowData) => formatDateTime(rowData.accept_time)}
                />
                <Column
                    field="read_time"
                    header="Read Time"
                    sortable
                    body={(rowData) => formatDateTime(rowData.read_time)}
                />
                {/* <Column
                    field="read_status"
                    header="Status"
                    sortable
                    body={(rowData) => (
                        <span
                            className={`pi ${rowData.read_status ? 'pi-check-circle text-green-600' : 'pi-exclamation-circle text-yellow-500'}`}
                            title={rowData.read_status ? 'Read' : 'Unread'}
                            style={{ fontSize: '1.2rem' }}
                        ></span>
                    )}
                /> */}
                <Column
                    header="Actions"
                    body={actionButtons}
                    style={{ width: '120px' }}
                />
            </DataTable>
        </div>
    </>
    );
};

export default NotificationManagement;