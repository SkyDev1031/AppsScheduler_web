import { _REQUEST, _REQ_METHOD } from './index';


export const getAppPackagesApi = () => 
    _REQUEST('packages', _REQ_METHOD.POST);
