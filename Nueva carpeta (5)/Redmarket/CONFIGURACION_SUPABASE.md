# 🚀 GUÍA COMPLETA: RedMarket + Supabase

## ✨ Por qué Supabase es MEJOR

- ✅ **No instalar nada** - Todo en la nube
- ✅ **PostgreSQL gratis** - Sin configuración local
- ✅ **Interfaz web** - Ver tablas, triggers, datos
- ✅ **SSL incluido** - Conexión segura
- ✅ **Fácil de compartir** - Muestra tu proyecto a cualquiera
- ✅ **Rápido** - 5 minutos de setup

---

## 📋 PASO 1: Crear Cuenta en Supabase

### 1. Ir a Supabase
🔗 **https://supabase.com**

### 2. Crear cuenta
- Click en **"Start your project"**
- Sign up con **GitHub** (recomendado) o email

### 3. Crear nuevo proyecto
- Click en **"New Project"**
- Configurar:
  - **Name:** `redmarket`
  - **Database Password:** Crear una contraseña SEGURA
    - Ejemplo: `RedMarket2024!Secure`
    - ⚠️ **IMPORTANTE:** Guarda esta contraseña, la necesitarás
  - **Region:** Elegir más cercana (ej: South America - São Paulo)
  - **Plan:** Free (suficiente para el proyecto)

### 4. Esperar
- El proyecto tarda **2-3 minutos** en crearse
- Verás una pantalla de "Setting up your project..."

---

## 🔑 PASO 2: Obtener Credenciales

### Una vez creado el proyecto:

1. **Click en el ícono ⚙️ "Settings"** (barra izquierda, abajo)

2. **Click en "Database"** (menú izquierdo)

3. **Scroll hasta "Connection String"**

4. **Seleccionar modo "URI"** (arriba de los strings)

5. **Copiar el Connection String**

Ejemplo de lo que verás:
```
postgresql://postgres.vkxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

6. **Reemplazar `[YOUR-PASSWORD]`** con la contraseña que creaste

**Ejemplo final:**
```
postgresql://postgres.vkxxxxxxxxxxxx:RedMarket2024!Secure@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

⚠️ **IMPORTANTE:** Tu string será diferente, cada proyecto tiene un ID único.

---

## ⚙️ PASO 3: Configurar el Backend

### 1. Ir al directorio del backend

```powershell
cd C:\Users\larv2\OneDrive\Desktop\Nueva carpeta (5)\Redmarket\backend
```

### 2. Crear archivo .env

```powershell
Copy-Item .env.example .env
```

### 3. Editar .env

Abre `backend\.env` y configura:

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================
DATABASE_URL=postgresql://postgres.xxxxx:TU_PASSWORD@aws-0-xxxxx.pooler.supabase.com:6543/postgres

# ⚠️ Reemplaza la línea de arriba con tu Connection String de Supabase
# (El que copiaste en el Paso 2)

# ============================================
# SERVIDOR
# ============================================
PORT=3000
```

**Ejemplo real (con tus datos):**
```env
DATABASE_URL=postgresql://postgres.vkxxxxxxxxxxxx:RedMarket2024!Secure@aws-0-us-east-1.pooler.supabase.com:6543/postgres
PORT=3000
```

### 4. Guardar el archivo

---

## 🗄️ PASO 4: Inicializar Base de Datos

### 1. Instalar dependencias (si no lo has hecho)

```powershell
npm install
```

### 2. Ejecutar script de inicialización

```powershell
npm run init-db
```

### Resultado esperado:

```
🔧 Inicializando base de datos...

✅ Tabla "productos" creada
✅ Tabla "ventas" creada
✅ Tabla "auditoria_stock" creada
✅ TRIGGER 1: "trigger_validar_stock" creado (valida stock disponible)
✅ TRIGGER 2: "trigger_descontar_stock" creado (descuenta stock y audita)
✅ Datos de prueba insertados

🎉 Base de datos inicializada correctamente

📋 Resumen:
   - Tablas: productos, ventas, auditoria_stock
   - Triggers: trigger_validar_stock, trigger_descontar_stock
   - Datos de prueba: 5 productos
```

---

## ✅ PASO 5: Verificar en Supabase

### En el dashboard de Supabase:

1. **Click en "Table Editor"** (icono de tabla 📋)

2. **Deberías ver 3 tablas:**
   - `productos` (con 5 productos de prueba)
   - `ventas` (vacía por ahora)
   - `auditoria_stock` (vacía)

3. **Click en "SQL Editor"** (icono </> )

4. **Verificar triggers:**

```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

**Deberías ver:**
```
trigger_validar_stock    | INSERT | ventas
trigger_descontar_stock  | INSERT | ventas
```

---

## 🚀 PASO 6: Iniciar el Backend

### 1. Ejecutar en modo desarrollo

```powershell
npm run dev
```

### Resultado esperado:

```
✅ Conectado a PostgreSQL (Aiven/Cloud)
🚀 Servidor corriendo en http://localhost:3000
```

### 2. Verificar conexión

Abre en tu navegador:
🔗 **http://localhost:3000/api/health**

