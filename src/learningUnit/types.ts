import { LearningUnit, SearchLearningUnit, SelfLearningUnit } from '@prisma/client';

/**
 * Specifies valid learningUnit types returned by Prisma.
 * @author El-Sharkawy <elscha@sse.uni-hildesheim.de>
 */
export type SearchLUDaoType = LearningUnit & { searchInfos: SearchLearningUnit };
export type SelfLearnLUDaoType = LearningUnit & { selfLearnInfos: SelfLearningUnit };
export type LUDaoUnionType = SearchLUDaoType | SelfLearnLUDaoType;

// Type Guards to differentiate between types used in different extensions: SEARCH and SELF-LEARN

export function isSearchLUDaoType(learningUnit: LearningUnit): learningUnit is SearchLUDaoType {
  return (learningUnit as SearchLUDaoType).searchInfos !== undefined;
}

export function isSearchLUDaoType2(learningUnit: LearningUnit): learningUnit is SearchLUDaoType {
  return (learningUnit as SearchLUDaoType).searchInfos !== null;
}

// export const isSearch = (learningUnit: LearningUnit): learningUnit is SearchLUDaoType =>
//   (learningUnit as SearchLUDaoType).searchInfos != null;

export function isSelfLearnLUDaoType(learningUnit: LearningUnit): learningUnit is SelfLearnLUDaoType {
  return (learningUnit as SelfLearnLUDaoType).selfLearnInfos !== undefined;
}
