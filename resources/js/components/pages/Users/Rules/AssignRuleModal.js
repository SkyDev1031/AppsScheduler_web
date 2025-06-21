import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { getStudiesWithParticipants } from '../../../api/StudyAPI';
import 'bootstrap-icons/font/bootstrap-icons.css';

const AssignRuleModal = ({
    participantsModalOpen,
    setParticipantsModalOpen,
    handleSendRecommendation
}) => {
    const [studies, setStudies] = useState([]);
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState([]);

    useEffect(() => {
        const fetchStudiesWithParticipants = async () => {
            try {
                const response = await getStudiesWithParticipants();
                if (response && response.data) {
                    const treeData = response.data.map((study) => ({
                        value: study.studyGroup,
                        label: study.studyGroup,
                        children: study.participants.map((participant) => ({
                            value: participant.id,
                            label: participant.userID,
                        })),
                    }));
                    setStudies(treeData);

                    // Initialize expanded state with all parent nodes (study groups)
                    const expandedNodes = treeData.map((study) => study.value);
                    setExpanded(expandedNodes);
                } else {
                    setStudies([]);
                    setExpanded([]); // Reset expanded state if no data
                }
            } catch (error) {
                console.error('Error fetching participants:', error);
                setStudies([]);
                setExpanded([]); // Reset expanded state on error
            }
        };

        if (participantsModalOpen) {
            fetchStudiesWithParticipants();
        }
    }, [participantsModalOpen]);

    return (
        <Dialog
            visible={participantsModalOpen}
            onHide={() => setParticipantsModalOpen(false)}
            style={{ width: '50vw', minHeight: '400px' }}
            header="Send Recommendation"
            modal
            className="study-participants-modal"
            footer={
                <div className="d-flex justify-content-end" style={{
                    paddingTop: '1rem',
                    borderTop: '1px solid #dee2e6' // Optional: adds a subtle separator line
                }}>
                    <button
                        className="btn btn-secondary me-2"
                        onClick={() => setParticipantsModalOpen(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => handleSendRecommendation(checked)}
                        disabled={checked.length === 0}
                    >
                        Send Recommendation
                    </button>
                </div>
            }
        >
            <div className="modal-content-wrapper" style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between' // This ensures content stays spaced
            }}>
                <div className="tree-container" style={{ 
                    flex: 1, 
                    overflow: 'auto', 
                    marginBottom: '1rem' 
                }}>
                    {studies.length > 0 ? (
                        <CheckboxTree
                            nodes={studies}
                            checked={checked}
                            expanded={expanded}
                            onCheck={(checked) => setChecked(checked)}
                            onExpand={(expanded) => setExpanded(expanded)}
                            icons={{
                                check: <i className="bi bi-check-square-fill text-primary" />,
                                uncheck: <i className="bi bi-square" />,
                                halfCheck: <i className="bi bi-dash-square-fill text-primary" />,
                                expandClose: <i className="bi bi-chevron-right" />,
                                expandOpen: <i className="bi bi-chevron-down" />,
                                leaf: <i className="bi bi-person-fill" />,
                            }}
                        />
                    ) : (
                        <div className="d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
                            <p className="text-muted">No participants available.</p>
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    );
};

export default AssignRuleModal;