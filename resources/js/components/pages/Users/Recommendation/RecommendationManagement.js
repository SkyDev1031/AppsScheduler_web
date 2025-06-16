import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { toast_success, toast_error, confirmDialog } from '../../../utils';
import StudyParticipantsModal from './StudyParticipantsModal';
import {
    getRecommendationsApi,
    deleteRecommendationApi,
    createRecommendationApi,
    updateRecommendationApi,
    getAppPackagesApi,
    sendToParticipantsApi
} from '../../../api/RecommendationAPI';
import { useGlobalContext } from '../../../contexts';
import { _ERROR_CODES } from '../../../config';
import useAuth from '../../../hooks/useAuth';

// Days of week options
const DAYS_OF_WEEK = [
    { label: 'Monday', value: '1' },
    { label: 'Tuesday', value: '2' },
    { label: 'Wednesday', value: '3' },
    { label: 'Thursday', value: '4' },
    { label: 'Friday', value: '5' },
    { label: 'Saturday', value: '6' },
    { label: 'Sunday', value: '7' }
];

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

// Helper to format time range for display
const formatTimeRange = (timeString) => {
    if (!timeString) return 'Not set';
    const [start, end] = timeString.split('-');
    return `${start} to ${end}`;
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
    const [availableAppPackages, setAvailableAppPackages] = useState([]);
    const [appPackageSearch, setAppPackageSearch] = useState('');
    const { setLoading, confirmDialog: globalConfirmDialog } = useGlobalContext();
    const { _user } = useAuth();
    const isMounted = useRef(true);
    const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
    const [selectedRecommendations, setSelectedRecommendations] = useState([]);
    useEffect(() => {
        isMounted.current = true;
        fetchRecommendations();
        fetchAppPackages();
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

    const fetchAppPackages = async () => {
        try {
            const res = await getAppPackagesApi();
            if (isMounted.current) {
                setAvailableAppPackages(
                    res.packages
                        .filter(pkg => pkg.value != null) // Filter out null/undefined
                        .map(pkg => ({
                            label: pkg.label,
                            value: pkg.value
                        }))
                );
            }
        } catch (err) {
            console.error('Failed to fetch app packages:', err);
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
        if(selectedRecommendations.length > 3) {
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
            console.log("Selected packages:", data.app_packages_array);
            console.log("Available options:", availableAppPackages);
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

    const handleScheduleChange = (index, field, value) => {
        const updated = [...form.schedules];

        if (field === 'app_schedule_days_array') {
            updated[index].app_schedule_days_array = value;
            updated[index].app_schedule_days = value.map(v => v.value || v).join('_');
        }
        else if (field === 'app_packages_array') {
            updated[index].app_packages_array = value;
            updated[index].app_packages = value.map(v => v.value || v).join(',');
        }
        else {
            updated[index][field] = value;
        }

        setForm({ ...form, schedules: updated });
    };

    const handleTimeRangeChange = (scheduleIndex, timeIndex, field, value) => {
        const updated = [...form.schedules];

        if (!updated[scheduleIndex].time_ranges) {
            updated[scheduleIndex].time_ranges = [];
        }

        if (!updated[scheduleIndex].time_ranges[timeIndex]) {
            updated[scheduleIndex].time_ranges[timeIndex] = {};
        }

        updated[scheduleIndex].time_ranges[timeIndex][field] = value;

        const timeRange = updated[scheduleIndex].time_ranges[timeIndex];
        if (timeRange.startTime && timeRange.endTime) {
            const timeRange = updated[scheduleIndex].time_ranges[timeIndex];
            if (timeRange.startTime && timeRange.endTime) {
                const start = timeRange.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).replace(':', ' : ');
                const end = timeRange.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).replace(':', ' : ');
                timeRange.range = `${start} - ${end}`;
            }
        }

        updated[scheduleIndex].app_schedule_times = updated[scheduleIndex].time_ranges
            .filter(tr => tr.range)
            .map(tr => tr.range)
            .join(',');

        setForm({ ...form, schedules: updated });
    };

    const handleRemoveTimeRange = (scheduleIndex, timeIndex) => {
        const updated = [...form.schedules];
        updated[scheduleIndex].time_ranges.splice(timeIndex, 1);
        updated[scheduleIndex].app_schedule_times = updated[scheduleIndex].time_ranges
            .filter(tr => tr.range)
            .map(tr => tr.range)
            .join(',');
        setForm({ ...form, schedules: updated });
    };

    const handleAddSchedule = () => {
        setForm({
            ...form,
            schedules: [...form.schedules, {
                app_packages: '',
                app_packages_array: [],
                app_schedule_days: '',
                app_schedule_days_array: [],
                app_schedule_times: '',
                time_ranges: []
            }]
        });
    };

    const handleAddTimeRange = (scheduleIndex) => {
        const updated = [...form.schedules];
        if (!updated[scheduleIndex].time_ranges) {
            updated[scheduleIndex].time_ranges = [];
        }
        updated[scheduleIndex].time_ranges.push({
            startTime: null,
            endTime: null,
            range: ''
        });
        setForm({ ...form, schedules: updated });
    };

    const handleRemoveSchedule = (index) => {
        const updated = form.schedules.filter((_, i) => i !== index);
        setForm({ ...form, schedules: updated });
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

            <Dialog
                header={editing ? 'Edit Recommendation' : 'New Recommendation'}
                visible={dialogVisible}
                style={{ width: '50vw', minWidth: '400px', maxWidth: '700px' }}
                onHide={() => setDialogVisible(false)}
                className="p-fluid"
                breakpoints={{ '960px': '75vw', '640px': '90vw' }}
                modal
            >
                <div className="flex flex-col gap-4 p-4">
                    <div className="field">
                        <label htmlFor="title" className="font-medium text-sm text-gray-600 mb-1 block">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <InputText
                            id="title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full"
                            placeholder="Enter recommendation title"
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="content" className="font-medium text-sm text-gray-600 mb-1 block">
                            Content <span className="text-red-500">*</span>
                        </label>
                        <InputTextarea
                            id="content"
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            className="w-full"
                            rows={1}
                            placeholder="Enter detailed recommendation content"
                            autoResize
                            required
                        />
                    </div>

                    <div className="">
                        <div className="flex justify-between items-center mb-3">
                            <Button
                                label="Add Schedule"
                                icon="pi pi-plus"
                                className="p-button-sm p-button-outlined"
                                onClick={handleAddSchedule}
                            />
                        </div>

                        {form.schedules.length === 0 && (
                            <div className="p-4 mb-3 border border-dashed border-gray-300 rounded-md bg-gray-50 text-center">
                                <i className="pi pi-inbox text-2xl text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">No schedules added yet</p>
                            </div>
                        )}

                        <div className="space-y-3">
                            {form.schedules.map((sched, schedIdx) => (
                                <Card
                                    key={`sched-${schedIdx}`}
                                    className="border border-gray-200 rounded-md bg-white shadow-xs"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                            <Button
                                                icon="pi pi-times"
                                                className="p-button-rounded p-button-text"
                                                onClick={() => handleRemoveSchedule(schedIdx)}
                                                tooltip="Remove this schedule"
                                            />
                                        </div>

                                        <div className="field">
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                App Packages <span className="text-red-500">*</span>
                                            </label>
                                            <MultiSelect
                                                value={sched.app_packages_array || []}
                                                options={availableAppPackages} // Add filter
                                                onChange={(e) => handleScheduleChange(schedIdx, 'app_packages_array', e.value)}
                                                onFilter={(e) => setAppPackageSearch(e.filter)}
                                                filter
                                                optionLabel="label"
                                                placeholder="Select apps"
                                                display="chip"
                                                className="w-full"
                                                required
                                            />
                                            <small className="text-xs text-gray-500">
                                                Selected: {sched.app_packages || 'None'}
                                            </small>
                                        </div>

                                        <div className="field">
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                Days <span className="text-red-500">*</span>
                                            </label>
                                            <MultiSelect
                                                value={sched.app_schedule_days_array || []}
                                                options={DAYS_OF_WEEK}
                                                onChange={(e) => handleScheduleChange(schedIdx, 'app_schedule_days_array', e.value)}
                                                optionLabel="label"
                                                display="chip"
                                                placeholder="Select days"
                                                className="w-full"
                                                required
                                            />
                                            <small className="text-xs text-gray-500">
                                                Selected: {sched.app_schedule_days || 'None'}
                                            </small>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleAddTimeRange(schedIdx)}>
                                                + Add Time Range
                                            </button>
                                        </div>

                                        {(!sched.time_ranges || sched.time_ranges.length === 0) && (
                                            <div className="p-3 mb-2 border border-dashed border-gray-300 rounded-md bg-gray-50 text-center">
                                                <p className="text-sm text-gray-500">No time ranges added yet</p>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            {sched.time_ranges?.map((timeRange, timeIdx) => (
                                                <div key={`time-${schedIdx}-${timeIdx}`}>
                                                    <div style={{ display: 'flex', alignContent: 'spaceBetween' }}>
                                                        <Calendar
                                                            value={timeRange.startTime}
                                                            onChange={(e) => handleTimeRangeChange(schedIdx, timeIdx, 'startTime', e.value)}
                                                            timeOnly
                                                            showTime
                                                            hourFormat="24"
                                                            placeholder="Start Time"
                                                            className="w-full"
                                                        />
                                                        <div style={{ margin: 'auto', padding: '2px' }}
                                                        > to </div>
                                                        <Calendar
                                                            value={timeRange.endTime}
                                                            onChange={(e) => handleTimeRangeChange(schedIdx, timeIdx, 'endTime', e.value)}
                                                            timeOnly
                                                            showTime
                                                            hourFormat="24"
                                                            placeholder="End Time"
                                                            className="w-full"
                                                            width={'80%'}
                                                        />
                                                        <button
                                                            className="btn btn-danger"
                                                            onClick={() => handleRemoveTimeRange(schedIdx, timeIdx)}
                                                            tooltip="Remove this time range"
                                                            style={{ margin: '2px' }}
                                                        ><i className="fa fa-trash"></i></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <small className="text-xs text-gray-500 block mt-2">
                                            Current: {sched.time_ranges?.map(tr => formatTimeRange(`${tr.range || 'Not set'}`)).join('; ') || 'None'}
                                        </small>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className='mt-3' style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                        <button
                            className="btn btn-danger"
                            onClick={() => setDialogVisible(false)}
                            style={{ margin: '5px' }}
                        >Cancel</button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            style={{ margin: '5px' }}
                            disabled={!form.title || form.schedules.some(s =>
                                !s.app_packages || s.app_packages_array.length === 0 ||
                                !s.app_schedule_days || !s.time_ranges || s.time_ranges.length === 0)}
                        >
                            {editing ? "Update" : "Save"}
                        </button>
                    </div>
                </div>
            </Dialog>

            <StudyParticipantsModal
                participantsModalOpen={participantsModalOpen}
                setParticipantsModalOpen={setParticipantsModalOpen}
                handleSendRecommendation={(participants) => handleSendRecommendation(participants)}
            />
        </div>
    );
};

export default RecommendationManagement;