import { LearningUnit, SearchLearningUnit, SelfLearningUnit, Skill } from '@prisma/client';

/**
 * Specifies valid learningUnit types returned by Prisma.
 * @author El-Sharkawy <elscha@sse.uni-hildesheim.de>
 */
export type SearchLUDaoType = LearningUnit & { searchInfos: SearchLearningUnit };
export type SelfLearnLUDaoType = LearningUnit & { selfLearnInfos: SelfLearningUnit };
export type LUDaoUnionType = SearchLUDaoType | SelfLearnLUDaoType;
export type LearningUnitBasisType = LearningUnit & { teachingGoals: Skill[]; requirements: Skill[] };

// Type Guards to differentiate between types used in different extensions: SEARCH and SELF-LEARN

export function isLearningUnitType(learningUnit: LearningUnit): learningUnit is LearningUnitBasisType {
  return (
    (learningUnit as LearningUnitBasisType).requirements !== undefined &&
    (learningUnit as LearningUnitBasisType).teachingGoals !== undefined
  );
}

export function isSearchLUDaoType(learningUnit: LearningUnit): learningUnit is SearchLUDaoType {
  return (learningUnit as SearchLUDaoType).searchInfos !== undefined;
}

export function isSelfLearnLUDaoType(learningUnit: LearningUnit): learningUnit is SelfLearnLUDaoType {
  return (learningUnit as SelfLearnLUDaoType).selfLearnInfos !== undefined;
}
