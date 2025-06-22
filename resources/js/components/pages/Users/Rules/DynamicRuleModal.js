import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { classNames } from 'primereact/utils';

import {
    DAYS_OF_WEEK,
    METRIC_OPTIONS,
    OPERATOR_OPTIONS,
    ACTION_TYPES,
    EVALUATION_WINDOWS
} from './constants';

import { getAppPackagesApi } from '../../../api/AppPackagesAPI';
import { getCategoriesApi } from '../../../api/CategoryAPI';
import { useGlobalContext } from '../../../contexts';

const DynamicRuleModal = ({
    dialogVisible,
    setDialogVisible,
    editing = false,
    handleSave,
    form,
    setForm,
    isMounted
}) => {
    const [appPackages, setAppPackages] = useState([]);
    const [appCategories, setAppCategories] = useState([]);
    const { setLoading } = useGlobalContext();

    useEffect(() => {
        // console.log("Form data=>", form.effective_days);
    }, [form])
    // Initialize form with default values when dialog opens
    useEffect(() => {
        if (dialogVisible) {
            setForm(prevForm => ({
                name: prevForm?.name || '',
                track_targets: {
                    apps: prevForm?.track_targets?.apps || [],
                    categories: prevForm?.track_targets?.categories || []
                },
                restrict_targets: {
                    apps: prevForm?.restrict_targets?.apps || [],
                    categories: prevForm?.restrict_targets?.categories || []
                },
                condition: {
                    metric: prevForm?.condition?.metric || METRIC_OPTIONS[0].value,
                    operator: prevForm?.condition?.operator || OPERATOR_OPTIONS[0].value,
                    value: prevForm?.condition?.value || ''
                },
                action: {
                    type: prevForm?.action?.type || ACTION_TYPES[0].value,
                    start_time: prevForm?.action?.start_time || '',
                    end_time: prevForm?.action?.end_time || ''
                },
                evaluation_window: prevForm?.evaluation_window || EVALUATION_WINDOWS[0].value,
                effective_days: (prevForm?.effective_days || []).map(String),
                notes: prevForm?.notes || ''
            }));
        }
    }, [dialogVisible]);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [pkgRes, catRes] = await Promise.all([
                    getAppPackagesApi(),
                    getCategoriesApi()
                ]);
                if (isMounted.current) {
                    setAppPackages(
                        (pkgRes.packages || [])
                            .filter(pkg => pkg.value != null)
                            .map(pkg => ({ label: pkg.label, value: pkg.value }))
                    );

                    setAppCategories(
                        (catRes || [])
                            .filter(cat => cat.title != null)
                            .map(cat => ({ label: cat.title, value: cat.title }))
                    );
                }
            } catch (err) {
                console.error('Failed to fetch packages or categories:', err);
            } finally {
                setLoading(false);
            }
        };

        if (dialogVisible) {
            fetchData();
        }
    }, [dialogVisible]);

    const updateField = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const updateNestedField = (field, nestedField, value) => {
        setForm(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [nestedField]: value
            }
        }));
    };

    const updateTargetsField = (targetType, field, value) => {
        setForm(prev => ({
            ...prev,
            [`${targetType}_targets`]: {
                ...prev[`${targetType}_targets`],
                [field]: value
            }
        }));
    };

    const dialogFooter = (
        <div className="flex justify-content-end gap-2">
            <Button 
                label='Cancel'
                className="p-button-danger" 
                onClick={() => setDialogVisible(false)} 
            />
            <Button 
                label={editing ? "Update" : "Save"}
                className="p-button-primary" 
                onClick={handleSave} 
            />
        </div>
    );

    return (
        <Dialog
            header={editing ? 'Edit Dynamic Rule' : 'New Dynamic Rule'}
            visible={dialogVisible}
            onHide={() => setDialogVisible(false)}
            style={{ width: '50vw' }}
            footer={dialogFooter}
            modal
            breakpoints={{ '960px': '75vw', '640px': '90vw' }}
            className="p-fluid"
        >
            <div className="grid formgrid p-fluid">
                {/* Rule Name */}
                <div className="field col-12">
                    <label htmlFor="ruleName">Rule Name*</label>
                    <InputText
                        id="ruleName"
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="Enter rule name"
                        className="w-full"
                    />
                </div>

                {/* Tracking Section */}
                <div className="field col-12 md:col-6">
                    <div className="card p-3">
                        <h4 className="mb-3">Tracking Targets</h4>
                        
                        <div className="field">
                            <label htmlFor="trackApps">Apps to Track*</label>
                            <MultiSelect
                                id="trackApps"
                                value={form.track_targets.apps}
                                options={appPackages}
                                onChange={(e) => updateTargetsField('track', 'apps', e.value)}
                                placeholder="Select apps to track"
                                display="chip"
                                optionLabel="label"
                                filter
                                className="w-full"
                            />
                        </div>
                        
                        <div className="field">
                            <label htmlFor="trackCategories">Categories to Track*</label>
                            <MultiSelect
                                id="trackCategories"
                                value={form.track_targets.categories}
                                options={appCategories}
                                onChange={(e) => updateTargetsField('track', 'categories', e.value)}
                                placeholder="Select categories to track"
                                display="chip"
                                optionLabel="label"
                                filter
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Restriction Section */}
                <div className="field col-12 md:col-6">
                    <div className="card p-3">
                        <h4 className="mb-3">Restriction Targets</h4>
                        
                        <div className="field">
                            <label htmlFor="restrictApps">Apps to Restrict*</label>
                            <MultiSelect
                                id="restrictApps"
                                value={form.restrict_targets.apps}
                                options={appPackages}
                                onChange={(e) => updateTargetsField('restrict', 'apps', e.value)}
                                placeholder="Select apps to restrict"
                                display="chip"
                                optionLabel="label"
                                filter
                                className="w-full"
                            />
                        </div>
                        
                        <div className="field">
                            <label htmlFor="restrictCategories">Categories to Restrict*</label>
                            <MultiSelect
                                id="restrictCategories"
                                value={form.restrict_targets.categories}
                                options={appCategories}
                                onChange={(e) => updateTargetsField('restrict', 'categories', e.value)}
                                placeholder="Select categories to restrict"
                                display="chip"
                                optionLabel="label"
                                filter
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Condition Section */}
                <div className="field col-12">
                    <div className="card p-3">
                        <h4 className="mb-3">Condition</h4>
                        <div className="grid">
                            <div className="field col-12 md:col-4">
                                <label htmlFor="metric">Metric*</label>
                                <Dropdown
                                    id="metric"
                                    value={form.condition.metric}
                                    options={METRIC_OPTIONS}
                                    onChange={(e) => updateNestedField('condition', 'metric', e.value)}
                                    placeholder="Select metric"
                                    optionLabel="label"
                                    className="w-full"
                                />
                            </div>
                            
                            <div className="field col-12 md:col-4">
                                <label htmlFor="operator">Operator*</label>
                                <Dropdown
                                    id="operator"
                                    value={form.condition.operator}
                                    options={OPERATOR_OPTIONS}
                                    onChange={(e) => updateNestedField('condition', 'operator', e.value)}
                                    placeholder="Select operator"
                                    optionLabel="label"
                                    className="w-full"
                                />
                            </div>
                            
                            <div className="field col-12 md:col-4">
                                <label htmlFor="value">Value*</label>
                                <InputText
                                    id="value"
                                    value={form.condition.value}
                                    onChange={(e) => updateNestedField('condition', 'value', e.target.value)}
                                    placeholder="Enter value"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Section */}
                <div className="field col-12">
                    <div className="card p-3">
                        <h4 className="mb-3">Action</h4>
                        <div className="grid">
                            <div className="field col-12 md:col-4">
                                <label htmlFor="actionType">Action Type*</label>
                                <Dropdown
                                    id="actionType"
                                    value={form.action.type}
                                    options={ACTION_TYPES}
                                    onChange={(e) => updateNestedField('action', 'type', e.value)}
                                    placeholder="Select action"
                                    optionLabel="label"
                                    className="w-full"
                                />
                            </div>
                            
                            {(form.action.type === 'block' || form.action.type === 'limit') && (
                                <>
                                    <div className="field col-12 md:col-4">
                                        <label htmlFor="startTime">Start Time</label>
                                        <InputText
                                            id="startTime"
                                            value={form.action.start_time}
                                            onChange={(e) => updateNestedField('action', 'start_time', e.target.value)}
                                            placeholder="HH:MM"
                                            className="w-full"
                                        />
                                    </div>
                                    
                                    <div className="field col-12 md:col-4">
                                        <label htmlFor="endTime">End Time</label>
                                        <InputText
                                            id="endTime"
                                            value={form.action.end_time}
                                            onChange={(e) => updateNestedField('action', 'end_time', e.target.value)}
                                            placeholder="HH:MM"
                                            className="w-full"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Schedule Section */}
                <div className="field col-12">
                    <div className="card p-3">
                        <h4 className="mb-3">Schedule</h4>
                        <div className="grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="evaluationWindow">Evaluation Window*</label>
                                <Dropdown
                                    id="evaluationWindow"
                                    value={form.evaluation_window}
                                    options={EVALUATION_WINDOWS}
                                    onChange={(e) => updateField('evaluation_window', e.value)}
                                    placeholder="Select window"
                                    optionLabel="label"
                                    className="w-full"
                                />
                            </div>
                            
                            <div className="field col-12 md:col-6">
                                <label htmlFor="effectiveDays">Effective Days*</label>
                                <MultiSelect
                                    id="effectiveDays"
                                    value={form.effective_days}
                                    options={DAYS_OF_WEEK}
                                    onChange={(e) => updateField('effective_days', e.value)}
                                    placeholder="Select days"
                                    display="chip"
                                    optionLabel="label"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </Dialog>
    );
};

export default DynamicRuleModal;