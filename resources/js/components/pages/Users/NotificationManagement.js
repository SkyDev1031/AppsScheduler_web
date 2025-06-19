import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode } from 'primereact/api';
import { deleteNotificationApi, markAsReadApi, markAsUnreadApi, getNotificationsApi } from '../../api/NotificationAPI';
import { useGlobalContext } from "../../contexts";
import { toast_success, toast_error } from '../../utils';
import { _ERROR_CODES } from '../../config';
import useAuth from '../../hooks/useAuth';

const NotificationManagement = () => {
    const [query, setQuery] = useState('');
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const { notifications, addNotification, removeNotification, clearNotifications, setLoading, confirmDialog } = useGlobalContext();
    const isMounted = useRef(true);
    const { _user } = useAuth();

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const response = await getNotificationsApi();
                if (isMounted.current) {
                    clearNotifications();
                    response.data.forEach((notification) => addNotification(notification));
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

        isMounted.current = true;
        fetchNotifications();

        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleDelete = async (notification) => {
        const isDelete = await confirmDialog('Are you sure you want to delete this notification?');
        if (!isDelete) return;

        setLoading(true);
        try {
            await deleteNotificationApi(notification.id);
            if (isMounted.current) {
                removeNotification(notification.id);
                // toast_success('Notification deleted successfully');
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
            await markAsReadApi(notification.id);
            if (isMounted.current) {
                const updatedNotifications = notifications.map((n) =>
                    n.id === notification.id ? { ...n, read_status: true, read_time: new Date().toISOString() } : n
                );
                clearNotifications();
                updatedNotifications.forEach((n) => addNotification(n));
                // toast_success('Notification marked as read');
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

    const handleMarkAsUnread = async (notification) => {
        if (!notification.read_status) return;

        setLoading(true);
        try {
            await markAsUnreadApi(notification.id);
            if (isMounted.current) {
                const updatedNotifications = notifications.map((n) =>
                    n.id === notification.id ? { ...n, read_status: false, read_time: null } : n
                );
                clearNotifications();
                updatedNotifications.forEach((n) => addNotification(n));
                // toast_success('Notification marked as unread');
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

    const deleteChecked = async () => {
        if (selectedNotifications.length === 0) {
            toast_error('No notifications selected for deletion', _ERROR_CODES.VALIDATION_ERROR);
            return;
        }

        const isDelete = await confirmDialog('Are you sure you want to delete all selected notifications?');
        if (!isDelete) return;

        setLoading(true);
        try {
            await Promise.all(selectedNotifications.map((notification) => deleteNotificationApi(notification.id)));
            if (isMounted.current) {
                selectedNotifications.forEach((notification) => removeNotification(notification.id));
                setSelectedNotifications([]);
                toast_success('Selected notifications deleted successfully');
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

    const markAsReadChecked = async () => {
        if (selectedNotifications.length === 0) {
            toast_error('No notifications selected to mark as read', _ERROR_CODES.VALIDATION_ERROR);
            return;
        }

        setLoading(true);
        try {
            await Promise.all(selectedNotifications.map((notification) => markAsReadApi(notification.id)));
            if (isMounted.current) {
                const updatedNotifications = notifications.map((n) =>
                    selectedNotifications.includes(n) ? { ...n, read_status: true, read_time: new Date().toISOString() } : n
                );
                clearNotifications();
                updatedNotifications.forEach((n) => addNotification(n));
                setSelectedNotifications([]);
                toast_success('Selected notifications marked as read');
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

    const showFullContent = (content) => {
        setModalContent(content);
        setShowModal(true);
    };

    const actionButtons = (rowData) => (
        <div className="flex gap-2">
            <Button
                icon="pi pi-check"
                className="p-button-success p-button-rounded p-button-sm"
                tooltip="Mark as read"
                tooltipOptions={{ position: 'top' }}
                onClick={() => handleMarkAsRead(rowData)}
                disabled={rowData.read_status}
                style={{ marginRight: '5px' }}
            />
            <Button
                icon="pi pi-times"
                className="p-button-warning p-button-rounded p-button-sm"
                tooltip="Mark as unread"
                tooltipOptions={{ position: 'top' }}
                onClick={() => handleMarkAsUnread(rowData)}
                disabled={!rowData.read_status}
                style={{ marginRight: '5px' }}
            />
            <Button
                icon="pi pi-trash"
                className="p-button-danger p-button-rounded p-button-sm"
                tooltip="Delete notification"
                tooltipOptions={{ position: 'top' }}
                onClick={() => handleDelete(rowData)}
            />
        </div>
    );

    const contentTemplate = (rowData) => {
        const truncatedContent = rowData.content.length > 50 ? `${rowData.content.substring(0, 50)}...` : rowData.content;
        return (
            <div>
                <span>{truncatedContent}</span>
                {rowData.content.length > 50 && (
                    <i
                        className='fa fa-eye'
                        style={{ cursor: 'pointer', marginLeft: '5px', color: '#007bff' }}
                        title="View full content"
                        onClick={() => showFullContent(rowData.content)}
                    />
                )}
            </div>
        );
    };

    return (
        <div className="p-4">
            <h3 className="mb-4">Notification Management</h3>

            <DataTable
                value={notifications}
                selection={selectedNotifications}
                onSelectionChange={(e) => setSelectedNotifications(e.value)}
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
                            <Button onClick={deleteChecked} icon="pi pi-trash"
                                className="p-button-danger p-button-sm"
                                style={{ marginRight: '10px' }}
                            />
                            <Button onClick={markAsReadChecked} icon="pi pi-check" 
                            className="p-button-success p-button-sm ml-2" />
                        </div>
                        <div className="p-2">
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by keyword" />
                            </span>
                        </div>
                    </div>
                }
            >
                <Column
                    selectionMode="multiple"
                    headerStyle={{ width: '3em' }}
                />
                {/* <Column
                    header="No"
                    body={(_, { rowIndex }) => rowIndex + 1}
                    style={{ width: '80px' }}
                /> */}
                <Column
                    field="userID"
                    header="ParticipantID"
                    sortable
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
                    body={contentTemplate}
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
                <Column
                    header="Actions"
                    body={actionButtons}
                    style={{ width: '200px' }}
                />
            </DataTable>

            <Dialog
                header="Full Content"
                visible={showModal}
                style={{ width: '50vw' }}
                modal
                onHide={() => setShowModal(false)}
            >
                <p>{modalContent}</p>
            </Dialog>
        </div>
    );
};

export default NotificationManagement;