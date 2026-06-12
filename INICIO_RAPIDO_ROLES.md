# 🚀 INICIO RÁPIDO - 5 MINUTOS

## ¿QUÉ SE IMPLEMENTÓ?

```
ANTES:                              DESPUÉS:
└─ Una contraseña para todos   →   └─ Sistema de roles
                                      ├─ Admin (editar todo)
                                      └─ Viewer (solo lectura)
```

---

## 3 PASOS PARA EMPEZAR

### PASO 1️⃣: Crear tabla en Supabase (2 min)

Abre tu proyecto Supabase → **SQL Editor** y copia/pega esto:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- Usuarios de prueba
INSERT INTO users (email, password, full_name, role) VALUES
('admin@empresa.com', 'admin123', 'Administrador', 'admin'),
('viewer@empresa.com', 'viewer123', 'Usuario Lectura', 'viewer');
```

**✅ Click en "Execute"**

---

### PASO 2️⃣: Actualizar tabla inventory (1 min)

En el mismo SQL Editor, ejecuta:

```sql
ALTER TABLE inventory 
ADD COLUMN created_by UUID,
ADD COLUMN created_by_name TEXT;
```

*(Si da error de columna existente, es normal - sigue)*

---

### PASO 3️⃣: Probar en tu app (2 min)

```bash
npm run dev
```

Abre: `http://localhost:3000/`

Serás redirigido a login. Usa:

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@empresa.com | admin123 |
| Viewer | viewer@empresa.com | viewer123 |

---

## 🎮 ¿QUÉ PUEDO HACER?

### 👨‍💼 Admin puede:
- ✅ Ver Inventario
- ✅ **Editar registros** (botón ✏️)
- ✅ Cambiar estado
- ✅ Registrar dispositivos
- ✅ Crear usuarios (en 👥 Gestionar Usuarios)

### 👁️ Viewer puede:
- ✅ Ver Inventario
- ✅ Ver Dashboard
- ❌ NO editar
- ❌ NO registrar

---

## 📂 ARCHIVOS NUEVOS CREADOS

```
app/hooks/useAuth.ts                    ← Hook de autenticación
app/components/Navbar.tsx               ← Navbar dinámica
app/usuarios/page.tsx                   ← Gestión de usuarios
GUIA_IMPLEMENTACION_ROLES.md            ← Guía completa
SETUP_ROLES_Y_USUARIOS.md               ← SQL detallado
CAMBIOS_TECNICAS_DETALLADOS.md          ← Cambios por archivo
INDICE_DOCUMENTACION_ROLES.md           ← Índice
RESUMEN_SISTEMA_ROLES.md                ← Este documento
```

---

## 🎯 PRÓXIMA TAREA

Cuando hayas probado:
1. Lee: [CAMBIOS_TECNICAS_DETALLADOS.md](CAMBIOS_TECNICAS_DETALLADOS.md)
2. Entiende cómo funciona el sistema
3. Customiza credenciales
4. *(Antes de producción: implementa bcrypt)*

---

## 🐛 SI ALGO FALLA

### "Usuario o contraseña incorrectos"
→ Verifica que ejecutaste el SQL correctamente

### "No tienes permiso para acceder"
→ Inicia sesión como admin@empresa.com

### "Página en blanco"
→ Abre DevTools (F12) y busca errores en Console

---

## ✅ LISTO PARA PRODUCCIÓN?

Antes de subir a producción, haz esto:

```python
# 1. Cambiar contraseñas de prueba
UPDATE users SET password = 'contraseña_segura' 
WHERE email = 'admin@empresa.com';

# 2. Implementar bcrypt para hashear
# 3. Usar cookies en lugar de localStorage
# 4. Implementar RLS en Supabase
# 5. Cambiar emails de prueba por reales
```

---

## 📚 DOCUMENTACIÓN COMPLETA

Para más detalles, ve a:
- [GUIA_IMPLEMENTACION_ROLES.md](GUIA_IMPLEMENTACION_ROLES.md) - Guía paso a paso
- [INDICE_DOCUMENTACION_ROLES.md](INDICE_DOCUMENTACION_ROLES.md) - Índice de todos los docs

---

**🎉 ¡Listo! Tu sistema de roles está funcionando.**

*¿Preguntas? Revisa la documentación o contacta al desarrollador.*
