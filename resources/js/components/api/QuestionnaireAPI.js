import { _REQUEST, _REQ_METHOD } from './index';

/**
 * Questionnaire APIs
 */
export const getAllQuestionnaires = () =>
    _REQUEST('questionnaires', _REQ_METHOD.GET);

export const createQuestionnaire = (payload) =>
    _REQUEST('questionnaires', _REQ_METHOD.POST, payload);
export const getQuestionnaire = (id) =>
    _REQUEST(`questionnaires/${id}`, _REQ_METHOD.GET);

export const updateQuestionnaire = (id, payload) =>
    _REQUEST(`questionnaires/${id}`, _REQ_METHOD.PUT, payload);

export const deleteQuestionnaire = (id) =>
    _REQUEST(`questionnaires/${id}`, _REQ_METHOD.DELETE);

export const assignQuestionnaire = (id, participants) =>
    _REQUEST(`questionnaires/${id}/assign`, _REQ_METHOD.POST, { participants });

export const getResponses = (id) =>
    _REQUEST(`questionnaires/${id}/responses`, _REQ_METHOD.GET);

export const getQuestionnaireSummary = (filters) =>
    _REQUEST('questionnaires/summary', _REQ_METHOD.POST, filters); // if using POST
