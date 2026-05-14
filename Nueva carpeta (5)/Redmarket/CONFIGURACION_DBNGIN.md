# 🗄️ Configuración de PostgreSQL con DBngin

## 📋 Guía Paso a Paso

### 1️⃣ Verificar PostgreSQL en DBngin

1. **Abrir DBngin**
2. **Iniciar PostgreSQL** (si no está corriendo)
   - Click en el servicio PostgreSQL
   - Click en "Start"
3. **Obtener información de conexión:**
   - **Host:** `127.0.0.1` o `localhost`
   - **Puerto:** Usualmente `5432` (verificar en DBngin)
   - **Usuario:** Usualmente tu nombre de usuario del sistema o `postgres`
   - **Contraseña:** Por defecto suele estar **vacía** o la que configuraste

### 2️⃣ Crear la Base de Datos

Hay 3 formas de crear la base de datos:

#### Opción A: Desde DBngin (Recomendado - Más fácil)
1. Click derecho en PostgreSQL → "Open Terminal"
2. En el terminal, ejecutar:
```bash
createdb redmarket_db
```

#### Opción B: Desde Terminal
```bash
# Abrir terminal y ejecutar
/Applications/DBngin.app/Contents/MacOS/postgresql/bin/createdb -U TU_USUARIO redmarket_db

# En Windows:
# Buscar donde DBngin instaló PostgreSQL (usualmente en C:\Users\TU_USUARIO\DBngin\postgresql)
# Navegar a bin\ y ejecutar:
createdb -U TU_USUARIO redmarket_db
```

#### Opción C: Usando psql
1. Click derecho en PostgreSQL → "Connect"
2. Ejecutar:
```sql
CREATE DATABASE redmarket_db;
\q
```

### 3️⃣ Configurar Variables de Entorno

1. **Ir al directorio del backend:**
```bash
cd Redmarket/backend
```

2. **Crear archivo `.env`:**
```bash
# En Windows (PowerShell)
Copy-Item .env.example .env

# En Mac/Linux
cp .env.example .env
```

3. **Editar el archivo `.env`** con tus datos de DBngin:

```env
# ============================================
# CONFIGURACIÓN PARA DBngin (PostgreSQL Local)
# ============================================

DB_HOST=localhost
DB_PORT=5432
DB_USER=TU_USUARIO_AQUI
DB_PASSWORD=
DB_NAME=redmarket_db
PORT=3000
```

**⚠️ IMPORTANTE:** Reemplaza `TU_USUARIO_AQUI` con:
- En Mac: Tu nombre de usuario del sistema (ejemplo: `john`)
- En Windows: Tu nombre de usuario o `postgres`
- La contraseña usualmente está **vacía** en DBngin (dejar sin nada después del `=`)

### 4️⃣ Verificar la Conexión

1. **Desde DBngin:**
   - Click derecho en PostgreSQL → "Connect"
   - Deberías ver el prompt `postgres=#` o `TU_USUARIO=#`
   - Ejecutar: `\l` para listar bases de datos
   - Deberías ver `redmarket_db` en la lista

2. **Desde el proyecto:**
```bash
# Estando en Redmarket/backend
npm run init-db
```

**✅ Si ves esto, está funcionando:**
```
🔧 Inicializando base de datos RedMarket...
📋 Creando tablas...
✅ Tablas creadas
📦 Insertando datos de prueba...
✅ Datos insertados
...
```

### 5️⃣ Solución de Problemas Comunes

#### ❌ Error: "password authentication failed"
**Solución:**
1. Abrir DBngin
2. Click derecho en PostgreSQL → "Show Info"
3. Ver el usuario y puerto
4. Actualizar `.env` con esos datos

#### ❌ Error: "database does not exist"
**Solución:**
```bash
# Conectarse a PostgreSQL desde DBngin
# Click derecho → Connect
# Luego ejecutar:
CREATE DATABASE redmarket_db;
```

#### ❌ Error: "ECONNREFUSED"
**Solución:**
1. Verificar que PostgreSQL esté **corriendo** en DBngin (botón verde)
2. Verificar el puerto en DBngin (usualmente 5432)
3. Actualizar `DB_PORT` en `.env` si es diferente

#### ❌ Error: "role does not exist"
**Solución:**
```sql
-- Conectarse desde DBngin y crear el usuario
CREATE USER tu_usuario WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE redmarket_db TO tu_usuario;
```

### 6️⃣ Datos de Ejemplo por Sistema Operativo

#### 🍎 macOS con DBngin
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=john
DB_PASSWORD=
DB_NAME=redmarket_db
PORT=3000
```

#### 🪟 Windows con DBngin
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=
DB_NAME=redmarket_db
PORT=3000
```

### 7️⃣ Verificación Final

**Test de conexión rápido:**

```bash
# Terminal 1: Iniciar backend
cd Redmarket/backend
npm run dev

# Deberías ver:
# ✅ Conectado a PostgreSQL (RedMarket)
# 🚀 Servidor corriendo en http://localhost:3000

# Terminal 2: Probar API
curl http://localhost:3000/api/health

# Respuesta esperada:
{
  "status": "healthy",
  "database": "connected",
  ...
}
```

---

## 🎯 Resumen Rápido

```bash
# 1. Crear base de datos en DBngin
createdb redmarket_db

# 2. Configurar .env
cd Redmarket/backend
cp .env.example .env
# Editar .env con tus datos de DBngin

# 3. Inicializar base de datos
npm run init-db

# 4. Iniciar backend
npm run dev

# 5. Verificar
curl http://localhost:3000/api/health
```

---

## 📞 ¿Sigues con problemas?

1. **Verifica los datos de conexión en DBngin:**
   - Click derecho en PostgreSQL → "Show Info"
   - Anota: Usuario, Puerto, Host

2. **Intenta conectarte manualmente:**
   - Click derecho en PostgreSQL → "Connect"
   - Si funciona, esos son los datos correctos

3. **Revisa los logs:**
   - Mira la terminal donde corriste `npm run dev`
   - El error te dirá qué está mal

---

## ✅ Checklist de Verificación

- [ ] DBngin está instalado y corriendo
- [ ] PostgreSQL está iniciado (botón verde en DBngin)
- [ ] Base de datos `redmarket_db` creada
- [ ] Archivo `.env` configurado con datos correctos
- [ ] `npm run init-db` ejecutado exitosamente
- [ ] Backend responde en `/api/health`

---

**🎉 Una vez que todo funcione, continúa con el frontend siguiendo `INICIO_RAPIDO.md`**
