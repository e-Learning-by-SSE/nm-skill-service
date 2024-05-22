/**
 * Base type to enroll a user to his/her personalized learning path.
 * Requires one of the following fields:
 * - pathId: An ID referencing a learning path defined by a content provider.
 * - pathTeachingGoalsIds: An array of IDs referencing teaching goals manually selected by the user.
 */
type PathEnrollmentBase = {
    userId: string;
    learningUnitsIds: string[];
    pathId?: string;
    pathTeachingGoalsIds?: string[];
};

/**
 * Ensures that exactly one of the optional properties is present.
 * Based on: https://stackoverflow.com/a/49725198
 */
type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
    {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
    }[Keys];

export type PathEnrollment = RequireOnlyOne<PathEnrollmentBase, "pathId" | "pathTeachingGoalsIds">;
