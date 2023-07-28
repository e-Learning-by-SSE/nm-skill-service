import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { PrismaService } from '../prisma/prisma.service';
import { CompanyDto, UserCreationDto, UserDto } from './dto';
import { CompanyCreationDto } from './dto/company-creation.dto';
import { RoleCategory, User } from '@prisma/client';
import { RoleGroupCreationDto } from './dto/roleGroup-creation.dto';
import { RoleGroupDto } from './dto/roleGroup.dto';
import { LearningProfileCreationDto } from './dto/learningProfile-creation.dto';
import { LearningProfileDto } from './dto/learningProfile.dto';
import { SkillProfileCreationDto } from './dto/skillProfil-creation.dto';
import { SkillProfileDto } from './dto/skillProfile.dto';
import { QualificationDto } from './dto/qualification.dto';

/**
 * Service that manages the creation/update/deletion Users
 * @author Wenzel
 */
@Injectable()
export class UserMgmtService {
  
  constructor(private db: PrismaService) {}

  /**
   * Adds a new user
   * @param dto Specifies the user to be created
   * @returns The newly created user

   */
  async createUser(dto: UserCreationDto) {
    // Create and return user
    try {
      const user = await this.db.user.create({
        data: {
          name: dto.name,
          companyId: dto.companyId
        },
      });

      return UserDto.createFromDao(user);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // unique field already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException('User already exists');
        }
      }
      throw error;
    }
  }

  private async loadUser(userId: string) {
    const user = await this.db.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Specified user not found: ' + userId);
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
    const users = await this.db.user.findMany();

    if (!users) {
      throw new NotFoundException('Can not find any users');
    }

    let userList:User[] = [];
    userList= users.map((user) => UserDto.createFromDao(user));

    return userList;
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
        if (error.code === 'P2002') {
          throw new ForbiddenException('Company already exists');
        }
      }
      throw error;
    }
  }
  
  async createRoleGroup(dto: RoleGroupCreationDto) {
   
    try {
      const rg = await this.db.roleGroup.create({
        data: {
          name: dto.name,
          userId : dto.userId, 
          roles:{
            create: [
              { isTypeOf: RoleCategory.LEHRERNDER }, // Populates authorId with user's id
            ],
          },
        },
      })
      return RoleGroupDto.createFromDao(rg);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // unique field already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException('Company already exists');
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
          userId:dto.userId
        },
      });

      return LearningProfileDto.createFromDao(lp);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // unique field already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException('Learning Profile could not be created');
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
          userId:dto.userId
        },
      });

      return SkillProfileDto.createFromDao(sp);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // unique field already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException('Skill Profile could not be created');
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
          userId:dto.userId
        },
      });

      return QualificationDto.createFromDao(qual);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // unique field already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException('Qualification could not be created');
        }
      }
      throw error;
    }
  }


}
