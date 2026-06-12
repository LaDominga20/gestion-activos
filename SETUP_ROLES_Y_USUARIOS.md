# 🔐 Setup de Roles y Usuarios

## SQL para Crear Tablas en Supabase

Ejecuta este SQL en el Editor de Supabase para crear el sistema de usuarios y roles.

### 1. Crear Tabla de Usuarios

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear índice en email para búsquedas rápidas
CREATE INDEX idx_users_email ON users(email);

-- Crear índice en role para filtrados
CREATE INDEX idx_users_role ON users(role);
```

### 2. Crear Tabla de Historial de Cambios

```sql
CREATE TABLE inventory_changes (
  id SERIAL PRIMARY KEY,
  inventory_id INTEGER NOT NULL,
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by UUID REFERENCES users(id),
  changed_at TIMESTAMP DEFAULT NOW()
);

-- Índices para búsquedas
CREATE INDEX idx_inventory_changes_inventory_id ON inventory_changes(inventory_id);
CREATE INDEX idx_inventory_changes_changed_by ON inventory_changes(changed_by);
```

### 3. Agregar Campo de Usuario a Inventario

```sql
-- Si la tabla 'inventory' no tiene el campo 'created_by', agrégalo:
ALTER TABLE inventory ADD COLUMN created_by UUID;
ALTER TABLE inventory ADD COLUMN created_by_name TEXT;

-- Agregar índice
CREATE INDEX idx_inventory_created_by ON inventory(created_by);
```

### 4. Insertar Usuarios de Ejemplo

```sql
-- Usuario Admin
INSERT INTO users (email, password, full_name, role)
VALUES (
  'admin@empresa.com',
  'admin123',
  'Administrador',
  'admin'
);

-- Usuario Viewer (solo lectura)
INSERT INTO users (email, password, full_name, role)
VALUES (
  'viewer@empresa.com',
  'viewer123',
  'Usuario de Lectura',
  'viewer'
);
```

## 🛡️ Roles Disponibles

| Rol | Permisos | Vistas |
|-----|----------|--------|
| **admin** | Crear, Leer, Editar, Eliminar registros | Dashboard, Inventario, Activos Propios, Registrar |
| **viewer** | Solo Leer | Dashboard, Inventario (sin editar) |

## ⚠️ Notas Importantes

1. **Para Hash de Contraseñas**: Usaremos bcrypt en la aplicación Node.js
2. **La tabla `users` NO usa auth.users de Supabase** por simplicidad
3. Los roles se verificarán en cada solicitud

## 📌 Próximos Pasos

1. Ejecuta este SQL en Supabase
2. Actualiza la aplicación con los archivos nuevos
3. Crea contraseñas seguras para los usuarios
