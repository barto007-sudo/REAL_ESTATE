# ¡Bienvenido a Real Estate Auction & Rental Management System!

Este es un proyecto full-stack completo para la administración y subasta de propiedades inmobiliarias con gestión de alquileres.

## 🚀 Inicio Rápido

### 1. Configurar Base de Datos PostgreSQL

Antes de continuar, asegúrate de tener PostgreSQL instalado y ejecutándose:

```bash
# Crear una base de datos llamada 'real_estate'
createdb real_estate
```

### 2. Configurar Variables de Entorno

#### Backend (.env)
```bash
cd backend
copy .env.example .env
# Editar .env con tus valores:
# DATABASE_URL=postgresql://user:password@localhost:5432/real_estate
# JWT_SECRET=tu_llave_secreta_aqui
# PORT=5000
# NODE_ENV=development
```

#### Frontend (.env.local)
```bash
cd ../frontend
copy .env.example .env.local
# REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Instalar Dependencias

```bash
# Instalar backend
cd backend
npm install

# Instalar frontend (en otra terminal)
cd frontend
npm install
```

### 4. Ejecutar la Aplicación

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# El servidor se ejecutará en http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# La aplicación se abrirá en http://localhost:3000
```

## 📝 Usuarios de Prueba

Puedes crear nuevos usuarios durante el registro. Aquí hay algunos ejemplos:

### Usuario Vendedor (Seller)
- Email: seller@example.com
- Contraseña: password
- Rol: Seller

### Usuario Comprador (Buyer)
- Email: buyer@example.com
- Contraseña: password
- Rol: Buyer

## 🎯 Características Principales

✅ **Autenticación JWT** - Sistema seguro de login y registro
✅ **Gestión de Propiedades** - Crear, editar y eliminar propiedades
✅ **Sistema de Subastas** - Pujar en propiedades disponibles
✅ **Gestión de Alquileres** - Solicitar y respaldar alquileres
✅ **Dashboard** - Panel personalizado para cada usuario
✅ **Búsqueda y Filtrado** - Buscar propiedades por ciudad y disponibilidad
✅ **Historial de Pujas** - Ver todas tus pujas realizadas
✅ **Gestión de Alquileres** - Rastrear solicitudes de alquiler

## 📁 Estructura del Proyecto

```
real_estate/
├── backend/              # API REST con Node.js/Express
├── frontend/             # Aplicación React
├── .github/              # Configuración de GitHub
├── .vscode/              # Configuración de VS Code
├── README.md             # Documentación principal
└── QUICKSTART.md         # Este archivo
```

## 🔧 Stack Tecnológico

- **Backend**: Node.js, Express, TypeScript, PostgreSQL
- **Frontend**: React, TypeScript, React Router, Axios
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS3 Responsive

## 📚 Documentación Completa

Para más información, consulta el archivo [README.md](./README.md)

## ⚠️ Solución de Problemas

### Error: "Cannot connect to database"
- Asegúrate de que PostgreSQL esté ejecutándose
- Verifica la URL de conexión en el archivo .env

### Error: "Port 3000 already in use"
- React te preguntará si deseas usar otro puerto
- Escribe "Y" para continuar

### Error: "API connection refused"
- Asegúrate de que el backend esté ejecutándose en puerto 5000
- Verifica que REACT_APP_API_URL sea correcto en .env.local

## 🎓 Próximos Pasos

1. Registra un nuevo usuario (ve a "Register")
2. Explora las propiedades disponibles
3. Crea una propiedad (si eres vendedor)
4. Participa en subastas o solicita alquileres
5. Consulta tu dashboard para ver todas tus actividades

¡Diviértete! 🎉
