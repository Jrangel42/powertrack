// Horario operativo (lunes-viernes)
export const HORARIO_INICIO = 6; // 6am
export const HORARIO_CIERRE = 22; // 10pm

// Simulación
export const INTERVALO_SIMULACION_MS = 5000; // 5 segundos
export const VARIABILIDAD_PORCENTAJE = 0.15; // ±15%
export const PROBABILIDAD_PICO = 0.05; // 5%
export const FACTOR_PICO = 1.5; // 150% del consumo esperado
export const CONSUMO_FUERA_HORARIO_MAX = 0.05; // 0-5% del esperado

// Umbrales de detección
export const UMBRAL_CONSUMO_ELEVADO = 1.2; // 120% del promedio
export const UMBRAL_EFICIENCIA_BAJA = 70; // < 70%
export const UMBRAL_CONSUMO_FUERA_HORARIO = 0.1; // > 10% del esperado

// Clasificación de estado
export const UMBRAL_NORMAL = 70; // >= 70% → Normal
export const UMBRAL_ADVERTENCIA = 50; // 50-69% → Advertencia
// < 50% → Crítico

// Clasificación de severidad de alertas
export const UMBRAL_SEVERIDAD_BAJA_MIN = 50; // 50-69%
export const UMBRAL_SEVERIDAD_MEDIA_MIN = 30; // 30-49%
// < 30% → Alta

// Historial
export const MAX_HISTORIAL = 100;

// Colores de estado
export const COLOR_NORMAL = '#22c55e';
export const COLOR_ADVERTENCIA = '#f59e0b';
export const COLOR_CRITICO = '#ef4444';
