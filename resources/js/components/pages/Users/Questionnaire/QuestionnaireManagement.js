import React, { useEffect, useRef, useState } from 'react';
import { getAllQuestionnaires, createQuestionnaire, updateQuestionnaire, deleteQuestionnaire, getQuestionnaire } from '../../../api/QuestionnaireAPI';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import QuestionEditor from './QuestionEditor';
import AssignmentModal from './AssignmentModal';
import ResponseViewer from './ResponseViewer';
import QuestionnaireForm from './QuestionnaireForm';
const QuestionnaireManagement = () => {
    const [editingQuestionnaire, setEditingQuestionnaire] = useState(null);
    const [assignVisible, setAssignVisible] = useState(false);
    const [responseVisible, setResponseVisible] = useState(false);

    const [questionnaires, setQuestionnaires] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editing, setEditing] = useState(null);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ title: '', description: '' });
    const toast = useRef(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        getAllQuestionnaires()
            .then(res => setQuestionnaires(res.data || []))
            .catch(err => {
                console.error(err);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load questionnaires' });
            });
    };

    const openNew = () => {
        setForm({ title: '', description: '' });
        setEditing(false);
        setDialogVisible(true);
    };

    const openEdit = (rowData) => {
        getQuestionnaire(rowData.id)
            .then(res => {
                setForm({ ...rowData });
                setEditing(res.data);
                setDialogVisible(true);
            })
            .catch(err => {
                console.error('Error fetching questionnaire:', err);
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load questionnaire data'
                });
            });
    };


    const openAssign = (q) => {
        setEditingQuestionnaire(q);
        setAssignVisible(true);
    };

    const openResponses = (q) => {
        setEditingQuestionnaire(q);
        setResponseVisible(true);
    };

    const hideDialog = () => {
        setDialogVisible(false);
    };

    const handleSave = (payload) => {
        const apiCall = editing
            ? updateQuestionnaire(editing.id, payload)
            : createQuestionnaire(payload);

        apiCall.then(() => {
            fetchData();
            setDialogVisible(false);
            setEditing(null);
        });
    };

    const handleDelete = (rowData) => {
        confirmDialog({
            message: `Are you sure you want to delete "${rowData.title}"?`,
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await deleteQuestionnaire(rowData.id);
                    toast.current.show({ severity: 'warn', summary: 'Deleted', detail: 'Questionnaire deleted' });
                    loadData();
                } catch {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Deletion failed' });
                }
            }
        });
    };

    const actionTemplate = (rowData) => (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-text" onClick={() => openEdit(rowData)} />
            <Button icon="pi pi-users" className="p-button-rounded p-button-text" onClick={() => openAssign(rowData)} />
            <Button icon="pi pi-eye" className="p-button-rounded p-button-text" onClick={() => openResponses(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => handleDelete(rowData)} />
        </>
    );

    return (
        <>
            <div className="p-4">
                <Toast ref={toast} />
                <ConfirmDialog />
                <div className="flex justify-between items-center mb-3">
                    <h2>Questionnaire Management</h2>
                    <Button label="New Questionnaire" icon="pi pi-plus" onClick={openNew} />
                </div>
                <DataTable
                    value={questionnaires}
                    paginator
                    rows={5}
                    selectionMode="single"
                    selection={selected}
                    onSelectionChange={(e) => setSelected(e.value)}
                    dataKey="id"
                    responsiveLayout="scroll"
                >
                    <Column field="id" header="ID" style={{ width: '5%' }} headerStyle={{ textAlign: 'center' }} />
                    <Column field="title" header="Title" headerStyle={{ textAlign: 'center' }} />
                    <Column field="description" header="Description" headerStyle={{ textAlign: 'center' }} />
                    <Column field="assignments_count" header="Assigned" style={{ width: '10%' }} headerStyle={{ textAlign: 'center' }} />
                    <Column field="responses_count" header="Responses" style={{ width: '10%' }} headerStyle={{ textAlign: 'center' }} />
                    <Column header="Actions" body={actionTemplate} style={{ textAlign: 'center', width: '20%' }} headerStyle={{ textAlign: 'center' }} />
                </DataTable>

                <Dialog
                    header={editing ? 'Edit Questionnaire' : 'New Questionnaire'}
                    visible={dialogVisible}
                    style={{ width: '400px' }}
                    onHide={hideDialog}
                    modal
                >
                    <div className="field mb-3">
                        <label htmlFor="title">Title</label>
                        <InputText id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} autoFocus />
                    </div>
                    <div className="field mb-3">
                        <label htmlFor="description">Description</label>
                        <InputText id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
                        <Button label="Save" icon="pi pi-check" onClick={handleSave} disabled={!form.title.trim()} />
                    </div>
                </Dialog>
            </div>
            <AssignmentModal visible={assignVisible} onHide={() => setAssignVisible(false)} questionnaire={editingQuestionnaire} />
            <ResponseViewer visible={responseVisible} onHide={() => setResponseVisible(false)} questionnaire={editingQuestionnaire} />
            <QuestionnaireForm
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                onSave={handleSave}
                initialData={editing || { title: '', description: '', questions: [] }}
            />
        </>
    );
};

export default QuestionnaireManagement;
