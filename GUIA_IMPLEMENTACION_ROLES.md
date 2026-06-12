# 🔐 GUÍA DE IMPLEMENTACIÓN: Sistema de Roles y Autenticación

## 📋 Resumen de Cambios

Se ha implementado un **sistema completo de autenticación con roles** en la aplicación:

### ✅ Lo que se agregó:
1. **Sistema de Usuarios con Roles** (Admin y Viewer)
2. **Login por Email y Contraseña**
3. **Hook de Autenticación** (`useAuth`)
4. **Control de Acceso** por roles en vistas
5. **Página de Gestión de Usuarios** (solo para admins)
6. **Edición de Registros** en Inventario (solo admins)
7. **Navbar Dinámico** con información del usuario

---

## 🚀 PASO 1: Crear Tablas en Supabase

Abre el **SQL Editor** de tu proyecto Supabase y ejecuta este código:

```sql
-- ===================================================
-- TABLA DE USUARIOS
-- ===================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Comentarios descriptivos
COMMENT ON TABLE users IS 'Tabla de usuarios del sistema con roles';
COMMENT ON COLUMN users.role IS 'Rol del usuario: admin (puede editar) o viewer (solo lectura)';
```

---

## 🚀 PASO 2: Insertar Usuarios de Prueba

En el mismo SQL Editor, ejecuta:

```sql
-- Usuario ADMIN
INSERT INTO users (email, password, full_name, role)
VALUES (
  'admin@empresa.com',
  'admin123',
  'Administrador del Sistema',
  'admin'
);

-- Usuario VIEWER (solo lectura)
INSERT INTO users (email, password, full_name, role)
VALUES (
  'viewer@empresa.com',
  'viewer123',
  'Usuario de Lectura',
  'viewer'
);

-- Verificar que se crearon correctamente
SELECT id, email, role, created_at FROM users;
```

---

## 🚀 PASO 3: Agregar Campos a Tabla 'inventory'

Si tu tabla `inventory` **NO** tiene estos campos, agrégalos:

```sql
-- Agregar campos para rastrear quién creó el registro
ALTER TABLE inventory 
ADD COLUMN created_by UUID REFERENCES users(id),
ADD COLUMN created_by_name TEXT,
ADD COLUMN created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

-- Crear índices
CREATE INDEX idx_inventory_created_by ON inventory(created_by);

-- Si la tabla ya tiene estas columnas, este paso fallará (es normal)
```

---

## 📱 PASO 4: Probar el Sistema

### Acceso de Usuario

Abre tu app en `http://localhost:3000/`

Te redirigirá a `/login`

**Usa estas credenciales:**

| Rol | Email | Contraseña |
|-----|-------|-----------|
| **Admin** | admin@empresa.com | admin123 |
| **Viewer** | viewer@empresa.com | viewer123 |

### Diferencias de Acceso

#### 👨‍💼 Admin puede:
- ✅ Ver **Inventario** (lectura completa)
- ✅ **Editar registros** (botón ✏️ en tabla)
- ✅ **Cambiar estado** de dispositivos
- ✅ Ver **Dashboard**
- ✅ Ver **Activos Propios**
- ✅ **Registrar nuevos dispositivos**
- ✅ Acceder a **Gestión de Usuarios** (👥)

#### 👁️ Viewer (Lectura) puede:
- ✅ Ver **Inventario** (sin editar)
- ✅ Ver **Dashboard**
- ✅ Ver **Activos Propios**
- ❌ NO puede registrar dispositivos
- ❌ NO puede editar registros
- ❌ NO puede gestionar usuarios

---

## 🔧 ARCHIVOS MODIFICADOS

### Archivos Creados:
```
app/hooks/useAuth.ts              ← Hook de autenticación
app/components/Navbar.tsx         ← Navegación con autenticación
app/usuarios/page.tsx             ← Gestión de usuarios (admin)
GUIA_IMPLEMENTACION_ROLES.md      ← Esta guía
```

### Archivos Modificados:
```
app/types.ts                      ← Agregado: User, UserRole
app/login/page.tsx                ← Ahora usa email/password
app/layout.tsx                    ← Usa nuevo Navbar
app/inventario/page.tsx           ← Edición + control de roles
app/registrar/page.tsx            ← Acceso solo admin
app/activos-propios/page.tsx      ← Requiere autenticación
```

---

## 🛡️ Seguridad - Notas Importantes

### ⚠️ Producción
- **NO** guardes contraseñas en texto plano
- Usa **bcrypt** o similar para hashear contraseñas
- Implementa **RLS (Row Level Security)** en Supabase
- Usa **HTTPS** en producción
- Establece cookies **HttpOnly** y **Secure**

### Para Desarrollo Actual
- Las contraseñas se guardan en texto plano (solo para pruebas)
- Las sesiones se guardan en `localStorage` (no es ideal en prod)
- No hay validaciones de fuerza de contraseña

---

## 🎯 Flujo de Autenticación

```
Usuario entra a /login
          ↓
Ingresa email y contraseña
          ↓
useAuth.login() busca en BD
          ↓
Compara contraseña
          ↓
✅ Éxito → Guarda en localStorage y redirige a /
❌ Error → Muestra mensaje
```

---

## 📝 Crear Nuevos Usuarios desde la App

1. **Inicia sesión como Admin**
2. Ve a **👥 Gestionar Usuarios** (en el menú izquierdo)
3. Haz clic en **➕ Crear Usuario**
4. Completa el formulario:
   - Correo electrónico
   - Contraseña
   - Nombre (opcional)
   - Rol (Admin o Viewer)
5. Haz clic en **💾 Crear Usuario**

---

## 🔄 Actualizar Rol de un Usuario

Actualmente, no hay interfaz para cambiar roles. Para hacerlo:

1. Ve a Supabase SQL Editor
2. Ejecuta:
```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'viewer@empresa.com';
```

3. El usuario deberá cerrar y abrir sesión para ver los cambios

---

## ❌ Problemas Comunes

### "Usuario o contraseña incorrectos"
- Verifica que el usuario exista en la tabla `users`
- Verifica que la contraseña sea exacta (case-sensitive)
- Asegúrate de que el email esté sin espacios

### "No tienes permiso para acceder a esta página"
- Inicia sesión como Admin
- Los Viewers solo pueden ver Dashboard e Inventario

### "Error al cargar sesión"
- Limpia el localStorage: Abre DevTools → Application → Clear All
- Vuelve a iniciar sesión

---

## 📞 Resumen del Sistema

| Componente | Función |
|-----------|---------|
| `useAuth()` | Hook que gestiona autenticación y roles |
| `Navbar` | Muestra opciones según el rol |
| `/login` | Pantalla de inicio de sesión |
| `/usuarios` | Panel de gestión de usuarios (admin) |
| `/inventario` | Vista con edición si es admin |

---

## ✨ Próximos Pasos Opcionales

- [ ] Implementar bcrypt para hashear contraseñas
- [ ] Agregar validación de email
- [ ] Implementar "Cambiar Contraseña"
- [ ] Agregar RLS en Supabase para seguridad
- [ ] Historial de cambios (quién editó qué)
- [ ] Exportar usuarios a CSV
- [ ] 2FA (autenticación de dos factores)

---

## 📚 Documentación Relacionada

- [SETUP_ROLES_Y_USUARIOS.md](SETUP_ROLES_Y_USUARIOS.md) - Instrucciones SQL detalladas
- [README.md](README.md) - Documentación general del proyecto
