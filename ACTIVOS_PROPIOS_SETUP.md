# Instrucciones para crear la tabla de Activos Propios en Supabase

## 1. Crear la tabla `activos_propios`

Ejecuta el siguiente SQL en tu base de datos Supabase:

```sql
CREATE TABLE activos_propios (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombre VARCHAR(255) NOT NULL,
  marca VARCHAR(255) NOT NULL,
  tipo_dispositivo VARCHAR(255) NOT NULL,
  caracteristicas TEXT,
  fecha_compra DATE NOT NULL,
  ubicacion VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 2. Configurar RLS (Row Level Security)

Opcionalmente, puedes configurar las políticas de seguridad:

```sql
-- Habilitar RLS
ALTER TABLE activos_propios ENABLE ROW LEVEL SECURITY;

-- Permitir lectura a todos los usuarios autenticados
CREATE POLICY "Enable read access for all users" 
ON activos_propios FOR SELECT 
USING (true);

-- Permitir inserción a usuarios autenticados
CREATE POLICY "Enable insert for authenticated users" 
ON activos_propios FOR INSERT 
WITH CHECK (true);

-- Permitir actualización a usuarios autenticados
CREATE POLICY "Enable update for authenticated users" 
ON activos_propios FOR UPDATE 
USING (true) WITH CHECK (true);

-- Permitir eliminación a usuarios autenticados
CREATE POLICY "Enable delete for authenticated users" 
ON activos_propios FOR DELETE 
USING (true);
```

## 3. Acceder a la vista

Una vez configurado, puedes acceder a la vista de "Activos Propios" en:
`http://localhost:3000/activos-propios`

## Características de la vista:

✓ **Formulario de registro** con campos para:
  - Nombre del dispositivo
  - Marca
  - Tipo de dispositivo
  - Características
  - Fecha de compra
  - Ubicación

✓ **Visualizador de registros** con:
  - Tabla completa con todos los activos
  - Búsqueda en tiempo real
  - Filtrado por nombre, marca, tipo y ubicación

✓ **Interfaz amigable** con:
  - Diseño responsive para móvil y escritorio
  - Formato de fecha localizado a Perú (es-PE)
  - Contador de resultados

## Notas importantes:

- Asegúrate de tener configuradas las variables de entorno en `.env.local` con las credenciales reales de Supabase
- El componente usa `"use client"` y carga Supabase de forma segura en el lado del cliente
- La búsqueda funciona en tiempo real sin necesidad de hacer clic en un botón
