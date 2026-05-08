# Diseño Técnico - PowerTrack MVP

## Overview

PowerTrack es un sistema de monitoreo inteligente de consumo energético para instituciones educativas. Este documento describe la arquitectura técnica, componentes, modelos de datos y algoritmos clave para implementar el MVP.

### Objetivos de Diseño

1. **Tiempo Real**: Actualizar métricas cada 5 segundos con latencia máxima de 1 segundo en dashboard
2. **Escalabilidad**: Soportar 50+ aulas simultáneamente sin degradación de rendimiento
3. **Modularidad**: Arquitectura desacoplada que permite agregar funcionalidades sin modificar código existente
4. **Usabilidad**: Interfaz intuitiva y responsive que funciona en navegadores modernos
5. **Confiabilidad**: Mantener integridad de datos y consistencia de alertas

### Stack Tecnológico

- **Frontend**: React 18+ con TypeScript
- **Backend**: NestJS con Node.js
- **Comunicación**: WebSockets para actualizaciones en tiempo real
- **Almacenamiento**: En memoria (sin persistencia)
- **Herramientas**: Vite (build), Vitest (testing), Socket.io (WebSockets)

---

## Architecture

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (React)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Dashboard   │  │  Formulario  │  │  Historial   │           │
│  │  Component   │  │  Component   │  │  Component   │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         │                 │                 │                    │
│         └─────────────────┼─────────────────┘                    │
│                           │                                      │
│                    ┌──────▼──────┐                               │
│                    │ Redux Store │                               │
│                    │ (State Mgmt)│                               │
│                    └──────┬──────┘                               │
│                           │                                      │
│                    ┌──────▼──────────┐                           │
│                    │ WebSocket Client │                          │
│                    └──────┬──────────┘                           │
└─────────────────────────────┼──────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   WebSocket       │
                    │   Connection      │
                    └─────────┬─────────┘
                              │
┌─────────────────────────────▼──────────────────────────────────┐
│                    SERVIDOR (NestJS)                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              API REST Controllers                        │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │  │
│  │  │ Aulas    │  │ Alertas  │  │ Historial│              │  │
│  │  │ Controller│  │ Controller│  │ Controller│             │  │
│  │  └──────────┘  └──────────┘  └──────────┘              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                     │
│  ┌────────────────────────▼────────────────────────────────┐   │
│  │              Servicios de Negocio                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │ AulasService │  │ Simulador    │  │ Calculador   │  │   │
│  │  │              │  │ Consumo      │  │ Eficiencia   │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │ Detector     │  │ Generador    │  │ Clasificador │  │   │
│  │  │ Anomalías    │  │ Alertas      │  │ Estado       │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  └────────────────────────────────────────────────────────┘   │
│                           │                                     │
│  ┌────────────────────────▼────────────────────────────────┐   │
│  │         Almacenamiento en Memoria                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │ Aulas Store  │  │ Consumo Store│  │ Alertas Store│  │   │
│  │  │              │  │              │  │              │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  └────────────────────────────────────────────────────────┘   │
│                           │                                     │
│  ┌────────────────────────▼────────────────────────────────┐   │
│  │         WebSocket Gateway                              │   │
│  │  (Emite eventos a clientes conectados)                 │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

```
1. INICIALIZACIÓN
   ├─ Servidor inicia
   ├─ Carga aulas desde almacenamiento en memoria
   ├─ Inicia simulador de consumo
   └─ Abre WebSocket para conexiones de clientes

2. SIMULACIÓN (cada 5 segundos)
   ├─ Simulador genera consumo para cada aula
   ├─ Calculador computa eficiencia
   ├─ Detector verifica anomalías
   ├─ Generador crea alertas si es necesario
   ├─ Clasificador asigna estado
   └─ WebSocket emite actualización a clientes

3. CLIENTE RECIBE ACTUALIZACIÓN
   ├─ Redux Store actualiza estado
   ├─ Componentes React se re-renderizan
   └─ Dashboard muestra nuevas métricas

4. USUARIO INTERACTÚA
   ├─ Usuario registra/edita/elimina aula
   ├─ Controlador REST procesa solicitud
   ├─ Servicio actualiza almacenamiento
   └─ WebSocket notifica a todos los clientes
```

### Patrones de Arquitectura

**Patrón MVC (Modificado)**
- **Model**: Interfaces TypeScript y almacenamiento en memoria
- **View**: Componentes React
- **Controller**: Controladores NestJS que manejan HTTP y WebSocket

**Patrón de Servicios**
- Cada dominio (Aulas, Consumo, Alertas) tiene su propio servicio
- Servicios son inyectables y testables
- Separación clara de responsabilidades

