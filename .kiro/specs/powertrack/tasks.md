# Tareas de Implementación - PowerTrack MVP

## Estado de Progreso

- [ ] = Pendiente
- [-] = En progreso
- [x] = Completado

---

## Fase 1: Configuración Inicial del Proyecto

- [x] 1. Inicializar monorepo y estructura base del proyecto
  - [x] 1.1 Crear estructura de carpetas del monorepo (`/backend`, `/frontend`)
  - [x] 1.2 Inicializar proyecto NestJS en `/backend` con TypeScript
  - [x] 1.3 Inicializar proyecto React + Vite en `/frontend` con TypeScript
  - [x] 1.4 Configurar `package.json` raíz con scripts para ejecutar ambos proyectos
  - [x] 1.5 Crear `.gitignore` y `README.md` base

- [x] 2. Configurar dependencias del backend
  - [x] 2.1 Instalar dependencias NestJS: `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io`
  - [x] 2.2 Instalar dependencias de validación: `class-validator`, `class-transformer`
  - [x] 2.3 Instalar dependencias de utilidades: `uuid`
  - [x] 2.4 Instalar dependencias de testing: `vitest`, `fast-check`
  - [x] 2.5 Configurar `tsconfig.json` del backend

- [x] 3. Configurar dependencias del frontend
  - [x] 3.1 Instalar dependencias de estado: `@reduxjs/toolkit`, `react-redux`
  - [x] 3.2 Instalar dependencias de WebSocket: `socket.io-client`
  - [x] 3.3 Instalar dependencias de gráficos: `recharts`
  - [x] 3.4 Instalar dependencias de UI: `lucide-react`
  - [x] 3.5 Configurar `tsconfig.json` y `vite.config.ts` del frontend

---

## Fase 2: Backend - Interfaces y Almacenamiento

- [x] 4. Crear interfaces y tipos comunes del backend
  - [x] 4.1 Crear interfaz `Aula` en `src/common/interfaces/aula.interface.ts`
  - [x] 4.2 Crear interfaz `Consumo` en `src/common/interfaces/consumo.interface.ts`
  - [x] 4.3 Crear interfaz `Alerta` en `src/common/interfaces/alerta.interface.ts`
  - [x] 4.4 Crear interfaz `Estadisticas` en `src/common/interfaces/estadisticas.interface.ts`
  - [x] 4.5 Crear constantes en `src/common/constants/app.constants.ts` (umbrales, horarios, intervalos)

- [-] 5. Implementar almacenamiento en memoria (`InMemoryStore`)
  - [ ] 5.1 Crear clase `InMemoryStore` en `src/common/store/in-memory.store.ts`
  - [ ] 5.2 Implementar métodos CRUD para aulas (`getAula`, `getAllAulas`, `saveAula`, `deleteAula`)
  - [ ] 5.3 Implementar métodos de historial de consumo con límite FIFO de 100 valores
  - [ ] 5.4 Implementar métodos de alertas (`addAlerta`, `getAlertas`, `updateAlerta`)
  - [ ] 5.5 Registrar `InMemoryStore` como provider global en `AppModule`

---

## Fase 3: Backend - Módulo de Aulas (RF01)

- [ ] 6. Implementar módulo de aulas
  - [ ] 6.1 Crear `CreateAulaDto` con validaciones (`class-validator`): nombre, horarioInicio, horarioCierre, consumoEsperado
  - [ ] 6.2 Crear `UpdateAulaDto` con campos opcionales
  - [ ] 6.3 Implementar `AulasService` con métodos: `crearAula`, `obtenerAulas`, `obtenerAula`, `actualizarAula`, `eliminarAula`
  - [ ] 6.4 Implementar `AulasController` con endpoints REST: `POST /aulas`, `GET /aulas`, `GET /aulas/:id`, `PUT /aulas/:id`, `DELETE /aulas/:id`
  - [ ] 6.5 Crear `AulasModule` y registrar en `AppModule`
  - [ ] 6.6 Configurar `ValidationPipe` global en `main.ts`

