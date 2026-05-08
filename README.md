# PowerTrack - Sistema de Monitoreo Inteligente de Consumo Energético

## Descripción

PowerTrack es un sistema de monitoreo inteligente de consumo energético diseñado para instituciones educativas. El MVP permite registrar aulas, simular consumo energético en tiempo real, calcular eficiencia automáticamente, detectar anomalías y generar alertas visuales en un dashboard interactivo.

## Características Principales

- **Registro de Aulas**: Gestión completa de aulas con datos de configuración
- **Simulación en Tiempo Real**: Generación de datos de consumo con variabilidad y picos ocasionales
- **Cálculo de Eficiencia**: Cálculo automático de eficiencia energética por aula
- **Detección de Anomalías**: Tres tipos de detección: consumo elevado, eficiencia baja, consumo fuera de horario
- **Sistema de Alertas**: Generación de alertas con clasificación de severidad
- **Dashboard Interactivo**: Visualización en tiempo real de métricas y estado de aulas
- **Historial de Consumo**: Gráficos y tablas con análisis retrospectivo
- **WebSocket en Tiempo Real**: Actualizaciones automáticas sin necesidad de recargar

## Arquitectura Técnica

### Backend (NestJS)
- **Framework**: NestJS con TypeScript
- **Arquitectura**: Modular (módulos, servicios, controladores)
- **Almacenamiento**: En memoria con límite FIFO de 100 valores por aula
- **WebSocket**: Socket.io para comunicación en tiempo real
- **Validación**: Class-validator para DTOs
- **CORS**: Configurado para frontend en localhost:5173

### Frontend (React + TypeScript)
- **Framework**: React 19 con TypeScript
- **Build Tool**: Vite
- **Estado Global**: Redux Toolkit con slices
- **UI Components**: Componentes reutilizables con Tailwind CSS
- **Gráficos**: Recharts para visualización de datos
- **Routing**: React Router DOM
- **WebSocket**: Socket.io-client para conexión en tiempo real

## Instalación y Ejecución

### Prerrequisitos
- Node.js 18+ y npm
- TypeScript 5+

### 1. Clonar el repositorio
```bash
git clone <repo-url>
cd powerTrack
```

### 2. Instalar dependencias del backend
```bash
cd backend
npm install
```

### 3. Instalar dependencias del frontend
```bash
cd ../frontend
npm install
```

### 4. Configurar variables de entorno (opcional)
Crear archivo `.env` en el directorio backend si es necesario.

### 5. Ejecutar en modo desarrollo

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Acceder a la aplicación
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Backend WebSocket**: ws://localhost:3000

## Estructura del Proyecto

```
powerTrack/
├── backend/                    # Backend NestJS
│   ├── src/
│   │   ├── common/            # Utilidades comunes
│   │   │   ├── constants/     # Constantes de la aplicación
│   │   │   ├── interfaces/    # Interfaces TypeScript
│   │   │   ├── seed/          # Datos iniciales
│   │   │   └── store/         # Almacenamiento en memoria
│   │   ├── modules/           # Módulos de la aplicación
│   │   │   ├── aulas/         # Gestión de aulas
│   │   │   ├── consumo/       # Simulación de consumo
│   │   │   ├── eficiencia/    # Cálculo de eficiencia
│   │   │   ├── anomalias/     # Detección de anomalías
│   │   │   ├── alertas/       # Generación de alertas
│   │   │   ├── estado/        # Clasificación de estado
│   │   │   ├── monitoreo/     # Orquestador del ciclo
│   │   │   ├── websocket/     # WebSocket Gateway
│   │   │   └── historial/     # Historial y estadísticas
│   │   ├── app.module.ts      # Módulo principal
│   │   └── main.ts            # Punto de entrada
│   └── package.json
├── frontend/                   # Frontend React
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   │   ├── Common/        # Componentes comunes
│   │   │   ├── Dashboard/     # Componentes del dashboard
│   │   │   ├── Formulario/    # Formularios
│   │   │   ├── Historial/     # Componentes de historial
│   │   │   └── Layout/        # Componentes de layout
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # Páginas de la aplicación
│   │   ├── services/          # Servicios de API y WebSocket
│   │   ├── store/             # Redux store y slices
│   │   ├── types/             # Tipos TypeScript
│   │   ├── App.tsx            # Componente principal
│   │   └── main.tsx           # Punto de entrada
│   └── package.json
└── README.md
```