**Patrón de Eventos**
- WebSocket Gateway emite eventos cuando cambian datos
- Clientes se suscriben a eventos relevantes
- Desacoplamiento entre servidor y cliente

---

## Components and Interfaces

### Backend - Estructura de Módulos

```
src/
├── modules/
│   ├── aulas/
│   │   ├── aulas.controller.ts
│   │   ├── aulas.service.ts
│   │   ├── aulas.module.ts
│   │   └── dto/
│   │       ├── create-aula.dto.ts
│   │       └── update-aula.dto.ts
│   │
│   ├── consumo/
│   │   ├── consumo.service.ts
│   │   ├── simulador.service.ts
│   │   ├── consumo.module.ts
│   │   └── dto/
│   │       └── consumo.dto.ts
│   │
│   ├── eficiencia/
│   │   ├── eficiencia.service.ts
│   │   ├── eficiencia.module.ts
│   │   └── dto/
│   │       └── eficiencia.dto.ts
│   │
│   ├── anomalias/
│   │   ├── detector-anomalias.service.ts
│   │   ├── anomalias.module.ts
│   │   └── dto/
│   │       └── anomalia.dto.ts
│   │
│   ├── alertas/
│   │   ├── alertas.controller.ts
│   │   ├── alertas.service.ts
│   │   ├── generador-alertas.service.ts
│   │   ├── alertas.module.ts
│   │   └── dto/
│   │       └── alerta.dto.ts
│   │
│   ├── estado/
│   │   ├── clasificador-estado.service.ts
│   │   └── estado.module.ts
│   │
│   └── websocket/
│       ├── websocket.gateway.ts
│       └── websocket.module.ts
│
├── common/
│   ├── interfaces/
│   │   ├── aula.interface.ts
│   │   ├── consumo.interface.ts
│   │   ├── alerta.interface.ts
│   │   └── estado.interface.ts
│   │
│   ├── constants/
│   │   └── app.constants.ts
│   │
│   └── utils/
│       ├── validators.ts
│       └── helpers.ts
│
├── app.module.ts
└── main.ts
```

### Backend - Servicios Principales

#### AulasService
```typescript
class AulasService {
  // Gestión de aulas
  crearAula(dto: CreateAulaDto): Aula
  obtenerAulas(): Aula[]
  obtenerAula(id: string): Aula
  actualizarAula(id: string, dto: UpdateAulaDto): Aula
  eliminarAula(id: string): void
  
  // Validación
  validarAula(aula: Aula): boolean
  validarHorario(inicio: number, cierre: number): boolean
}
```

#### SimuladorService
```typescript
class SimuladorService {
  // Simulación de consumo
  iniciarSimulacion(): void
  detenerSimulacion(): void
  generarConsumo(aula: Aula): number
  
  // Lógica de simulación
  private aplicarVariabilidad(consumo: number): number
  private generarPico(): boolean
  private estaEnHorarioOperativo(aula: Aula): boolean
}
```

#### EficienciaService
```typescript
class EficienciaService {
  // Cálculo de eficiencia
  calcularEficiencia(consumoActual: number, consumoEsperado: number): number
  
  // Estadísticas
  calcularPromedio(historial: number[]): number
  calcularDesviacion(historial: number[]): number
  calcularMinMax(historial: number[]): { min: number; max: number }
}
```

#### DetectorAnomalias
```typescript
class DetectorAnomalias {
  // Detección de anomalías
  detectarConsumoElevado(consumoActual: number, promedio: number): boolean
  detectarEficienciaBaja(eficiencia: number): boolean
  detectarConsumoFueraHorario(aula: Aula, consumoActual: number): boolean
}
```

#### GeneradorAlertas
```typescript
class GeneradorAlertas {
  // Generación de alertas
  generarAlerta(tipo: string, aula: Aula, descripcion: string): Alerta
  clasificarSeveridad(eficiencia: number): 'Baja' | 'Media' | 'Alta'
  marcarResuelta(alertaId: string): void
}
```

#### ClasificadorEstado
```typescript
class ClasificadorEstado {
  // Clasificación de estado
  clasificarEstado(eficiencia: number): 'Normal' | 'Advertencia' | 'Crítico'
  obtenerColor(estado: string): string
}
```

### Frontend - Estructura de Componentes

