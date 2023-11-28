import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { PrismaService } from "../prisma/prisma.service";
import { NuggetCreationDto, NuggetDto, NuggetListDto } from "./dto";

/**
 * Service that manages the creation/update/deletion Nuggets
 * @author Wenzel
 */
@Injectable()
export class NuggetMgmtService {
    constructor(private db: PrismaService) {}

    /**
   * Adds a new nugget
   * @param dto Specifies the nugget to be created
   * @returns The newly created nugget

   */
    async createNugget(dto: NuggetCreationDto) {
        // Create and return nugget
        try {
            const nugget = await this.db.nugget.create({
                data: {
                    language: dto.language,
                    resource: dto.resource,
                    processingTime: dto.processingTime.toString(),
                    isTypeOf: dto.isTypeOf,
                    presenter: dto.presenter,
                    mediatype: dto.mediatype,
                },
            });

            return NuggetDto.createFromDao(nugget);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // unique field already exists
                if (error.code === "P2002") {
                    throw new ForbiddenException("Nugget already exists");
                }
            }
            throw error;
        }
    }

    private async loadNugget(nuggetId: string) {
        const nugget = await this.db.nugget.findUnique({ where: { id: nuggetId } });

        if (!nugget) {
            throw new NotFoundException("Specified nugget not found: " + nuggetId);
        }

        return nugget;
    }

    public async getNugget(nuggetId: string) {
        const dao = await this.loadNugget(nuggetId);

        if (!dao) {
            throw new NotFoundException(`Specified nugget not found: ${nuggetId}`);
        }

        return NuggetDto.createFromDao(dao);
    }

    public async loadAllNuggets() {
        const nuggets = await this.db.nugget.findMany();

        if (!nuggets) {
            throw new NotFoundException("Can not find any nuggets");
        }

        const nuggetList = new NuggetListDto();
        nuggetList.nuggets = nuggets.map((nugget) => NuggetDto.createFromDao(nugget));

        return nuggets;
    }
}