## API Endpoints

### Aulas
- `POST /api/aulas` - Crear nueva aula
- `GET /api/aulas` - Obtener todas las aulas
- `GET /api/aulas/:id` - Obtener aula específica
- `PUT /api/aulas/:id` - Actualizar aula
- `DELETE /api/aulas/:id` - Eliminar aula

### Alertas
- `GET /api/alertas` - Obtener todas las alertas
- `GET /api/alertas? aulaId=:id` - Obtener alertas por aula
- `GET /api/alertas/activas` - Obtener alertas activas
- `PATCH /api/alertas/:id/resolver` - Marcar alerta como resuelta

### Historial
- `GET /api/historial/:aulaId` - Obtener historial de consumo
- `GET /api/historial/:aulaId/estadisticas` - Obtener estadísticas

## WebSocket Events

### Emitidos por el servidor:
- `estado-inicial` - Estado inicial al conectar
- `actualizacion` - Actualización de métricas (cada 5 segundos)
- `aulas-actualizadas` - Cambios en la lista de aulas

### Recibidos por el cliente:
- `connection` - Cliente conectado
- `disconnect` - Cliente desconectado

## Flujo de Datos

1. **Registro de Aula**: Administrador registra aula con datos básicos
2. **Simulación Automática**: Sistema genera consumo cada 5 segundos
3. **Cálculo de Eficiencia**: Se calcula eficiencia basada en consumo actual vs esperado
4. **Detección de Anomalías**: Sistema verifica tres condiciones de anomalía
5. **Generación de Alertas**: Si hay anomalías, se generan alertas con severidad
6. **Clasificación de Estado**: Aula se clasifica como Normal/Advertencia/Crítico
7. **Actualización en Tiempo Real**: Datos se envían al frontend via WebSocket
8. **Visualización**: Dashboard muestra métricas actualizadas

## Configuración de Umbrales

### Detección de Anomalías:
- **Consumo Elevado**: > 120% del promedio histórico
- **Eficiencia Baja**: < 70%
- **Consumo Fuera de Horario**: > 10% del consumo esperado (fuera de horario)

### Clasificación de Estado:
- **Normal**: Eficiencia ≥ 70%
- **Advertencia**: Eficiencia 50-69%
- **Crítico**: Eficiencia < 50%

### Severidad de Alertas:
- **Baja**: Eficiencia 50-69%
- **Media**: Eficiencia 30-49%
- **Alta**: Eficiencia < 30%

## Datos de Ejemplo (Seed)

Al iniciar el sistema, se crean automáticamente 5 aulas de ejemplo:
1. Aula 101 (45 kWh)
2. Aula 202 (60 kWh)
3. Laboratorio A (90 kWh)
4. Sala de Cómputo (120 kWh)
5. Auditorio (75 kWh)

## Pruebas

### Ejecutar tests del backend:
```bash
cd backend
npm test
```

### Ejecutar tests del frontend:
```bash
cd frontend
npm test
```

## Consideraciones de Seguridad

- **CORS**: Configurado solo para localhost:5173 en desarrollo
- **Validación**: Todos los endpoints validan datos de entrada
- **Tipado**: TypeScript en todo el proyecto para prevención de errores
- **Manejo de Errores**: Errores manejados con try-catch y respuestas HTTP apropiadas

## Limitaciones del MVP

- Almacenamiento en memoria (sin persistencia en base de datos)
- Consumo simulado (no integración con sensores reales)
- Usuario único sin autenticación
- Horarios fijos (lunes-viernes, 6am-10pm)
- Máximo 50 aulas simuladas

## Roadmap Futuro

1. **Persistencia**: Integración con base de datos PostgreSQL
2. **Autenticación**: Sistema de usuarios y roles
3. **Sensores Reales**: Integración con hardware de medición
4. **Reportes**: Exportación a PDF/Excel
5. **Notificaciones**: Email y SMS para alertas críticas
6. **Análisis Predictivo**: Machine learning para predicción de consumo
7. **Multi-instituciones**: Soporte para múltiples instituciones educativas

## Contribución

1. Fork el repositorio
2. Crear rama de feature (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

## Contacto

Para preguntas o soporte, contactar al equipo de desarrollo.

---

**Nota**: Este es un MVP para demostración. Para uso en producción, se requieren mejoras de seguridad, persistencia y escalabilidad.