---

## Fase 4: Backend - Módulo de Simulación (RF02)

- [ ] 7. Implementar servicio de simulación de consumo
  - [ ] 7.1 Crear `SimuladorService` en `src/modules/consumo/simulador.service.ts`
  - [ ] 7.2 Implementar `estaEnHorarioOperativo(aula, horaActual)`: verifica lunes-viernes 6am-10pm
  - [ ] 7.3 Implementar `aplicarVariabilidad(consumo)`: factor aleatorio ±15%
  - [ ] 7.4 Implementar `generarPico()`: retorna `true` con probabilidad 5%
  - [ ] 7.5 Implementar `generarConsumo(aula)`: lógica completa con horario, variabilidad y picos
  - [ ] 7.6 Implementar `iniciarSimulacion()`: loop con `setInterval` cada 5 segundos para todas las aulas
  - [ ] 7.7 Implementar `detenerSimulacion()`: limpia el intervalo
  - [ ] 7.8 Crear `ConsumoModule` y registrar `SimuladorService`

---

## Fase 5: Backend - Módulo de Eficiencia (RF03)

- [ ] 8. Implementar servicio de cálculo de eficiencia
  - [ ] 8.1 Crear `EficienciaService` en `src/modules/eficiencia/eficiencia.service.ts`
  - [ ] 8.2 Implementar `calcularEficiencia(consumoActual, consumoEsperado)`: fórmula η = (E_útil / E_total) × 100, redondeado a 2 decimales
  - [ ] 8.3 Implementar `calcularPromedio(historial)`: promedio del array de valores
  - [ ] 8.4 Implementar `calcularDesviacion(historial)`: desviación estándar
  - [ ] 8.5 Implementar `calcularMinMax(historial)`: retorna `{ min, max }`
  - [ ] 8.6 Implementar `calcularEstadisticas(historial)`: retorna objeto `Estadisticas` completo
  - [ ] 8.7 Crear `EficienciaModule` y registrar en `AppModule`

---

## Fase 6: Backend - Módulo de Detección de Anomalías (RF04, RF08)

- [ ] 9. Implementar detector de anomalías
  - [ ] 9.1 Crear `DetectorAnomalias` en `src/modules/anomalias/detector-anomalias.service.ts`
  - [ ] 9.2 Implementar `detectarConsumoElevado(consumoActual, promedio)`: retorna `true` si consumo > promedio × 1.2
  - [ ] 9.3 Implementar `detectarEficienciaBaja(eficiencia)`: retorna `true` si eficiencia < 70
  - [ ] 9.4 Implementar `detectarConsumoFueraHorario(aula, consumoActual, horaActual)`: retorna `true` si fuera de horario y consumo > 10% del esperado
  - [ ] 9.5 Implementar `detectarAnomalias(aula, horaActual)`: orquesta los tres detectores y retorna array de anomalías
  - [ ] 9.6 Crear `AnomaliaModule` y registrar en `AppModule`

---

## Fase 7: Backend - Módulo de Alertas (RF05)

- [ ] 10. Implementar generador y servicio de alertas
  - [ ] 10.1 Crear `GeneradorAlertas` en `src/modules/alertas/generador-alertas.service.ts`
  - [ ] 10.2 Implementar `clasificarSeveridad(eficiencia)`: Baja (50-69%), Media (30-49%), Alta (<30%)
  - [ ] 10.3 Implementar `generarAlerta(tipo, aula, descripcion)`: crea objeto `Alerta` con UUID, timestamp y severidad
  - [ ] 10.4 Implementar `marcarResuelta(alertaId)`: actualiza alerta en store con `resuelta: true` y `resolutionTime`
  - [ ] 10.5 Crear `AlertasService` que expone `getAlertas(aulaId?)` y `getAlertasActivas()`
  - [ ] 10.6 Crear `AlertasController` con endpoints: `GET /alertas`, `GET /alertas/:aulaId`, `PATCH /alertas/:id/resolver`
  - [ ] 10.7 Crear `AlertasModule` y registrar en `AppModule`

