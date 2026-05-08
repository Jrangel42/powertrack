import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsInt,
  Min,
  Max,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateAulaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del aula es requerido' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre: string;

  @IsInt({ message: 'El horario de inicio debe ser un número entero' })
  @Min(0, { message: 'El horario de inicio debe estar entre 0 y 23' })
  @Max(23, { message: 'El horario de inicio debe estar entre 0 y 23' })
  horarioInicio: number;

  @IsInt({ message: 'El horario de cierre debe ser un número entero' })
  @Min(0, { message: 'El horario de cierre debe estar entre 0 y 23' })
  @Max(23, { message: 'El horario de cierre debe estar entre 0 y 23' })
  horarioCierre: number;

  @IsNumber({}, { message: 'El consumo esperado debe ser un número' })
  @IsPositive({ message: 'El consumo esperado debe ser positivo' })
  @Max(1000, { message: 'El consumo esperado no puede exceder 1000 kWh' })
  consumoEsperado: number;
}
