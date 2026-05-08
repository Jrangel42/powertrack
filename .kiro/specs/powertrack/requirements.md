# Requisitos - PowerTrack MVP
## Sistema de Monitoreo Inteligente de Consumo Energético en Aulas

---

## 1. Introducción

PowerTrack es un sistema de monitoreo inteligente de consumo energético diseñado para instituciones educativas. El MVP permite registrar aulas, simular consumo energético en tiempo real, calcular eficiencia automáticamente, detectar anomalías y generar alertas visuales en un dashboard interactivo. El sistema utiliza almacenamiento en memoria con datos simulados que incluyen picos ocasionales de consumo para validar la detección de anomalías.

**Objetivo Principal:** Proporcionar a administradores educativos visibilidad en tiempo real del consumo energético por aula, facilitando la identificación de ineficiencias y anomalías para optimizar el uso de recursos.

---

## 2. Glosario

- **Aula**: Espacio físico en la institución educativa con equipamiento que consume energía
- **Consumo Energético**: Cantidad de energía (en kWh) utilizada por un aula en un período de tiempo
- **Consumo Esperado**: Valor de referencia de consumo normal para un aula en condiciones operativas estándar
- **Eficiencia Energética (η)**: Porcentaje calculado como (E_útil / E_total) × 100, donde E_útil es el consumo esperado y E_total es el consumo real
- **Anomalía**: Desviación significativa del consumo esperado que indica posible mal funcionamiento o uso inadecuado
- **Alerta**: Notificación generada cuando se detecta una anomalía o condición anormal
- **Dashboard**: Interfaz visual que muestra métricas de consumo, eficiencia y estado de aulas en tiempo real
- **Horario Operativo**: Período de funcionamiento esperado del aula (lunes-viernes, 6am-10pm)
- **Consumo Fuera de Horario**: Detección de consumo energético durante períodos cuando el aula no debería estar en uso
- **Estado del Aula**: Clasificación del aula en tres niveles: Normal (eficiencia ≥ 70%), Advertencia (eficiencia 50-69%), Crítico (eficiencia < 50%)
- **Administrador**: Usuario con permisos para registrar aulas, visualizar métricas y gestionar configuraciones
- **Sistema**: Componente automatizado que simula consumo, calcula métricas y genera alertas
- **Historial de Consumo**: Registro temporal de valores de consumo y eficiencia para análisis retrospectivo
- **Pico de Consumo**: Aumento ocasional y temporal en el consumo energético simulado para validar detección de anomalías

---

## 3. Alcance del MVP

### Incluido

- Registro y gestión de aulas con datos básicos (nombre, horario operativo, consumo esperado)
- Simulación de consumo energético con variabilidad y picos ocasionales
- Cálculo automático de eficiencia energética por aula
- Detección de anomalías basada en tres criterios: consumo > 120% del promedio, eficiencia < 70%, consumo fuera de horario
- Generación de alertas en tiempo real con clasificación de severidad
- Dashboard interactivo que muestra métricas actuales, estado de aulas e historial de consumo
- Almacenamiento en memoria de datos de aulas y consumo
- Interfaz compatible con navegadores modernos (Chrome, Firefox, Safari, Edge)

### Excluido

- Integración con sensores físicos reales
- Almacenamiento persistente en base de datos
- Autenticación y autorización de usuarios
- Exportación de reportes a formatos externos (PDF, Excel)
- Análisis predictivo o machine learning
- Integración con sistemas de control de edificios (BMS)
- Notificaciones por correo o SMS
- Múltiples instituciones o multi-tenancy

---

## 4. Requisitos Funcionales

### RF01: Registrar Aulas

**Historia de Usuario:** Como administrador, quiero registrar aulas con sus datos de configuración, para que el sistema pueda monitorear su consumo energético.

#### Criterios de Aceptación