```
src/
├── components/
│   ├── Dashboard/
│   │   ├── Dashboard.tsx
│   │   ├── AulaCard.tsx
│   │   ├── AlertasPanel.tsx
│   │   └── Dashboard.module.css
│   │
│   ├── Formulario/
│   │   ├── FormularioAula.tsx
│   │   ├── FormularioAula.module.css
│   │   └── validaciones.ts
│   │
│   ├── Historial/
│   │   ├── HistorialConsumo.tsx
│   │   ├── GraficoConsumo.tsx
│   │   ├── TablaConsumo.tsx
│   │   └── Historial.module.css
│   │
│   ├── Common/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Indicador.tsx
│   │   └── Common.module.css
│   │
│   └── Alertas/
│       ├── AlertaItem.tsx
│       └── Alertas.module.css
│
├── hooks/
│   ├── useWebSocket.ts
│   ├── useAulas.ts
│   └── useAlertas.ts
│
├── store/
│   ├── store.ts
│   ├── slices/
│   │   ├── aulasSlice.ts
│   │   ├── alertasSlice.ts
│   │   └── uiSlice.ts
│   └── types.ts
│
├── services/
│   ├── api.ts
│   └── websocket.ts
│
├── types/
│   ├── aula.types.ts
│   ├── alerta.types.ts
│   └── consumo.types.ts
│
├── App.tsx
└── main.tsx
```

### Frontend - Componentes Principales

#### Dashboard Component
```typescript
interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  // Muestra:
  // - Lista de aulas con estado actual
  // - Indicadores visuales (colores)
  // - Panel de alertas activas
  // - Botones para registrar/editar aulas
  // - Actualización en tiempo real vía WebSocket
}
```

#### FormularioAula Component
```typescript
interface FormularioAulaProps {
  aula?: Aula
  onSubmit: (aula: CreateAulaDto) => void
  onCancel: () => void
}

const FormularioAula: React.FC<FormularioAulaProps> = () => {
  // Campos:
  // - Nombre del aula
  // - Horario de inicio (0-23)
  // - Horario de cierre (0-23)
  // - Consumo esperado (kWh)
  // Validación en tiempo real
}
```

#### HistorialConsumo Component
```typescript
interface HistorialConsumoProps {
  aulaId: string
}

const HistorialConsumo: React.FC<HistorialConsumoProps> = () => {
  // Muestra:
  // - Gráfico de líneas con últimos 100 valores
  // - Tabla con últimos 20 valores
  // - Estadísticas (min, max, promedio, desviación)
  // - Interactividad: hover, click en tabla
}
```

---

## Data Models

### Interfaces TypeScript

#### Aula
```typescript
interface Aula {
  id: string                    // UUID único
  nombre: string                // Nombre del aula
  horarioInicio: number         // Hora de inicio (0-23)
  horioCierre: number           // Hora de cierre (0-23)
  consumoEsperado: number       // kWh esperado
  consumoActual: number         // kWh actual
  eficiencia: number            // Porcentaje (0-∞)
  estado: 'Normal' | 'Advertencia' | 'Crítico'
  historialConsumo: number[]    // Últimos 100 valores
  historialEficiencia: number[] // Últimos 100 valores
  ultimaActualizacion: Date     // Timestamp
  createdAt: Date
  updatedAt: Date
}
```

#### Consumo
```typescript
interface Consumo {
  id: string
  aulaId: string
  valor: number                 // kWh
  timestamp: Date
  esAnomalia: boolean
  tipoAnomalia?: 'Elevado' | 'FueraHorario'
}
```

#### Alerta
```typescript
interface Alerta {
  id: string
  aulaId: string
  tipo: 'Consumo Elevado' | 'Eficiencia Baja' | 'Consumo Fuera de Horario'
  severidad: 'Baja' | 'Media' | 'Alta'
  descripcion: string
  timestamp: Date
  resuelta: boolean
  resolutionTime?: Date
}
```

#### Estado
```typescript
interface Estado {
  aulaId: string
  estado: 'Normal' | 'Advertencia' | 'Crítico'
  color: '#4CAF50' | '#FFC107' | '#F44336'
  eficiencia: number
  timestamp: Date
}
```

#### Estadísticas
```typescript
interface Estadisticas {
  consumoMinimo: number
  consumoMaximo: number
  consumoPromedio: number
  desviacionEstandar: number
  eficienciaPromedio: number
}
```

### Almacenamiento en Memoria

```typescript
class InMemoryStore {
  private aulas: Map<string, Aula> = new Map()
  private consumos: Map<string, Consumo[]> = new Map()
  private alertas: Map<string, Alerta[]> = new Map()
  
  // Métodos de acceso
  getAula(id: string): Aula | undefined
  getAllAulas(): Aula[]
  saveAula(aula: Aula): void
  deleteAula(id: string): void
  
  // Historial (máximo 100 valores por aula)
  addConsumo(aulaId: string, consumo: Consumo): void
  getHistorialConsumo(aulaId: string): Consumo[]
  
  // Alertas
  addAlerta(alerta: Alerta): void
  getAlertas(aulaId?: string): Alerta[]
  updateAlerta(id: string, alerta: Partial<Alerta>): void
}
```

