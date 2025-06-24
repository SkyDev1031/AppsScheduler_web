import { _REQUEST, _REQ_METHOD } from './index';


export const getAppPackagesByAppNameApi = () => 
    _REQUEST('packages/appname', _REQ_METHOD.POST);
export const getAppPackagesByAppPackageApi = () => 
    _REQUEST('packages/apppackage', _REQ_METHOD.POST);
