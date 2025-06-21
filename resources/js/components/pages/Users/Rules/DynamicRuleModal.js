// DynamicRuleModal.js
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { useEffect, useState } from 'react';
import { DAYS_OF_WEEK, METRIC_OPTIONS, OPERATOR_OPTIONS, ACTION_TYPES, EVALUATION_WINDOWS } from './constants';
import { getAppPackagesApi } from '../../../api/RecommendationAPI';

const DynamicRuleModal = ({ dialogVisible, setDialogVisible, editing, handleSave, form, setForm, isMounted }) => {
    const [appPackages, setAppPackages] = useState([]);

    useEffect(() => {
        fetchAppPackages();
    }, []);

    const fetchAppPackages = async () => {
        try {
            const res = await getAppPackagesApi();
            if (isMounted?.current) {
                setAppPackages(
                    res.packages?.map(pkg => ({ label: pkg.label, value: pkg.value })) || []
                );
            }
        } catch (err) {
            console.error('Failed to fetch packages:', err);
        }
    };

    const updateField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const dialogFooter = (
        <div>
            <Button label="Cancel" className="p-button-danger" onClick={() => setDialogVisible(false)} />
            <Button label={editing ? 'Update' : 'Save'} className="p-button-primary" onClick={handleSave} />
        </div>
    );

    return (
        <Dialog
            header={editing ? 'Edit Dynamic Rule' : 'New Dynamic Rule'}
            visible={dialogVisible}
            onHide={() => setDialogVisible(false)}
            style={{ width: '60vw' }}
            footer={dialogFooter}
            modal
        >
            <div className="grid">
                <div className="col-12">
                    <label>Rule Name*</label>
                    <InputText
                        value={form?.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="Enter rule name"
                        className="w-full"
                    />
                </div>

                <div className="col-6">
                    <label>Apps to Track*</label>
                    <MultiSelect
                        value={form?.tracking_apps || []}
                        options={appPackages}
                        onChange={(e) => updateField('tracking_apps', e.value)}
                        placeholder="Select apps"
                        display="chip"
                        className="w-full"
                    />
                </div>
                <div className="col-6">
                    <label>Apps to Restrict*</label>
                    <MultiSelect
                        value={form?.restriction_apps || []}
                        options={appPackages}
                        onChange={(e) => updateField('restriction_apps', e.value)}
                        placeholder="Select apps"
                        display="chip"
                        className="w-full"
                    />
                </div>

                <div className="col-6">
                    <label>Metric*</label>
                    <Dropdown
                        value={form?.condition.metric}
                        options={METRIC_OPTIONS}
                        onChange={(e) => updateField('condition', { ...form?.condition, metric: e.value })}
                        placeholder="Select metric"
                        className="w-full"
                    />
                </div>
                <div className="col-3">
                    <label>Operator*</label>
                    <Dropdown
                        value={form?.condition.operator}
                        options={OPERATOR_OPTIONS}
                        onChange={(e) => updateField('condition', { ...form?.condition, operator: e.value })}
                        placeholder=">"
                        className="w-full"
                    />
                </div>
                <div className="col-3">
                    <label>Value*</label>
                    <InputText
                        value={form?.condition.value}
                        onChange={(e) => updateField('condition', { ...form?.condition, value: e.target.value })}
                        placeholder="60"
                        className="w-full"
                    />
                </div>

                <div className="col-6">
                    <label>Action Type*</label>
                    <Dropdown
                        value={form?.action.type}
                        options={ACTION_TYPES}
                        onChange={(e) => updateField('action', { ...form?.action, type: e.value })}
                        placeholder="Select action"
                        className="w-full"
                    />
                </div>

                {(form?.action.type === 'block' || form?.action.type === 'limit') && (
                    <>
                        <div className="col-3">
                            <label>Start Time</label>
                            <InputText
                                value={form?.action.start_time || ''}
                                onChange={(e) => updateField('action', { ...form?.action, start_time: e.target.value })}
                                placeholder="HH:MM"
                            />
                        </div>
                        <div className="col-3">
                            <label>End Time</label>
                            <InputText
                                value={form?.action.end_time || ''}
                                onChange={(e) => updateField('action', { ...form?.action, end_time: e.target.value })}
                                placeholder="HH:MM"
                            />
                        </div>
                    </>
                )}

                <div className="col-6">
                    <label>Evaluation Window*</label>
                    <Dropdown
                        value={form?.evaluation_window}
                        options={EVALUATION_WINDOWS}
                        onChange={(e) => updateField('evaluation_window', e.value)}
                        placeholder="Select window"
                        className="w-full"
                    />
                </div>
                <div className="col-6">
                    <label>Effective Days*</label>
                    <MultiSelect
                        value={form?.effective_days || []}
                        options={DAYS_OF_WEEK}
                        onChange={(e) => updateField('effective_days', e.value)}
                        placeholder="Select days"
                        display="chip"
                        className="w-full"
                    />
                </div>

                <div className="col-12">
                    <label>Notes</label>
                    <InputTextarea
                        rows={3}
                        value={form?.notes || ''}
                        onChange={(e) => updateField('notes', e.target.value)}
                        placeholder="Optional notes for this rule"
                        className="w-full"
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default DynamicRuleModal;
