import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const QUESTION_TYPES = [
    { label: 'Single Choice', value: 'single_choice' },
    { label: 'Multi Choice', value: 'multi_choice' },
    { label: 'Rating', value: 'rating' }
];

const QuestionEditor = ({ questions, setQuestions }) => {
    const addQuestion = () => {
        setQuestions([...questions, { text: '', type: 'single_choice', options: [] }]);
    };

    const updateQuestion = (index, field, value) => {
        const updated = [...questions];
        updated[index][field] = value;
        if (field === 'type' && value === 'rating') {
            updated[index].options = [];
        }
        setQuestions(updated);
    };

    const addOption = (qIndex) => {
        const updated = [...questions];
        updated[qIndex].options.push('');
        setQuestions(updated);
    };

    const updateOption = (qIndex, oIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[oIndex] = value;
        setQuestions(updated);
    };

    const removeQuestion = (index) => {
        const updated = questions.filter((_, i) => i !== index);
        setQuestions(updated);
    };

    return (
        <div className="mt-3">
            <h5>Questions</h5>
            {questions.map((q, index) => (
                <div key={index} className="border p-3 mb-2 rounded">
                    <div className="field">
                        <label>Question Text</label>
                        <InputText value={q.text} onChange={(e) => updateQuestion(index, 'text', e.target.value)} />
                    </div>
                    <div className="field">
                        <label>Type</label>
                        <Dropdown value={q.type} options={QUESTION_TYPES} onChange={(e) => updateQuestion(index, 'type', e.value)} />
                    </div>
                    {q.type === 'rating' && (
                        <div className="field">
                            <label>Rating Scale Max</label>
                            <InputText value={q.rating_scale_max || ''} onChange={(e) => updateQuestion(index, 'rating_scale_max', e.target.value)} />
                        </div>
                    )}
                    {(q.type === 'single_choice' || q.type === 'multi_choice') && (
                        <div className="field">
                            <label>Options</label>
                            {q.options.map((opt, oIndex) => (
                                <InputText
                                    key={oIndex}
                                    className="mb-2"
                                    value={opt}
                                    onChange={(e) => updateOption(index, oIndex, e.target.value)}
                                />
                            ))}
                            <Button label="Add Option" icon="pi pi-plus" className="p-button-sm mt-2" onClick={() => addOption(index)} />
                        </div>
                    )}
                    <div className="mt-2">
                        <Button label="Remove Question" icon="pi pi-trash" className="p-button-danger p-button-sm" onClick={() => removeQuestion(index)} />
                    </div>
                </div>
            ))}
            <Button label="Add Question" icon="pi pi-plus" className="p-button-secondary mt-2" onClick={addQuestion} />
        </div>
    );
};

export default QuestionEditor;