1. WHEN el administrador accede a la sección de gestión de aulas, THE Sistema SHALL mostrar un formulario para registrar nueva aula
2. THE formulario SHALL requerir los siguientes campos: nombre del aula, horario de inicio (hora), horario de cierre (hora), consumo esperado en kWh
3. WHEN el administrador completa el formulario y hace clic en "Guardar", THE Sistema SHALL validar que todos los campos sean completados
4. IF el administrador intenta guardar sin completar campos obligatorios, THEN THE Sistema SHALL mostrar un mensaje de error indicando qué campos faltan
5. WHEN el administrador guarda un aula válida, THE Sistema SHALL almacenarla en memoria con un identificador único
6. WHEN el administrador visualiza la lista de aulas, THE Sistema SHALL mostrar todas las aulas registradas con sus datos de configuración
7. WHEN el administrador selecciona un aula, THE Sistema SHALL permitir editar sus datos de configuración
8. WHEN el administrador elimina un aula, THE Sistema SHALL removerla del sistema y detener su monitoreo

#### Propiedades de Corrección

- **Invariante**: El número de aulas registradas no disminuye cuando se agrega una nueva aula
- **Invariante**: Cada aula tiene un identificador único que no cambia durante su ciclo de vida
- **Idempotencia**: Guardar los mismos datos de aula múltiples veces produce el mismo estado del sistema

---

### RF02: Simular Consumo Energético

**Historia de Usuario:** Como administrador, quiero que el sistema simule consumo energético realista por aula, para validar la detección de anomalías.

#### Criterios de Aceptación

1. WHEN el sistema inicia, THE Simulador SHALL generar valores de consumo para cada aula registrada
2. THE Simulador SHALL generar consumo basado en el consumo esperado con variabilidad aleatoria (±15% del valor esperado)
3. WHEN el horario actual está dentro del horario operativo del aula, THE Simulador SHALL generar consumo energético
4. WHEN el horario actual está fuera del horario operativo del aula, THE Simulador SHALL generar consumo cercano a cero (0-5% del consumo esperado)
5. THE Simulador SHALL ocasionalmente generar picos de consumo (hasta 150% del consumo esperado) para simular anomalías
6. WHEN se genera un nuevo valor de consumo, THE Sistema SHALL actualizar el valor actual del aula en tiempo real
7. THE Simulador SHALL generar nuevos valores de consumo cada 5 segundos para simular monitoreo continuo
8. WHILE el sistema está en ejecución, THE Simulador SHALL mantener un historial de los últimos 100 valores de consumo por aula

#### Propiedades de Corrección

- **Metamórfica**: El consumo simulado durante horario operativo es siempre mayor que el consumo fuera de horario
- **Invariante**: El consumo simulado nunca es negativo
- **Invariante**: El historial de consumo mantiene el orden cronológico de los valores

---

### RF03: Calcular Eficiencia Energética

**Historia de Usuario:** Como administrador, quiero que el sistema calcule automáticamente la eficiencia energética, para identificar aulas ineficientes.

#### Criterios de Aceptación

1. WHEN se genera un nuevo valor de consumo, THE Calculador SHALL calcular la eficiencia usando la fórmula: η = (E_útil / E_total) × 100
2. THE Calculador SHALL usar el consumo esperado como E_útil y el consumo actual como E_total
3. WHEN el consumo actual es igual al consumo esperado, THE Calculador SHALL calcular eficiencia del 100%
4. WHEN el consumo actual es el doble del consumo esperado, THE Calculador SHALL calcular eficiencia del 50%
5. WHEN el consumo actual es cero, THE Calculador SHALL calcular eficiencia del 0%
6. THE Calculador SHALL redondear la eficiencia a dos decimales
7. WHEN se calcula la eficiencia, THE Sistema SHALL almacenarla junto con el timestamp del cálculo
8. WHILE el sistema está en ejecución, THE Calculador SHALL recalcular la eficiencia cada vez que se actualiza el consumo

#### Propiedades de Corrección

- **Round-trip**: Dado un consumo esperado y un consumo actual, calcular eficiencia y luego invertir la fórmula debe recuperar el consumo actual original
- **Invariante**: La eficiencia siempre está en el rango [0, ∞) (puede exceder 100% si el consumo es menor al esperado)
- **Metamórfica**: Si el consumo actual aumenta, la eficiencia disminuye (relación inversa)

---

### RF04: Detectar Consumo Fuera de Horario

**Historia de Usuario:** Como administrador, quiero que el sistema detecte consumo energético fuera del horario operativo, para identificar equipos olvidados o mal configurados.

#### Criterios de Aceptación

