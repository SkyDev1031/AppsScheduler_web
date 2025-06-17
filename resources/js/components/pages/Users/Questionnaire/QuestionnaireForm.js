import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Divider } from 'primereact/divider';
import QuestionEditor from './QuestionEditor';
import { useGlobalContext } from '../../../contexts';
import { createQuestionnaire, updateQuestionnaire } from '../../../api/QuestionnaireAPI'; // Adjust the import path as needed

const QuestionnaireForm = ({ visible, onHide, onSaveSuccess, questionnaire }) => {
    const { user } = useGlobalContext();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    React.useEffect(() => {
        if (questionnaire) {
            setTitle(questionnaire.title || '');
            setDescription(questionnaire.description || '');
            setQuestions(questionnaire.questions || []);
        } else {
            setTitle('');
            setDescription('');
            setQuestions([]);
        }
    }, [questionnaire]);

    const handleSubmit = () => {
        if (!title.trim()) {
            return;
        }

        setIsSaving(true);

        const payload = {
            title,
            description,
            researcher_id: user.id,
            questions: questions.map(q => ({
                ...q,
                options: q.type === 'rating' ? [] : q.options.map(opt => opt.text)
            }))
        };
        const apiCall = questionnaire
            ? updateQuestionnaire(questionnaire.id, payload)
            : createQuestionnaire(payload);

        apiCall.then(() => {
            onSaveSuccess();
        }).catch(error => {
            console.error('Error saving questionnaire:', error);
        }).finally(() => {
            setIsSaving(false);
        });
    };

    const footer = (
        <div style={{ padding: '5px', margin: '5px' }}>
            <Button
                className="p-button-raised p-btn-danger"
                onClick={onHide}
                disabled={isSaving}
            >Cancel</Button>
            <Button
                className="p-button-raised"
                onClick={handleSubmit}
                // loading={isSaving}
                disabled={!title.trim() || isSaving}
            >Save</Button>
        </div>
    );

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            header={questionnaire ? 'Edit Questionnaire' : 'Create New Questionnaire'}
            style={{ width: '70vw' }}
            footer={footer}
            modal
            className="p-fluid"
        >
            <div className="grid">
                <div className="col-12 md:col-6">
                    <div className="field">
                        <label htmlFor="title">Title*</label>
                        <InputText
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter questionnaire title"
                            className="w-full"
                        />
                    </div>
                </div>
                <div className="col-12">
                    <div className="field">
                        <label htmlFor="description">Description</label>
                        <InputTextarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={1}
                            placeholder="Enter questionnaire description"
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            <Divider align="left">
                <div className="inline-flex align-items-center" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <span className="font-bold">Questions</span>
                </div>
            </Divider>

            <QuestionEditor
                questions={questions}
                setQuestions={setQuestions}
            />
        </Dialog>
    );
};

export default QuestionnaireForm;