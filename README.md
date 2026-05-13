This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🎯 Sistema de Gestión TI

Sistema integral de gestión de inventario y activos para **Panalia / Propasac / Pastired**.

### ✨ Características Principales

- 📊 **Dashboard** de estadísticas
- 📦 **Inventario** de dispositivos por colaborador
- 🏢 **Activos Propios** (NUEVO) para dispositivos de uso general
- ➕ **Registro** de nuevos dispositivos
- 🔍 **Búsqueda** en tiempo real
- 📥 **Exportación** a Excel

---

## 🚀 Nueva Funcionalidad: Activos Propios

Se ha implementado una nueva vista para gestionar dispositivos propios de la empresa.

**📍 Ubicación:** `http://localhost:3000/activos-propios`

**📚 Documentación:** Ver [INDICE_DOCUMENTACION.md](INDICE_DOCUMENTACION.md)

### Campos Soportados
- Nombre del dispositivo
- Marca
- Tipo de dispositivo
- Características
- Fecha de compra
- Ubicación (Oficina, Tienda, Planta)

### Funcionalidades
✅ Formulario de registro completo
✅ Tabla visualizadora con búsqueda
✅ Búsqueda en tiempo real
✅ Interfaz responsive

---

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📋 Configuración Rápida (Activos Propios)

1. **Lee la guía rápida:**
   ```
   GUIA_RAPIDA_ACTIVOS_PROPIOS.md
   ```

2. **Crea la tabla en Supabase:**
   - Ver: `ACTIVOS_PROPIOS_SETUP.md`

3. **Actualiza .env.local:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
   ```

4. **¡Listo!** Accede a `/activos-propios`

---

## 📚 Documentación Completa

| Documento | Propósito |
|-----------|-----------|
| [INDICE_DOCUMENTACION.md](INDICE_DOCUMENTACION.md) | 📚 Índice y navegación |
| [GUIA_RAPIDA_ACTIVOS_PROPIOS.md](GUIA_RAPIDA_ACTIVOS_PROPIOS.md) | ⚡ Configuración en 5 min |
| [ACTIVOS_PROPIOS_SETUP.md](ACTIVOS_PROPIOS_SETUP.md) | 🗄️ SQL y configuración DB |
| [IMPLEMENTACION_ACTIVOS_PROPIOS.md](IMPLEMENTACION_ACTIVOS_PROPIOS.md) | 🔧 Detalles técnicos |
| [DATOS_EJEMPLO.md](DATOS_EJEMPLO.md) | 📊 Datos de prueba |
| [RESUMEN_FINAL.md](RESUMEN_FINAL.md) | 📋 Visión general |

---

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 📁 Project Structure

```
app/
├── activos-propios/          # NUEVA - Vista Activos Propios
│   └── page.tsx
├── inventario/
├── registrar/
├── login/
├── components/
├── lib/
│   └── supabase.ts
├── types.ts                  # Actualizado
└── layout.tsx                # Actualizado
```

---

## 🔗 Rutas Disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Dashboard |
| `/inventario` | Inventario de dispositivos |
| `/activos-propios` | ✨ Activos propios (NUEVO) |
| `/registrar` | Registrar nuevo dispositivo |
| `/login` | Login |

---

## 🔐 Variables de Entorno

Crea un archivo `.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
```

---

## 📞 Soporte

**Para empezar con Activos Propios:**
1. Abre [INDICE_DOCUMENTACION.md](INDICE_DOCUMENTACION.md)
2. Selecciona el documento que necesites
3. Sigue las instrucciones

---

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
