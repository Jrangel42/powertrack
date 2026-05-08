# PowerTrack - Guía de Instalación y Configuración

## Descripción del Proyecto

PowerTrack es un sistema de monitoreo energético en tiempo real para aulas educativas. Permite registrar aulas, simular consumo de energía, detectar anomalías y generar alertas automáticas.

## Estructura del Proyecto

```
powertrack/
├── backend/          # API NestJS
├── frontend/         # Aplicación React + Vite
├── .gitignore        # Configuración global de Git
├── backend/.gitignore
├── frontend/.gitignore
└── README.md
```

## Requisitos Previos

- **Node.js** v18 o superior
- **npm** v9 o superior (o yarn/pnpm)
- **Git**

## Instalación

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd powertrack
```

### 2. Instalar Dependencias del Backend

```bash
cd backend
npm install
cd ..
```

### 3. Instalar Dependencias del Frontend

```bash
cd frontend
npm install
cd ..
```

## Ejecución

### Opción 1: Ejecutar en Terminales Separadas

#### Terminal 1 - Backend

```bash
cd backend
npm run start:dev
```

El backend estará disponible en `http://localhost:3000`

#### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### Opción 2: Ejecutar Ambos desde la Raíz (si está configurado)

```bash
npm run dev
```

## Configuración de Variables de Entorno

### Backend (.env)

```env
NODE_ENV=development
PORT=3000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
```

## Características Principales

### Backend (NestJS)

- ✅ **Gestión de Aulas**: CRUD completo
- ✅ **Simulación de Consumo**: Generación automática cada 5 segundos
- ✅ **Cálculo de Eficiencia**: Fórmula η = (E_útil / E_total) × 100
- ✅ **Detección de Anomalías**: Consumo elevado, eficiencia baja, consumo fuera de horario
- ✅ **Sistema de Alertas**: Generación y resolución de alertas
- ✅ **WebSocket**: Actualizaciones en tiempo real
- ✅ **Historial**: Almacenamiento de últimas 100 mediciones

### Frontend (React + Vite)

- ✅ **Dashboard**: Vista general del sistema
- ✅ **Gestión de Aulas**: Crear, editar, eliminar aulas
- ✅ **Historial de Consumo**: Gráficos y tablas de datos
- ✅ **Panel de Alertas**: Visualización y resolución de alertas
- ✅ **Modal de Detalles**: Información completa del aula con alertas
- ✅ **Resolución de Alertas**: Con notas descriptivas
- ✅ **Actualizaciones en Tiempo Real**: Vía WebSocket

## Endpoints de la API

### Aulas

- `GET /aulas` - Obtener todas las aulas
- `POST /aulas` - Crear nueva aula
- `GET /aulas/:id` - Obtener aula específica
- `PUT /aulas/:id` - Actualizar aula
- `DELETE /aulas/:id` - Eliminar aula

### Alertas

- `GET /alertas` - Obtener todas las alertas
- `GET /alertas/activas` - Obtener alertas activas
- `GET /alertas?aulaId=:id` - Obtener alertas de un aula
- `PATCH /alertas/:id/resolver` - Resolver alerta con notas

### Historial

- `GET /historial/:aulaId` - Obtener historial de consumo
- `GET /historial/:aulaId/estadisticas` - Obtener estadísticas

## Datos de Ejemplo

Al iniciar el backend, se crean automáticamente 5 aulas de ejemplo:

1. **Aula 101** - Horario: 6:00 - 22:00, Consumo esperado: 50 kWh
2. **Aula 102** - Horario: 6:00 - 22:00, Consumo esperado: 45 kWh
3. **Aula 201** - Horario: 6:00 - 22:00, Consumo esperado: 55 kWh
4. **Aula 202** - Horario: 6:00 - 22:00, Consumo esperado: 48 kWh
5. **Aula 301** - Horario: 6:00 - 22:00, Consumo esperado: 52 kWh

## Tecnologías Utilizadas

### Backend

- **NestJS** - Framework Node.js
- **TypeScript** - Lenguaje de programación
- **Socket.io** - WebSocket en tiempo real
- **class-validator** - Validación de datos
- **uuid** - Generación de IDs únicos

### Frontend

- **React** - Librería de UI
- **TypeScript** - Lenguaje de programación
- **Vite** - Build tool
- **Redux Toolkit** - Gestión de estado
- **Tailwind CSS** - Estilos
- **Recharts** - Gráficos
- **Lucide React** - Iconos
- **Socket.io Client** - WebSocket cliente

## Estructura de Carpetas

### Backend

```
backend/src/
├── common/
│   ├── constants/
│   ├── interfaces/
│   ├── seed/
│   └── store/
├── modules/
│   ├── alertas/
│   ├── anomalias/
│   ├── aulas/
│   ├── consumo/
│   ├── eficiencia/
│   ├── estado/
│   ├── historial/
│   ├── monitoreo/
│   └── websocket/
├── app.module.ts
└── main.ts
```

### Frontend

```
frontend/src/
├── components/
│   ├── Common/
│   ├── Dashboard/
│   ├── Formulario/
│   ├── Historial/
│   └── Layout/
├── hooks/
├── pages/
├── services/
├── store/
├── types/
├── App.tsx
└── main.tsx
```

## Troubleshooting

### Puerto 3000 ya está en uso

```bash
# Cambiar puerto en backend/.env
PORT=3001
```

### Puerto 5173 ya está en uso

```bash
# Cambiar puerto en frontend/vite.config.ts
export default defineConfig({
  server: {
    port: 5174
  }
})
```

### Errores de conexión WebSocket

Asegúrate de que:
1. El backend está corriendo en `http://localhost:3000`
2. El frontend está corriendo en `http://localhost:5173`
3. CORS está habilitado en el backend

### node_modules corrupto

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Desarrollo

### Agregar una Nueva Característica

1. Crear rama: `git checkout -b feature/nueva-caracteristica`
2. Hacer cambios
3. Commit: `git commit -m "feat: descripción"`
4. Push: `git push origin feature/nueva-caracteristica`
5. Crear Pull Request

### Estándares de Código

- Usar TypeScript
- Seguir convenciones de nombres camelCase
- Comentar código complejo
- Usar tipos explícitos

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Contacto

Para preguntas o sugerencias, contacta al equipo de desarrollo.
