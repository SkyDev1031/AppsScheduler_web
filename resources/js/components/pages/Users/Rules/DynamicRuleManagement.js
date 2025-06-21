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
    assignRuleToParticipantApi
} from '../../../api/DynamicRuleAPI';

const DynamicRuleManagement = () => {
    const [rules, setRules] = useState([]);
    const [selectedRules, setSelectedRules] = useState([]);
    const [query, setQuery] = useState('');
    const [editingRule, setEditingRule] = useState(null);
    const [form, setForm] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [assignModalVisible, setAssignModalVisible] = useState(false);

    const { _user } = useAuth();
    const { setLoading } = useGlobalContext();
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
            if (isMounted.current && res?.assignments) {
                const uniqueRules = res.assignments.map(a => a.rule);
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
            condition: { metric: '', operator: '', value: 0 },
            action: { type: '', start_time: '', end_time: '', limit_minutes: null },
            evaluation_window: 'daily',
            effective_days: []
        });
        setEditingRule(null);
        setDialogVisible(true);
    };

    const openEditDialog = (rule) => {
        setForm(rule);
        setEditingRule(rule);
        setDialogVisible(true);
    };

    const handleSave = async () => {
        if (!form.name || !form.condition || !form.action) {
            toast_error('All fields are required');
            return;
        }

        setLoading(true);
        try {
            if (editingRule) {
                await updateRuleApi(editingRule.id, form);
                toast_success('Rule updated successfully');
            } else {
                await createRuleApi(form);
                toast_success('Rule created successfully');
            }
            setDialogVisible(false);
            fetchRules();
        } catch (err) {
            toast_error('Failed to save rule');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (rule) => {
        setLoading(true);
        try {
            await deleteRuleApi(rule.id);
            toast_success('Rule deleted');
            fetchRules();
        } catch (err) {
            toast_error('Failed to delete rule');
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
            await Promise.all(
                selectedRules.map(rule =>
                    participants.map(participant =>
                        assignRuleToParticipantApi({
                            rule_id: rule.id,
                            researcher_id: _user.id,
                            participant_id: participant.id
                        })
                    )
                ).flat()
            );
            toast_success('Rules assigned successfully');
            setAssignModalVisible(false);
        } catch (err) {
            toast_error('Failed to assign rules');
        } finally {
            setLoading(false);
        }
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
                    <div className="d-flex justify-content-between gap-3">
                        <div className="flex gap-2">
                            <Button label="New Rule" icon="pi pi-plus" onClick={openCreateDialog} />
                            <Button label="Assign to Participants" icon="pi pi-send" onClick={openAssignDialog} disabled={selectedRules.length === 0} />
                        </div>
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search rules..." />
                        </span>
                    </div>
                }
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                <Column header="No" body={(_, { rowIndex }) => rowIndex + 1} style={{ width: '3rem' }} />
                <Column field="name" header="Rule Name" sortable />
                <Column field="evaluation_window" header="Window" />
                <Column
                    field="created_at"
                    header="Created"
                    body={(row) => new Date(row.created_at).toLocaleDateString()}
                />
                <Column
                    header="Actions"
                    body={(rowData) => (
                        <div className="flex gap-2">
                            <Button icon="pi pi-pencil" className="p-button-sm" onClick={() => openEditDialog(rowData)} />
                            <Button icon="pi pi-trash" className="p-button-danger p-button-sm" onClick={() => handleDelete(rowData)} />
                        </div>
                    )}
                />
            </DataTable>

            <DynamicRuleModal
                dialogVisible={dialogVisible}
                setDialogVisible={setDialogVisible}
                form={form}
                setForm={setForm}
                handleSave={handleSave}
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