---

## Correctness Properties

Antes de escribir las propiedades de corrección, necesito analizar si Property-Based Testing (PBT) es aplicable a este feature.

### Evaluación de Aplicabilidad de PBT

PowerTrack MVP incluye varios tipos de funcionalidades:

1. **Funciones Puras (Aplicables a PBT)**:
   - Cálculo de eficiencia: `η = (E_útil / E_total) × 100`
   - Detección de anomalías (lógica de comparación)
   - Clasificación de estado (basada en rangos de eficiencia)
   - Cálculo de estadísticas (promedio, desviación)

2. **Funcionalidades NO Aplicables a PBT**:
   - Gestión de aulas (CRUD simple)
   - Simulación de consumo (generación aleatoria)
   - Almacenamiento en memoria (no hay lógica transformacional)
   - WebSocket (comunicación, no lógica de negocio)
   - UI/Dashboard (rendering)

**Conclusión**: PBT ES aplicable para las funciones de cálculo y detección de anomalías.

### Propiedades de Corrección

*Una propiedad es una característica o comportamiento que debe ser verdadero en todas las ejecuciones válidas de un sistema - esencialmente, una declaración formal sobre lo que el sistema debe hacer. Las propiedades sirven como puente entre especificaciones legibles por humanos y garantías de corrección verificables por máquina.*

#### Property 1: Cálculo de Eficiencia - Fórmula Correcta

*Para cualquier valor de consumo actual y consumo esperado positivos, calcular la eficiencia usando la fórmula η = (E_útil / E_total) × 100 debe producir un resultado que, cuando se invierte la fórmula, recupere el consumo actual original.*

**Validates: Requirements 3.1, 3.2, 3.6**

**Rationale**: Esta es una propiedad round-trip. Si calculamos eficiencia y luego invertimos la fórmula (consumoActual = consumoEsperado / (eficiencia / 100)), debemos recuperar el valor original. Esto valida que la fórmula se aplica correctamente.

#### Property 2: Eficiencia Inversamente Proporcional al Consumo

*Para cualquier consumo esperado fijo, si el consumo actual aumenta, la eficiencia debe disminuir (relación inversa).*

**Validates: Requirements 3.1, 3.8**

**Rationale**: La eficiencia es inversamente proporcional al consumo actual. Esta propiedad metamórfica valida que la relación matemática es correcta.

#### Property 3: Rango de Eficiencia Válido

*Para cualquier consumo actual y consumo esperado positivos, la eficiencia calculada debe estar en el rango [0, ∞). Específicamente, cuando consumo actual = consumo esperado, eficiencia = 100%.*

**Validates: Requirements 3.3, 3.4, 3.5**

**Rationale**: Valida casos específicos de la fórmula (100% cuando son iguales, 50% cuando actual es el doble, 0% cuando actual es cero).

#### Property 4: Redondeo Consistente a Dos Decimales

*Para cualquier valor de eficiencia calculado, el redondeo a dos decimales debe ser consistente y determinístico. Aplicar el redondeo múltiples veces debe producir el mismo resultado.*

**Validates: Requirements 3.6**

**Rationale**: Idempotencia del redondeo - aplicarlo múltiples veces no debe cambiar el resultado.

#### Property 5: Historial Mantiene Orden Cronológico

*Para cualquier historial de consumo, los valores deben estar ordenados cronológicamente. Si se agrega un nuevo valor con timestamp más reciente, debe aparecer al final del historial.*

**Validates: Requirements 2.8, 7.2, 7.8**

**Rationale**: Invariante de orden. El historial debe mantener integridad cronológica.

#### Property 6: Historial Limitado a 100 Valores (FIFO)

*Para cualquier historial que alcance 100 valores, agregar un nuevo valor debe mantener exactamente 100 valores, eliminando el más antiguo (FIFO).*

**Validates: Requirements 2.8, 7.8**

**Rationale**: Invariante de tamaño. El historial nunca debe exceder 100 valores.

#### Property 7: Detección de Consumo Elevado

*Para cualquier consumo actual que exceda el 120% del promedio histórico, la función detectarConsumoElevado debe retornar true. Para cualquier consumo que no exceda este umbral, debe retornar false.*

**Validates: Requirements 5.1**

**Rationale**: Valida la lógica de detección de anomalías para consumo elevado.

#### Property 8: Detección de Eficiencia Baja

*Para cualquier eficiencia menor al 70%, la función detectarEficienciaBaja debe retornar true. Para cualquier eficiencia ≥ 70%, debe retornar false.*

**Validates: Requirements 5.2**

**Rationale**: Valida la lógica de detección de anomalías para eficiencia baja.

#### Property 9: Detección de Consumo Fuera de Horario