1. WHEN el horario actual está fuera del horario operativo del aula, THE Detector SHALL verificar si el consumo actual es mayor al 10% del consumo esperado
2. IF el consumo fuera de horario es mayor al 10% del consumo esperado, THEN THE Detector SHALL marcar esta condición como anomalía
3. WHEN se detecta consumo fuera de horario, THE Sistema SHALL registrar el timestamp y el valor de consumo
4. WHEN el horario actual entra nuevamente en el horario operativo, THE Detector SHALL dejar de considerar el consumo como anomalía por fuera de horario
5. WHILE el sistema está en ejecución, THE Detector SHALL verificar continuamente la condición de consumo fuera de horario

#### Propiedades de Corrección

- **Invariante**: Una anomalía de consumo fuera de horario solo se detecta cuando el horario actual está fuera del rango operativo
- **Idempotencia**: Verificar la condición de consumo fuera de horario múltiples veces en el mismo período produce el mismo resultado

---

### RF05: Generar Alertas por Consumo Anormal

**Historia de Usuario:** Como administrador, quiero recibir alertas cuando se detecten anomalías de consumo, para tomar acciones correctivas inmediatamente.

#### Criterios de Aceptación

1. WHEN se detecta consumo > 120% del promedio histórico, THE Generador SHALL crear una alerta de tipo "Consumo Elevado"
2. WHEN se detecta eficiencia < 70%, THE Generador SHALL crear una alerta de tipo "Eficiencia Baja"
3. WHEN se detecta consumo fuera de horario > 10% del consumo esperado, THE Generador SHALL crear una alerta de tipo "Consumo Fuera de Horario"
4. WHEN se genera una alerta, THE Sistema SHALL asignarle un timestamp, identificador único, tipo, aula asociada y descripción
5. THE Generador SHALL clasificar alertas en tres niveles de severidad: Baja (eficiencia 50-69%), Media (eficiencia 30-49%), Alta (eficiencia < 30%)
6. WHEN se genera una alerta, THE Sistema SHALL mostrarla inmediatamente en el dashboard
7. WHILE el sistema está en ejecución, THE Generador SHALL verificar continuamente las condiciones de alerta cada 5 segundos
8. WHEN una condición de alerta se resuelve (consumo vuelve a normal), THE Sistema SHALL marcar la alerta como resuelta pero mantenerla en el historial

#### Propiedades de Corrección

- **Invariante**: Cada alerta tiene un identificador único
- **Invariante**: El timestamp de una alerta es siempre anterior o igual al timestamp actual
- **Metamórfica**: Si el consumo disminuye, la cantidad de alertas activas no aumenta

---

### RF06: Mostrar Métricas en Dashboard

**Historia de Usuario:** Como administrador, quiero visualizar métricas de consumo y eficiencia en un dashboard en tiempo real, para monitorear el estado general del sistema.

#### Criterios de Aceptación

1. WHEN el administrador accede al dashboard, THE Sistema SHALL mostrar una vista general de todas las aulas
2. FOR cada aula, THE Dashboard SHALL mostrar: nombre, consumo actual (kWh), consumo esperado (kWh), eficiencia (%), estado (Normal/Advertencia/Crítico)
3. WHEN el consumo actual se actualiza, THE Dashboard SHALL reflejar el cambio en tiempo real (máximo 1 segundo de latencia)
4. WHEN se genera una nueva alerta, THE Dashboard SHALL mostrarla en una sección de alertas activas
5. THE Dashboard SHALL mostrar un indicador visual (color) para cada aula: Verde (Normal), Amarillo (Advertencia), Rojo (Crítico)
6. WHEN el administrador hace clic en una aula, THE Dashboard SHALL mostrar detalles adicionales: historial de consumo, gráfico de tendencias, alertas asociadas
7. THE Dashboard SHALL ser responsive y adaptarse a diferentes tamaños de pantalla (desktop, tablet, móvil)
8. WHEN el administrador actualiza la página, THE Dashboard SHALL mantener el estado actual del sistema sin perder datos

#### Propiedades de Corrección

- **Invariante**: El estado mostrado en el dashboard corresponde al estado actual del sistema
- **Idempotencia**: Actualizar el dashboard múltiples veces sin cambios en los datos produce la misma visualización

