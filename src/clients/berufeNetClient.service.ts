import axios from "axios";
import { PrismaService } from "../prisma/prisma.service";
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { throws } from "assert";
@Injectable()
export class BerufeService {
    constructor(private db: PrismaService) {
        db = db;
    }
    private readonly baseUrl = "https://rest.arbeitsagentur.de/infosysbub/bnet/pc/v1";
    private apiKey: string = "d672172b-f3ef-4746-b659-227c39d95acf";
    private axiosConfig = {
        headers: {
            "X-API-Key": this.apiKey,
        },
        timeout: 120000,
    };

    async getBerufeByID(berufId: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/berufe/${berufId}`, this.axiosConfig);
            return response.data;
        } catch (error) {
            throw new Error(`Error making API request: ${error.message}`);
        }
    }

    async getBerufeByPageAndSearchString(page: string, suchwoerter: string): Promise<any> {
        const apiKey = 'd672172b-f3ef-4746-b659-227c39d95acf';
        const baseUrl = 'https://rest.arbeitsagentur.de/infosysbub/bnet/pc/v1';
        const searchQuery = suchwoerter;
        
        
        const url = `${baseUrl}/berufe?suchwoerter=${searchQuery}&page=${page}`;
        
        try {
          const response = await axios.get(url, {
            headers: {
              'X-API-Key': apiKey,
            },
            timeout: 60000, // 60 seconds timeout, similar to the curl -m option
          });
        
          const data = response.data;
          console.log(data);
          return data;
        } catch (error) {
          console.error(`Error making API request: ${error.message}`);
        }
    }
    async getALLBerufeByPage(page: string): Promise<any> {
      const url = `${this.baseUrl}/berufe?suchwoerter=*&page=${page}`
        
      try {
            const response = await axios.get(
               url ,
                this.axiosConfig,
            );

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
                const result = await this.getBerufeByPageAndSearchString(
                    currentPage.toString(),
                    suchwoerter,
                );
                // Concatenate the results of the current page to the overall results array
                allResults = allResults.concat(result._embedded.berufSucheList);
                if (!result._links.next) {
                    break;
                }
                // Increment the page number for the next iteration
                currentPage++;

                // You might want to introduce a limit to avoid infinite loops
                if (currentPage > 100) {
                    console.error("Exceeded maximum number of pages.");
                    break;
                }
            }

            return allResults;
        } catch (error) {
            console.error(error.message);
            return [];
        }
    }

    extractLastPageNumber(result: any): number {
        const lastHref = result._links.last.href;
        const pageMatch = lastHref.match(/page=(\d+)/);
        return pageMatch ? parseInt(pageMatch[1], 10) : 0;
    }
   
    async getAllBerufe(): Promise<any[]> {
        try {
            let currentPage = 0;
            let allResults: any[] = [];

            const firstPageResult = await this.getALLBerufeByPage("0");
            const lastPage = this.extractLastPageNumber(firstPageResult);
       const del = await this.db.beruf.deleteMany();
       await this.db.bkgr.deleteMany();
       await this.db.typ.deleteMany();
            while (currentPage <= lastPage) {
                console.log(`Fetching page ${currentPage}`);

                const result = await this.getALLBerufeByPage(currentPage.toString());
                await this.storeBerufeInDatabase(result._embedded.berufSucheList);
                allResults = allResults.concat(result._embedded.berufSucheList);

                // Increment the page number for the next iteration
                currentPage++;
            }
            this.db;
            return allResults;
        } catch (error) {
            console.error(error.message);
            return [];
        }
    }
    private async storeBerufeInDatabase(berufeList: any[]): Promise<void> {
     
        for (const berufData of berufeList) {
            // Map the API data to your Prisma data model
            const mappedBerufData = {
                id: berufData.id?.toString() || "defaultId",
                kurzBezeichnungNeutral:
                    berufData.kurzBezeichnungNeutral || "defaultKurzBezeichnung",
                bkgr: {
                    connectOrCreate: {
                        where: {
                            id: berufData.bkgr.id.toString(),
                        },
                        create: {
                            id: berufData.bkgr.id.toString(),
                            typ: {
                                connectOrCreate: {
                                    where: {
                                        id: berufData.bkgr.typ.id.toString(),
                                    },
                                    create: {
                                        id: berufData.bkgr.typ.id.toString(),
                                    },
                                },
                            },
                        },
                    },
                },
            };

            // Store the beruf in the database
            try {
                console.log(mappedBerufData);
                await this.db.beruf.create({
                    data: mappedBerufData,
                });
                console.log(`Beruf ${berufData.id} stored successfully.`);
            } catch (error) {
                console.error(`Error storing beruf ${berufData.id}: ${error.message}`);
                // Handle the error as needed (e.g., logging, retrying, skipping, etc.)
            }
        }
    }
}
