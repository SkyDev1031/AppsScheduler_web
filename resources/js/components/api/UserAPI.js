import { _REQUEST, _REQ_METHOD } from './index';

export const getUsersApi = () => _REQUEST('users', _REQ_METHOD.POST);
export const allowUserApi = (id) => _REQUEST('users/allow', _REQ_METHOD.POST, { id });
export const blockUserApi = (id) => _REQUEST('users/block', _REQ_METHOD.POST, { id });
export const deleteUserApi = (id) => _REQUEST('users/delete', _REQ_METHOD.POST, { id });