---

## Fase 8: Backend - Módulo de Estado (RF08)

- [ ] 11. Implementar clasificador de estado
  - [ ] 11.1 Crear `ClasificadorEstado` en `src/modules/estado/clasificador-estado.service.ts`
  - [ ] 11.2 Implementar `clasificarEstado(eficiencia)`: Normal (≥70%), Advertencia (50-69%), Crítico (<50%)
  - [ ] 11.3 Implementar `obtenerColor(estado)`: retorna color hex correspondiente
  - [ ] 11.4 Crear `EstadoModule` y registrar en `AppModule`

---

## Fase 9: Backend - Orquestador del Ciclo de Monitoreo

- [ ] 12. Implementar orquestador del ciclo de monitoreo
  - [ ] 12.1 Crear `MonitoreoService` en `src/modules/monitoreo/monitoreo.service.ts`
  - [ ] 12.2 Implementar `procesarCiclo()`: para cada aula, ejecuta simulación → eficiencia → detección → alertas → clasificación → actualización en store
  - [ ] 12.3 Integrar `SimuladorService`, `EficienciaService`, `DetectorAnomalias`, `GeneradorAlertas`, `ClasificadorEstado`
  - [ ] 12.4 Emitir evento WebSocket al finalizar cada ciclo con el estado actualizado de todas las aulas
  - [ ] 12.5 Crear `MonitoreoModule` y registrar en `AppModule`

---

## Fase 10: Backend - WebSocket Gateway

- [ ] 13. Implementar WebSocket Gateway
  - [ ] 13.1 Crear `PowerTrackGateway` en `src/modules/websocket/powertrack.gateway.ts`
  - [ ] 13.2 Configurar `@WebSocketGateway` con CORS para el frontend
  - [ ] 13.3 Implementar evento `connection`: enviar estado actual al cliente que se conecta
  - [ ] 13.4 Implementar método `emitirActualizacion(data)`: broadcast a todos los clientes conectados
  - [ ] 13.5 Implementar evento `disconnect`: limpiar recursos del cliente
  - [ ] 13.6 Crear `WebSocketModule` y registrar en `AppModule`

---

## Fase 11: Backend - Historial y Estadísticas (RF07)

- [ ] 14. Implementar endpoints de historial
  - [ ] 14.1 Crear `HistorialController` con endpoint `GET /historial/:aulaId`
  - [ ] 14.2 Implementar respuesta con últimos 100 valores de consumo y eficiencia con timestamps
  - [ ] 14.3 Implementar endpoint `GET /historial/:aulaId/estadisticas` que retorna objeto `Estadisticas`
  - [ ] 14.4 Registrar controlador en `ConsumoModule`

---

## Fase 12: Frontend - Configuración y Estado Global

- [ ] 15. Configurar Redux Store
  - [ ] 15.1 Crear `store.ts` con configuración de Redux Toolkit
  - [ ] 15.2 Crear `aulasSlice.ts`: estado de aulas, reducers para `setAulas`, `updateAula`, `addAula`, `removeAula`
  - [ ] 15.3 Crear `alertasSlice.ts`: estado de alertas, reducers para `setAlertas`, `addAlerta`, `resolverAlerta`
  - [ ] 15.4 Crear `uiSlice.ts`: estado de UI (aula seleccionada, modal abierto, loading)
  - [ ] 15.5 Crear tipos TypeScript en `src/types/` para `Aula`, `Alerta`, `Consumo`, `Estadisticas`

