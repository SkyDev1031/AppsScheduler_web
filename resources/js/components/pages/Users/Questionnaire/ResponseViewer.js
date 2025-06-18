import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { getResponses } from '../../../api/QuestionnaireAPI';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';

const ResponseViewer = ({ visible, onHide, questionnaire }) => {
    const [questions, setQuestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        if (visible && questionnaire) {
            getResponses(questionnaire.id).then(res => {
                const qData = res?.data;
                if (!qData) return;

                const questions = qData.questions || [];
                const assignments = qData.assignments || [];

                const enrichedQuestions = questions.map((question, index) => {
                    const responses = [];
                    const stats = {};
                    let totalResponses = 0;

                    assignments.forEach(a => {
                        const response = a.responses.find(r => r.question_id === question.id);
                        if (!response) return;

                        const participantName = a.participant?.userID || `Participant ${a.participant_id}`;
                        let answer = response.answer;
                        totalResponses++;

                        if (question.type === 'multi_choice') {
                            const items = Array.isArray(answer) ? answer : answer.split(',').map(s => s.trim());
                            answer = items.join(', ');
                            items.forEach(opt => {
                                stats[opt] = (stats[opt] || 0) + 1;
                            });
                        } else if (question.type === 'single_choice') {
                            stats[answer] = (stats[answer] || 0) + 1;
                        } else if (question.type === 'rating') {
                            const num = parseFloat(answer);
                            if (!isNaN(num)) {
                                stats.sum = (stats.sum || 0) + num;
                                stats.count = (stats.count || 0) + 1;
                                stats.min = stats.min !== undefined ? Math.min(stats.min, num) : num;
                                stats.max = stats.max !== undefined ? Math.max(stats.max, num) : num;
                            }
                        }

                        responses.push({ participant: participantName, answer });
                    });

                    return {
                        ...question,
                        index: index + 1,
                        responses,
                        stats,
                        totalResponses
                    };
                });

                setQuestions(enrichedQuestions);
            });
        }
    }, [visible, questionnaire]);

    const renderQuestionStats = (question) => {
        if (question.type === 'rating') {
            const avg = question.stats.count ? (question.stats.sum / question.stats.count).toFixed(2) : 'N/A';
            return (
                <div className="grid p-3">
                    <div className="col-4">
                        <div className="text-sm font-medium">Average</div>
                        <div className="text-xl font-bold">{avg}</div>
                    </div>
                    <div className="col-4">
                        <div className="text-sm font-medium">Range</div>
                        <div className="text-sm">
                            {question.stats.min || 'N/A'} - {question.stats.max || 'N/A'}
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="text-sm font-medium">Responses</div>
                        <div className="text-sm">{question.totalResponses}</div>
                    </div>
                </div>
            );
        } else if (question.type === 'single_choice' || question.type === 'multi_choice') {
            return (
                <div className="p-3">
                    {Object.entries(question.stats).map(([option, count]) => (
                        <div key={option} className="mb-2">
                            <div className="flex justify-content-between mb-1">
                                <span>{option}</span>
                                <span>
                                    {count} ({Math.round((count / question.totalResponses) * 100)}%)
                                </span>
                            </div>
                            <ProgressBar 
                                value={(count / question.totalResponses) * 100} 
                                showValue={false} 
                                style={{ height: '6px' }}
                            />
                        </div>
                    ))}
                </div>
            );
        } else {
            return (
                <div className="p-3">
                    <Badge value={`${question.totalResponses} text responses`} severity="info" />
                </div>
            );
        }
    };

    const renderResponseTable = (question) => {
        return (
            <DataTable
                value={question.responses}
                scrollable
                scrollHeight="200px"
                className="p-datatable-sm"
            >
                <Column field="participant" header="Participant" />
                <Column 
                    field="answer" 
                    header="Answer" 
                    body={(rowData) => (
                        question.type === 'text' ? (
                            <div className="p-2 bg-gray-100 border-round">
                                {rowData.answer}
                            </div>
                        ) : (
                            rowData.answer
                        )
                    )}
                />
            </DataTable>
        );
    };

    const getQuestionTypeTag = (type) => {
        const typeMap = {
            'single_choice': { label: 'Single Choice', severity: 'success' },
            'multi_choice': { label: 'Multiple Choice', severity: 'info' },
            'rating': { label: 'Rating Scale', severity: 'warning' },
            'text': { label: 'Text Answer', severity: null }
        };

        const config = typeMap[type] || { label: type, severity: null };
        return (
            <Tag 
                value={config.label} 
                severity={config.severity} 
                className="mr-2" 
            />
        );
    };

    return (
        <Dialog 
            visible={visible} 
            onHide={onHide} 
            header={
                <div>
                    <span>Responses: </span>
                    <span className="font-bold">{questionnaire?.title}</span>
                    <div className="flex gap-2 mt-2">
                        <Badge value={`${questions.length} questions`} severity="info" />
                        <Badge 
                            value={`${questions.reduce((sum, q) => sum + q.totalResponses, 0)} total responses`} 
                            severity="success" 
                        />
                    </div>
                </div>
            } 
            style={{ width: '85vw', height: '85vh' }} // Fixed height
            breakpoints={{ '960px': '85vw', '640px': '95vw' }}
            modal
            className="p-fluid"
            footer={
                <div className="d-flex justify-content-end" style={{
                    paddingTop: '1rem',
                    borderTop: '1px solid #dee2e6'
                }}>
                    <button
                        className="btn btn-secondary"
                        onClick={onHide}
                    >
                        Cancel
                    </button>
                </div>
            }
        >
            <div className="p-2" style={{
                height: 'calc(100% - 60px)', // Adjust height to account for header and footer
                overflowY: 'auto' // Enable scrolling for content
            }}>
                <Accordion 
                    activeIndex={activeIndex}
                    onTabChange={(e) => setActiveIndex(e.index)}
                    multiple
                >
                    {questions.map((question) => (
                        <AccordionTab 
                            key={question.id}
                            header={
                                <div className="flex align-items-center gap-3">
                                    <span className="font-bold">Q{question.index}:</span>
                                    <span className="flex-grow-1">{question.text}</span>
                                    {getQuestionTypeTag(question.type)}
                                    <Badge 
                                        value={`${question.totalResponses} responses`} 
                                        severity="info" 
                                        size="small" 
                                    />
                                </div>
                            }
                        >
                            <div className="grid">
                                <div className="col-12 md:col-5">
                                    <div className="text-sm font-medium mb-2">Response Statistics</div>
                                    {renderQuestionStats(question)}
                                </div>
                                <div className="col-12 md:col-7">
                                    <div className="text-sm font-medium mb-2">Individual Responses</div>
                                    {renderResponseTable(question)}
                                </div>
                            </div>
                        </AccordionTab>
                    ))}
                </Accordion>
            </div>
        </Dialog>
    );
};

export default ResponseViewer;