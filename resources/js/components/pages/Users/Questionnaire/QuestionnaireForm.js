import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import QuestionEditor from './QuestionEditor';

const QuestionnaireForm = ({ visible, onHide, onSave, initialData = {} }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setQuestions(initialData.questions || []);
        }
    }, [initialData]);

    const handleSubmit = () => {
        const payload = {
            title,
            description,
            researcher_id: 1, // or dynamic
            questions
        };
        onSave(payload);
    };

    return (
        <Dialog visible={visible} onHide={onHide} header={initialData.id ? 'Edit Questionnaire' : 'New Questionnaire'} style={{ width: '50vw' }}>
            <div className="p-fluid">
                <div className="field">
                    <label>Title</label>
                    <InputText value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="field">
                    <label>Description</label>
                    <InputTextarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                </div>
                <QuestionEditor questions={questions} setQuestions={setQuestions} />
            </div>
            <div className="flex justify-end mt-3">
                <Button label="Save" onClick={handleSubmit} />
            </div>
        </Dialog>
    );
};

export default QuestionnaireForm;