- [ ] 16. Configurar servicios de comunicación
  - [ ] 16.1 Crear `src/services/api.ts`: funciones para llamadas REST (`crearAula`, `actualizarAula`, `eliminarAula`, `getAlertas`, `getHistorial`)
  - [ ] 16.2 Crear `src/services/websocket.ts`: cliente Socket.io con reconexión automática
  - [ ] 16.3 Crear hook `useWebSocket.ts`: conecta al WebSocket y despacha acciones Redux al recibir eventos
  - [ ] 16.4 Crear hook `useAulas.ts`: selectors y acciones para gestión de aulas
  - [ ] 16.5 Crear hook `useAlertas.ts`: selectors y acciones para gestión de alertas

---

## Fase 13: Frontend - Componentes Comunes

- [ ] 17. Implementar componentes comunes
  - [ ] 17.1 Crear `Header.tsx`: barra superior con nombre del sistema y estado de conexión WebSocket
  - [ ] 17.2 Crear `Sidebar.tsx`: navegación lateral con links a Dashboard y Gestión de Aulas
  - [ ] 17.3 Crear `Indicador.tsx`: badge de color (verde/amarillo/rojo) para estado del aula
  - [ ] 17.4 Crear `LoadingSpinner.tsx`: indicador de carga
  - [ ] 17.5 Crear `Toast.tsx`: notificaciones de éxito/error
  - [ ] 17.6 Crear `ConfirmDialog.tsx`: diálogo de confirmación para eliminar aulas

---

## Fase 14: Frontend - Formulario de Aulas (RF01)

- [ ] 18. Implementar formulario de registro/edición de aulas
  - [ ] 18.1 Crear `FormularioAula.tsx` con campos: nombre, horarioInicio, horarioCierre, consumoEsperado
  - [ ] 18.2 Implementar validación en tiempo real: nombre requerido, horarios 0-23, consumo positivo, cierre > inicio
  - [ ] 18.3 Implementar submit: llama a `crearAula` o `actualizarAula` según modo
  - [ ] 18.4 Mostrar mensajes de error por campo con estilos visuales claros
  - [ ] 18.5 Implementar botones "Guardar" y "Cancelar" con estados de loading

- [ ] 19. Implementar página de gestión de aulas
  - [ ] 19.1 Crear `GestionAulas.tsx`: lista todas las aulas registradas en tabla
  - [ ] 19.2 Mostrar columnas: nombre, horario, consumo esperado, estado, acciones (editar/eliminar)
  - [ ] 19.3 Implementar botón "Nueva Aula" que abre `FormularioAula` en modo creación
  - [ ] 19.4 Implementar botón "Editar" que abre `FormularioAula` en modo edición con datos precargados
  - [ ] 19.5 Implementar botón "Eliminar" con `ConfirmDialog` antes de proceder

---

## Fase 15: Frontend - Dashboard Principal (RF06, RF08)

- [ ] 20. Implementar tarjetas de métricas globales
  - [ ] 20.1 Crear `MetricaCard.tsx`: tarjeta reutilizable con título, valor e ícono
  - [ ] 20.2 Crear tarjeta "Consumo Total": suma de consumo actual de todas las aulas
  - [ ] 20.3 Crear tarjeta "Eficiencia Promedio": promedio de eficiencia de todas las aulas
  - [ ] 20.4 Crear tarjeta "Alertas Activas": conteo de alertas no resueltas
  - [ ] 20.5 Crear tarjeta "Aulas Monitoreadas": total de aulas registradas

- [ ] 21. Implementar tabla de aulas en dashboard
  - [ ] 21.1 Crear `TablaAulas.tsx`: tabla con columnas nombre, consumo actual, consumo esperado, eficiencia, estado
  - [ ] 21.2 Implementar indicador visual de color por estado (verde/amarillo/rojo)
  - [ ] 21.3 Ordenar aulas por estado: Crítico primero, luego Advertencia, luego Normal
  - [ ] 21.4 Implementar click en fila para navegar al detalle del aula
  - [ ] 21.5 Actualizar tabla en tiempo real al recibir eventos WebSocket