---

### RF07: Visualizar Historial de Consumo

**Historia de Usuario:** Como administrador, quiero visualizar el historial de consumo de cada aula, para analizar patrones y tendencias.

#### Criterios de Aceptación

1. WHEN el administrador selecciona una aula en el dashboard, THE Sistema SHALL mostrar un gráfico de líneas con el historial de consumo
2. THE gráfico SHALL mostrar los últimos 100 valores de consumo con timestamps
3. WHEN el administrador pasa el cursor sobre el gráfico, THE Sistema SHALL mostrar el valor exacto de consumo y timestamp para ese punto
4. THE Sistema SHALL mostrar una tabla con los últimos 20 valores de consumo, eficiencia y timestamp
5. WHEN el administrador hace clic en un valor en la tabla, THE Sistema SHALL destacar el punto correspondiente en el gráfico
6. THE Sistema SHALL calcular y mostrar estadísticas: consumo mínimo, máximo, promedio y desviación estándar
7. WHILE el sistema está en ejecución, THE historial SHALL actualizarse en tiempo real con nuevos valores
8. WHEN el historial alcanza 100 valores, THE Sistema SHALL mantener solo los últimos 100 (FIFO)

#### Propiedades de Corrección

- **Invariante**: El historial mantiene el orden cronológico de los valores
- **Invariante**: El número de valores en el historial nunca excede 100
- **Metamórfica**: El consumo promedio es siempre menor o igual al consumo máximo

---

### RF08: Clasificar Estado del Aula

**Historia de Usuario:** Como administrador, quiero que el sistema clasifique automáticamente el estado de cada aula, para identificar rápidamente aulas problemáticas.

#### Criterios de Aceptación

1. WHEN se calcula la eficiencia de un aula, THE Clasificador SHALL asignar un estado basado en el valor de eficiencia
2. IF eficiencia ≥ 70%, THEN THE estado SHALL ser "Normal" con indicador visual verde
3. IF eficiencia está entre 50% y 69%, THEN THE estado SHALL ser "Advertencia" con indicador visual amarillo
4. IF eficiencia < 50%, THEN THE estado SHALL ser "Crítico" con indicador visual rojo
5. WHEN el estado de un aula cambia, THE Sistema SHALL actualizar el indicador visual en el dashboard inmediatamente
6. WHEN el estado cambia a "Crítico", THE Sistema SHALL generar automáticamente una alerta de severidad Alta
7. WHILE el sistema está en ejecución, THE Clasificador SHALL reevaluar el estado cada vez que se actualiza la eficiencia
8. WHEN el administrador visualiza la lista de aulas, THE Sistema SHALL ordenarlas por estado (Crítico primero, luego Advertencia, luego Normal)

#### Propiedades de Corrección

- **Invariante**: Cada aula tiene exactamente un estado en todo momento
- **Invariante**: El estado es determinístico basado en la eficiencia actual
- **Idempotencia**: Clasificar el estado múltiples veces con la misma eficiencia produce el mismo resultado

---

## 5. Requisitos No Funcionales

### RNF01: Interfaz Amigable e Intuitiva

- La interfaz SHALL utilizar React con componentes reutilizables
- El diseño SHALL seguir principios de UX moderno con espaciado consistente, tipografía clara y paleta de colores coherente
- La navegación SHALL ser intuitiva con menús claros y acciones principales visibles
- Los formularios SHALL incluir validación en tiempo real con mensajes de error descriptivos
- La interfaz SHALL ser accesible (WCAG 2.1 AA) con soporte para navegación por teclado y lectores de pantalla

### RNF02: Respuesta en Tiempo Real (Simulada)

- El sistema SHALL actualizar métricas cada 5 segundos
- El dashboard SHALL reflejar cambios en consumo y alertas con latencia máxima de 1 segundo
- Las transiciones visuales SHALL ser suaves sin parpadeos o saltos abruptos
- El sistema SHALL mantener responsividad incluso con 50+ aulas registradas

### RNF03: Código Modular y Escalable

- El backend SHALL utilizar NestJS con arquitectura modular (módulos, servicios, controladores)
- El código SHALL seguir principios SOLID y patrones de diseño establecidos
- Los servicios SHALL ser independientes y testables
- La estructura SHALL permitir agregar nuevas funcionalidades sin modificar código existente

