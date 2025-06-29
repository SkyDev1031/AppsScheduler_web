import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputNumber } from 'primereact/inputnumber';
import { Fieldset } from 'primereact/fieldset';

const QUESTION_TYPES = [
    { label: 'Single Choice', value: 'single_choice' },
    { label: 'Multiple Choice', value: 'multi_choice' },
    { label: 'Rating Scale', value: 'rating' },
    { label: 'Text Answer', value: 'text' }
];

const QuestionEditor = ({ questions, setQuestions }) => {
    const addQuestion = () => {
        setQuestions([...questions, { 
            text: '', 
            type: 'single_choice', 
            options: [{ text: '' }],
            required: false,
            rating_scale_max: 5
        }]);
    };

    const updateQuestion = (index, field, value) => {
        const updated = [...questions];
        updated[index][field] = value;
        
        if (field === 'type') {
            // Reset options when changing to rating or text type
            if (value === 'rating' || value === 'text') {
                updated[index].options = [];
            } else if (value === 'single_choice' || value === 'multi_choice') {
                updated[index].options = updated[index].options.length ? updated[index].options : [{ text: '' }];
            }
        }
        
        setQuestions(updated);
    };

    const addOption = (qIndex) => {
        const updated = [...questions];
        updated[qIndex].options.push({ text: '' });
        setQuestions(updated);
    };

    const updateOption = (qIndex, oIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[oIndex] = {
            ...updated[qIndex].options[oIndex],
            text: value
        };
        setQuestions(updated);
    };

    const removeQuestion = (index) => {
        const updated = questions.filter((_, i) => i !== index);
        setQuestions(updated);
    };

    const removeOption = (qIndex, oIndex) => {
        const updated = [...questions];
        updated[qIndex].options.splice(oIndex, 1);
        setQuestions(updated);
    };

    return (
        <div className="question-editor">
            {questions.length === 0 && (
                <div className="text-center py-4">
                    <p className="text-gray-500">No questions added yet</p>
                </div>
            )}

            <Accordion multiple activeIndex={[]}>
                {questions.map((q, index) => (
                    <AccordionTab 
                        key={index} 
                        header={`Question ${index + 1}`}
                        headerClassName="font-bold"
                    >
                        <Card className="mb-3">
                            <div className="grid">
                                <div className="col-12 md:col-8">
                                    <div className="field">
                                        <label>Question Text*</label>
                                        <InputText 
                                            value={q.text} 
                                            onChange={(e) => updateQuestion(index, 'text', e.target.value)} 
                                            placeholder="Enter your question"
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                                <div className="col-12 md:col-4">
                                    <div className="field">
                                        <label>Question Type*</label>
                                        <Dropdown 
                                            value={q.type} 
                                            options={QUESTION_TYPES} 
                                            onChange={(e) => updateQuestion(index, 'type', e.value)} 
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {(q.type === 'single_choice' || q.type === 'multi_choice') && (
                                <Fieldset legend="Options" className="mt-3" style={{ width: '80%', margin: 'auto' }}>
                                    {q.options.map((opt, oIndex) => (
                                        <div key={oIndex} className="flex align-items-center gap-2 mb-2" style={{ display: 'flex' }}>
                                            <InputText
                                                value={opt.text || ''}
                                                onChange={(e) => updateOption(index, oIndex, e.target.value)}
                                                placeholder={`Option ${oIndex + 1}`}
                                                className="flex-grow-1"
                                            />
                                            <Button
                                                icon="pi pi-trash"
                                                className="p-button-rounded p-button-danger"
                                                onClick={() => removeOption(index, oIndex)}
                                                disabled={q.options.length <= 1}
                                            />
                                        </div>
                                    ))}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            label="+ Add Option"
                                            style={{ width: '20%' }}
                                            className="p-button-sm"
                                            onClick={() => addOption(index)}
                                        />
                                    </div>
                                </Fieldset>
                            )}

                            {q.type === 'rating' && (
                                <div className="field mt-3">
                                    <label>Rating Scale (1 to)</label>
                                    <InputNumber
                                        value={q.rating_scale_max || 5}
                                        onValueChange={(e) => updateQuestion(index, 'rating_scale_max', e.value)}
                                        min={2}
                                        max={10}
                                        showButtons
                                        className="w-full"
                                    />
                                </div>
                            )}

                            <div className="flex justify-end mt-3" style={{ display: 'flex', justifyContent: 'end' }}>
                                <button 
                                    className="btn btn-danger" 
                                    onClick={() => removeQuestion(index)} 
                                >Remove Question</button>
                            </div>
                        </Card>
                    </AccordionTab>
                ))}
            </Accordion>

            <div className="flex justify-between mt-4" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                    label="+ Add Question" 
                    // icon="pi pi-plus" 
                    className="p-button-raised" 
                    onClick={addQuestion} 
                />
                {/* <div className="text-sm text-gray-500">
                    {questions.length} question{questions.length !== 1 ? 's' : ''} added
                </div> */}
            </div>
        </div>
    );
};

export default QuestionEditor;