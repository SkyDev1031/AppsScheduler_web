import { _REQUEST, _REQ_METHOD } from './index';

/**
 * Schedule APIs
 */
export const getSchedulesApi = () =>
    _REQUEST('schedules', _REQ_METHOD.GET);

export const getScheduleApi = (id) =>
    _REQUEST(`schedules/${id}`, _REQ_METHOD.GET);

export const createScheduleApi = (data) =>
    _REQUEST('schedules', _REQ_METHOD.POST, data);

export const updateScheduleApi = (id, data) =>
    _REQUEST(`schedules/${id}`, _REQ_METHOD.PUT, data);

export const deleteScheduleApi = (id) =>
    _REQUEST(`schedules/${id}`, _REQ_METHOD.DELETE);
