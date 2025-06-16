import React, { useEffect, useState } from 'react';
import { getAllQuestionnaires } from '../../api/QuestionnaireAPI';

const QuestionnaireManagement = () => {
    const [questionnaires, setQuestionnaires] = useState([]);

    useEffect(() => {
        getAllQuestionnaires()
            .then(res => setQuestionnaires(res))
            .catch(err => console.error('Failed to fetch questionnaires:', err));
    }, []);

    return (
        <div>
            <h3>All Questionnaires</h3>
            <ul>
                {questionnaires.map(q => (
                    <li key={q.id}>{q.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default QuestionnaireManagement;