*Para cualquier aula fuera de su horario operativo, si el consumo actual es mayor al 10% del consumo esperado, detectarConsumoFueraHorario debe retornar true. Si el consumo es ≤ 10%, debe retornar false.*

**Validates: Requirements 4.1, 4.2**

**Rationale**: Valida la lógica de detección de consumo fuera de horario.

#### Property 10: Clasificación de Estado Determinística

*Para cualquier valor de eficiencia, la clasificación de estado debe ser determinística y consistente:*
- *Si eficiencia ≥ 70%, estado = "Normal"*
- *Si 50% ≤ eficiencia < 70%, estado = "Advertencia"*
- *Si eficiencia < 50%, estado = "Crítico"*

**Validates: Requirements 8.1, 8.2, 8.3, 8.4**

**Rationale**: Valida que la clasificación es determinística basada en rangos de eficiencia.

#### Property 11: Severidad de Alerta Basada en Eficiencia

*Para cualquier eficiencia, la clasificación de severidad debe ser:*
- *Si 50% ≤ eficiencia < 70%, severidad = "Baja"*
- *Si 30% ≤ eficiencia < 50%, severidad = "Media"*
- *Si eficiencia < 30%, severidad = "Alta"*

**Validates: Requirements 5.5**

**Rationale**: Valida que la severidad se clasifica correctamente según rangos de eficiencia.

#### Property 12: Alerta Tiene Todos los Campos Requeridos

*Para cualquier alerta generada, debe contener: id único, aulaId, tipo, severidad, descripción, timestamp, y estado resuelta.*

**Validates: Requirements 5.4**

**Rationale**: Invariante de estructura. Toda alerta debe tener todos los campos requeridos.

#### Property 13: Consumo Simulado Dentro de Rango Esperado

*Para cualquier aula durante horario operativo, el consumo simulado debe estar dentro del rango [consumoEsperado × 0.85, consumoEsperado × 1.15] (±15% de variabilidad).*

**Validates: Requirements 2.2**

**Rationale**: Valida que la variabilidad simulada está dentro del rango especificado.

#### Property 14: Consumo Fuera de Horario Mínimo

*Para cualquier aula fuera de su horario operativo, el consumo simulado debe estar en el rango [0, consumoEsperado × 0.05] (0-5% del consumo esperado).*

**Validates: Requirements 2.4**

**Rationale**: Valida que el consumo fuera de horario es mínimo.

#### Property 15: Consumo Durante Horario Operativo Mayor que Fuera de Horario

*Para cualquier aula, el consumo promedio durante horario operativo debe ser siempre mayor que el consumo promedio fuera de horario.*

**Validates: Requirements 2.3, 2.4**

**Rationale**: Propiedad metamórfica que valida la relación entre consumo dentro y fuera de horario.

---

## Error Handling

### Estrategia de Manejo de Errores

#### Validación de Entrada

```typescript
// Validación de Aula
- Nombre: no vacío, máximo 100 caracteres
- Horario Inicio: 0-23, número entero
- Horario Cierre: 0-23, número entero, > horario inicio
- Consumo Esperado: número positivo, máximo 1000 kWh

// Validación de Consumo
- Valor: número no negativo
- Timestamp: fecha válida

// Validación de Alerta
- Tipo: uno de los tipos permitidos
- Severidad: una de las severidades permitidas
```

#### Manejo de Excepciones

```typescript
// Backend (NestJS)
- BadRequestException: Validación fallida
- NotFoundException: Recurso no encontrado
- InternalServerErrorException: Error interno del servidor
- ConflictException: Conflicto de datos (ej: aula duplicada)

// Frontend (React)
- Mostrar toast/snackbar con mensaje de error
- Registrar error en consola para debugging
- Permitir reintentos automáticos para errores de red
```

#### Recuperación de Errores

```typescript
// Errores de Validación
- Mostrar mensaje específico indicando qué campo es inválido
- Permitir al usuario corregir y reintentar

// Errores de Conexión WebSocket
- Intentar reconectar automáticamente cada 3 segundos
- Mostrar indicador visual de desconexión
- Sincronizar estado cuando se reconecta

// Errores de Almacenamiento
- Registrar error en logs
- Notificar al usuario que el sistema está en estado inconsistente
- Sugerir recargar la página
```

---

## Testing Strategy

### Enfoque Dual de Testing

PowerTrack MVP utiliza dos estrategias complementarias de testing:

#### 1. Property-Based Testing (PBT)

**Aplicable a**: Funciones de cálculo, detección de anomalías, clasificación de estado

**Configuración**:
- Mínimo 100 iteraciones por propiedad
- Generadores de datos aleatorios para inputs
- Cada test referencia una propiedad del documento de diseño

