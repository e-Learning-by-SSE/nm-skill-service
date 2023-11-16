import axios from "axios";
import { SearchLearningUnitCreationDto } from "../../learningUnit/dto";
import { UserCreationDto } from "../../user/dto";
import { NotFoundException } from "@nestjs/common";

export class MLSClient {
    private BASE_URL: string;
    private LOGIN_SERVER_URL: string;
    private REALM: string;
    private CLIENT_ID: string;
    private CLIENT_SECRET: string | undefined;
    private USERNAME: string;
    private PASSWORD: string | undefined;
    private LOGIN_PAYLOAD: Record<string, string | undefined>;

    constructor() {
        this.BASE_URL = "https://search.mls2.de";
        this.LOGIN_SERVER_URL = "https://develop-login.mls2.de";
        this.REALM = "nws";
        this.CLIENT_ID = "mls2-search";
        this.CLIENT_SECRET = process.env.CLIENT_SECRET;
        this.USERNAME = "SEARCH";
        this.PASSWORD = process.env.SEARCH_USER_PASSWORD;
        this.LOGIN_PAYLOAD = {
            client_id: this.CLIENT_ID,
            client_secret: this.CLIENT_SECRET,
            username: this.USERNAME,
            password: this.PASSWORD,
            grant_type: "password",
        };
    }

    async login(): Promise<any> {
        try {
            const loginResponse = await axios.post(
                `${this.LOGIN_SERVER_URL}/realms/${this.REALM}/protocol/openid-connect/token`,
                this.LOGIN_PAYLOAD,
                {
                    responseType: "json",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                },
            );

            return loginResponse.data;
        } catch (error) {
            throw error;
        }
    }

    async refresh(refresh_token: string): Promise<any> {
        try {
            const refreshResponse = await axios.post(
                `${this.LOGIN_SERVER_URL}/realms/${this.REALM}/protocol/openid-connect/token`,
                { refresh_token, grant_type: "refresh_token" },
                {
                    responseType: "json",
                    headers: {
                        Authorization: `Basic ${btoa(`${this.CLIENT_ID}:${this.CLIENT_SECRET}`)}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                },
            );

            return refreshResponse.data;
        } catch (error) {
            throw error;
        }
    }

    async getLearningUnitForId(id: string): Promise<SearchLearningUnitCreationDto> {
        try {
            let { access_token, refresh_token } = await this.login();
            let tasksResponse = await axios.get(`${this.BASE_URL}/mls-api/tasks/` + id, {
                responseType: "json",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            let a: SearchLearningUnitCreationDto = new SearchLearningUnitCreationDto(
                tasksResponse.data.id,
                null,
                tasksResponse.data.title,
                tasksResponse.data.description,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                tasksResponse.data.lifecycle,
                tasksResponse.data.creator,
            );

            return a;
        } catch (error) {
            throw error;
        }
    }

    async getUserStateForId(id: string) {
        try {
            // Login
            let { access_token, refresh_token } = await this.login();
            // Get data from MLS as JSON token
            let tasksResponse = await axios.get(`${this.BASE_URL}/mls-api/users/` + id, {
                responseType: "json",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            // Create a user DTO with required information (currently only the state) from MLS
//            let userDto: UserCreationDto= new UserCreationDto(
//                tasksResponse.data.id,
//                null,
//                null,
//                null,
//                null,
//                null,
//                null,
//                null,
//                null,
//                tasksResponse.data.state,
//                null,
//                null,
//            );

            return tasksResponse.data.state;
        } catch (error) {
            throw new NotFoundException("(MLS Request) Could not get user state for user id:"+id);
        }
    }
}