- [ ] 22. Implementar panel de alertas activas
  - [ ] 22.1 Crear `AlertasPanel.tsx`: lista de alertas activas ordenadas por timestamp descendente
  - [ ] 22.2 Crear `AlertaItem.tsx`: muestra tipo, aula, severidad, timestamp y botón "Resolver"
  - [ ] 22.3 Implementar badge de severidad con colores: Baja (amarillo), Media (naranja), Alta (rojo)
  - [ ] 22.4 Implementar botón "Resolver" que llama al endpoint y actualiza estado local
  - [ ] 22.5 Mostrar nuevas alertas en tiempo real vía WebSocket

- [ ] 23. Ensamblar Dashboard principal
  - [ ] 23.1 Crear `Dashboard.tsx`: layout con tarjetas de métricas, tabla de aulas y panel de alertas
  - [ ] 23.2 Conectar con `useWebSocket` para recibir actualizaciones en tiempo real
  - [ ] 23.3 Implementar estado de carga inicial mientras se obtienen datos del servidor
  - [ ] 23.4 Hacer layout responsive: columnas en desktop, stack en móvil

---

## Fase 16: Frontend - Historial de Consumo (RF07)

- [ ] 24. Implementar gráfico de consumo
  - [ ] 24.1 Crear `GraficoConsumo.tsx` usando `recharts` (LineChart)
  - [ ] 24.2 Mostrar línea de consumo actual vs línea de consumo esperado
  - [ ] 24.3 Implementar tooltip con valor exacto y timestamp al hacer hover
  - [ ] 24.4 Actualizar gráfico en tiempo real con nuevos valores
  - [ ] 24.5 Marcar visualmente los puntos que son anomalías (color rojo)

- [ ] 25. Implementar tabla de historial
  - [ ] 25.1 Crear `TablaConsumo.tsx`: tabla con columnas timestamp, consumo, eficiencia, estado
  - [ ] 25.2 Mostrar últimos 20 valores ordenados por timestamp descendente
  - [ ] 25.3 Implementar click en fila que resalta el punto correspondiente en el gráfico
  - [ ] 25.4 Mostrar estadísticas debajo: mínimo, máximo, promedio, desviación estándar

- [ ] 26. Ensamblar vista de historial
  - [ ] 26.1 Crear `HistorialConsumo.tsx`: layout con gráfico arriba y tabla abajo
  - [ ] 26.2 Mostrar nombre del aula y estado actual en el encabezado
  - [ ] 26.3 Cargar historial inicial via REST al montar el componente
  - [ ] 26.4 Actualizar en tiempo real vía WebSocket

---

## Fase 17: Frontend - Routing y Layout

- [ ] 27. Configurar routing y layout principal
  - [ ] 27.1 Instalar y configurar `react-router-dom`
  - [ ] 27.2 Crear rutas: `/` → Dashboard, `/aulas` → Gestión de Aulas, `/aulas/:id` → Historial
  - [ ] 27.3 Crear `Layout.tsx`: wrapper con `Header` y `Sidebar` que envuelve todas las rutas
  - [ ] 27.4 Configurar `App.tsx` con `RouterProvider` y `Provider` de Redux
  - [ ] 27.5 Implementar navegación activa en `Sidebar` según ruta actual

---

## Fase 18: Testing - Property-Based Tests

- [ ] 28. Implementar tests PBT para EficienciaService
  - [ ] 28.1 Configurar `fast-check` en el proyecto de testing
  - [ ] 28.2 Test Property 1: round-trip de cálculo de eficiencia (calcular y revertir recupera valor original)
  - [ ] 28.3 Test Property 2: eficiencia inversamente proporcional al consumo (metamórfica)
  - [ ] 28.4 Test Property 3: rango de eficiencia válido (100% cuando iguales, 50% cuando doble)
  - [ ] 28.5 Test Property 4: redondeo idempotente a dos decimales

- [ ] 29. Implementar tests PBT para DetectorAnomalias
  - [ ] 29.1 Test Property 7: detección de consumo elevado (>120% del promedio)
  - [ ] 29.2 Test Property 8: detección de eficiencia baja (<70%)
  - [ ] 29.3 Test Property 9: detección de consumo fuera de horario (>10% del esperado)

