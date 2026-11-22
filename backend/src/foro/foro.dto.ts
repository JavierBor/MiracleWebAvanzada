import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateForoDto {
  @ApiProperty({ example: 'ING-II', description: 'Asignatura asociada a la consulta' })
  @IsString()
  @IsNotEmpty({ message: 'La asignatura (curso) es obligatoria' })
  @MaxLength(20)
  curso!: string;

  @ApiProperty({ example: '¿Cuándo usar make vs do?', description: 'Título breve de la duda' })
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  @MaxLength(150)
  titulo!: string;

  @ApiProperty({
    example: 'Tengo dudas sobre cuándo corresponde usar make y cuándo do en oraciones cotidianas.',
    description: 'Cuerpo detallado de la publicación',
  })
  @IsString()
  @IsNotEmpty({ message: 'El contenido es obligatorio' })
  @MinLength(5, { message: 'El contenido debe tener al menos 5 caracteres' })
  @MaxLength(2000)
  contenido!: string;

  @ApiPropertyOptional({ example: 'Gabriel Reyes' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  autor?: string;

  @ApiPropertyOptional({ example: 'Gramática' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  categoria?: string;
}
