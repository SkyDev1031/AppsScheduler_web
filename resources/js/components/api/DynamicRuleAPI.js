import { _REQUEST, _REQ_METHOD } from './index';

/**
 * Dynamic Rule APIs
 */
export const getRulesByResearcherApi = (researcherId = 0) =>
    _REQUEST(`rules/researcher/${researcherId}`, _REQ_METHOD.GET);

export const getRulesForParticipantApi = (participantId) =>
    _REQUEST(`rules/participant/${participantId}`, _REQ_METHOD.GET);

export const createRuleApi = (data) =>
    _REQUEST('rules/create', _REQ_METHOD.POST, data);

export const updateRuleApi = (id, data) =>
    _REQUEST(`rules/${id}`, _REQ_METHOD.PUT, data);

export const deleteRuleApi = (id) =>
    _REQUEST(`rules/${id}`, _REQ_METHOD.DELETE);

export const assignRuleToParticipantApi = ({ rule_id, researcher_id, participant_id }) =>
    _REQUEST('rules/assign', _REQ_METHOD.POST, { rule_id, researcher_id, participant_id });

export const sendRulesToParticipantsApi = (participants, rules) =>
    _REQUEST('rules/send-to-participants', _REQ_METHOD.POST, { participants, payload: rules });
