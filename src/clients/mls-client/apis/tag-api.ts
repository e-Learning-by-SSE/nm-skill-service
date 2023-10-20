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
import { InlineResponse20059 } from '../models';
import { TagJsonld } from '../models';
import { TagJsonldTagItemRead } from '../models';
import { TagJsonldTagItemWrite } from '../models';
import { TagJsonldTagWrite } from '../models';
import { TagTagItemWrite } from '../models';
import { TagTagWrite } from '../models';
/**
 * TagApi - axios parameter creator
 * @export
 */
export const TagApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Removes the Tag resource.
         * @summary Removes the Tag resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteTagItem: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling deleteTagItem.');
            }
            const localVarPath = `/mls-api/tags/{id}`
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
         * Retrieves the collection of Tag resources.
         * @summary Retrieves the collection of Tag resources.
         * @param {number} [page] The collection page number
         * @param {number} [itemsPerPage] The number of items per page
         * @param {boolean} [pagination] Enable or disable pagination
         * @param {string} [organizationOrNoneFilter] 
         * @param {number} [id] 
         * @param {Array<number>} [id] 
         * @param {string} [title] 
         * @param {string} [context] 
         * @param {Array<string>} [context] 
         * @param {string} [organization] 
         * @param {Array<string>} [organization] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getTagCollection: async (page?: number, itemsPerPage?: number, pagination?: boolean, organizationOrNoneFilter?: string, id?: number, id?: Array<number>, title?: string, context?: string, context?: Array<string>, organization?: string, organization?: Array<string>, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/mls-api/tags`;
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

            if (organizationOrNoneFilter !== undefined) {
                localVarQueryParameter['organizationOrNoneFilter'] = organizationOrNoneFilter;
            }

            if (id !== undefined) {
                localVarQueryParameter['id'] = id;
            }

            if (id) {
                localVarQueryParameter['id[]'] = id;
            }

            if (title !== undefined) {
                localVarQueryParameter['title'] = title;
            }

            if (context !== undefined) {
                localVarQueryParameter['context'] = context;
            }

            if (context) {
                localVarQueryParameter['context[]'] = context;
            }

            if (organization !== undefined) {
                localVarQueryParameter['organization'] = organization;
            }

            if (organization) {
                localVarQueryParameter['organization[]'] = organization;
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
         * Retrieves a Tag resource.
         * @summary Retrieves a Tag resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getTagItem: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling getTagItem.');
            }
            const localVarPath = `/mls-api/tags/{id}`
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
         * Creates a Tag resource.
         * @summary Creates a Tag resource.
         * @param {TagJsonldTagWrite} body The new Tag resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        postTagCollection: async (body: TagJsonldTagWrite, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling postTagCollection.');
            }
            const localVarPath = `/mls-api/tags`;
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
         * Creates a Tag resource.
         * @summary Creates a Tag resource.
         * @param {TagJsonldTagWrite} body The new Tag resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        postTagCollection: async (body: TagJsonldTagWrite, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling postTagCollection.');
            }
            const localVarPath = `/mls-api/tags`;
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
         * Replaces the Tag resource.
         * @summary Replaces the Tag resource.
         * @param {TagJsonldTagItemWrite} body The updated Tag resource
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putTagItem: async (body: TagJsonldTagItemWrite, id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling putTagItem.');
            }
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling putTagItem.');
            }
            const localVarPath = `/mls-api/tags/{id}`
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
         * Replaces the Tag resource.
         * @summary Replaces the Tag resource.
         * @param {TagJsonldTagItemWrite} body The updated Tag resource
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putTagItem: async (body: TagJsonldTagItemWrite, id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling putTagItem.');
            }
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling putTagItem.');
            }
            const localVarPath = `/mls-api/tags/{id}`
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
 * TagApi - functional programming interface
 * @export
 */
export const TagApiFp = function(configuration?: Configuration) {
    return {
        /**
         * Removes the Tag resource.
         * @summary Removes the Tag resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteTagItem(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<void>>> {
            const localVarAxiosArgs = await TagApiAxiosParamCreator(configuration).deleteTagItem(id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Retrieves the collection of Tag resources.
         * @summary Retrieves the collection of Tag resources.
         * @param {number} [page] The collection page number
         * @param {number} [itemsPerPage] The number of items per page
         * @param {boolean} [pagination] Enable or disable pagination
         * @param {string} [organizationOrNoneFilter] 
         * @param {number} [id] 
         * @param {Array<number>} [id] 
         * @param {string} [title] 
         * @param {string} [context] 
         * @param {Array<string>} [context] 
         * @param {string} [organization] 
         * @param {Array<string>} [organization] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getTagCollection(page?: number, itemsPerPage?: number, pagination?: boolean, organizationOrNoneFilter?: string, id?: number, id?: Array<number>, title?: string, context?: string, context?: Array<string>, organization?: string, organization?: Array<string>, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20059>>> {
            const localVarAxiosArgs = await TagApiAxiosParamCreator(configuration).getTagCollection(page, itemsPerPage, pagination, organizationOrNoneFilter, id, id, title, context, context, organization, organization, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Retrieves a Tag resource.
         * @summary Retrieves a Tag resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getTagItem(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<TagJsonldTagItemRead>>> {
            const localVarAxiosArgs = await TagApiAxiosParamCreator(configuration).getTagItem(id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Creates a Tag resource.
         * @summary Creates a Tag resource.
         * @param {TagJsonldTagWrite} body The new Tag resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postTagCollection(body: TagJsonldTagWrite, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<TagJsonld>>> {
            const localVarAxiosArgs = await TagApiAxiosParamCreator(configuration).postTagCollection(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Creates a Tag resource.
         * @summary Creates a Tag resource.
         * @param {TagJsonldTagWrite} body The new Tag resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postTagCollection(body: TagJsonldTagWrite, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<TagJsonld>>> {
            const localVarAxiosArgs = await TagApiAxiosParamCreator(configuration).postTagCollection(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Replaces the Tag resource.
         * @summary Replaces the Tag resource.
         * @param {TagJsonldTagItemWrite} body The updated Tag resource
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async putTagItem(body: TagJsonldTagItemWrite, id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<TagJsonld>>> {
            const localVarAxiosArgs = await TagApiAxiosParamCreator(configuration).putTagItem(body, id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Replaces the Tag resource.
         * @summary Replaces the Tag resource.
         * @param {TagJsonldTagItemWrite} body The updated Tag resource
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async putTagItem(body: TagJsonldTagItemWrite, id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<TagJsonld>>> {
            const localVarAxiosArgs = await TagApiAxiosParamCreator(configuration).putTagItem(body, id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * TagApi - factory interface
 * @export
 */
export const TagApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * Removes the Tag resource.
         * @summary Removes the Tag resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteTagItem(id: string, options?: AxiosRequestConfig): Promise<AxiosResponse<void>> {
            return TagApiFp(configuration).deleteTagItem(id, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieves the collection of Tag resources.
         * @summary Retrieves the collection of Tag resources.
         * @param {number} [page] The collection page number
         * @param {number} [itemsPerPage] The number of items per page
         * @param {boolean} [pagination] Enable or disable pagination
         * @param {string} [organizationOrNoneFilter] 
         * @param {number} [id] 
         * @param {Array<number>} [id] 
         * @param {string} [title] 
         * @param {string} [context] 
         * @param {Array<string>} [context] 
         * @param {string} [organization] 
         * @param {Array<string>} [organization] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getTagCollection(page?: number, itemsPerPage?: number, pagination?: boolean, organizationOrNoneFilter?: string, id?: number, id?: Array<number>, title?: string, context?: string, context?: Array<string>, organization?: string, organization?: Array<string>, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20059>> {
            return TagApiFp(configuration).getTagCollection(page, itemsPerPage, pagination, organizationOrNoneFilter, id, id, title, context, context, organization, organization, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieves a Tag resource.
         * @summary Retrieves a Tag resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getTagItem(id: string, options?: AxiosRequestConfig): Promise<AxiosResponse<TagJsonldTagItemRead>> {
            return TagApiFp(configuration).getTagItem(id, options).then((request) => request(axios, basePath));
        },
        /**
         * Creates a Tag resource.
         * @summary Creates a Tag resource.
         * @param {TagJsonldTagWrite} body The new Tag resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postTagCollection(body: TagJsonldTagWrite, options?: AxiosRequestConfig): Promise<AxiosResponse<TagJsonld>> {
            return TagApiFp(configuration).postTagCollection(body, options).then((request) => request(axios, basePath));
        },
        /**
         * Creates a Tag resource.
         * @summary Creates a Tag resource.
         * @param {TagJsonldTagWrite} body The new Tag resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postTagCollection(body: TagJsonldTagWrite, options?: AxiosRequestConfig): Promise<AxiosResponse<TagJsonld>> {
            return TagApiFp(configuration).postTagCollection(body, options).then((request) => request(axios, basePath));
        },
        /**
         * Replaces the Tag resource.
         * @summary Replaces the Tag resource.
         * @param {TagJsonldTagItemWrite} body The updated Tag resource
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async putTagItem(body: TagJsonldTagItemWrite, id: string, options?: AxiosRequestConfig): Promise<AxiosResponse<TagJsonld>> {
            return TagApiFp(configuration).putTagItem(body, id, options).then((request) => request(axios, basePath));
        },
        /**
         * Replaces the Tag resource.
         * @summary Replaces the Tag resource.
         * @param {TagJsonldTagItemWrite} body The updated Tag resource
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async putTagItem(body: TagJsonldTagItemWrite, id: string, options?: AxiosRequestConfig): Promise<AxiosResponse<TagJsonld>> {
            return TagApiFp(configuration).putTagItem(body, id, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * TagApi - object-oriented interface
 * @export
 * @class TagApi
 * @extends {BaseAPI}
 */
export class TagApi extends BaseAPI {
    /**
     * Removes the Tag resource.
     * @summary Removes the Tag resource.
     * @param {string} id Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TagApi
     */
    public async deleteTagItem(id: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<void>> {
        return TagApiFp(this.configuration).deleteTagItem(id, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Retrieves the collection of Tag resources.
     * @summary Retrieves the collection of Tag resources.
     * @param {number} [page] The collection page number
     * @param {number} [itemsPerPage] The number of items per page
     * @param {boolean} [pagination] Enable or disable pagination
     * @param {string} [organizationOrNoneFilter] 
     * @param {number} [id] 
     * @param {Array<number>} [id] 
     * @param {string} [title] 
     * @param {string} [context] 
     * @param {Array<string>} [context] 
     * @param {string} [organization] 
     * @param {Array<string>} [organization] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TagApi
     */
    public async getTagCollection(page?: number, itemsPerPage?: number, pagination?: boolean, organizationOrNoneFilter?: string, id?: number, id?: Array<number>, title?: string, context?: string, context?: Array<string>, organization?: string, organization?: Array<string>, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20059>> {
        return TagApiFp(this.configuration).getTagCollection(page, itemsPerPage, pagination, organizationOrNoneFilter, id, id, title, context, context, organization, organization, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Retrieves a Tag resource.
     * @summary Retrieves a Tag resource.
     * @param {string} id Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TagApi
     */
    public async getTagItem(id: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<TagJsonldTagItemRead>> {
        return TagApiFp(this.configuration).getTagItem(id, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Creates a Tag resource.
     * @summary Creates a Tag resource.
     * @param {TagJsonldTagWrite} body The new Tag resource
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TagApi
     */
    public async postTagCollection(body: TagJsonldTagWrite, options?: AxiosRequestConfig) : Promise<AxiosResponse<TagJsonld>> {
        return TagApiFp(this.configuration).postTagCollection(body, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Creates a Tag resource.
     * @summary Creates a Tag resource.
     * @param {TagJsonldTagWrite} body The new Tag resource
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TagApi
     */
    public async postTagCollection(body: TagJsonldTagWrite, options?: AxiosRequestConfig) : Promise<AxiosResponse<TagJsonld>> {
        return TagApiFp(this.configuration).postTagCollection(body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Replaces the Tag resource.
     * @summary Replaces the Tag resource.
     * @param {TagJsonldTagItemWrite} body The updated Tag resource
     * @param {string} id Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TagApi
     */
    public async putTagItem(body: TagJsonldTagItemWrite, id: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<TagJsonld>> {
        return TagApiFp(this.configuration).putTagItem(body, id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Replaces the Tag resource.
     * @summary Replaces the Tag resource.
     * @param {TagJsonldTagItemWrite} body The updated Tag resource
     * @param {string} id Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TagApi
     */
    public async putTagItem(body: TagJsonldTagItemWrite, id: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<TagJsonld>> {
        return TagApiFp(this.configuration).putTagItem(body, id, options).then((request) => request(this.axios, this.basePath));
    }
}
