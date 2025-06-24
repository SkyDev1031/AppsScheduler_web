import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';
import { getAppPackagesByAppPackageApi } from '../../../api/AppPackagesAPI';


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

const RecommendationModal = ({ dialogVisible, setDialogVisible, editing, handleSave, form, setForm, isMounted }) => {
    const [availableAppPackages, setAvailableAppPackages] = useState([]);
    const [appPackageSearch, setAppPackageSearch] = useState('');
    useEffect(() => {
        fetchAppPackages();
    }, [])
    const fetchAppPackages = async () => {
        try {
            const res = await getAppPackagesByAppPackageApi();
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

    // Helper to format time range for display
    const formatTimeRange = (timeString) => {
        if (!timeString) return 'Not set';
        const [start, end] = timeString.split('-');
        return `${start} to ${end}`;
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

    const dialogFooter = (
        <div style={{ paddingTop: '20px' }}>
            <Button
                label="Cancel"
                className="p-button-danger"
                onClick={() => setDialogVisible(false)}
            />
            <Button
                label={editing ? "Update" : "Save"}
                className="p-button-primary"
                onClick={handleSave}
                disabled={!form.title || form.schedules.some(s =>
                    !s.app_packages || s.app_packages_array.length === 0 ||
                    !s.app_schedule_days || !s.time_ranges || s.time_ranges.length === 0)}
            />
        </div>
    );

    return (
        <Dialog
            header={editing ? 'Edit Recommendation' : 'New Recommendation'}
            breakpoints={{ '960px': '75vw', '640px': '90vw' }}
            visible={dialogVisible}
            onHide={() => setDialogVisible(false)}
            style={{ width: '50vw' }}
            footer={dialogFooter}
            className="p-fluid"
            modal
        >
            <div className="grid">
                <div className="col-12">
                    <div className="field">
                        <label htmlFor="title">Title*</label>
                        <InputText
                            id="title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full"
                            placeholder="Enter recommendation title"
                            required
                        />
                    </div>
                </div>

                <div className="col-12">
                    <div className="field">
                        <label htmlFor="content">Content*</label>
                        <InputTextarea
                            id="content"
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            className="w-full"
                            rows={3}
                            placeholder="Enter detailed recommendation content"
                            autoResize
                            required
                        />
                    </div>
                </div>
            </div>

            <Divider align="left">
                <div className="inline-flex align-items-center">
                    <span className="font-bold">Schedules</span>
                </div>
            </Divider>


            {form.schedules.length === 0 && (
                <div className="p-4 mb-3 border-1 border-dashed surface-border border-round surface-ground text-center">
                    <i className="pi pi-inbox text-2xl text-400 mb-2" />
                    <p className="text-sm text-500">No schedules added yet</p>
                </div>
            )}

            <div className="grid">
                {form.schedules.map((sched, schedIdx) => (
                    <div className="col-12" key={`sched-${schedIdx}`}>
                        <Card className="mb-3">
                            <div className="grid">
                                <div className="col-12 md:col-6">
                                    <div className="field">
                                        <label>App Packages*</label>
                                        <MultiSelect
                                            value={sched.app_packages_array || []}
                                            options={availableAppPackages}
                                            onChange={(e) => handleScheduleChange(schedIdx, 'app_packages_array', e.value)}
                                            onFilter={(e) => setAppPackageSearch(e.filter)}
                                            filter
                                            optionLabel="label"
                                            placeholder="Select apps"
                                            display="chip"
                                            className="w-full"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-12 md:col-6">
                                    <div className="field">
                                        <label>Days*</label>
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
                                    </div>
                                </div>
                            </div>

                            <Divider />

                            {(!sched.time_ranges || sched.time_ranges.length === 0) && (
                                <div className="p-3 mb-2 border-1 border-dashed surface-border border-round surface-ground text-center">
                                    <p className="text-sm text-500">No time ranges added yet</p>
                                </div>
                            )}

                            <div className="grid" style={{ textAlign: 'center' }}>
                                {sched.time_ranges?.map((timeRange, timeIdx) => (
                                    <div className="" key={`time-${schedIdx}-${timeIdx}`}>
                                        <div className="gap-2 mb-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Calendar
                                                value={timeRange.startTime}
                                                onChange={(e) => handleTimeRangeChange(schedIdx, timeIdx, 'startTime', e.value)}
                                                timeOnly
                                                showTime
                                                hourFormat="24"
                                                placeholder="Start Time"
                                                className="flex-1"
                                            />
                                            <span>to</span>
                                            <Calendar
                                                value={timeRange.endTime}
                                                onChange={(e) => handleTimeRangeChange(schedIdx, timeIdx, 'endTime', e.value)}
                                                timeOnly
                                                showTime
                                                hourFormat="24"
                                                placeholder="End Time"
                                                className="flex-1"
                                            />
                                            <Button
                                                icon="pi pi-trash"
                                                className="p-button-rounded p-button-danger"
                                                onClick={() => handleRemoveTimeRange(schedIdx, timeIdx)}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className="mb-3">
                                    <Button
                                        label="Add Time Range"
                                        icon="pi pi-plus"
                                        className="p-button-outlined p-button-sm"
                                        style={{ width: '50%' }}
                                        onClick={() => handleAddTimeRange(schedIdx)}
                                    />
                                </div>

                            </div>
                            <div className="flex justify-content-end" style={{ display: 'flex', justifyContent: 'end' }}>
                                <Button
                                    label='Remove schedule'
                                    style={{ width: '25%' }}
                                    className="p-button-sm p-button-danger"
                                    onClick={() => handleRemoveSchedule(schedIdx)}
                                    tooltip="Remove this schedule"
                                />
                            </div>
                        </Card>
                    </div>
                ))}
            </div>

            <div className="mt-3" style={{ textAlign: 'center' }}>
                <Button
                    label="Add Schedule"
                    icon="pi pi-plus"
                    className="p-button-raised p-button-sm"
                    style={{ width: '60%' }}
                    onClick={handleAddSchedule}
                />
            </div>

        </Dialog>

    )
}

export default RecommendationModal;