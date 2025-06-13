import { _REQUEST, _REQ_METHOD } from './index';

/**
 * App Usage Information APIs
 */
// Notification APIs
export const getCategoriesApi = (user_id = 0) => _REQUEST('categories', _REQ_METHOD.GET, {user_id});

export const createCategoryApi = (data) => _REQUEST('categories', _REQ_METHOD.POST, data);

export const updateCategoryApi = (id, data) => _REQUEST(`categories/${id}`, _REQ_METHOD.PUT, data);

export const deleteCategoryApi = (id) => _REQUEST(`categories/${id}`, _REQ_METHOD.DELETE);
