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
import { ConfigurationsConfigurationsItemWrite } from '../models';
import { ConfigurationsConfigurationsWrite } from '../models';
import { ConfigurationsJsonld } from '../models';
import { ConfigurationsJsonldConfigurationsItemRead } from '../models';
import { ConfigurationsJsonldConfigurationsItemWrite } from '../models';
import { ConfigurationsJsonldConfigurationsWrite } from '../models';
import { InlineResponse2006 } from '../models';
/**
 * ConfigurationsApi - axios parameter creator
 * @export
 */
export const ConfigurationsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Removes the Configurations resource.
         * @summary Removes the Configurations resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteConfigurationsItem: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling deleteConfigurationsItem.');
            }
            const localVarPath = `/mls-api/configurations/{id}`
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
         * Retrieves the collection of Configurations resources.
         * @summary Retrieves the collection of Configurations resources.
         * @param {number} [page] The collection page number
         * @param {number} [itemsPerPage] The number of items per page
         * @param {boolean} [pagination] Enable or disable pagination
         * @param {string} [name] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getConfigurationsCollection: async (page?: number, itemsPerPage?: number, pagination?: boolean, name?: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/mls-api/configurations`;
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

            if (name !== undefined) {
                localVarQueryParameter['name'] = name;
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
         * Retrieves a Configurations resource.
         * @summary Retrieves a Configurations resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getConfigurationsItem: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling getConfigurationsItem.');
            }
            const localVarPath = `/mls-api/configurations/{id}`
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
         * Creates a Configurations resource.
         * @summary Creates a Configurations resource.
         * @param {ConfigurationsJsonldConfigurationsWrite} body The new Configurations resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        postConfigurationsCollection: async (body: ConfigurationsJsonldConfigurationsWrite, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling postConfigurationsCollection.');
            }
            const localVarPath = `/mls-api/configurations`;
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
         * Creates a Configurations resource.
         * @summary Creates a Configurations resource.
         * @param {ConfigurationsJsonldConfigurationsWrite} body The new Configurations resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        postConfigurationsCollection: async (body: ConfigurationsJsonldConfigurationsWrite, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling postConfigurationsCollection.');
            }
            const localVarPath = `/mls-api/configurations`;
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
         * Replaces the Configurations resource.
         * @summary Replaces the Configurations resource.
         * @param {ConfigurationsJsonldConfigurationsItemWrite} body The updated Configurations resource
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putConfigurationsItem: async (body: ConfigurationsJsonldConfigurationsItemWrite, id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling putConfigurationsItem.');
            }
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling putConfigurationsItem.');
            }
            const localVarPath = `/mls-api/configurations/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'PUT', ...baseOptions, ...options};
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
         * Replaces the Configurations resource.
         * @summary Replaces the Configurations resource.
         * @param {ConfigurationsJsonldConfigurationsItemWrite} body The updated Configurations resource
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putConfigurationsItem: async (body: ConfigurationsJsonldConfigurationsItemWrite, id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling putConfigurationsItem.');
            }
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling putConfigurationsItem.');
            }
            const localVarPath = `/mls-api/configurations/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'PUT', ...baseOptions, ...options};
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
 * ConfigurationsApi - functional programming interface
 * @export
 */
export const ConfigurationsApiFp = function(configuration?: Configuration) {
    return {
        /**
         * Removes the Configurations resource.
         * @summary Removes the Configurations resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteConfigurationsItem(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<void>>> {
            const localVarAxiosArgs = await ConfigurationsApiAxiosParamCreator(configuration).deleteConfigurationsItem(id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Retrieves the collection of Configurations resources.
         * @summary Retrieves the collection of Configurations resources.
         * @param {number} [page] The collection page number
         * @param {number} [itemsPerPage] The number of items per page
         * @param {boolean} [pagination] Enable or disable pagination
         * @param {string} [name] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getConfigurationsCollection(page?: number, itemsPerPage?: number, pagination?: boolean, name?: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse2006>>> {
            const localVarAxiosArgs = await ConfigurationsApiAxiosParamCreator(configuration).getConfigurationsCollection(page, itemsPerPage, pagination, name, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Retrieves a Configurations resource.
         * @summary Retrieves a Configurations resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getConfigurationsItem(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<ConfigurationsJsonldConfigurationsItemRead>>> {
            const localVarAxiosArgs = await ConfigurationsApiAxiosParamCreator(configuration).getConfigurationsItem(id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Creates a Configurations resource.
         * @summary Creates a Configurations resource.
         * @param {ConfigurationsJsonldConfigurationsWrite} body The new Configurations resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postConfigurationsCollection(body: ConfigurationsJsonldConfigurationsWrite, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<ConfigurationsJsonld>>> {
            const localVarAxiosArgs = await ConfigurationsApiAxiosParamCreator(configuration).postConfigurationsCollection(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Creates a Configurations resource.
         * @summary Creates a Configurations resource.
         * @param {ConfigurationsJsonldConfigurationsWrite} body The new Configurations resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postConfigurationsCollection(body: ConfigurationsJsonldConfigurationsWrite, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<ConfigurationsJsonld>>> {
            const localVarAxiosArgs = await ConfigurationsApiAxiosParamCreator(configuration).postConfigurationsCollection(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Replaces the Configurations resource.
         * @summary Replaces the Configurations resource.
         * @param {ConfigurationsJsonldConfigurationsItemWrite} body The updated Configurations resource
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async putConfigurationsItem(body: ConfigurationsJsonldConfigurationsItemWrite, id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<ConfigurationsJsonld>>> {
            const localVarAxiosArgs = await ConfigurationsApiAxiosParamCreator(configuration).putConfigurationsItem(body, id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Replaces the Configurations resource.
         * @summary Replaces the Configurations resource.
         * @param {ConfigurationsJsonldConfigurationsItemWrite} body The updated Configurations resource
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async putConfigurationsItem(body: ConfigurationsJsonldConfigurationsItemWrite, id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<ConfigurationsJsonld>>> {
            const localVarAxiosArgs = await ConfigurationsApiAxiosParamCreator(configuration).putConfigurationsItem(body, id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * ConfigurationsApi - factory interface
 * @export
 */
export const ConfigurationsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * Removes the Configurations resource.
         * @summary Removes the Configurations resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteConfigurationsItem(id: string, options?: AxiosRequestConfig): Promise<AxiosResponse<void>> {
            return ConfigurationsApiFp(configuration).deleteConfigurationsItem(id, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieves the collection of Configurations resources.
         * @summary Retrieves the collection of Configurations resources.
         * @param {number} [page] The collection page number
         * @param {number} [itemsPerPage] The number of items per page
         * @param {boolean} [pagination] Enable or disable pagination
         * @param {string} [name] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getConfigurationsCollection(page?: number, itemsPerPage?: number, pagination?: boolean, name?: string, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse2006>> {
            return ConfigurationsApiFp(configuration).getConfigurationsCollection(page, itemsPerPage, pagination, name, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieves a Configurations resource.
         * @summary Retrieves a Configurations resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getConfigurationsItem(id: string, options?: AxiosRequestConfig): Promise<AxiosResponse<ConfigurationsJsonldConfigurationsItemRead>> {
            return ConfigurationsApiFp(configuration).getConfigurationsItem(id, options).then((request) => request(axios, basePath));
        },
        /**
         * Creates a Configurations resource.
         * @summary Creates a Configurations resource.
         * @param {ConfigurationsJsonldConfigurationsWrite} body The new Configurations resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postConfigurationsCollection(body: ConfigurationsJsonldConfigurationsWrite, options?: AxiosRequestConfig): Promise<AxiosResponse<ConfigurationsJsonld>> {
            return ConfigurationsApiFp(configuration).postConfigurationsCollection(body, options).then((request) => request(axios, basePath));
        },
        /**
         * Creates a Configurations resource.
         * @summary Creates a Configurations resource.
         * @param {ConfigurationsJsonldConfigurationsWrite} body The new Configurations resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postConfigurationsCollection(body: ConfigurationsJsonldConfigurationsWrite, options?: AxiosRequestConfig): Promise<AxiosResponse<ConfigurationsJsonld>> {
            return ConfigurationsApiFp(configuration).postConfigurationsCollection(body, options).then((request) => request(axios, basePath));
        },
        /**
         * Replaces the Configurations resource.
         * @summary Replaces the Configurations resource.
         * @param {ConfigurationsJsonldConfigurationsItemWrite} body The updated Configurations resource
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async putConfigurationsItem(body: ConfigurationsJsonldConfigurationsItemWrite, id: string, options?: AxiosRequestConfig): Promise<AxiosResponse<ConfigurationsJsonld>> {
            return ConfigurationsApiFp(configuration).putConfigurationsItem(body, id, options).then((request) => request(axios, basePath));
        },
        /**
         * Replaces the Configurations resource.
         * @summary Replaces the Configurations resource.
         * @param {ConfigurationsJsonldConfigurationsItemWrite} body The updated Configurations resource
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async putConfigurationsItem(body: ConfigurationsJsonldConfigurationsItemWrite, id: string, options?: AxiosRequestConfig): Promise<AxiosResponse<ConfigurationsJsonld>> {
            return ConfigurationsApiFp(configuration).putConfigurationsItem(body, id, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * ConfigurationsApi - object-oriented interface
 * @export
 * @class ConfigurationsApi
 * @extends {BaseAPI}
 */
export class ConfigurationsApi extends BaseAPI {
    /**
     * Removes the Configurations resource.
     * @summary Removes the Configurations resource.
     * @param {string} id Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ConfigurationsApi
     */
    public async deleteConfigurationsItem(id: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<void>> {
        return ConfigurationsApiFp(this.configuration).deleteConfigurationsItem(id, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Retrieves the collection of Configurations resources.
     * @summary Retrieves the collection of Configurations resources.
     * @param {number} [page] The collection page number
     * @param {number} [itemsPerPage] The number of items per page
     * @param {boolean} [pagination] Enable or disable pagination
     * @param {string} [name] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ConfigurationsApi
     */
    public async getConfigurationsCollection(page?: number, itemsPerPage?: number, pagination?: boolean, name?: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse2006>> {
        return ConfigurationsApiFp(this.configuration).getConfigurationsCollection(page, itemsPerPage, pagination, name, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Retrieves a Configurations resource.
     * @summary Retrieves a Configurations resource.
     * @param {string} id Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ConfigurationsApi
     */
    public async getConfigurationsItem(id: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<ConfigurationsJsonldConfigurationsItemRead>> {
        return ConfigurationsApiFp(this.configuration).getConfigurationsItem(id, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Creates a Configurations resource.
     * @summary Creates a Configurations resource.
     * @param {ConfigurationsJsonldConfigurationsWrite} body The new Configurations resource
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ConfigurationsApi
     */
    public async postConfigurationsCollection(body: ConfigurationsJsonldConfigurationsWrite, options?: AxiosRequestConfig) : Promise<AxiosResponse<ConfigurationsJsonld>> {
        return ConfigurationsApiFp(this.configuration).postConfigurationsCollection(body, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Creates a Configurations resource.
     * @summary Creates a Configurations resource.
     * @param {ConfigurationsJsonldConfigurationsWrite} body The new Configurations resource
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ConfigurationsApi
     */
    public async postConfigurationsCollection(body: ConfigurationsJsonldConfigurationsWrite, options?: AxiosRequestConfig) : Promise<AxiosResponse<ConfigurationsJsonld>> {
        return ConfigurationsApiFp(this.configuration).postConfigurationsCollection(body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Replaces the Configurations resource.
     * @summary Replaces the Configurations resource.
     * @param {ConfigurationsJsonldConfigurationsItemWrite} body The updated Configurations resource
     * @param {string} id Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ConfigurationsApi
     */
    public async putConfigurationsItem(body: ConfigurationsJsonldConfigurationsItemWrite, id: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<ConfigurationsJsonld>> {
        return ConfigurationsApiFp(this.configuration).putConfigurationsItem(body, id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Replaces the Configurations resource.
     * @summary Replaces the Configurations resource.
     * @param {ConfigurationsJsonldConfigurationsItemWrite} body The updated Configurations resource
     * @param {string} id Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ConfigurationsApi
     */
    public async putConfigurationsItem(body: ConfigurationsJsonldConfigurationsItemWrite, id: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<ConfigurationsJsonld>> {
        return ConfigurationsApiFp(this.configuration).putConfigurationsItem(body, id, options).then((request) => request(this.axios, this.basePath));
    }
}
