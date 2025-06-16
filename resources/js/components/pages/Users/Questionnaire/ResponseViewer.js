import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { getResponses } from '../../../api/QuestionnaireAPI';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const ResponseViewer = ({ visible, onHide, questionnaire }) => {
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        if (visible && questionnaire) {
            getResponses(questionnaire.id).then(res => {
                console.log('ResponseViewer mounted or visible changed:', res);
                setResponses(res.data.assignments || []);
            });
        }
    }, [visible]);

    return (
        <Dialog visible={visible} onHide={onHide} header={`Responses: ${questionnaire?.title}`} style={{ width: '50vw' }}>
            <DataTable value={responses} paginator rows={5}>
                <Column field="participant_id" header="Participant ID" />
                <Column field="responses.length" header="# Responses" body={row => row.responses?.length || 0} />
            </DataTable>
        </Dialog>
    );
};

export default ResponseViewer;
