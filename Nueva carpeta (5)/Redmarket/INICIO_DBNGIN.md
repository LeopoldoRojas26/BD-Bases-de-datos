# ⚡ INICIO ULTRA RÁPIDO - DBngin

## 🎯 Para usuarios con DBngin (5 minutos)

### ✅ Paso 1: Base de Datos (1 minuto)
```bash
# En DBngin:
# 1. Verificar que PostgreSQL esté corriendo (botón verde)
# 2. Click derecho → "Open Terminal"
# 3. Ejecutar:
createdb redmarket_db
```

### ✅ Paso 2: Instalar Dependencias (2 minutos)
```bash
# En tu terminal normal:
cd Redmarket
npm run install-all
```

### ✅ Paso 3: Configurar .env (30 segundos)
```bash
cd backend
copy .env.example .env
```

**Editar `backend/.env`:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=TU_USUARIO_AQUI     ← Cambiar esto
DB_PASSWORD=                 ← Dejar vacío
DB_NAME=redmarket_db
PORT=3000
```

**🔍 ¿Cómo saber tu usuario?**
- En DBngin: Click derecho en PostgreSQL → "Show Info"
- O es tu nombre de usuario del sistema (ej: john, maria)

### ✅ Paso 4: Inicializar DB (30 segundos)
```bash
npm run init-db
```

**✅ Deberías ver:**
```
🔧 Inicializando base de datos RedMarket...
✅ Tablas creadas
✅ Datos insertados
✅ Vistas creadas
✅ Triggers creados
🎉 Base de datos inicializada exitosamente
```

### ✅ Paso 5: Ejecutar (1 minuto)
```bash
# Terminal 1
cd Redmarket
npm run dev:backend

# Terminal 2 (nueva ventana)
cd Redmarket
npm run dev:frontend
```

### ✅ Paso 6: Verificar
1. **Backend:** http://localhost:3000/api/health
   - Deberías ver: `"database": "connected"`
2. **Frontend:** http://localhost:5173
   - Deberías ver el dashboard de RedMarket

---

## 🎉 ¡Listo! Tu aplicación está funcionando

- 🏠 Dashboard: http://localhost:5173/
- 🛍️ Productos: http://localhost:5173/productos
- 💰 Ventas: http://localhost:5173/ventas (triggers funcionan aquí)
- 📦 Inventario: http://localhost:5173/inventario

---

## 🐛 Si algo falla:

### Error: "password authentication failed"
```bash
# En DBngin: Click derecho → "Show Info"
# Copiar el usuario exacto que aparece
# Actualizar DB_USER en backend/.env con ese usuario
```

### Error: "database does not exist"
```bash
# En DBngin: Click derecho → "Open Terminal"
createdb redmarket_db
```

### Error: PostgreSQL no conecta
```bash
# Verificar en DBngin que PostgreSQL esté iniciado (botón verde)
# Si está rojo, hacer click en "Start"
```

---

## 📖 Más Ayuda

- **Guía completa de DBngin:** [CONFIGURACION_DBNGIN.md](CONFIGURACION_DBNGIN.md)
- **Guía paso a paso:** [INICIO_RAPIDO.md](INICIO_RAPIDO.md)
- **Documentación completa:** [INDEX.md](INDEX.md)

---

**🚀 Creado específicamente para usuarios de DBngin**