**Ejemplo de Test**:
```typescript
// Feature: powertrack-mvp, Property 1: Cálculo de Eficiencia - Fórmula Correcta
describe('EficienciaService', () => {
  it('should calculate efficiency correctly (round-trip property)', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0.1, max: 1000 }), // consumoEsperado
        fc.float({ min: 0.1, max: 1000 }), // consumoActual
        (consumoEsperado, consumoActual) => {
          const eficiencia = eficienciaService.calcularEficiencia(
            consumoActual,
            consumoEsperado
          )
          
          // Invertir la fórmula
          const consumoRecuperado = consumoEsperado / (eficiencia / 100)
          
          // Debe recuperar el valor original (con tolerancia de redondeo)
          expect(Math.abs(consumoRecuperado - consumoActual)).toBeLessThan(0.01)
        }
      ),
      { numRuns: 100 }
    )
  })
})
```

#### 2. Unit Tests (Ejemplo-Based)

**Aplicable a**: Casos específicos, edge cases, integración

**Ejemplos**:
```typescript
describe('AulasService', () => {
  it('should create a classroom with valid data', () => {
    const dto: CreateAulaDto = {
      nombre: 'Aula 101',
      horarioInicio: 6,
      horioCierre: 22,
      consumoEsperado: 50
    }
    
    const aula = aulasService.crearAula(dto)
    
    expect(aula.id).toBeDefined()
    expect(aula.nombre).toBe('Aula 101')
    expect(aula.estado).toBe('Normal')
  })
  
  it('should reject classroom with missing fields', () => {
    const dto: Partial<CreateAulaDto> = {
      nombre: 'Aula 101'
      // Faltan otros campos
    }
    
    expect(() => aulasService.crearAula(dto as CreateAulaDto))
      .toThrow(BadRequestException)
  })
})
```

#### 3. Integration Tests

**Aplicable a**: Flujos completos, WebSocket, comunicación cliente-servidor

**Ejemplos**:
```typescript
describe('Dashboard Integration', () => {
  it('should update dashboard when consumption changes', async () => {
    // 1. Crear aula
    const aula = await createTestClassroom()
    
    // 2. Simular cambio de consumo
    await simulateConsumption(aula.id, 75)
    
    // 3. Verificar que dashboard recibe actualización
    const dashboardData = await getDashboardData()
    expect(dashboardData.aulas[0].consumoActual).toBe(75)
  })
})
```

### Cobertura de Testing

| Componente | Unit Tests | Property Tests | Integration Tests |
|-----------|-----------|----------------|------------------|
| EficienciaService | ✓ | ✓ | - |
| DetectorAnomalias | ✓ | ✓ | - |
| ClasificadorEstado | ✓ | ✓ | - |
| AulasService | ✓ | - | ✓ |
| SimuladorService | ✓ | - | ✓ |
| GeneradorAlertas | ✓ | ✓ | - |
| Dashboard Component | ✓ | - | ✓ |
| WebSocket Gateway | - | - | ✓ |

### Criterios de Aceptación de Testing

- Cobertura de código mínimo 80%
- Todos los requisitos funcionales tienen al menos un test
- Todas las propiedades de corrección tienen un test PBT
- Todos los flujos principales tienen un test de integración
- Todos los tests pasan antes de merge a main

---

## Key Algorithms

### Algoritmo 1: Generación de Consumo Simulado

```
FUNCIÓN generarConsumo(aula: Aula, horaActual: number): number
  SI estaEnHorarioOperativo(aula, horaActual) ENTONCES
    consumoBase ← aula.consumoEsperado
    variabilidad ← aplicarVariabilidad(consumoBase)  // ±15%
    
    SI generarPico() ENTONCES  // Probabilidad ~5%
      consumo ← variabilidad × 1.5  // Hasta 150%
    SINO
      consumo ← variabilidad
    FIN SI
  SINO
    consumo ← aula.consumoEsperado × random(0, 0.05)  // 0-5%
  FIN SI
  
  RETORNAR redondear(consumo, 2)
FIN FUNCIÓN

FUNCIÓN aplicarVariabilidad(consumo: number): number
  factor ← random(0.85, 1.15)  // ±15%
  RETORNAR consumo × factor
FIN FUNCIÓN

FUNCIÓN generarPico(): boolean
  RETORNAR random(0, 1) < 0.05  // 5% de probabilidad
FIN FUNCIÓN
```

### Algoritmo 2: Cálculo de Eficiencia

```
FUNCIÓN calcularEficiencia(consumoActual: number, consumoEsperado: number): number
  SI consumoActual = 0 ENTONCES
    RETORNAR 0
  FIN SI
  
  eficiencia ← (consumoEsperado / consumoActual) × 100
  eficienciaRedondeada ← redondear(eficiencia, 2)
  
  RETORNAR eficienciaRedondeada
FIN FUNCIÓN
```

