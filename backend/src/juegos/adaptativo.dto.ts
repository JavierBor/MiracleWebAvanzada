import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SiguienteVerboDto {
  @ApiProperty({ example: 5, description: 'Racha actual de aciertos consecutivos' })
  @IsInt()
  @Min(0)
  rachaActual!: number;

  @ApiPropertyOptional({ example: true, description: 'Resultado de la ronda previa' })
  @IsOptional()
  @IsBoolean()
  ultimoResultado?: boolean;

  @ApiPropertyOptional({ example: ['play', 'go'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  verbosUsados?: string[];

  @ApiPropertyOptional({ example: false, description: 'Control del usuario para fijar dificultad' })
  @IsOptional()
  @IsBoolean()
  modoManual?: boolean;

  @ApiPropertyOptional({ enum: ['Normal', 'Difícil', 'Experto'], example: 'Difícil' })
  @IsOptional()
  @IsIn(['Normal', 'Difícil', 'Experto'])
  dificultadFija?: 'Normal' | 'Difícil' | 'Experto';
}

export class RegistrarInteraccionDto {
  @ApiProperty({ enum: ['ING_I', 'ING_II', 'ING_III', 'ING_IV'], example: 'ING_II' })
  @IsIn(['ING_I', 'ING_II', 'ING_III', 'ING_IV'])
  nivelJuego!: 'ING_I' | 'ING_II' | 'ING_III' | 'ING_IV';

  @ApiProperty({ example: 'Verb Transformer' })
  @IsString()
  @IsNotEmpty()
  nombreJuego!: string;

  @ApiPropertyOptional({ example: 'VERBOS' })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiProperty({ example: 120 })
  @IsInt()
  @Min(0)
  puntaje!: number;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsInt()
  @Min(0)
  rachaMaxima?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  modoAdaptativo?: boolean;

  @ApiPropertyOptional({ example: { verboFallado: 'TEACH', respuestaUsuario: 'teached' } })
  @IsOptional()
  @IsObject()
  erroresComunes?: Record<string, any>;
}