import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';
import { IsString, MinLength } from 'class-validator';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @IsString()
  @MinLength(3)
  title!: string;
  @IsString()
  @MinLength(10)
  content!: string;
}
