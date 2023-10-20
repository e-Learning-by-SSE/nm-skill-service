/* tslint:disable */
/* eslint-disable */
/**
 * MLS2 API
 * Central API
 *
 * OpenAPI spec version: 0.7.2
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import globalAxios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
import { EquipmentFilesEquipmentFilesWrite } from '../models';
import { EquipmentFilesJsonld } from '../models';
import { EquipmentFilesJsonldEquipmentFilesItemRead } from '../models';
import { EquipmentFilesJsonldEquipmentFilesWrite } from '../models';
import { InlineResponse20013 } from '../models';
/**
 * EquipmentFilesApi - axios parameter creator
 * @export
 */
export const EquipmentFilesApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Removes the EquipmentFiles resource.
         * @summary Removes the EquipmentFiles resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteEquipmentFilesItem: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling deleteEquipmentFilesItem.');
            }
            const localVarPath = `/mls-api/equipment-files/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication oauth required
            // oauth required
            if (configuration && configuration.accessToken) {
                const localVarAccessTokenValue = typeof configuration.accessToken === 'function'
                    ? await configuration.accessToken("oauth", [])
                    : await configuration.accessToken;
                localVarHeaderParameter["Authorization"] = "Bearer " + localVarAccessTokenValue;
            }

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * Retrieves the collection of EquipmentFiles resources.
         * @summary Retrieves the collection of EquipmentFiles resources.
         * @param {number} [page] The collection page number
         * @param {number} [itemsPerPage] The number of items per page
         * @param {boolean} [pagination] Enable or disable pagination
         * @param {string} [equipment] 
         * @param {Array<string>} [equipment] 
         * @param {number} [mls1Id] 
         * @param {Array<number>} [mls1Id] 
         * @param {string} [fileResource] 
         * @param {Array<string>} [fileResource] 
         * @param {string} [fileResourceOriginalFilename] 
         * @param {string} [fileResourceMimeType] 
         * @param {Array<string>} [fileResourceMimeType] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getEquipmentFilesCollection: async (page?: number, itemsPerPage?: number, pagination?: boolean, equipment?: string, equipment?: Array<string>, mls1Id?: number, mls1Id?: Array<number>, fileResource?: string, fileResource?: Array<string>, fileResourceOriginalFilename?: string, fileResourceMimeType?: string, fileResourceMimeType?: Array<string>, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/mls-api/equipment-files`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication oauth required
            // oauth required
            if (configuration && configuration.accessToken) {
                const localVarAccessTokenValue = typeof configuration.accessToken === 'function'
                    ? await configuration.accessToken("oauth", [])
                    : await configuration.accessToken;
                localVarHeaderParameter["Authorization"] = "Bearer " + localVarAccessTokenValue;
            }

            if (page !== undefined) {
                localVarQueryParameter['page'] = page;
            }

            if (itemsPerPage !== undefined) {
                localVarQueryParameter['itemsPerPage'] = itemsPerPage;
            }

            if (pagination !== undefined) {
                localVarQueryParameter['pagination'] = pagination;
            }

            if (equipment !== undefined) {
                localVarQueryParameter['equipment'] = equipment;
            }

            if (equipment) {
                localVarQueryParameter['equipment[]'] = equipment;
            }

            if (mls1Id !== undefined) {
                localVarQueryParameter['mls1Id'] = mls1Id;
            }

            if (mls1Id) {
                localVarQueryParameter['mls1Id[]'] = mls1Id;
            }

            if (fileResource !== undefined) {
                localVarQueryParameter['fileResource'] = fileResource;
            }

            if (fileResource) {
                localVarQueryParameter['fileResource[]'] = fileResource;
            }

            if (fileResourceOriginalFilename !== undefined) {
                localVarQueryParameter['fileResource.originalFilename'] = fileResourceOriginalFilename;
            }

            if (fileResourceMimeType !== undefined) {
                localVarQueryParameter['fileResource.mimeType'] = fileResourceMimeType;
            }

            if (fileResourceMimeType) {
                localVarQueryParameter['fileResource.mimeType[]'] = fileResourceMimeType;
            }

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * Retrieves a EquipmentFiles resource.
         * @summary Retrieves a EquipmentFiles resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getEquipmentFilesItem: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling getEquipmentFilesItem.');
            }
            const localVarPath = `/mls-api/equipment-files/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication oauth required
            // oauth required
            if (configuration && configuration.accessToken) {
                const localVarAccessTokenValue = typeof configuration.accessToken === 'function'
                    ? await configuration.accessToken("oauth", [])
                    : await configuration.accessToken;
                localVarHeaderParameter["Authorization"] = "Bearer " + localVarAccessTokenValue;
            }

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * Creates a EquipmentFiles resource.
         * @summary Creates a EquipmentFiles resource.
         * @param {EquipmentFilesJsonldEquipmentFilesWrite} body The new EquipmentFiles resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        postEquipmentFilesCollection: async (body: EquipmentFilesJsonldEquipmentFilesWrite, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling postEquipmentFilesCollection.');
            }
            const localVarPath = `/mls-api/equipment-files`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication oauth required
            // oauth required
            if (configuration && configuration.accessToken) {
                const localVarAccessTokenValue = typeof configuration.accessToken === 'function'
                    ? await configuration.accessToken("oauth", [])
                    : await configuration.accessToken;
                localVarHeaderParameter["Authorization"] = "Bearer " + localVarAccessTokenValue;
            }

            localVarHeaderParameter['Content-Type'] = 'application/ld+json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * Creates a EquipmentFiles resource.
         * @summary Creates a EquipmentFiles resource.
         * @param {EquipmentFilesJsonldEquipmentFilesWrite} body The new EquipmentFiles resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        postEquipmentFilesCollection: async (body: EquipmentFilesJsonldEquipmentFilesWrite, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling postEquipmentFilesCollection.');
            }
            const localVarPath = `/mls-api/equipment-files`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication oauth required
            // oauth required
            if (configuration && configuration.accessToken) {
                const localVarAccessTokenValue = typeof configuration.accessToken === 'function'
                    ? await configuration.accessToken("oauth", [])
                    : await configuration.accessToken;
                localVarHeaderParameter["Authorization"] = "Bearer " + localVarAccessTokenValue;
            }

            localVarHeaderParameter['Content-Type'] = 'application/ld+json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * EquipmentFilesApi - functional programming interface
 * @export
 */
export const EquipmentFilesApiFp = function(configuration?: Configuration) {
    return {
        /**
         * Removes the EquipmentFiles resource.
         * @summary Removes the EquipmentFiles resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteEquipmentFilesItem(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<void>>> {
            const localVarAxiosArgs = await EquipmentFilesApiAxiosParamCreator(configuration).deleteEquipmentFilesItem(id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Retrieves the collection of EquipmentFiles resources.
         * @summary Retrieves the collection of EquipmentFiles resources.
         * @param {number} [page] The collection page number
         * @param {number} [itemsPerPage] The number of items per page
         * @param {boolean} [pagination] Enable or disable pagination
         * @param {string} [equipment] 
         * @param {Array<string>} [equipment] 
         * @param {number} [mls1Id] 
         * @param {Array<number>} [mls1Id] 
         * @param {string} [fileResource] 
         * @param {Array<string>} [fileResource] 
         * @param {string} [fileResourceOriginalFilename] 
         * @param {string} [fileResourceMimeType] 
         * @param {Array<string>} [fileResourceMimeType] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getEquipmentFilesCollection(page?: number, itemsPerPage?: number, pagination?: boolean, equipment?: string, equipment?: Array<string>, mls1Id?: number, mls1Id?: Array<number>, fileResource?: string, fileResource?: Array<string>, fileResourceOriginalFilename?: string, fileResourceMimeType?: string, fileResourceMimeType?: Array<string>, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20013>>> {
            const localVarAxiosArgs = await EquipmentFilesApiAxiosParamCreator(configuration).getEquipmentFilesCollection(page, itemsPerPage, pagination, equipment, equipment, mls1Id, mls1Id, fileResource, fileResource, fileResourceOriginalFilename, fileResourceMimeType, fileResourceMimeType, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Retrieves a EquipmentFiles resource.
         * @summary Retrieves a EquipmentFiles resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getEquipmentFilesItem(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<EquipmentFilesJsonldEquipmentFilesItemRead>>> {
            const localVarAxiosArgs = await EquipmentFilesApiAxiosParamCreator(configuration).getEquipmentFilesItem(id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Creates a EquipmentFiles resource.
         * @summary Creates a EquipmentFiles resource.
         * @param {EquipmentFilesJsonldEquipmentFilesWrite} body The new EquipmentFiles resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postEquipmentFilesCollection(body: EquipmentFilesJsonldEquipmentFilesWrite, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<EquipmentFilesJsonld>>> {
            const localVarAxiosArgs = await EquipmentFilesApiAxiosParamCreator(configuration).postEquipmentFilesCollection(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Creates a EquipmentFiles resource.
         * @summary Creates a EquipmentFiles resource.
         * @param {EquipmentFilesJsonldEquipmentFilesWrite} body The new EquipmentFiles resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postEquipmentFilesCollection(body: EquipmentFilesJsonldEquipmentFilesWrite, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<EquipmentFilesJsonld>>> {
            const localVarAxiosArgs = await EquipmentFilesApiAxiosParamCreator(configuration).postEquipmentFilesCollection(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * EquipmentFilesApi - factory interface
 * @export
 */
export const EquipmentFilesApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * Removes the EquipmentFiles resource.
         * @summary Removes the EquipmentFiles resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteEquipmentFilesItem(id: string, options?: AxiosRequestConfig): Promise<AxiosResponse<void>> {
            return EquipmentFilesApiFp(configuration).deleteEquipmentFilesItem(id, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieves the collection of EquipmentFiles resources.
         * @summary Retrieves the collection of EquipmentFiles resources.
         * @param {number} [page] The collection page number
         * @param {number} [itemsPerPage] The number of items per page
         * @param {boolean} [pagination] Enable or disable pagination
         * @param {string} [equipment] 
         * @param {Array<string>} [equipment] 
         * @param {number} [mls1Id] 
         * @param {Array<number>} [mls1Id] 
         * @param {string} [fileResource] 
         * @param {Array<string>} [fileResource] 
         * @param {string} [fileResourceOriginalFilename] 
         * @param {string} [fileResourceMimeType] 
         * @param {Array<string>} [fileResourceMimeType] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getEquipmentFilesCollection(page?: number, itemsPerPage?: number, pagination?: boolean, equipment?: string, equipment?: Array<string>, mls1Id?: number, mls1Id?: Array<number>, fileResource?: string, fileResource?: Array<string>, fileResourceOriginalFilename?: string, fileResourceMimeType?: string, fileResourceMimeType?: Array<string>, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20013>> {
            return EquipmentFilesApiFp(configuration).getEquipmentFilesCollection(page, itemsPerPage, pagination, equipment, equipment, mls1Id, mls1Id, fileResource, fileResource, fileResourceOriginalFilename, fileResourceMimeType, fileResourceMimeType, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieves a EquipmentFiles resource.
         * @summary Retrieves a EquipmentFiles resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getEquipmentFilesItem(id: string, options?: AxiosRequestConfig): Promise<AxiosResponse<EquipmentFilesJsonldEquipmentFilesItemRead>> {
            return EquipmentFilesApiFp(configuration).getEquipmentFilesItem(id, options).then((request) => request(axios, basePath));
        },
        /**
         * Creates a EquipmentFiles resource.
         * @summary Creates a EquipmentFiles resource.
         * @param {EquipmentFilesJsonldEquipmentFilesWrite} body The new EquipmentFiles resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postEquipmentFilesCollection(body: EquipmentFilesJsonldEquipmentFilesWrite, options?: AxiosRequestConfig): Promise<AxiosResponse<EquipmentFilesJsonld>> {
            return EquipmentFilesApiFp(configuration).postEquipmentFilesCollection(body, options).then((request) => request(axios, basePath));
        },
        /**
         * Creates a EquipmentFiles resource.
         * @summary Creates a EquipmentFiles resource.
         * @param {EquipmentFilesJsonldEquipmentFilesWrite} body The new EquipmentFiles resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postEquipmentFilesCollection(body: EquipmentFilesJsonldEquipmentFilesWrite, options?: AxiosRequestConfig): Promise<AxiosResponse<EquipmentFilesJsonld>> {
            return EquipmentFilesApiFp(configuration).postEquipmentFilesCollection(body, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * EquipmentFilesApi - object-oriented interface
 * @export
 * @class EquipmentFilesApi
 * @extends {BaseAPI}
 */
export class EquipmentFilesApi extends BaseAPI {
    /**
     * Removes the EquipmentFiles resource.
     * @summary Removes the EquipmentFiles resource.
     * @param {string} id Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EquipmentFilesApi
     */
    public async deleteEquipmentFilesItem(id: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<void>> {
        return EquipmentFilesApiFp(this.configuration).deleteEquipmentFilesItem(id, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Retrieves the collection of EquipmentFiles resources.
     * @summary Retrieves the collection of EquipmentFiles resources.
     * @param {number} [page] The collection page number
     * @param {number} [itemsPerPage] The number of items per page
     * @param {boolean} [pagination] Enable or disable pagination
     * @param {string} [equipment] 
     * @param {Array<string>} [equipment] 
     * @param {number} [mls1Id] 
     * @param {Array<number>} [mls1Id] 
     * @param {string} [fileResource] 
     * @param {Array<string>} [fileResource] 
     * @param {string} [fileResourceOriginalFilename] 
     * @param {string} [fileResourceMimeType] 
     * @param {Array<string>} [fileResourceMimeType] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EquipmentFilesApi
     */
    public async getEquipmentFilesCollection(page?: number, itemsPerPage?: number, pagination?: boolean, equipment?: string, equipment?: Array<string>, mls1Id?: number, mls1Id?: Array<number>, fileResource?: string, fileResource?: Array<string>, fileResourceOriginalFilename?: string, fileResourceMimeType?: string, fileResourceMimeType?: Array<string>, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20013>> {
        return EquipmentFilesApiFp(this.configuration).getEquipmentFilesCollection(page, itemsPerPage, pagination, equipment, equipment, mls1Id, mls1Id, fileResource, fileResource, fileResourceOriginalFilename, fileResourceMimeType, fileResourceMimeType, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Retrieves a EquipmentFiles resource.
     * @summary Retrieves a EquipmentFiles resource.
     * @param {string} id Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EquipmentFilesApi
     */
    public async getEquipmentFilesItem(id: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<EquipmentFilesJsonldEquipmentFilesItemRead>> {
        return EquipmentFilesApiFp(this.configuration).getEquipmentFilesItem(id, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Creates a EquipmentFiles resource.
     * @summary Creates a EquipmentFiles resource.
     * @param {EquipmentFilesJsonldEquipmentFilesWrite} body The new EquipmentFiles resource
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EquipmentFilesApi
     */
    public async postEquipmentFilesCollection(body: EquipmentFilesJsonldEquipmentFilesWrite, options?: AxiosRequestConfig) : Promise<AxiosResponse<EquipmentFilesJsonld>> {
        return EquipmentFilesApiFp(this.configuration).postEquipmentFilesCollection(body, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Creates a EquipmentFiles resource.
     * @summary Creates a EquipmentFiles resource.
     * @param {EquipmentFilesJsonldEquipmentFilesWrite} body The new EquipmentFiles resource
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EquipmentFilesApi
     */
    public async postEquipmentFilesCollection(body: EquipmentFilesJsonldEquipmentFilesWrite, options?: AxiosRequestConfig) : Promise<AxiosResponse<EquipmentFilesJsonld>> {
        return EquipmentFilesApiFp(this.configuration).postEquipmentFilesCollection(body, options).then((request) => request(this.axios, this.basePath));
    }
}
