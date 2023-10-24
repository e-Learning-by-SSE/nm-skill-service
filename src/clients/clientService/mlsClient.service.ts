import axios from "axios";


export class MLSClient {
  private BASE_URL: string;
  private LOGIN_SERVER_URL: string;
  private REALM: string;
  private CLIENT_ID: string;
  private CLIENT_SECRET: string | undefined;
  private USERNAME: string;
  private PASSWORD: string | undefined;;
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
    console.log(this.CLIENT_SECRET)
    try {
      const loginResponse = await axios.post(
        `${this.LOGIN_SERVER_URL}/realms/${this.REALM}/protocol/openid-connect/token`,
        this.LOGIN_PAYLOAD,
        {
          responseType: "json",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
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
        }
      );

      return refreshResponse.data;
    } catch (error) {
      throw error;
    }
  }

  async run() {
    try {
      let { access_token, refresh_token } = await this.login();
      let tasksResponse = await axios.get(`${this.BASE_URL}/mls-api/tasks.jsonld`, {
        responseType: "json",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      let pageIndex = 1;

      while (tasksResponse.data["hydra:view"]?.["hydra:next"] != null) {
        const refreshResponse = await this.refresh(refresh_token);
        access_token = refreshResponse.access_token;
        refresh_token = refreshResponse.refresh_token;

        console.log(`=== Page ${pageIndex} ===`);

        tasksResponse = await axios.get(
          `${this.BASE_URL}/mls-api/tasks.jsonld?pagination=true&page=${pageIndex}`,
          {
            responseType: "json",
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        for (let task of tasksResponse.data["hydra:member"]) {
          console.log("task: ", task.title);

          for (let taskStepIri of task.taskSteps) {
            const taskStepResponse = await axios.get(`${this.BASE_URL}${taskStepIri}`, {
              responseType: "json",
              headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
              },
            });

            console.log(`- ${taskStepResponse.data.title}`);
          }

          console.log("");
        }

        pageIndex++;
      }
    } catch (error) {
      throw error;
    }
  }
}

