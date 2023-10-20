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
import { InlineResponse20074 } from '../models';
import { TermsOfUseJsonld } from '../models';
import { TermsOfUseJsonldTermsOfUseItemRead } from '../models';
import { TermsOfUseJsonldTermsOfUseItemWrite } from '../models';
import { TermsOfUseJsonldTermsOfUseWrite } from '../models';
import { TermsOfUseTermsOfUseItemWrite } from '../models';
import { TermsOfUseTermsOfUseWrite } from '../models';
/**
 * TermsOfUseApi - axios parameter creator
 * @export
 */
export const TermsOfUseApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Removes the TermsOfUse resource.
         * @summary Removes the TermsOfUse resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteTermsOfUseItem: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling deleteTermsOfUseItem.');
            }
            const localVarPath = `/mls-api/terms-of-uses/{id}`
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
         * Retrieves the collection of TermsOfUse resources.
         * @summary Retrieves the collection of TermsOfUse resources.
         * @param {number} [page] The collection page number
         * @param {number} [itemsPerPage] The number of items per page
         * @param {boolean} [pagination] Enable or disable pagination
         * @param {string} [excerpt] 
         * @param {string} [organization] 
         * @param {Array<string>} [organization] 
         * @param {boolean} [active] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getTermsOfUseCollection: async (page?: number, itemsPerPage?: number, pagination?: boolean, excerpt?: string, organization?: string, organization?: Array<string>, active?: boolean, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/mls-api/terms-of-uses`;
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

            if (excerpt !== undefined) {
                localVarQueryParameter['excerpt'] = excerpt;
            }

            if (organization !== undefined) {
                localVarQueryParameter['organization'] = organization;
            }

            if (organization) {
                localVarQueryParameter['organization[]'] = organization;
            }

            if (active !== undefined) {
                localVarQueryParameter['active'] = active;
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
         * Retrieves a TermsOfUse resource.
         * @summary Retrieves a TermsOfUse resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getTermsOfUseItem: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling getTermsOfUseItem.');
            }
            const localVarPath = `/mls-api/terms-of-uses/{id}`
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
         * Creates a TermsOfUse resource.
         * @summary Creates a TermsOfUse resource.
         * @param {TermsOfUseJsonldTermsOfUseWrite} body The new TermsOfUse resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        postTermsOfUseCollection: async (body: TermsOfUseJsonldTermsOfUseWrite, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling postTermsOfUseCollection.');
            }
            const localVarPath = `/mls-api/terms-of-uses`;
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
         * Creates a TermsOfUse resource.
         * @summary Creates a TermsOfUse resource.
         * @param {TermsOfUseJsonldTermsOfUseWrite} body The new TermsOfUse resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        postTermsOfUseCollection: async (body: TermsOfUseJsonldTermsOfUseWrite, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling postTermsOfUseCollection.');
            }
            const localVarPath = `/mls-api/terms-of-uses`;
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
         * Replaces the TermsOfUse resource.
         * @summary Replaces the TermsOfUse resource.
         * @param {TermsOfUseJsonldTermsOfUseItemWrite} body The updated TermsOfUse resource
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putTermsOfUseItem: async (body: TermsOfUseJsonldTermsOfUseItemWrite, id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling putTermsOfUseItem.');
            }
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling putTermsOfUseItem.');
            }
            const localVarPath = `/mls-api/terms-of-uses/{id}`
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
         * Replaces the TermsOfUse resource.
         * @summary Replaces the TermsOfUse resource.
         * @param {TermsOfUseJsonldTermsOfUseItemWrite} body The updated TermsOfUse resource
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putTermsOfUseItem: async (body: TermsOfUseJsonldTermsOfUseItemWrite, id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling putTermsOfUseItem.');
            }
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling putTermsOfUseItem.');
            }
            const localVarPath = `/mls-api/terms-of-uses/{id}`
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
 * TermsOfUseApi - functional programming interface
 * @export
 */
export const TermsOfUseApiFp = function(configuration?: Configuration) {
    return {
        /**
         * Removes the TermsOfUse resource.
         * @summary Removes the TermsOfUse resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteTermsOfUseItem(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<void>>> {
            const localVarAxiosArgs = await TermsOfUseApiAxiosParamCreator(configuration).deleteTermsOfUseItem(id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Retrieves the collection of TermsOfUse resources.
         * @summary Retrieves the collection of TermsOfUse resources.
         * @param {number} [page] The collection page number
         * @param {number} [itemsPerPage] The number of items per page
         * @param {boolean} [pagination] Enable or disable pagination
         * @param {string} [excerpt] 
         * @param {string} [organization] 
         * @param {Array<string>} [organization] 
         * @param {boolean} [active] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getTermsOfUseCollection(page?: number, itemsPerPage?: number, pagination?: boolean, excerpt?: string, organization?: string, organization?: Array<string>, active?: boolean, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20074>>> {
            const localVarAxiosArgs = await TermsOfUseApiAxiosParamCreator(configuration).getTermsOfUseCollection(page, itemsPerPage, pagination, excerpt, organization, organization, active, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Retrieves a TermsOfUse resource.
         * @summary Retrieves a TermsOfUse resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getTermsOfUseItem(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<TermsOfUseJsonldTermsOfUseItemRead>>> {
            const localVarAxiosArgs = await TermsOfUseApiAxiosParamCreator(configuration).getTermsOfUseItem(id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Creates a TermsOfUse resource.
         * @summary Creates a TermsOfUse resource.
         * @param {TermsOfUseJsonldTermsOfUseWrite} body The new TermsOfUse resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postTermsOfUseCollection(body: TermsOfUseJsonldTermsOfUseWrite, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<TermsOfUseJsonld>>> {
            const localVarAxiosArgs = await TermsOfUseApiAxiosParamCreator(configuration).postTermsOfUseCollection(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Creates a TermsOfUse resource.
         * @summary Creates a TermsOfUse resource.
         * @param {TermsOfUseJsonldTermsOfUseWrite} body The new TermsOfUse resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postTermsOfUseCollection(body: TermsOfUseJsonldTermsOfUseWrite, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<TermsOfUseJsonld>>> {
            const localVarAxiosArgs = await TermsOfUseApiAxiosParamCreator(configuration).postTermsOfUseCollection(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Replaces the TermsOfUse resource.
         * @summary Replaces the TermsOfUse resource.
         * @param {TermsOfUseJsonldTermsOfUseItemWrite} body The updated TermsOfUse resource
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async putTermsOfUseItem(body: TermsOfUseJsonldTermsOfUseItemWrite, id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<TermsOfUseJsonld>>> {
            const localVarAxiosArgs = await TermsOfUseApiAxiosParamCreator(configuration).putTermsOfUseItem(body, id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Replaces the TermsOfUse resource.
         * @summary Replaces the TermsOfUse resource.
         * @param {TermsOfUseJsonldTermsOfUseItemWrite} body The updated TermsOfUse resource
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async putTermsOfUseItem(body: TermsOfUseJsonldTermsOfUseItemWrite, id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<TermsOfUseJsonld>>> {
            const localVarAxiosArgs = await TermsOfUseApiAxiosParamCreator(configuration).putTermsOfUseItem(body, id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * TermsOfUseApi - factory interface
 * @export
 */
export const TermsOfUseApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * Removes the TermsOfUse resource.
         * @summary Removes the TermsOfUse resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteTermsOfUseItem(id: string, options?: AxiosRequestConfig): Promise<AxiosResponse<void>> {
            return TermsOfUseApiFp(configuration).deleteTermsOfUseItem(id, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieves the collection of TermsOfUse resources.
         * @summary Retrieves the collection of TermsOfUse resources.
         * @param {number} [page] The collection page number
         * @param {number} [itemsPerPage] The number of items per page
         * @param {boolean} [pagination] Enable or disable pagination
         * @param {string} [excerpt] 
         * @param {string} [organization] 
         * @param {Array<string>} [organization] 
         * @param {boolean} [active] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getTermsOfUseCollection(page?: number, itemsPerPage?: number, pagination?: boolean, excerpt?: string, organization?: string, organization?: Array<string>, active?: boolean, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20074>> {
            return TermsOfUseApiFp(configuration).getTermsOfUseCollection(page, itemsPerPage, pagination, excerpt, organization, organization, active, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieves a TermsOfUse resource.
         * @summary Retrieves a TermsOfUse resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getTermsOfUseItem(id: string, options?: AxiosRequestConfig): Promise<AxiosResponse<TermsOfUseJsonldTermsOfUseItemRead>> {
            return TermsOfUseApiFp(configuration).getTermsOfUseItem(id, options).then((request) => request(axios, basePath));
        },
        /**
         * Creates a TermsOfUse resource.
         * @summary Creates a TermsOfUse resource.
         * @param {TermsOfUseJsonldTermsOfUseWrite} body The new TermsOfUse resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postTermsOfUseCollection(body: TermsOfUseJsonldTermsOfUseWrite, options?: AxiosRequestConfig): Promise<AxiosResponse<TermsOfUseJsonld>> {
            return TermsOfUseApiFp(configuration).postTermsOfUseCollection(body, options).then((request) => request(axios, basePath));
        },
        /**
         * Creates a TermsOfUse resource.
         * @summary Creates a TermsOfUse resource.
         * @param {TermsOfUseJsonldTermsOfUseWrite} body The new TermsOfUse resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postTermsOfUseCollection(body: TermsOfUseJsonldTermsOfUseWrite, options?: AxiosRequestConfig): Promise<AxiosResponse<TermsOfUseJsonld>> {
            return TermsOfUseApiFp(configuration).postTermsOfUseCollection(body, options).then((request) => request(axios, basePath));
        },
        /**
         * Replaces the TermsOfUse resource.
         * @summary Replaces the TermsOfUse resource.
         * @param {TermsOfUseJsonldTermsOfUseItemWrite} body The updated TermsOfUse resource
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async putTermsOfUseItem(body: TermsOfUseJsonldTermsOfUseItemWrite, id: string, options?: AxiosRequestConfig): Promise<AxiosResponse<TermsOfUseJsonld>> {
            return TermsOfUseApiFp(configuration).putTermsOfUseItem(body, id, options).then((request) => request(axios, basePath));
        },
        /**
         * Replaces the TermsOfUse resource.
         * @summary Replaces the TermsOfUse resource.
         * @param {TermsOfUseJsonldTermsOfUseItemWrite} body The updated TermsOfUse resource
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async putTermsOfUseItem(body: TermsOfUseJsonldTermsOfUseItemWrite, id: string, options?: AxiosRequestConfig): Promise<AxiosResponse<TermsOfUseJsonld>> {
            return TermsOfUseApiFp(configuration).putTermsOfUseItem(body, id, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * TermsOfUseApi - object-oriented interface
 * @export
 * @class TermsOfUseApi
 * @extends {BaseAPI}
 */
export class TermsOfUseApi extends BaseAPI {
    /**
     * Removes the TermsOfUse resource.
     * @summary Removes the TermsOfUse resource.
     * @param {string} id Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TermsOfUseApi
     */
    public async deleteTermsOfUseItem(id: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<void>> {
        return TermsOfUseApiFp(this.configuration).deleteTermsOfUseItem(id, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Retrieves the collection of TermsOfUse resources.
     * @summary Retrieves the collection of TermsOfUse resources.
     * @param {number} [page] The collection page number
     * @param {number} [itemsPerPage] The number of items per page
     * @param {boolean} [pagination] Enable or disable pagination
     * @param {string} [excerpt] 
     * @param {string} [organization] 
     * @param {Array<string>} [organization] 
     * @param {boolean} [active] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TermsOfUseApi
     */
    public async getTermsOfUseCollection(page?: number, itemsPerPage?: number, pagination?: boolean, excerpt?: string, organization?: string, organization?: Array<string>, active?: boolean, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20074>> {
        return TermsOfUseApiFp(this.configuration).getTermsOfUseCollection(page, itemsPerPage, pagination, excerpt, organization, organization, active, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Retrieves a TermsOfUse resource.
     * @summary Retrieves a TermsOfUse resource.
     * @param {string} id Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TermsOfUseApi
     */
    public async getTermsOfUseItem(id: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<TermsOfUseJsonldTermsOfUseItemRead>> {
        return TermsOfUseApiFp(this.configuration).getTermsOfUseItem(id, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Creates a TermsOfUse resource.
     * @summary Creates a TermsOfUse resource.
     * @param {TermsOfUseJsonldTermsOfUseWrite} body The new TermsOfUse resource
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TermsOfUseApi
     */
    public async postTermsOfUseCollection(body: TermsOfUseJsonldTermsOfUseWrite, options?: AxiosRequestConfig) : Promise<AxiosResponse<TermsOfUseJsonld>> {
        return TermsOfUseApiFp(this.configuration).postTermsOfUseCollection(body, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Creates a TermsOfUse resource.
     * @summary Creates a TermsOfUse resource.
     * @param {TermsOfUseJsonldTermsOfUseWrite} body The new TermsOfUse resource
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TermsOfUseApi
     */
    public async postTermsOfUseCollection(body: TermsOfUseJsonldTermsOfUseWrite, options?: AxiosRequestConfig) : Promise<AxiosResponse<TermsOfUseJsonld>> {
        return TermsOfUseApiFp(this.configuration).postTermsOfUseCollection(body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Replaces the TermsOfUse resource.
     * @summary Replaces the TermsOfUse resource.
     * @param {TermsOfUseJsonldTermsOfUseItemWrite} body The updated TermsOfUse resource
     * @param {string} id Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TermsOfUseApi
     */
    public async putTermsOfUseItem(body: TermsOfUseJsonldTermsOfUseItemWrite, id: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<TermsOfUseJsonld>> {
        return TermsOfUseApiFp(this.configuration).putTermsOfUseItem(body, id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Replaces the TermsOfUse resource.
     * @summary Replaces the TermsOfUse resource.
     * @param {TermsOfUseJsonldTermsOfUseItemWrite} body The updated TermsOfUse resource
     * @param {string} id Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TermsOfUseApi
     */
    public async putTermsOfUseItem(body: TermsOfUseJsonldTermsOfUseItemWrite, id: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<TermsOfUseJsonld>> {
        return TermsOfUseApiFp(this.configuration).putTermsOfUseItem(body, id, options).then((request) => request(this.axios, this.basePath));
    }
}
