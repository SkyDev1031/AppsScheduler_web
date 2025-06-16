import React, { useEffect, useRef, useState } from 'react';
import { getAllQuestionnaires, deleteQuestionnaire, getQuestionnaire } from '../../../api/QuestionnaireAPI';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Card } from 'primereact/card';
import { Toolbar } from 'primereact/toolbar';
import QuestionnaireForm from './QuestionnaireForm';
import AssignmentModal from './AssignmentModal';
import ResponseViewer from './ResponseViewer';
import { Badge } from 'primereact/badge';
import { toast_success, toast_error } from '../../../utils'; // Import toast utilities
import { useGlobalContext } from '../../../contexts';

const QuestionnaireManagement = () => {
    const [questionnaires, setQuestionnaires] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editingQuestionnaire, setEditingQuestionnaire] = useState(null);
    const [assignVisible, setAssignVisible] = useState(false);
    const [responseVisible, setResponseVisible] = useState(false);
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
    const toast = useRef(null);
    const { setLoading } = useGlobalContext();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setLoading(true)
        getAllQuestionnaires()
            .then(res => {
                setQuestionnaires(res.data || []);
                setLoading(false)
                // toast_success('Questionnaires loaded successfully');
            })
            .catch(err => {
                console.error(err);
                toast_error('Failed to load questionnaires');
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
                toast_error('Failed to load questionnaire data');
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
                    toast_success('Questionnaire deleted successfully');
                    loadData();
                } catch {
                    toast_error('Deletion failed');
                }
            }
        });
    };

    const handleSaveSuccess = () => {
        toast_success(editingQuestionnaire ? 'Questionnaire updated' : 'Questionnaire created');
        loadData();
        setDialogVisible(false);
    };

    const actionTemplate = (rowData) => (
        <div className="flex gap-2">
            <Button 
                icon="pi pi-pencil" 
                className="p-button-rounded p-button-primary" 
                tooltip="Edit" 
                tooltipOptions={{ position: 'top' }}
                onClick={() => openEdit(rowData)} 
            />
            <Button 
                icon="pi pi-users" 
                className="p-button-rounded p-button-help" 
                tooltip="Assign" 
                tooltipOptions={{ position: 'top' }}
                onClick={() => openAssign(rowData)} 
            />
            <Button 
                icon="pi pi-eye" 
                className="p-button-rounded p-button-info" 
                tooltip="View Responses" 
                tooltipOptions={{ position: 'top' }}
                onClick={() => openResponses(rowData)} 
            />
            <Button 
                icon="pi pi-trash" 
                className="p-button-rounded p-button-danger" 
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
                size="small" 
            />
            <Badge 
                value={`${rowData.responses_count} responses`} 
                severity="success" 
                size="small" 
            />
        </div>
    );

    const leftToolbarTemplate = () => (
        <div style={{ display: 'flex' }}>
            <h3 className="m-0">Questionnaires</h3>
            <Badge value={questionnaires.length} severity="info" />
        </div>
    );

    const rightToolbarTemplate = () => (
        <button 
            icon="pi pi-plus" 
            className="btn btn-primary"
            onClick={openNew} 
        >+ New Questionnaire</button>
    );

    return (
        <div className="p-4">
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
                    selection={selectedQuestionnaire}
                    onSelectionChange={(e) => setSelectedQuestionnaire(e.value)}
                    dataKey="id"
                    responsiveLayout="scroll"
                >
                    <Column header="No" body={(_, { rowIndex }) => rowIndex + 1} style={{ width: '5%' }} />
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