**Deberías ver:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-xx-xxTxx:xx:xx.xxxZ",
  "version": "PostgreSQL 15.x"
}
```

---

## 🎨 PASO 7: Iniciar el Frontend

### En OTRA terminal:

```powershell
cd C:\Users\larv2\OneDrive\Desktop\Nueva carpeta (5)\Redmarket\frontend
npm install
npm run dev
```

### Abrir en navegador:

🔗 **http://localhost:5173**

---

## 🧪 PASO 8: Probar los Triggers

### Prueba 1: Ver productos

1. En el frontend: **http://localhost:5173/productos**
2. Deberías ver los 5 productos de prueba

### Prueba 2: Intentar venta sin stock (TRIGGER 1)

1. Ir a: **http://localhost:5173/ventas**
2. Click en **"+ Nueva Venta"**
3. Seleccionar:
   - Cliente: Cualquiera
   - Producto: **"Webcam HD"** (tiene stock 0)
   - Cantidad: 1
4. Click en **"Registrar Venta"**

**Resultado esperado:**
```
❌ Error: Stock insuficiente para el producto "Webcam HD" (ID: 5).
Stock disponible: 0, Cantidad solicitada: 1
```

✅ **TRIGGER 1 funcionando** (RAISE EXCEPTION)

### Prueba 3: Venta exitosa (TRIGGER 2)

1. Ir a: **http://localhost:5173/ventas**
2. Click en **"+ Nueva Venta"**
3. Seleccionar:
   - Cliente: Cualquiera
   - Producto: **"Laptop HP"** (tiene stock 10)
   - Cantidad: 2
4. Click en **"Registrar Venta"**

**Resultado esperado:**
```
✅ Venta registrada exitosamente
```

5. **Verificar en Supabase:**
   - Ir a Table Editor → `productos`
   - **Laptop HP ahora tiene stock: 8** (10 - 2)
   - Ir a Table Editor → `auditoria_stock`
   - **Hay 1 registro** de la venta

✅ **TRIGGER 2 funcionando** (descuenta stock automáticamente)

---

## 🐛 Solución de Problemas

### ❌ Error: "password authentication failed"

**Causa:** Contraseña incorrecta en DATABASE_URL

**Solución:**
1. Verificar que copiaste la contraseña correcta
2. Verificar que no hay espacios extra en el .env
3. Si olvidaste la contraseña:
   - Supabase → Settings → Database
   - Click en "Reset Database Password"

### ❌ Error: "connection refused"

**Causa:** DATABASE_URL incorrecto

**Solución:**
1. Ir a Supabase → Settings → Database
2. Copiar nuevamente el "Connection String"
3. Asegurar que es el modo "URI" (no "Session")
4. Actualizar `.env`

### ❌ Error: "database does not exist"

**Causa:** Intentando conectar a una BD que no existe en Supabase

**Solución:**
- El database en Supabase siempre se llama `postgres`
- Verificar que tu DATABASE_URL termine en `/postgres`

### ❌ No se ejecuta init-db

**Causa:** No está instalado el módulo `pg`

**Solución:**
```powershell
cd backend
npm install
npm run init-db
```

---

## 📊 Ventajas de Supabase vs DBngin

| Característica | Supabase | DBngin |
|----------------|----------|--------|
| Instalación | ✅ Ninguna | ❌ Instalar app |
| Configuración | ✅ 5 minutos | ⚠️ 10-15 minutos |
| Interfaz web | ✅ Incluida | ❌ Necesitas pgAdmin |
| Acceso remoto | ✅ Desde cualquier lado | ❌ Solo local |
| SSL | ✅ Automático | ⚠️ Manual |
| Backups | ✅ Automáticos | ❌ Manual |
| Colaboración | ✅ Fácil | ❌ Complicado |
| Gratis | ✅ Sí (500 MB) | ✅ Sí |

---

## 🎓 Para el Sprint 4

Con Supabase tienes:

✅ **Conexión Backend-DB** (Node.js → Supabase PostgreSQL)  
✅ **CRUD Completo** (6 módulos funcionando)  
✅ **Trigger 1:** Validación con RAISE EXCEPTION  
✅ **Trigger 2:** Descuento automático de stock  
✅ **Demostración fácil** (cualquiera puede verlo online)  

---

## 📝 Checklist Final

- [ ] Cuenta en Supabase creada
- [ ] Proyecto `redmarket` creado
- [ ] Connection String copiado
- [ ] Archivo `backend/.env` configurado con DATABASE_URL
- [ ] `npm run init-db` ejecutado exitosamente
- [ ] Backend corriendo (`npm run dev`)
- [ ] Frontend corriendo (`npm run dev`)
- [ ] Verificado `/api/health` → "connected"
- [ ] Probado trigger de validación (sin stock)
- [ ] Probado trigger de descuento (con stock)
- [ ] Verificado en Supabase Table Editor

---

## 🎉 ¡Listo!

Tu proyecto RedMarket ahora está:
- ✅ En la nube (Supabase)
- ✅ Con triggers funcionando
- ✅ Fácil de demostrar
- ✅ Accesible desde cualquier lugar
- ✅ Cumple 100% con Sprint 4

---

**🚀 Siguiente paso: Ir a https://supabase.com y crear tu cuenta**

---

## 📞 Ayuda Adicional

- **Documentación Supabase:** https://supabase.com/docs
- **Guía frontend:** [INICIO_RAPIDO.md](INICIO_RAPIDO.md)
- **Documentación completa:** [INDEX.md](INDEX.md)

---

**Última actualización:** Configuración optimizada para Supabase
