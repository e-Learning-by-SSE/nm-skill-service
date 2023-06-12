import { IsNotEmpty } from 'class-validator';

export class EdgeDto {
  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  to: string;

  constructor(from: string, to: string) {
    this.from = from;
    this.to = to;
  }
}