### Algoritmo 3: Detección de Anomalías

```
FUNCIÓN detectarAnomalias(aula: Aula, horaActual: number): Anomalia[]
  anomalias ← []
  
  // Anomalía 1: Consumo elevado
  promedio ← calcularPromedio(aula.historialConsumo)
  SI aula.consumoActual > promedio × 1.2 ENTONCES
    anomalias.agregar({tipo: 'ConsumoElevado', valor: aula.consumoActual})
  FIN SI
  
  // Anomalía 2: Eficiencia baja
  SI aula.eficiencia < 70 ENTONCES
    anomalias.agregar({tipo: 'EficienciaBaja', valor: aula.eficiencia})
  FIN SI
  
  // Anomalía 3: Consumo fuera de horario
  SI NO estaEnHorarioOperativo(aula, horaActual) ENTONCES
    SI aula.consumoActual > aula.consumoEsperado × 0.1 ENTONCES
      anomalias.agregar({tipo: 'ConsumoFueraHorario', valor: aula.consumoActual})
    FIN SI
  FIN SI
  
  RETORNAR anomalias
FIN FUNCIÓN
```

### Algoritmo 4: Clasificación de Estado

```
FUNCIÓN clasificarEstado(eficiencia: number): Estado
  SI eficiencia >= 70 ENTONCES
    RETORNAR {estado: 'Normal', color: '#4CAF50'}
  SINO SI eficiencia >= 50 ENTONCES
    RETORNAR {estado: 'Advertencia', color: '#FFC107'}
  SINO
    RETORNAR {estado: 'Crítico', color: '#F44336'}
  FIN SI
FIN FUNCIÓN
```

### Algoritmo 5: Cálculo de Estadísticas

```
FUNCIÓN calcularEstadisticas(historial: number[]): Estadisticas
  SI historial.longitud = 0 ENTONCES
    RETORNAR {minimo: 0, maximo: 0, promedio: 0, desviacion: 0}
  FIN SI
  
  minimo ← MIN(historial)
  maximo ← MAX(historial)
  promedio ← SUMA(historial) / historial.longitud
  
  // Desviación estándar
  varianza ← SUMA((valor - promedio)² para cada valor en historial) / historial.longitud
  desviacion ← RAIZ_CUADRADA(varianza)
  
  RETORNAR {
    minimo: redondear(minimo, 2),
    maximo: redondear(maximo, 2),
    promedio: redondear(promedio, 2),
    desviacion: redondear(desviacion, 2)
  }
FIN FUNCIÓN
```

---

## Performance Considerations

### Optimizaciones de React

1. **Memoización de Componentes**
   - Usar `React.memo()` para componentes que reciben props estables
   - Usar `useMemo()` para cálculos costosos
   - Usar `useCallback()` para funciones pasadas como props

2. **Lazy Loading**
   - Cargar componentes de historial bajo demanda
   - Usar `React.lazy()` para rutas no críticas

3. **Virtualización**
   - Para listas largas de aulas, usar virtualización (react-window)
   - Renderizar solo elementos visibles

### Optimizaciones de Backend

1. **Gestión de Memoria**
   - Limitar historial a 100 valores por aula
   - Usar Map en lugar de arrays para búsquedas O(1)
   - Limpiar referencias no utilizadas

2. **Actualización Eficiente**
   - Emitir solo cambios a través de WebSocket
   - Usar delta updates en lugar de full state
   - Batching de actualizaciones cada 5 segundos

3. **Cálculos Optimizados**
   - Cachear promedio histórico
   - Recalcular solo cuando hay nuevos datos
   - Usar operaciones matemáticas eficientes

### Límites de Recursos

- **Memoria**: Máximo 10MB para 50 aulas con 100 valores de historial
- **CPU**: < 20% en estado de reposo
- **Latencia**: < 1 segundo para actualizaciones en dashboard
- **Conexiones WebSocket**: Soportar 100+ conexiones simultáneas

---

## Security and Validation

### Validación de Entrada

```typescript
// Validadores reutilizables
const validators = {
  nombre: (valor: string) => {
    if (!valor || valor.trim().length === 0) throw new Error('Nombre requerido')
    if (valor.length > 100) throw new Error('Nombre muy largo')
    return valor.trim()
  },
  
  horario: (valor: number) => {
    if (!Number.isInteger(valor)) throw new Error('Horario debe ser entero')
    if (valor < 0 || valor > 23) throw new Error('Horario debe estar entre 0-23')
    return valor
  },
  
  consumo: (valor: number) => {
    if (valor <= 0) throw new Error('Consumo debe ser positivo')
    if (valor > 1000) throw new Error('Consumo máximo es 1000 kWh')
    return valor
  }
}
```

