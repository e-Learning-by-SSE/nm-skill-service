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
import { InlineResponse20043 } from '../models';
import { LocalEuropathekBookPageJsonldLocalEuropathekBookPageItemRead } from '../models';
/**
 * LocalEuropathekBookPageApi - axios parameter creator
 * @export
 */
export const LocalEuropathekBookPageApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Retrieves the collection of LocalEuropathekBookPage resources.
         * @summary Retrieves the collection of LocalEuropathekBookPage resources.
         * @param {number} [page] The collection page number
         * @param {number} [itemsPerPage] The number of items per page
         * @param {boolean} [pagination] Enable or disable pagination
         * @param {string} [title] 
         * @param {number} [bookPage] 
         * @param {Array<number>} [bookPage] 
         * @param {string} [book] 
         * @param {Array<string>} [book] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getLocalEuropathekBookPageCollection: async (page?: number, itemsPerPage?: number, pagination?: boolean, title?: string, bookPage?: number, bookPage?: Array<number>, book?: string, book?: Array<string>, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/mls-api/local-europathek-book-pages`;
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

            if (title !== undefined) {
                localVarQueryParameter['title'] = title;
            }

            if (bookPage !== undefined) {
                localVarQueryParameter['bookPage'] = bookPage;
            }

            if (bookPage) {
                localVarQueryParameter['bookPage[]'] = bookPage;
            }

            if (book !== undefined) {
                localVarQueryParameter['book'] = book;
            }

            if (book) {
                localVarQueryParameter['book[]'] = book;
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
         * Retrieves a LocalEuropathekBookPage resource.
         * @summary Retrieves a LocalEuropathekBookPage resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getLocalEuropathekBookPageItem: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling getLocalEuropathekBookPageItem.');
            }
            const localVarPath = `/mls-api/local-europathek-book-pages/{id}`
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
    }
};

/**
 * LocalEuropathekBookPageApi - functional programming interface
 * @export
 */
export const LocalEuropathekBookPageApiFp = function(configuration?: Configuration) {
    return {
        /**
         * Retrieves the collection of LocalEuropathekBookPage resources.
         * @summary Retrieves the collection of LocalEuropathekBookPage resources.
         * @param {number} [page] The collection page number
         * @param {number} [itemsPerPage] The number of items per page
         * @param {boolean} [pagination] Enable or disable pagination
         * @param {string} [title] 
         * @param {number} [bookPage] 
         * @param {Array<number>} [bookPage] 
         * @param {string} [book] 
         * @param {Array<string>} [book] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getLocalEuropathekBookPageCollection(page?: number, itemsPerPage?: number, pagination?: boolean, title?: string, bookPage?: number, bookPage?: Array<number>, book?: string, book?: Array<string>, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse20043>>> {
            const localVarAxiosArgs = await LocalEuropathekBookPageApiAxiosParamCreator(configuration).getLocalEuropathekBookPageCollection(page, itemsPerPage, pagination, title, bookPage, bookPage, book, book, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Retrieves a LocalEuropathekBookPage resource.
         * @summary Retrieves a LocalEuropathekBookPage resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getLocalEuropathekBookPageItem(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<LocalEuropathekBookPageJsonldLocalEuropathekBookPageItemRead>>> {
            const localVarAxiosArgs = await LocalEuropathekBookPageApiAxiosParamCreator(configuration).getLocalEuropathekBookPageItem(id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * LocalEuropathekBookPageApi - factory interface
 * @export
 */
export const LocalEuropathekBookPageApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * Retrieves the collection of LocalEuropathekBookPage resources.
         * @summary Retrieves the collection of LocalEuropathekBookPage resources.
         * @param {number} [page] The collection page number
         * @param {number} [itemsPerPage] The number of items per page
         * @param {boolean} [pagination] Enable or disable pagination
         * @param {string} [title] 
         * @param {number} [bookPage] 
         * @param {Array<number>} [bookPage] 
         * @param {string} [book] 
         * @param {Array<string>} [book] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getLocalEuropathekBookPageCollection(page?: number, itemsPerPage?: number, pagination?: boolean, title?: string, bookPage?: number, bookPage?: Array<number>, book?: string, book?: Array<string>, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse20043>> {
            return LocalEuropathekBookPageApiFp(configuration).getLocalEuropathekBookPageCollection(page, itemsPerPage, pagination, title, bookPage, bookPage, book, book, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieves a LocalEuropathekBookPage resource.
         * @summary Retrieves a LocalEuropathekBookPage resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getLocalEuropathekBookPageItem(id: string, options?: AxiosRequestConfig): Promise<AxiosResponse<LocalEuropathekBookPageJsonldLocalEuropathekBookPageItemRead>> {
            return LocalEuropathekBookPageApiFp(configuration).getLocalEuropathekBookPageItem(id, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * LocalEuropathekBookPageApi - object-oriented interface
 * @export
 * @class LocalEuropathekBookPageApi
 * @extends {BaseAPI}
 */
export class LocalEuropathekBookPageApi extends BaseAPI {
    /**
     * Retrieves the collection of LocalEuropathekBookPage resources.
     * @summary Retrieves the collection of LocalEuropathekBookPage resources.
     * @param {number} [page] The collection page number
     * @param {number} [itemsPerPage] The number of items per page
     * @param {boolean} [pagination] Enable or disable pagination
     * @param {string} [title] 
     * @param {number} [bookPage] 
     * @param {Array<number>} [bookPage] 
     * @param {string} [book] 
     * @param {Array<string>} [book] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LocalEuropathekBookPageApi
     */
    public async getLocalEuropathekBookPageCollection(page?: number, itemsPerPage?: number, pagination?: boolean, title?: string, bookPage?: number, bookPage?: Array<number>, book?: string, book?: Array<string>, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse20043>> {
        return LocalEuropathekBookPageApiFp(this.configuration).getLocalEuropathekBookPageCollection(page, itemsPerPage, pagination, title, bookPage, bookPage, book, book, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Retrieves a LocalEuropathekBookPage resource.
     * @summary Retrieves a LocalEuropathekBookPage resource.
     * @param {string} id Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LocalEuropathekBookPageApi
     */
    public async getLocalEuropathekBookPageItem(id: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<LocalEuropathekBookPageJsonldLocalEuropathekBookPageItemRead>> {
        return LocalEuropathekBookPageApiFp(this.configuration).getLocalEuropathekBookPageItem(id, options).then((request) => request(this.axios, this.basePath));
    }
}
