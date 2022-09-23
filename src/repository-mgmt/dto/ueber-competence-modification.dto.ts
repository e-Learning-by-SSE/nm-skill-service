import { IsDefined } from 'class-validator';

/**
 * Modifies an existing Ueber-Competence
 */
export class UeberCompetenceModificationDto {
  @IsDefined()
  /**
   * The Ueber-Competence to change
   */
  ueberCompetenceId!: string;

  @IsDefined()
  /**
   * Complete list of all directly nested Competencies. Overwrites old settings.
   */
  nestedCompetencies!: string[];

  @IsDefined()
  /**
   * Complete list of all directly nested Ueber-Competencies. Overwrites old settings.
   */
  nestedUeberCompetencies!: string[];
}
