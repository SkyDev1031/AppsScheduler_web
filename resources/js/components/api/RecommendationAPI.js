import { _REQUEST, _REQ_METHOD } from './index';

/**
 * Recommendation APIs
 */
export const getRecommendationsApi = (id = 0) =>
    _REQUEST('recommendations', _REQ_METHOD.GET, { researcher_id: id });

export const getRecommendationApi = (id) =>
    _REQUEST(`recommendations/${id}`, _REQ_METHOD.GET);

export const createRecommendationApi = (data) =>
    _REQUEST('recommendations', _REQ_METHOD.POST, data);

export const updateRecommendationApi = (id, data) =>
    _REQUEST(`recommendations/${id}`, _REQ_METHOD.PUT, data);

export const deleteRecommendationApi = (id) =>
    _REQUEST(`recommendations/${id}`, _REQ_METHOD.DELETE);

export const sendToParticipantsApi = (participants, payload) => 
    _REQUEST('recommendations/send-to-participants', _REQ_METHOD.POST, {participants, payload});