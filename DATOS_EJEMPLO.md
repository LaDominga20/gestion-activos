# Datos de Ejemplo para Activos Propios

## SQL para insertar datos de prueba

Ejecuta esto en tu editor SQL de Supabase para agregar datos de ejemplo:

```sql
INSERT INTO activos_propios (nombre, marca, tipo_dispositivo, caracteristicas, fecha_compra, ubicacion) VALUES
('Monitor 24" Full HD', 'Dell', 'Monitor', 'Pantalla 24 pulgadas, Full HD 1920x1080, entrada HDMI y DisplayPort', '2024-03-15', 'Oficina'),
('Teclado Mecánico RGB', 'Corsair', 'Teclado', 'Mecánico, switches Cherry MX, retroiluminación RGB, conexión USB', '2024-02-10', 'Oficina'),
('Ratón Inalámbrico', 'Logitech', 'Ratón', 'Ratón inalámbrico 2.4GHz, batería de larga duración, sensibilidad ajustable', '2024-01-20', 'Oficina'),
('Impresora Multifuncional', 'HP', 'Impresora', 'Impresora láser monocromo, copia y escaneo, 40 ppm', '2023-11-05', 'Planta'),
('Router WiFi 6', 'ASUS', 'Router', 'WiFi 6E, doble banda, 10 Gbps ethernet, cobertura 200m²', '2024-04-01', 'Planta'),
('Webcam 4K', 'Logitech', 'Cámara', 'Resolución 4K, micrófono integrado, corrección automática de luz', '2024-05-12', 'Oficina'),
('Dock USB-C', 'Belkin', 'Hub', '7 puertos: 3x USB 3.0, HDMI, USB-C con PD 100W, SD/MicroSD', '2024-03-08', 'Tienda'),
('Pantalla Táctil 22"', 'ViewSonic', 'Pantalla Táctil', 'Pantalla táctil capacitiva, 22 pulgadas, Full HD, marco delgado', '2024-04-22', 'Tienda'),
('SSD Externo 1TB', 'Samsung', 'Almacenamiento', 'SSD portátil T7, 1TB, velocidades hasta 1050 MB/s, resistente al agua', '2024-02-18', 'Oficina'),
('Headset Gaming', 'SteelSeries', 'Audio', 'Auriculares con micrófono, sonido 7.1 surround, cable de 2.5m', '2023-12-14', 'Oficina'),
('Proyector LED', 'Epson', 'Proyector', 'Proyector LED compacto, 3300 lúmenes, resolución XGA, ruido bajo', '2024-01-30', 'Planta'),
('Cable de Red Cat6', 'Belkin', 'Accesorios', 'Cable ethernet CAT6 blindado, 20 metros, certificado', '2024-04-10', 'Planta');
```

## Datos esperados después de la inserción

Deberías ver una tabla con 12 registros que incluyan:

| Nombre | Marca | Tipo | Características | Fecha Compra | Ubicación |
|--------|-------|------|-----------------|--------------|-----------|
| Monitor 24" Full HD | Dell | Monitor | Pantalla 24 pulgadas... | 15/03/2024 | Oficina |
| Teclado Mecánico RGB | Corsair | Teclado | Mecánico, switches... | 10/02/2024 | Oficina |
| ... | ... | ... | ... | ... | ... |

## Ejemplos de búsqueda

Una vez insertados, prueba estas búsquedas:

### Buscar por marca:
- `"Dell"` → Encuentra Monitor 24"
- `"Logitech"` → Encuentra Ratón y Webcam
- `"Corsair"` → Encuentra Teclado

### Buscar por tipo:
- `"Monitor"` → Encuentra Monitor 24"
- `"Impresora"` → Encuentra Impresora HP
- `"Almacenamiento"` → Encuentra SSD

### Buscar por ubicación:
- `"Oficina"` → Encuentra 7 dispositivos
- `"Tienda"` → Encuentra 2 dispositivos
- `"Planta"` → Encuentra 3 dispositivos

### Buscar por nombre:
- `"WiFi"` → Encuentra Router
- `"Pantalla"` → Encuentra Monitor, Pantalla Táctil
- `"Samsung"` → Encuentra SSD

## Pasos para insertar los datos:

1. Ve a tu proyecto en Supabase
2. Selecciona "SQL Editor"
3. Crea un nuevo query
4. Copia y pega el SQL anterior
5. Haz clic en "Run"
6. Los datos se insertarán automáticamente

## Verificar que se insertaron correctamente:

```sql
SELECT COUNT(*) as total FROM activos_propios;
SELECT * FROM activos_propios ORDER BY fecha_compra DESC;
```

¡Después de esto, tu aplicación estará lista para usar con datos de ejemplo!
