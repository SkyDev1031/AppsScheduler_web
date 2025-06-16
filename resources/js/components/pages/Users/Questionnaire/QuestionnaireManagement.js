import React, { useEffect, useRef, useState } from 'react';
import { getAllQuestionnaires, deleteQuestionnaire, getQuestionnaire } from '../../../api/QuestionnaireAPI';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Card } from 'primereact/card';
import { Toolbar } from 'primereact/toolbar';
import QuestionnaireForm from './QuestionnaireForm';
import AssignmentModal from './AssignmentModal';
import ResponseViewer from './ResponseViewer';
import { Badge } from 'primereact/badge';

const QuestionnaireManagement = () => {
    const [questionnaires, setQuestionnaires] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editingQuestionnaire, setEditingQuestionnaire] = useState(null);
    const [assignVisible, setAssignVisible] = useState(false);
    const [responseVisible, setResponseVisible] = useState(false);
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        getAllQuestionnaires()
            .then(res => setQuestionnaires(res.data || []))
            .catch(err => {
                console.error(err);
                toast.current.show({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'Failed to load questionnaires',
                    life: 3000
                });
            });
    };

    const openNew = () => {
        setEditingQuestionnaire(null);
        setDialogVisible(true);
    };

    const openEdit = (questionnaire) => {
        getQuestionnaire(questionnaire.id)
            .then(res => {
                setEditingQuestionnaire(res.data);
                setDialogVisible(true);
            })
            .catch(err => {
                console.error('Error fetching questionnaire:', err);
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load questionnaire data',
                    life: 3000
                });
            });
    };

    const openAssign = (questionnaire) => {
        setSelectedQuestionnaire(questionnaire);
        setAssignVisible(true);
    };

    const openResponses = (questionnaire) => {
        setSelectedQuestionnaire(questionnaire);
        setResponseVisible(true);
    };

    const handleDelete = (questionnaire) => {
        confirmDialog({
            message: `Are you sure you want to delete "${questionnaire.title}"?`,
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await deleteQuestionnaire(questionnaire.id);
                    toast.current.show({ 
                        severity: 'success', 
                        summary: 'Deleted', 
                        detail: 'Questionnaire deleted successfully',
                        life: 3000
                    });
                    loadData();
                } catch {
                    toast.current.show({ 
                        severity: 'error', 
                        summary: 'Error', 
                        detail: 'Deletion failed',
                        life: 3000
                    });
                }
            }
        });
    };

    // const createQuestionnaireHandle = (payload) => {
    //     console.log("payload", payload);
    // }

    // const updateQuestionnaireHandle = (id, payload) => {
    //     console.log("---", id, payload)
    // }

    const handleSaveSuccess = () => {
        toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: editingQuestionnaire ? 'Questionnaire updated' : 'Questionnaire created',
            life: 3000
        });
        loadData();
        setDialogVisible(false);
    };

    const actionTemplate = (rowData) => (
        <div className="flex gap-2">
            <Button 
                icon="pi pi-pencil" 
                className="p-button-rounded p-button-text p-button-primary" 
                tooltip="Edit" 
                tooltipOptions={{ position: 'top' }}
                onClick={() => openEdit(rowData)} 
            />
            <Button 
                icon="pi pi-users" 
                className="p-button-rounded p-button-text p-button-help" 
                tooltip="Assign" 
                tooltipOptions={{ position: 'top' }}
                onClick={() => openAssign(rowData)} 
            />
            <Button 
                icon="pi pi-eye" 
                className="p-button-rounded p-button-text p-button-info" 
                tooltip="View Responses" 
                tooltipOptions={{ position: 'top' }}
                onClick={() => openResponses(rowData)} 
            />
            <Button 
                icon="pi pi-trash" 
                className="p-button-rounded p-button-text p-button-danger" 
                tooltip="Delete" 
                tooltipOptions={{ position: 'top' }}
                onClick={() => handleDelete(rowData)} 
            />
        </div>
    );

    const statusTemplate = (rowData) => (
        <div className="flex gap-2">
            <Badge 
                value={`${rowData.assignments_count} assigned`} 
                severity="info" 
                size="large" 
            />
            <Badge 
                value={`${rowData.responses_count} responses`} 
                severity="success" 
                size="large" 
            />
        </div>
    );

    const leftToolbarTemplate = () => (
        <div className="flex align-items-center gap-2">
            <h2 className="m-0">Questionnaires</h2>
            <Badge value={questionnaires.length} severity="info" />
        </div>
    );

    const rightToolbarTemplate = () => (
        <Button 
            label="New Questionnaire" 
            icon="pi pi-plus" 
            className="p-button-raised"
            onClick={openNew} 
        />
    );

    return (
        <div className="p-4">
            <Toast ref={toast} position="top-right" />
            <ConfirmDialog />
            
            <Card>
                <Toolbar 
                    className="mb-4" 
                    left={leftToolbarTemplate} 
                    right={rightToolbarTemplate} 
                />
                
                <DataTable
                    value={questionnaires}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    emptyMessage="No questionnaires found"
                    selectionMode="single"
                    selection={selectedQuestionnaire}
                    onSelectionChange={(e) => setSelectedQuestionnaire(e.value)}
                    dataKey="id"
                    responsiveLayout="scroll"
                >
                    <Column field="id" header="ID" style={{ width: '5%' }} />
                    <Column field="title" header="Title" sortable />
                    <Column field="description" header="Description" sortable />
                    <Column header="Status" body={statusTemplate} style={{ width: '25%' }} />
                    <Column 
                        header="Actions" 
                        body={actionTemplate} 
                        style={{ width: '20%' }} 
                        alignHeader="center"
                    />
                </DataTable>
            </Card>

            <QuestionnaireForm
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                onSaveSuccess={handleSaveSuccess}
                questionnaire={editingQuestionnaire}
            />

            <AssignmentModal 
                visible={assignVisible} 
                onHide={() => setAssignVisible(false)} 
                questionnaire={selectedQuestionnaire} 
            />
            
            <ResponseViewer 
                visible={responseVisible} 
                onHide={() => setResponseVisible(false)} 
                questionnaire={selectedQuestionnaire} 
            />
        </div>
    );
};

export default QuestionnaireManagement;