### RNF04: Compatible con Navegadores Modernos

- El sistema SHALL funcionar en Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- El sistema SHALL utilizar características modernas de JavaScript (ES6+) con transpilación si es necesario
- El sistema SHALL ser responsive en resoluciones desde 320px (móvil) hasta 2560px (desktop)

### RNF05: Bajo Consumo de Recursos

- El almacenamiento en memoria SHALL limitarse a máximo 10MB para 50 aulas con 100 valores de historial cada una
- El sistema SHALL utilizar optimizaciones de renderizado en React (memoización, lazy loading)
- Las consultas de datos SHALL completarse en menos de 100ms
- El sistema SHALL mantener CPU < 20% en estado de reposo

---

## 6. Actores y Casos de Uso

### Actores

#### Administrador
- **Descripción**: Usuario responsable de gestionar aulas, monitorear consumo energético y responder a alertas
- **Responsabilidades**: Registrar aulas, visualizar dashboard, analizar historial, tomar acciones correctivas
- **Interacciones**: Accede a todas las funcionalidades del sistema

#### Sistema
- **Descripción**: Componente automatizado que simula consumo, calcula métricas y genera alertas
- **Responsabilidades**: Generar datos de consumo, calcular eficiencia, detectar anomalías, crear alertas
- **Interacciones**: Opera continuamente sin intervención del usuario

### Casos de Uso Expandidos

#### CU01: Registrar Aula
- **Actor Principal**: Administrador
- **Precondición**: El administrador está autenticado en el sistema
- **Flujo Principal**:
  1. Administrador accede a la sección de gestión de aulas
  2. Administrador hace clic en "Registrar Nueva Aula"
  3. Sistema muestra formulario con campos: nombre, horario inicio, horario cierre, consumo esperado
  4. Administrador completa los campos y hace clic en "Guardar"
  5. Sistema valida los datos
  6. Sistema almacena el aula en memoria
  7. Sistema muestra confirmación y redirecciona a la lista de aulas
- **Flujo Alternativo (Validación Fallida)**:
  - En paso 5, si hay campos incompletos, sistema muestra errores
  - Administrador corrige los datos y reintenta
- **Postcondición**: El aula está registrada y el sistema comienza a simular su consumo

#### CU02: Simular Consumo Energético
- **Actor Principal**: Sistema
- **Precondición**: Existen aulas registradas
- **Flujo Principal**:
  1. Sistema inicia simulación al arrancar
  2. Para cada aula, sistema genera valor de consumo basado en horario y consumo esperado
  3. Sistema aplica variabilidad aleatoria (±15%)
  4. Sistema ocasionalmente genera picos (hasta 150%)
  5. Sistema actualiza el valor actual del aula
  6. Sistema repite cada 5 segundos
- **Postcondición**: Cada aula tiene un valor de consumo actual actualizado

#### CU03: Calcular Eficiencia Energética
- **Actor Principal**: Sistema
- **Precondición**: Se ha generado un nuevo valor de consumo
- **Flujo Principal**:
  1. Sistema obtiene consumo actual y consumo esperado del aula
  2. Sistema aplica fórmula: η = (E_útil / E_total) × 100
  3. Sistema redondea a dos decimales
  4. Sistema almacena eficiencia con timestamp
  5. Sistema actualiza el estado del aula basado en eficiencia
- **Postcondición**: La eficiencia está calculada y el estado del aula está actualizado

#### CU04: Detectar Anomalías
- **Actor Principal**: Sistema
- **Precondición**: Se ha calculado la eficiencia y se ha generado consumo
- **Flujo Principal**:
  1. Sistema verifica si consumo > 120% del promedio histórico
  2. Sistema verifica si eficiencia < 70%
  3. Sistema verifica si hay consumo fuera de horario > 10% del esperado
  4. Sistema registra cualquier anomalía detectada
- **Postcondición**: Las anomalías están identificadas y listas para generar alertas

#### CU05: Generar Alertas
- **Actor Principal**: Sistema
- **Precondición**: Se ha detectado una anomalía
- **Flujo Principal**:
  1. Sistema crea alerta con tipo, descripción y timestamp
  2. Sistema asigna nivel de severidad basado en eficiencia
  3. Sistema almacena alerta en historial
  4. Sistema notifica al dashboard para mostrar alerta en tiempo real