### Manejo de Errores

```typescript
// Middleware de error global (NestJS)
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: HttpArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    
    let status = 500
    let message = 'Error interno del servidor'
    
    if (exception instanceof BadRequestException) {
      status = 400
      message = exception.getResponse()['message']
    } else if (exception instanceof NotFoundException) {
      status = 404
      message = 'Recurso no encontrado'
    }
    
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString()
    })
  }
}
```

### Límites de Recursos

```typescript
// Rate limiting para API
@UseGuards(ThrottlerGuard)
@Throttle(100, 60)  // 100 requests por minuto
@Post('/aulas')
crearAula(@Body() dto: CreateAulaDto) {
  // ...
}

// Validación de tamaño de payload
app.use(express.json({ limit: '1mb' }))
```

---

## Design Decisions and Rationale

### 1. Almacenamiento en Memoria vs Base de Datos

**Decisión**: Usar almacenamiento en memoria para el MVP

**Rationale**:
- Simplifica el MVP sin agregar complejidad de persistencia
- Suficiente para validar lógica de negocio
- Permite iteración rápida
- Futuras versiones pueden agregar persistencia

**Trade-offs**:
- Datos se pierden al reiniciar el servidor
- No escalable a múltiples instancias
- Limitado por memoria disponible

### 2. WebSockets para Actualizaciones en Tiempo Real

**Decisión**: Usar WebSockets en lugar de polling

**Rationale**:
- Menor latencia (push vs pull)
- Menor consumo de ancho de banda
- Mejor experiencia de usuario
- Escalable a múltiples clientes

**Trade-offs**:
- Más complejo que polling
- Requiere manejo de reconexión
- Requiere servidor con soporte WebSocket

### 3. React + Redux para Estado Global

**Decisión**: Usar Redux para gestión de estado

**Rationale**:
- Predecible y fácil de debuggear
- Integración con DevTools
- Facilita testing
- Escalable a aplicaciones complejas

**Trade-offs**:
- Boilerplate inicial
- Curva de aprendizaje
- Alternativa: Context API (más simple pero menos escalable)

### 4. NestJS para Backend

**Decisión**: Usar NestJS en lugar de Express puro

**Rationale**:
- Arquitectura modular y escalable
- Inyección de dependencias integrada
- Decoradores para validación y autorización
- Mejor para proyectos grandes

**Trade-offs**:
- Más overhead que Express
- Curva de aprendizaje
- Alternativa: Express (más simple pero menos estructurado)

### 5. Simulación de Consumo vs Sensores Reales

**Decisión**: Usar simulación para el MVP

**Rationale**:
- No requiere hardware
- Reproducible y testeable
- Permite validar lógica de detección de anomalías
- Más rápido de desarrollar

**Trade-offs**:
- No refleja datos reales
- Futuras versiones necesitarán integración con sensores

---

## Deployment and Operations

### Requisitos de Infraestructura

- **Node.js**: v18+ LTS
- **Memoria**: Mínimo 2GB RAM
- **CPU**: 2+ cores
- **Almacenamiento**: 1GB para logs y datos temporales

### Variables de Entorno

```bash
# Backend
NODE_ENV=production
PORT=3000
WEBSOCKET_PORT=3001
LOG_LEVEL=info

# Frontend
VITE_API_URL=http://localhost:3000
VITE_WEBSOCKET_URL=ws://localhost:3001
```

### Monitoreo

```typescript
// Métricas a monitorear
- Número de aulas activas
- Latencia de WebSocket
- Uso de memoria
- Errores por minuto
- Tasa de alertas generadas
```

---

## Future Enhancements

1. **Persistencia de Datos**: Integrar PostgreSQL o MongoDB
2. **Autenticación**: Agregar JWT y roles de usuario
3. **Reportes**: Exportar datos a PDF/Excel
4. **Predicción**: Machine learning para predecir anomalías
5. **Integración BMS**: Conectar con sistemas de control de edificios
6. **Notificaciones**: Email/SMS para alertas críticas
7. **Multi-tenancy**: Soportar múltiples instituciones
8. **Mobile App**: Aplicación nativa para iOS/Android

---

## Conclusion

Este documento de diseño proporciona una arquitectura sólida y escalable para PowerTrack MVP. La separación clara de responsabilidades, el uso de patrones establecidos y la inclusión de propiedades de corrección garantizan que el sistema sea confiable, mantenible y fácil de extender.

La combinación de property-based testing para funciones puras y unit/integration tests para lógica de negocio proporciona cobertura completa y confianza en la corrección del sistema.

