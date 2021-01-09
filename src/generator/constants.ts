import { OperationMethod } from 'generator/types';

export const Constants = {
  AXIOS_IMPORT_NAME: 'axios',
  AXIOS_PACKAGE_NAME: 'axios',
  AXIOS_REQUEST_CONFIG_PARAMETER_NAME: 'config',
  AXIOS_REQUEST_CONFIG_TYPE: 'AxiosRequestConfig',
  PARAMETERS_PARAMETER_NAME: 'parameters',
  REQUEST_BODY_PARAMETER_NAME: 'requestBody',
  SUPPORTED_MEDIA_TYPES: [
    '*/*',
    'application/json',
    'application/octet-stream',
    'application/x-yaml',
  ],
  SUPPORTED_OPERATION_METHODS: [
    'get',
    'post',
    'put',
    'delete',
  ] as readonly OperationMethod[],
};