- [ ] 30. Implementar tests PBT para ClasificadorEstado y GeneradorAlertas
  - [ ] 30.1 Test Property 10: clasificación de estado determinística por rangos de eficiencia
  - [ ] 30.2 Test Property 11: severidad de alerta basada en eficiencia
  - [ ] 30.3 Test Property 12: alerta tiene todos los campos requeridos

- [ ] 31. Implementar tests PBT para historial y estadísticas
  - [ ] 31.1 Test Property 5: historial mantiene orden cronológico
  - [ ] 31.2 Test Property 6: historial limitado a 100 valores FIFO
  - [ ] 31.3 Test Property: promedio siempre ≤ máximo del historial

---

## Fase 19: Testing - Unit e Integration Tests

- [ ] 32. Implementar unit tests de servicios backend
  - [ ] 32.1 Tests para `AulasService`: crear, obtener, actualizar, eliminar aulas
  - [ ] 32.2 Tests para `SimuladorService`: generación de consumo dentro de rangos esperados
  - [ ] 32.3 Tests para `EficienciaService`: casos específicos (consumo cero, igual al esperado, doble)
  - [ ] 32.4 Tests para `GeneradorAlertas`: generación correcta de alertas por tipo
  - [ ] 32.5 Tests para `InMemoryStore`: CRUD y límite FIFO del historial

- [ ] 33. Implementar integration tests
  - [ ] 33.1 Test de flujo completo: registrar aula → simular consumo → verificar eficiencia calculada
  - [ ] 33.2 Test de flujo de alertas: consumo elevado → alerta generada → visible en respuesta API
  - [ ] 33.3 Test de WebSocket: cliente recibe actualización cuando cambia el consumo
  - [ ] 33.4 Test de historial: verificar que se mantienen máximo 100 valores en orden cronológico

---

## Fase 20: Documentación y Configuración Final

- [ ] 34. Crear documentación del proyecto
  - [ ] 34.1 Actualizar `README.md` con instrucciones de instalación y ejecución
  - [ ] 34.2 Documentar variables de entorno en `.env.example` para backend y frontend
  - [ ] 34.3 Documentar endpoints REST de la API (método, ruta, body, respuesta)
  - [ ] 34.4 Agregar sección de arquitectura con descripción de módulos

- [ ] 35. Configuración final y pulido
  - [ ] 35.1 Configurar CORS en NestJS para permitir peticiones del frontend
  - [ ] 35.2 Agregar datos de ejemplo (seed) al iniciar el servidor: 3-5 aulas predefinidas
  - [ ] 35.3 Verificar que todos los tests pasan (`npm test`)
  - [ ] 35.4 Verificar que el build de producción funciona (`npm run build`)
  - [ ] 35.5 Revisar accesibilidad básica: labels en formularios, contraste de colores, navegación por teclado

---

## Resumen de Trazabilidad

| Tarea | Requisito | Prioridad |
|-------|-----------|-----------|
| 1-3 | Setup | Alta |
| 4-5 | Infraestructura | Alta |
| 6 | RF01 | Alta |
| 7 | RF02 | Alta |
| 8 | RF03 | Alta |
| 9 | RF04, RF08 | Alta |
| 10 | RF05 | Alta |
| 11 | RF08 | Alta |
| 12 | RF02-RF08 (orquestador) | Alta |
| 13 | RNF02 | Alta |
| 14 | RF07 | Media |
| 15-16 | Frontend setup | Alta |
| 17 | Componentes comunes | Media |
| 18-19 | RF01 | Alta |
| 20-23 | RF06, RF08 | Alta |
| 24-26 | RF07 | Media |
| 27 | RNF01, RNF04 | Media |
| 28-31 | PBT (Properties 1-15) | Alta |
| 32-33 | Unit/Integration tests | Alta |
| 34-35 | RNF03, documentación | Media |
