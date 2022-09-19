import { IsNotEmpty } from 'class-validator';

/**
 * Creates a new Ueber-Competence
 */
export class UeberCompetenceModificationDto {
  @IsNotEmpty()
  /**
   * The Ueber-Competence to change
   */
  ueberCompetenceId: string;

  @IsNotEmpty()
  /**
   * Complete list of all directly nested Competencies. Overwrites old settings.
   */
  nestedCompetencies: string[];

  /**
   * Complete list of all directly nested Ueber-Competencies. Overwrites old settings.
   */
  nestedUeberCompetencies: string[];
}
