import { _REQUEST, _REQ_METHOD } from './index';

// GET all studies
export const getStudies = (researcher_id) => _REQUEST('studies', _REQ_METHOD.GET, { researcher_id });

// GET a single study by ID
export const getStudyById = (id) => _REQUEST(`studies/${id}`, _REQ_METHOD.GET);

// CREATE a new study
export const createStudy = (data) => _REQUEST('studies', _REQ_METHOD.POST, data);

// UPDATE a study by ID
export const updateStudy = (id, data) => _REQUEST(`studies/${id}`, _REQ_METHOD.PUT, data);

// DELETE a study by ID
export const deleteStudy = (id) => _REQUEST(`studies/${id}`, _REQ_METHOD.DELETE);

// INVITE a Participant to study by ID
export const inviteParticipant = (data) => _REQUEST(`study-requests`, _REQ_METHOD.POST, data);

// DELETE a Participant Requeset by ID
export const cancelInviteParticipant = (data) => _REQUEST(`study-requests/cancel`, _REQ_METHOD.POST, data);