- **Postcondición**: La alerta está visible en el dashboard

#### CU06: Visualizar Dashboard
- **Actor Principal**: Administrador
- **Precondición**: El administrador está autenticado
- **Flujo Principal**:
  1. Administrador accede al dashboard
  2. Sistema carga lista de todas las aulas
  3. Para cada aula, sistema muestra: nombre, consumo actual, eficiencia, estado
  4. Sistema muestra alertas activas en sección dedicada
  5. Sistema actualiza métricas en tiempo real
  6. Administrador puede hacer clic en una aula para ver detalles
- **Postcondición**: El administrador visualiza el estado actual del sistema

---

## 7. Criterios de Aceptación Generales

### Funcionalidad
- Todos los requisitos funcionales (RF01-RF08) deben estar completamente implementados
- El sistema debe funcionar sin errores durante al menos 1 hora de operación continua
- Todas las alertas deben generarse dentro de 5 segundos de detectada la anomalía

### Rendimiento
- El dashboard debe cargar en menos de 2 segundos
- Las actualizaciones de métricas deben reflejarse en menos de 1 segundo
- El sistema debe soportar mínimo 50 aulas simultáneamente sin degradación de rendimiento

### Usabilidad
- El 90% de usuarios nuevos debe poder registrar un aula sin ayuda
- Todos los campos de formulario deben tener validación clara y mensajes de error descriptivos
- La interfaz debe ser completamente funcional en dispositivos móviles

### Confiabilidad
- El sistema no debe perder datos durante operación normal
- Las alertas no deben duplicarse
- El historial de consumo debe mantener integridad cronológica

---

## 8. Restricciones y Supuestos

### Restricciones

- **Almacenamiento**: Datos en memoria solamente, sin persistencia en base de datos
- **Simulación**: Consumo energético es simulado, no proviene de sensores reales
- **Usuarios**: MVP soporta un único administrador sin autenticación
- **Horarios**: Solo lunes-viernes, 6am-10pm (horarios fijos, no configurables por aula)
- **Navegadores**: Solo navegadores modernos (Chrome, Firefox, Safari, Edge)
- **Escalabilidad**: MVP diseñado para máximo 50 aulas

### Supuestos

- Se asume que los datos simulados son suficientemente realistas para validar la lógica de detección de anomalías
- Se asume que los administradores tienen acceso a navegadores modernos
- Se asume que el consumo esperado es un valor positivo válido
- Se asume que los picos ocasionales de consumo ocurren aleatoriamente (no en patrón predecible)
- Se asume que la latencia de red es mínima (ambiente local o LAN)
- Se asume que el sistema se ejecuta en un servidor con recursos suficientes (mínimo 2GB RAM)

---

## 9. Matriz de Trazabilidad

| Requisito | Caso de Uso | Actor | Prioridad |
|-----------|------------|-------|-----------|
| RF01 | CU01 | Administrador | Alta |
| RF02 | CU02 | Sistema | Alta |
| RF03 | CU03 | Sistema | Alta |
| RF04 | CU04 | Sistema | Alta |
| RF05 | CU05 | Sistema | Alta |
| RF06 | CU06 | Administrador | Alta |
| RF07 | CU06 | Administrador | Media |
| RF08 | CU04, CU05 | Sistema | Alta |
| RNF01 | CU06 | Administrador | Media |
| RNF02 | Todos | Sistema | Alta |
| RNF03 | Todos | Sistema | Media |
| RNF04 | CU06 | Administrador | Media |
| RNF05 | Todos | Sistema | Media |

---

## 10. Notas de Implementación

- Los patrones EARS utilizados en este documento garantizan requisitos claros, testables y sin ambigüedad
- Cada requisito funcional incluye propiedades de corrección que pueden ser validadas mediante pruebas automatizadas
- La arquitectura modular de NestJS permite implementar cada requisito como un servicio independiente
- El almacenamiento en memoria simplifica el MVP pero debe considerarse persistencia en futuras versiones
- La simulación de consumo debe incluir generador de números aleatorios con seed configurable para reproducibilidad en pruebas

