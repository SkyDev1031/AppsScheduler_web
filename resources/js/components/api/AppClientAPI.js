import { _REQUEST_APP, _REQ_METHOD } from './index';

/**
 * App Usage Information APIs
 */
export const getAppUsageInfosApi = () =>
    _REQUEST_APP('appUseInfos', _REQ_METHOD.POST);

export const getAppUsageDurationApi = (
    phonenumber = "",
    startDate = "",
    endDate = "",
    studyId = 0 
) => _REQUEST_APP('appUseInfoDuration', _REQ_METHOD.POST, {
    phonenumber,
    startDate,
    endDate,
    studyId
});

export const getAppUsageFreqApi = (
    phonenumber = "",
    startDate = "",
    endDate = "",
    studyId = 0
) => _REQUEST_APP('appUseInfoFreq', _REQ_METHOD.POST, {
    phonenumber,
    startDate,
    endDate,
    studyId
});

/**
 * Phone Usage Information APIs
 */
export const getPhoneUsageInfosApi = () =>
    _REQUEST_APP('phoneuseinfos', _REQ_METHOD.POST);

export const getPhoneUsageInfosByPhoneNumberApi = (phonenumber = "") =>
    _REQUEST_APP('phoneUseInfoByPhonenumber', _REQ_METHOD.POST, {
        phonenumber
    });

/**
 * Data Deletion APIs
 */
export const deleteAppUseInfosApi = (phonenumber = "") =>
    _REQUEST_APP('deleteAppInfoByPhonenumber', _REQ_METHOD.POST, {
        phonenumber
    });

export const deletePhoneUseInfosApi = (phonenumber = "") =>
    _REQUEST_APP('deletepPhoneInfoByPhonenumber', _REQ_METHOD.POST, {
        phonenumber
    });

// Note: downloadCSV is already imported from './index' at the top
export { downloadCSV } from './index';
