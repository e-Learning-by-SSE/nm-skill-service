import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import { PrismaService } from "../prisma/prisma.service";
import { CompanyDto, UserCreationDto, UserDto } from "./dto";
import { CompanyCreationDto } from "./dto/company-creation.dto";
import { LearningProfileCreationDto } from "./dto/learningProfile-creation.dto";
import { LearningProfileDto } from "./dto/learningProfile.dto";
import { SkillProfileCreationDto } from "./dto/skillProfil-creation.dto";
import { SkillProfileDto } from "./dto/skillProfile.dto";
import { QualificationDto } from "./dto/qualification.dto";
import { UserListDto } from "./dto/user-list.dto";
import { CreateLearningProgressDto } from "./dto/learningProgress-creation.dto";
import { UpdateLearningProgressDto } from "./dto/learningProgress-update.dto";
import { DeleteLearningProgressDto } from "./dto/learningProgress-deletion.dto";
import { de } from "@faker-js/faker";

/**
 * Service that manages the creation/update/deletion Users
 * @author Wenzel
 */
@Injectable()
export class UserMgmtService {
    constructor(private db: PrismaService) {}

    async deleteProgressForId(id: string) {
        const recordToDelete = await this.db.learningProgress.findUnique({
            where: {
                id: id, // Replace with the actual record ID you want to delete
            },
        });

        if (!recordToDelete) {
            // The record with the specified ID doesn't exist; handle it accordingly
            throw new NotFoundException(`Record not found: ${id}`);
        }

        const dao = await this.db.learningProgress.delete({ where: { id: id } });

        

        return dao;
    }
    async updateLearningProgress(
        userId: string,
        updateLearningProgressDto: UpdateLearningProgressDto,
    ) {
        try {
        } catch (error) {
            throw new Error("Error updating learning progress.");
        }
    }
    async createProgressForUserId(
        userId: string,
        createLearningProgressDto: CreateLearningProgressDto,
    ) {
        try {
            const createEntry = await this.db.learningProgress.create({
                data: { userId, ...createLearningProgressDto },
            });
            return createEntry;
        } catch (error) {
            throw new Error("Error creating learning progress.");
        }
    }

    async findProgressForUserId(id: string) {
        try {
            const progressEntries = await this.db.learningProgress.findMany({
              where: { userId: id },
            });
        
            if (progressEntries.length === 0) {
              throw new NotFoundException('No learning progress found.');
            }
        
            return progressEntries;
          } catch (error) {
            // Handle any other errors or rethrow them as needed
            throw new Error('Error finding learning progress.');
          }
    }

    /**
   * Adds a new user
   * @param dto Specifies the user to be created
   * @returns The newly created user

   */
    async createUser(dto: UserCreationDto) {
        // Create and return user
        try {
            const user = await this.db.userProfile.create({
                data: {
                    name: dto.name,
                    companyId: dto.companyId,
                },
            });

            return UserDto.createFromDao(user);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // unique field already exists
                if (error.code === "P2002") {
                    throw new ForbiddenException("User already exists");
                }
            }
            throw error;
        }
    }

    private async loadUser(userId: string) {
        const user = await this.db.userProfile.findUnique({
            where: {
                id: userId,
            },
            include: {
                company: true,
                learningProfile: true,
                skillProfile: true,
                learningProgress: true,
            },
        });

        if (!user) {
            throw new NotFoundException("Specified user not found: " + userId);
        }

        return user;
    }

    public async getUser(userId: string) {
        const dao = await this.loadUser(userId);

        if (!dao) {
            throw new NotFoundException(`Specified user not found: ${userId}`);
        }

        return UserDto.createFromDao(dao);
    }

    public async loadAllUsers() {
        const users = await this.db.userProfile.findMany();

        if (!users) {
            throw new NotFoundException("Can not find any users");
        }

        const userList = new UserListDto();
        userList.users = users.map((user) => UserDto.createFromDao(user));

        return users;
    }
    async createComp(dto: CompanyCreationDto) {
        // Create and return company
        try {
            const comp = await this.db.company.create({
                data: {
                    name: dto.name,
                },
            });

            return CompanyDto.createFromDao(comp);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // unique field already exists
                if (error.code === "P2002") {
                    throw new ForbiddenException("Company already exists");
                }
            }
            throw error;
        }
    }

    async createLP(dto: LearningProfileCreationDto) {
        try {
            const lp = await this.db.learningProfile.create({
                data: {
                    semanticDensity: Number(dto.semanticDensity),
                    semanticGravity: Number(dto.semanticGravity),
                    mediaType: dto.mediaType,
                    language: dto.language,
                    userId: dto.userId,
                },
            });

            return LearningProfileDto.createFromDao(lp);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // unique field already exists
                if (error.code === "P2002") {
                    throw new ForbiddenException("Learning Profile could not be created");
                }
            }
            throw error;
        }
    }

    async createSP(dto: SkillProfileCreationDto) {
        try {
            const sp = await this.db.skillProfile.create({
                data: {
                    jobHistory: dto.jobHistory,
                    professionalInterests: dto.professionalInterests,
                    userId: dto.userId,
                },
            });

            return SkillProfileDto.createFromDao(sp);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // unique field already exists
                if (error.code === "P2002") {
                    throw new ForbiddenException("Skill Profile could not be created");
                }
            }
            throw error;
        }
    }

    async createQualification(dto: QualificationDto) {
        try {
            const qual = await this.db.qualification.create({
                data: {
                    name: dto.name,
                    year: dto.year,
                    userId: dto.userId,
                },
            });

            return QualificationDto.createFromDao(qual);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // unique field already exists
                if (error.code === "P2002") {
                    throw new ForbiddenException("Qualification could not be created");
                }
            }
            throw error;
        }
    }
}
