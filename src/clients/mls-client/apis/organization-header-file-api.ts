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
import { OrganizationHeaderFileJsonld } from '../models';
/**
 * OrganizationHeaderFileApi - axios parameter creator
 * @export
 */
export const OrganizationHeaderFileApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Removes the OrganizationHeaderFile resource.
         * @summary Removes the OrganizationHeaderFile resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteOrganizationHeaderFileItem: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling deleteOrganizationHeaderFileItem.');
            }
            const localVarPath = `/mls-api/organization-header-files/{id}`
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
         * Retrieves a OrganizationHeaderFile resource.
         * @summary Retrieves a OrganizationHeaderFile resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getOrganizationHeaderFileItem: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling getOrganizationHeaderFileItem.');
            }
            const localVarPath = `/mls-api/organization-header-files/{id}`
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
 * OrganizationHeaderFileApi - functional programming interface
 * @export
 */
export const OrganizationHeaderFileApiFp = function(configuration?: Configuration) {
    return {
        /**
         * Removes the OrganizationHeaderFile resource.
         * @summary Removes the OrganizationHeaderFile resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteOrganizationHeaderFileItem(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<void>>> {
            const localVarAxiosArgs = await OrganizationHeaderFileApiAxiosParamCreator(configuration).deleteOrganizationHeaderFileItem(id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Retrieves a OrganizationHeaderFile resource.
         * @summary Retrieves a OrganizationHeaderFile resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getOrganizationHeaderFileItem(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<OrganizationHeaderFileJsonld>>> {
            const localVarAxiosArgs = await OrganizationHeaderFileApiAxiosParamCreator(configuration).getOrganizationHeaderFileItem(id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * OrganizationHeaderFileApi - factory interface
 * @export
 */
export const OrganizationHeaderFileApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * Removes the OrganizationHeaderFile resource.
         * @summary Removes the OrganizationHeaderFile resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteOrganizationHeaderFileItem(id: string, options?: AxiosRequestConfig): Promise<AxiosResponse<void>> {
            return OrganizationHeaderFileApiFp(configuration).deleteOrganizationHeaderFileItem(id, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieves a OrganizationHeaderFile resource.
         * @summary Retrieves a OrganizationHeaderFile resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getOrganizationHeaderFileItem(id: string, options?: AxiosRequestConfig): Promise<AxiosResponse<OrganizationHeaderFileJsonld>> {
            return OrganizationHeaderFileApiFp(configuration).getOrganizationHeaderFileItem(id, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * OrganizationHeaderFileApi - object-oriented interface
 * @export
 * @class OrganizationHeaderFileApi
 * @extends {BaseAPI}
 */
export class OrganizationHeaderFileApi extends BaseAPI {
    /**
     * Removes the OrganizationHeaderFile resource.
     * @summary Removes the OrganizationHeaderFile resource.
     * @param {string} id Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrganizationHeaderFileApi
     */
    public async deleteOrganizationHeaderFileItem(id: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<void>> {
        return OrganizationHeaderFileApiFp(this.configuration).deleteOrganizationHeaderFileItem(id, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Retrieves a OrganizationHeaderFile resource.
     * @summary Retrieves a OrganizationHeaderFile resource.
     * @param {string} id Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrganizationHeaderFileApi
     */
    public async getOrganizationHeaderFileItem(id: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<OrganizationHeaderFileJsonld>> {
        return OrganizationHeaderFileApiFp(this.configuration).getOrganizationHeaderFileItem(id, options).then((request) => request(this.axios, this.basePath));
    }
}
