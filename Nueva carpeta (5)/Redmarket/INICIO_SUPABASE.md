# ⚡ INICIO ULTRA RÁPIDO - Supabase

## 🎯 La forma MÁS FÁCIL de ejecutar RedMarket (5 minutos)

### ✅ Ventajas de Supabase:
- 🌐 **Sin instalar nada** - Todo en la nube
- ⚡ **Setup en 5 minutos** - Más rápido que DBngin
- 🎨 **Interfaz web incluida** - Ver tablas, triggers, datos
- 🆓 **Completamente gratis** - Para proyectos de aprendizaje
- 🔒 **SSL automático** - Conexión segura
- 📱 **Acceso desde cualquier lugar** - Demuestra tu proyecto fácilmente

---

## 🚀 PASOS RÁPIDOS

### 1️⃣ Crear cuenta en Supabase (2 minutos)
```
1. Ir a: https://supabase.com
2. Click en "Start your project"
3. Sign up con GitHub (recomendado)
4. Click en "New Project"
5. Configurar:
   - Name: redmarket
   - Password: (crea una segura y guárdala)
   - Region: South America
6. Click "Create new project"
7. Esperar 2-3 minutos
```

### 2️⃣ Copiar credenciales (30 segundos)
```
1. En Supabase: Settings ⚙️ → Database
2. Buscar "Connection String"
3. Seleccionar modo "URI"
4. Copiar el string completo
5. Reemplazar [YOUR-PASSWORD] con tu contraseña
```

**Ejemplo:**
```
postgresql://postgres.vkxxxx:MiPassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### 3️⃣ Configurar proyecto (1 minuto)
```powershell
# Terminal en tu proyecto
cd Redmarket\backend

# Crear .env
Copy-Item .env.example .env

# Editar .env y pegar:
DATABASE_URL=tu_string_de_supabase_aqui
PORT=3000
```

### 4️⃣ Inicializar base de datos (30 segundos)
```powershell
npm install
npm run init-db
```

**Verás:**
```
✅ Tabla "productos" creada
✅ Tabla "ventas" creada
✅ Tabla "auditoria_stock" creada
✅ TRIGGER 1: creado ⚡
✅ TRIGGER 2: creado ⚡
✅ Datos de prueba insertados
🎉 Base de datos inicializada correctamente
```

### 5️⃣ Ejecutar (1 minuto)
```powershell
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
cd ..\frontend
npm install
npm run dev
```

---

## ✅ Verificar que funciona

### 1. Backend
🔗 http://localhost:3000/api/health

**Debe decir:** `"database": "connected"` ✅

### 2. Frontend
🔗 http://localhost:5173

**Debe mostrar:** Dashboard de RedMarket ✅

### 3. En Supabase (interfaz web)
1. Click en "Table Editor" 📋
2. Ver tabla `productos` → **5 productos**
3. Ver tabla `ventas` → **vacía**
4. Ver tabla `auditoria_stock` → **vacía**

---

## 🧪 Probar Triggers

### Prueba 1: RAISE EXCEPTION (Trigger 1)
```
1. Ir a: http://localhost:5173/ventas
2. Click "Nueva Venta"
3. Seleccionar "Webcam HD" (stock 0)
4. Cantidad: 1
5. Intentar registrar

Resultado: ❌ "Stock insuficiente..."
✅ TRIGGER FUNCIONANDO
```

### Prueba 2: Descuento Automático (Trigger 2)
```
1. Ir a: http://localhost:5173/ventas
2. Click "Nueva Venta"
3. Seleccionar "Laptop HP" (stock 10)
4. Cantidad: 2
5. Registrar

Resultado: ✅ Venta exitosa

Verificar en Supabase:
- Table Editor → productos
- Laptop HP ahora tiene stock: 8
✅ TRIGGER FUNCIONANDO
```

---

## 📊 Resumen

| Paso | Tiempo | Status |
|------|--------|--------|
| Crear cuenta Supabase | 2 min | |
| Copiar credenciales | 30 seg | |
| Configurar .env | 1 min | |
| Inicializar BD | 30 seg | |
| Ejecutar proyecto | 1 min | |
| **TOTAL** | **5 min** | |

---

## 🎓 Para el Sprint 4

Con Supabase cumples:
- ✅ Conexión Backend-DB (Node.js → Supabase PostgreSQL)
- ✅ CRUD Completo (6 módulos)
- ✅ Trigger 1: RAISE EXCEPTION
- ✅ Trigger 2: Descuento automático
- ✅ **EXTRA:** Interfaz web para demostrar

**Puntaje: 40% / 40%** ✅

---

## 🐛 Problemas comunes

### ❌ "password authentication failed"
→ Verifica la contraseña en DATABASE_URL

### ❌ "connection refused"
→ Copia nuevamente el Connection String de Supabase

### ❌ Frontend no conecta
→ Asegura que el backend esté corriendo (`npm run dev`)

---

## 📖 Guía Completa

Para más detalles, ver: **[CONFIGURACION_SUPABASE.md](CONFIGURACION_SUPABASE.md)**

---

## 🎉 Ventajas sobre DBngin

| | Supabase | DBngin |
|---|---|---|
| Instalación | ✅ Ninguna | ❌ Descargar app |
| Tiempo setup | ✅ 5 min | ⚠️ 15 min |
| Interfaz web | ✅ Incluida | ❌ Necesitas pgAdmin |
| Acceso remoto | ✅ Sí | ❌ Solo local |
| SSL | ✅ Automático | ⚠️ Manual |
| Demostración | ✅ Fácil | ❌ Complicado |

---

**🚀 Empieza ahora:** https://supabase.com

**📖 Guía detallada:** [CONFIGURACION_SUPABASE.md](CONFIGURACION_SUPABASE.md)
