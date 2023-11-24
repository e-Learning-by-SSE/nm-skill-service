import axios from "axios";

export class BerufeService {
    
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.baseUrl = "https://rest.arbeitsagentur.de/infosysbub/bnet/pc/v1";
    }
    async getBerufeByID(berufId: string) {
      try {
        const response = await axios.get(`${this.baseUrl}/berufe/${berufId}`, {
            headers: {
                "X-API-Key": this.apiKey,
            },
            timeout: 60000, // 60 seconds timeout, similar to the curl -m option
        });

        return response.data;
    } catch (error) {
        throw new Error(`Error making API request: ${error.message}`);
    }
  }

    async getBerufeByPageAndSearchString(page: string, suchwoerter: string): Promise<any> {
        try {
            const response = await axios.get(`${this.baseUrl}/berufe?suchwoerter=${suchwoerter}&page=${page}`, {
                headers: {
                    "X-API-Key": this.apiKey,
                },
                timeout: 60000, // 60 seconds timeout, similar to the curl -m option
            });

            return response.data;
        } catch (error) {
            throw new Error(`Error making API request: ${error.message}`);
        }
    }
    async getALLBerufeByPage(page: string): Promise<any> {
      try {
          const response = await axios.get(`${this.baseUrl}/berufe?suchwoerter=*&page=${page}`, {
              headers: {
                  "X-API-Key": this.apiKey,
              },
              timeout: 60000, // 60 seconds timeout, similar to the curl -m option
          });

          return response.data;
      } catch (error) {
          throw new Error(`Error making API request: ${error.message}`);
      }
  }

async getAllBerufeBySearchString(suchwoerter: string): Promise<any[]> {
    let currentPage = 0;
    let allResults: any[] = [];

    try {
      while (true) {
        const result = await this.getBerufeByPageAndSearchString(currentPage.toString(), suchwoerter);
   
        // Break the loop if there are no more pages
        if (!result._links.next) {
          break;
        }

        // Concatenate the results of the current page to the overall results array
        allResults = allResults.concat(result._embedded.berufSucheList);

        // Increment the page number for the next iteration
        currentPage++;

        // You might want to introduce a limit to avoid infinite loops
        if (currentPage > 100) {
          console.error('Exceeded maximum number of pages.');
          break;
        }
      }

      return allResults;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  }
  async getAllBerufe(): Promise<any[]> {
    let currentPage = 0;
    let allResults: any[] = [];

    try {
      while (true) {
        console.log(currentPage);
        const result = await this.getALLBerufeByPage(currentPage.toString());
   
        // Break the loop if there are no more pages
        if (!result._links.next) {
          break;
        }

        // Concatenate the results of the current page to the overall results array
        allResults = allResults.concat(result._embedded.berufSucheList);

        // Increment the page number for the next iteration
        currentPage++;

        // You might want to introduce a limit to avoid infinite loops
        if (currentPage > 200) {
          console.error('Exceeded maximum number of pages.');
          break;
        }
      }

      return allResults;
    } catch (error) {
      console.error(error.message);
      return [];
    }


    
  }


}
