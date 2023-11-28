import { IsDefined, IsNotEmpty } from 'class-validator';

import { Skill, LearningHistory, LearningUnit, LearningPath, LearningPathProgress, LIFECYCLE } from '@prisma/client';
import { OmitType } from '@nestjs/swagger';
import { CareerProfileCreationDto } from './careerProfile-creation.dto';
import { LearningProfileCreationDto } from './learningProfile-creation.dto';
import { PersonalizedLearningPathCreationDto } from './personalizedLearningPath-creation.dto';

export class PersonalizedLearningPathDto extends PersonalizedLearningPathCreationDto {
  @IsNotEmpty()
  id: string;

  constructor(id: string, createdAt: Date | undefined, updatedAt: Date | undefined, pathTeachingGoals: Skill[] | undefined, 
    unitSequence: LearningUnit[] | undefined, userProfil: LearningHistory | undefined, userProfilId: string | undefined,
    learningPath: LearningPath | undefined, learningPathId: string | undefined, progress: LearningPathProgress | undefined, lifecycle: LIFECYCLE | undefined,) {
    
        super();
    
    this.id = id;
    this.createdAt = createdAt ?? undefined;
    this.updatedAt =  updatedAt ?? undefined;
    this.pathTeachingGoals =  pathTeachingGoals ?? undefined;
    this.unitSequence =  unitSequence ?? undefined;
    this.userProfil = userProfil  ?? undefined;
    this.userProfilId =  userProfilId ?? undefined;
    this.learningPath = learningPath ?? undefined;
    this.learningPathId = learningPathId ?? undefined;
    this.progress = progress ?? undefined;
    this.lifecycle = lifecycle ?? undefined;

  }

  static createFromDao(plp: PersonalizedLearningPathDto): PersonalizedLearningPathCreationDto {
    return new PersonalizedLearningPathDto(
        plp.id, 
        plp.createdAt, 
        plp.updatedAt, 
        plp.pathTeachingGoals, 
        plp.unitSequence,
        plp.userProfil,  
        plp.userProfilId,
        plp.learningPath,
        plp.learningPathId,
        plp.progress,
        plp.lifecycle
        );
  }
}
