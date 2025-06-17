import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { toast_success, toast_error, confirmDialog } from '../../../utils';
import AssignRecommendationModal from './AssignRecommendationModal';
import RecommendationModal from './RecommendationModal';
import {
    getRecommendationsApi,
    deleteRecommendationApi,
    createRecommendationApi,
    updateRecommendationApi,
    sendToParticipantsApi
} from '../../../api/RecommendationAPI';
import { useGlobalContext } from '../../../contexts';
import { _ERROR_CODES } from '../../../config';
import useAuth from '../../../hooks/useAuth';


// Helper function to parse time string into Date objects
const parseTimeRange = (timeString) => {
    if (typeof timeString !== 'string') return null;

    const [start, end] = timeString.split('-');
    if (!start || !end) return null;

    const now = new Date();
    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);

    const startDate = new Date(now);
    startDate.setHours(startHours, startMinutes, 0, 0);

    const endDate = new Date(now);
    endDate.setHours(endHours, endMinutes, 0, 0);

    return [startDate, endDate];
};


const RecommendationManagement = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [query, setQuery] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        title: '',
        content: '',
        schedules: []
    });
    const { setLoading, confirmDialog: globalConfirmDialog } = useGlobalContext();
    const { _user } = useAuth();
    const isMounted = useRef(true);
    const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
    const [selectedRecommendations, setSelectedRecommendations] = useState([]);
    useEffect(() => {
        isMounted.current = true;
        fetchRecommendations();
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchRecommendations = async () => {
        setLoading(true);
        try {
            const res = await getRecommendationsApi(_user.id);
            if (isMounted.current) {
                setRecommendations(res || []);
            }
        } catch (err) {
            if (isMounted.current) toast_error(err, _ERROR_CODES.NETWORK_ERROR);
        } finally {
            if (isMounted.current) setLoading(false);
        }
    };


    const handleDelete = async (data) => {
        const isDelete = await globalConfirmDialog('Are you sure you want to delete this study group?');
        if (!isDelete) {
            return;
        }
        const id = data.id;
        setLoading(true);
        try {
            await deleteRecommendationApi(id);
            if (isMounted.current) {
                setRecommendations((prev) => prev.filter((r) => r.id !== id));
                toast_success('Recommendation deleted successfully');
            }
        } catch (err) {
            toast_error(err, _ERROR_CODES.NETWORK_ERROR);
        } finally {
            setLoading(false);
        }
    };

    const openParticipantsDialog = (selectedRecommendations) => {
        if (selectedRecommendations.length > 3) {
            toast_error('You can only send recommendations to a maximum of 3 participants at a time.');
            return;
        }
        setParticipantsModalOpen(true);
    };

    const handleSendRecommendation = async (participants) => {
        if (selectedRecommendations.length === 0 || participants.length === 0) {
            toast_error('Please select recommendations and participants.');
            return;
        }

        setLoading(true);
        try {
            // Iterate over selected recommendations and participants
            const res = await sendToParticipantsApi(participants, selectedRecommendations);

            toast_success('Recommendations sent successfully.');
            setParticipantsModalOpen(false); // Close the modal after sending
        } catch (error) {
            console.error('Error sending recommendations:', error);
            toast_error('Failed to send recommendations.');
        } finally {
            setLoading(false);
        }
    };
    const openCreateDialog = () => {
        setForm({
            title: '',
            content: '',
            schedules: []
        });
        setEditing(null);
        setDialogVisible(true);
    };

    const openEditDialog = (rec) => {
        const schedules = rec.schedules ? rec.schedules.map(sched => {
            // Convert app packages string to array
            const appPackages = sched.app_packages
                ? sched.app_packages.split(',').filter(Boolean).map(pkgValue => {
                    return pkgValue
                })
                : [];
            // Convert time ranges string to array of time range objects

            const timeRanges = sched.app_schedule_times
                ? sched.app_schedule_times.split(',').map(time => {
                    const [start, end] = parseTimeRange(time) || [null, null];
                    return {
                        range: time,
                        startTime: start,
                        endTime: end
                    };
                })
                : [];

            const data = {
                ...sched,
                app_packages_array: appPackages,
                app_schedule_days_array: sched.app_schedule_days
                    ? sched.app_schedule_days.split('_').filter(Boolean)
                    : [],
                time_ranges: timeRanges
            }
            return data;
        }) : [];

        setForm({
            title: rec.title,
            content: rec.content,
            schedules
        });
        setEditing(rec);
        setDialogVisible(true);
    };


    const handleSave = async () => {
        if (!form.title || !form.content) {
            toast_error('Title and content are required');
            return;
        }

        for (const sched of form.schedules) {
            if (!sched.app_packages || sched.app_packages_array.length === 0 ||
                !sched.app_schedule_days || !sched.app_schedule_times) {
                toast_error('All schedule fields are required');
                return;
            }

            if (sched.time_ranges.length === 0) {
                toast_error('At least one time range is required for each schedule');
                return;
            }
        }

        setLoading(true);
        try {
            const payload = {
                title: form.title,
                content: form.content,
                schedules: form.schedules.map(sched => ({
                    app_packages: sched.app_packages,
                    app_schedule_days: sched.app_schedule_days,
                    app_schedule_times: sched.app_schedule_times
                }))
            };

            if (!editing) {
                payload.researcher_id = _user.id;
                await createRecommendationApi(payload);
                toast_success('Recommendation created');
            } else {
                await updateRecommendationApi(editing.id, payload);
                toast_success('Recommendation updated');
            }

            setDialogVisible(false);
            fetchRecommendations();
        } catch (err) {
            toast_error(err, _ERROR_CODES.NETWORK_ERROR);
        } finally {
            setLoading(false);
        }
    };

    const renderStatus = (rowData) => {
        const status = rowData.status || 'draft';
        const severity = status === 'sent' ? 'success' : 'info';
        return <Badge value={status} severity={severity} />;
    };

    const actionButtons = (rowData) => (
        <div className="flex gap-2">
            {/* <Button
                icon="pi pi-send"
                className="p-button-primary p-button-sm"
                tooltip="Send to Participant"
                tooltipOptions={{ position: 'top' }}
                onClick={() => openParticipantsDialog(rowData)}
                style={{ marginRight: '5px' }}
            /> */}
            <Button
                icon="pi pi-pencil"
                className="p-button-sm"
                tooltip="Edit Recommendation"
                tooltipOptions={{ position: 'top' }}
                onClick={() => openEditDialog(rowData)}
                style={{ marginRight: '5px' }}
            />
            <Button
                icon="pi pi-trash"
                className="p-button-danger p-button-sm"
                tooltip="Delete Recommendation"
                tooltipOptions={{ position: 'top' }}
                onClick={() => handleDelete(rowData)}
            />
        </div>
    );

    const renderContentPreview = (content) => {
        return content.length > 50 ? `${content.substring(0, 50)}...` : content;
    };

    return (
        <div className="p-4">
            <div className="p-4">
                <h3 className="mb-4">Recommendation Management</h3>
                <DataTable
                    value={recommendations}
                    paginator
                    stripedRows
                    rows={10}
                    columnResizeMode="fit"
                    showGridlines
                    responsiveLayout="scroll"
                    filters={{ global: { value: query, matchMode: 'contains' } }}
                    emptyMessage="No recommendations found."
                    className="p-datatable-sm"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                    rowsPerPageOptions={[10, 20, 50]}
                    selection={selectedRecommendations}
                    onSelectionChange={(e) => setSelectedRecommendations(e.value)}
                    header={
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div className="flex gap-2">
                                <button
                                    className="btn btn-primary"
                                    onClick={openCreateDialog}
                                >
                                    <i className="fa fa-plus"></i> New Recommendation
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={() => openParticipantsDialog(selectedRecommendations)}
                                    disabled={selectedRecommendations.length === 0}
                                    style={{ marginLeft: '10px' }}
                                >
                                    <i className="fa fa-send"></i> Send to Participants
                                </button>
                            </div>
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search recommendations..."
                                    className="w-full"
                                />
                            </span>
                        </div>
                    }
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '50px' }}></Column>
                    <Column header="No" body={(_, { rowIndex }) => rowIndex + 1} style={{ width: '50px' }} />
                    <Column field="title" header="Title" sortable />
                    <Column
                        field="content"
                        header="Content"
                        body={(row) => renderContentPreview(row.content)}
                    />
                    {/* <Column
                        field="status"
                        header="Status"
                        body={renderStatus}
                        style={{ width: '120px' }}
                    /> */}
                    <Column
                        field="created_at"
                        header="Date"
                        body={(row) => new Date(row.created_at).toLocaleDateString()}
                        sortable
                        style={{ width: '120px' }}
                    />
                    <Column
                        header="Actions"
                        body={actionButtons}
                        style={{ width: '180px' }}
                        align="center"
                    />
                </DataTable>
            </div>


            <RecommendationModal
                dialogVisible={dialogVisible}
                setDialogVisible={setDialogVisible}
                editing={editing}
                handleSave={handleSave}
                form={form}
                setForm={setForm}
                isMounted={isMounted}
            />

            <AssignRecommendationModal
                participantsModalOpen={participantsModalOpen}
                setParticipantsModalOpen={setParticipantsModalOpen}
                handleSendRecommendation={(participants) => handleSendRecommendation(participants)}
            />
        </div>
    );
};

export default RecommendationManagement;