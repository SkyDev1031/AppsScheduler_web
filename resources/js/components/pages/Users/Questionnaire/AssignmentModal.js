import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getStudiesWithParticipants } from '../../../api/StudyAPI'; // or your path
import { assignQuestionnaire } from '../../../api/QuestionnaireAPI'; // update this path as needed
import { useGlobalContext } from '../../../contexts';
import { toast_success } from '../../../utils';

const AssignmentModal = ({ visible, onHide, questionnaire }) => {
    const [treeData, setTreeData] = useState([]);
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState([]);
    const { setLoading } = useGlobalContext();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await getStudiesWithParticipants();
                if (response && response.data) {
                    const nodes = response.data.map((study) => ({
                        value: study.studyGroup,
                        label: study.studyGroup,
                        children: study.participants.map((participant) => ({
                            value: participant.id,
                            label: participant.userID,
                        })),
                    }));
                    setTreeData(nodes);
                    setExpanded(nodes.map(n => n.value));
                } else {
                    setTreeData([]);
                    setExpanded([]);
                }
            } catch (err) {
                console.error('Error fetching participant data:', err);
                setTreeData([]);
                setExpanded([]);
            } finally {
                setLoading(false)
            }
        };

        if (visible) {
            fetchData();
            setChecked([]);
        }
    }, [visible]);

    const handleAssign = async () => {
        if (!questionnaire) return;
        setLoading(true);
        try {
            const res = await assignQuestionnaire(questionnaire.id, checked);
            console.log("assignRes", res)
            toast_success(res.message)
            setLoading(false);
            onHide();
        } catch (err) {
            console.error('Assignment failed:', err);
        }
    };

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            style={{ width: '50vw', minHeight: '400px' }}
            header={`Assign Questionnaire: ${questionnaire?.title || ''}`}
            modal
            className="assignment-modal"
        >
            <div className="modal-content-wrapper" style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <div className="tree-container" style={{
                    flex: 1,
                    overflow: 'auto',
                    marginBottom: '1rem'
                }}>
                    {treeData.length > 0 ? (
                        <CheckboxTree
                            nodes={treeData}
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

                <div className="d-flex justify-content-end" style={{
                    paddingTop: '1rem',
                    borderTop: '1px solid #dee2e6'
                }}>
                    <button
                        className="btn btn-secondary me-2"
                        onClick={onHide}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleAssign}
                        disabled={checked.length === 0}
                    >
                        Assign
                    </button>
                </div>
            </div>
        </Dialog>
    );
};

export default AssignmentModal;
