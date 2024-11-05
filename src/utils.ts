import { LearningUnit } from "../nm-skill-lib/src";

/**
 * Dummy, Composites are currently not supported by the SEARCH service, but a type guard is required by the library
 */
export type SearchCompositeUnit = LearningUnit & {
    composite: true;
};

/**
 * Type guard for SearchCompositeUnit (currently not implemented, but required by the library)
 * @param unit LearningUnit | SearchCompositeUnit
 */
export const isComposite = (unit: LearningUnit): unit is SearchCompositeUnit => {
    return false;
};

/**
 * Filters for defined string values.
 * @param value nullable string
 * @returns Only defined strings
 */
export const isDefined = (value: string | null | undefined): value is string =>
    value !== null && value !== undefined;
