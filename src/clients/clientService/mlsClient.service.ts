import { TaskApi } from "../mls-client/api";
import { Configuration } from "../mls-client/configuration";
import axios from "axios";

class MLSClient {
    private BASE_URL: string;
    private LOGIN_SERVER_URL: string;
    private REALM: string;
    private CLIENT_ID: string;
    private CLIENT_SECRET: string | undefined;
    private USERNAME: string;
    private PASSWORD: string | undefined;
    private taskApi: TaskApi;
    private accessToken: string | undefined;

    constructor() {
        this.BASE_URL = "https://search.mls2.de";
        this.LOGIN_SERVER_URL = "https://develop-login.mls2.de";
        this.REALM = "nws";
        this.CLIENT_ID = "mls2-search";
        this.CLIENT_SECRET = "CLIENT_SECRET";
        this.USERNAME = "SEARCH";
        this.PASSWORD = process.env.SEARCH_USER_PASSWORD;
        this.taskApi = new TaskApi(new Configuration({ basePath: this.BASE_URL }));
        this.login()
            .then((accessToken) => {
                this.accessToken = accessToken;
            })
            .catch((error) => {
                throw error;
            });
    }

    private async login(): Promise<string> {
        try {
            const loginData = new URLSearchParams();
            loginData.append("client_id", this.CLIENT_ID);
            loginData.append("client_secret", this.CLIENT_SECRET || "");
            loginData.append("username", this.USERNAME);
            loginData.append("password", this.PASSWORD || "");
            loginData.append("grant_type", "password");

            const loginResponse = await axios.post(
                `${this.LOGIN_SERVER_URL}/realms/${this.REALM}/protocol/openid-connect/token`,
                loginData.toString(), // Convert the URLSearchParams to a string
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                },
            );

            return loginResponse.data.access_token;
        } catch (error) {
            throw error;
        }
    }
    private async getItems(id : string ) {
        const response = await this.taskApi.getTaskItem(id);
    console.log(response.data);
    return response
    }
    

}
