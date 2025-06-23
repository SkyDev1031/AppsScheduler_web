import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { toast_success, toast_error } from '../../../utils';
import { useGlobalContext } from '../../../contexts';
import useAuth from '../../../hooks/useAuth';

import DynamicRuleModal from './DynamicRuleModal';
import AssignRuleModal from './AssignRuleModal';

import {
    getRulesByResearcherApi,
    createRuleApi,
    updateRuleApi,
    deleteRuleApi,
    assignRuleToParticipantApi,
    sendRulesToParticipantsApi
} from '../../../api/DynamicRuleAPI';

const DynamicRuleManagement = () => {
    const [rules, setRules] = useState([]);
    const [selectedRules, setSelectedRules] = useState([]);
    const [query, setQuery] = useState('');
    const [editingRule, setEditingRule] = useState(null);
    const [form, setForm] = useState({
        name: '',
        track_targets: { apps: [], categories: [] },
        restrict_targets: { apps: [], categories: [] },
        condition: { metric: '', operator: '', value: '' },
        action: { type: '', start_time: '', end_time: '', limit_minutes: null },
        evaluation_window: 'daily',
        effective_days: [],
        notes: ''
    });

    const [dialogVisible, setDialogVisible] = useState(false);
    const [assignModalVisible, setAssignModalVisible] = useState(false);

    const { _user } = useAuth();
    const { setLoading, confirmDialog } = useGlobalContext();
    const isMounted = useRef(true);

    useEffect(() => {
        fetchRules();
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchRules = async () => {
        setLoading(true);
        try {
            const res = await getRulesByResearcherApi(_user.id);
            console.log("----------res--------------", res)
            if (isMounted.current && res?.rules) {
                const uniqueRules = res.rules.map(a => ({
                    ...a,
                    // Ensure proper structure for nested objects
                    track_targets: a.track_targets || { apps: [], categories: [] },
                    restrict_targets: a.restrict_targets || { apps: [], categories: [] },
                    condition: a.condition || { metric: '', operator: '', value: '' },
                    action: a.action || { type: '', start_time: '', end_time: '', limit_minutes: null },
                    effective_days: a.effective_days || [],
                    notes: a.notes || ''
                }));
                setRules(uniqueRules);
            }
        } catch (err) {
            toast_error(err.message || 'Failed to fetch rules');
        } finally {
            setLoading(false);
        }
    };

    const openCreateDialog = () => {
        setForm({
            name: '',
            track_targets: { apps: [], categories: [] },
            restrict_targets: { apps: [], categories: [] },
            condition: { metric: '', operator: '', value: '' },
            action: { type: '', start_time: '', end_time: '', limit_minutes: null },
            evaluation_window: 'daily',
            effective_days: [],
            notes: ''
        });
        setEditingRule(null);
        setDialogVisible(true);
    };

    const openEditDialog = (rule) => {
        setForm({
            ...rule,
            track_targets: rule.track_targets || { apps: [], categories: [] },
            restrict_targets: rule.restrict_targets || { apps: [], categories: [] },
            condition: rule.condition || { metric: '', operator: '', value: '' },
            action: rule.action || { type: '', start_time: '', end_time: '', limit_minutes: null },
            evaluation_window: rule.evaluation_window || 'daily',
            effective_days: rule.effective_days || [],
            notes: rule.notes || ''
        });
        setEditingRule(rule);
        setDialogVisible(true);
    };

    const handleSave = async () => {
        // Validate required fields
        if (!form.name || 
            !form.condition.metric || 
            !form.condition.operator || 
            !form.condition.value ||
            !form.action.type ||
            form.effective_days.length === 0) {
            toast_error('Please fill all required fields');
            return;
        }

        // Additional validation for time-based actions
        if ((form.action.type === 'limit') && 
            (!form.action.start_time || !form.action.end_time)) {
            toast_error('Start and end time are required for this action type');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...form,
                // Ensure numbers are properly formatted
                condition: {
                    ...form.condition,
                    value: Number(form.condition.value)
                },
                // Clean up action object based on type
                action: form.action.type === 'notify' ? 
                    { type: form.action.type } : 
                    {
                        type: form.action.type,
                        start_time: form.action.start_time,
                        end_time: form.action.end_time,
                        ...(form.action.type === 'limit' && { limit_minutes: Number(form.action.limit_minutes) || 0 })
                    }
            };

            if (editingRule) {
                await updateRuleApi(editingRule.id, payload);
                toast_success('Rule updated successfully');
            } else {
                await createRuleApi(payload);
                toast_success('Rule created successfully');
            }
            setDialogVisible(false);
            fetchRules();
        } catch (err) {
            toast_error(err.message || 'Failed to save rule');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (rule) => {
        const isDelete = await confirmDialog('Delete', 'Are you sure you want to delete rule?');
        if(!isDelete) return;
        setLoading(true);
        try {
            console.log("**************", rule.id)
            await deleteRuleApi(rule.id);
            toast_success('Rule deleted');
            fetchRules();
        } catch (err) {
            toast_error(err.message || 'Failed to delete rule');
        } finally {
            setLoading(false);
        }
    };

    const openAssignDialog = () => {
        if (selectedRules.length === 0) {
            toast_error('Please select at least one rule to assign');
            return;
        }
        setAssignModalVisible(true);
    };

    const handleAssign = async (participants) => {
        setLoading(true);
        try {
            const res = await sendRulesToParticipantsApi(participants, selectedRules);
            toast_success('Rules assigned successfully');
            setAssignModalVisible(false);
            fetchRules()
        } catch (err) {
            toast_error(err.message || 'Failed to assign rules');
        } finally {
            setLoading(false);
        }
    };

    const actionTypeBodyTemplate = (rowData) => {
        const action = rowData.action?.type || '';
        return (
            <span className={`action-badge action-${action}`}>
                {action.charAt(0).toUpperCase() + action.slice(1)}
            </span>
        );
    };

    return (
        <div className="p-4">
            <h3 className="mb-4">Dynamic Rule Management</h3>
            <DataTable
                value={rules}
                paginator
                rows={10}
                responsiveLayout="scroll"
                selection={selectedRules}
                onSelectionChange={(e) => setSelectedRules(e.value)}
                filters={{ global: { value: query, matchMode: 'contains' } }}
                header={
                    <div className="flex justify-content-between align-items-center">
                        <div className="flex gap-2">
                            <Button 
                                icon="pi pi-plus" 
                                onClick={openCreateDialog} 
                                className="p-button-primary" 
                            />
                            <Button 
                                icon="pi pi-send" 
                                onClick={openAssignDialog} 
                                disabled={selectedRules.length === 0}
                                className="p-button-success"
                            />
                        </div>
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText 
                                value={query} 
                                onChange={(e) => setQuery(e.target.value)} 
                                placeholder="Search rules..." 
                            />
                        </span>
                    </div>
                }
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                <Column header="No" body={(_, { rowIndex }) => rowIndex + 1} style={{ width: '3rem' }} />
                <Column field="name" header="Rule Name" sortable />
                <Column field="evaluation_window" header="Window" sortable />
                <Column field="action.type" header="Action" body={actionTypeBodyTemplate} sortable />
                <Column
                    field="created_at"
                    header="Created"
                    body={(row) => new Date(row.created_at).toLocaleDateString()}
                    sortable
                />
                <Column
                    header="Actions"
                    body={(rowData) => (
                        <div className="flex gap-2">
                            <Button 
                                icon="pi pi-pencil" 
                                className="p-button-rounded p-button-sm" 
                                onClick={() => openEditDialog(rowData)} 
                                tooltip="Edit"
                                tooltipOptions={{ position: 'top' }}
                            />
                            <Button 
                                icon="pi pi-trash" 
                                className="p-button-rounded p-button-danger p-button-sm" 
                                onClick={() => handleDelete(rowData)} 
                                tooltip="Delete"
                                tooltipOptions={{ position: 'top' }}
                            />
                        </div>
                    )}
                    style={{ width: '8rem' }}
                />
            </DataTable>

            <DynamicRuleModal
                dialogVisible={dialogVisible}
                setDialogVisible={setDialogVisible}
                form={form}
                setForm={setForm}
                handleSave={handleSave}
                editing={!!editingRule}
                isMounted={isMounted}
            />

            <AssignRuleModal
                visible={assignModalVisible}
                setVisible={setAssignModalVisible}
                handleAssign={handleAssign}
            />
        </div>
    );
};

export default DynamicRuleManagement;