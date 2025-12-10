# 🎬 Movie Tracker

Aplicación móvil multiplataforma para gestionar y valorar películas favoritas con Expo + React Native + TypeScript.

## 📝 Descripción

Movie Tracker permite explorar películas populares desde TMDB, crear notas personales con fotos desde cámara/galería, y organizar tus favoritos con persistencia local.

## 🛠️ Tecnologías

- **Expo SDK 54** - Framework multiplataforma
- **React Native** - UI nativa
- **TypeScript** - Tipado estático
- **Expo Router** - Navegación file-based
- **Context API** - Estado global
- **AsyncStorage** - Persistencia local
- **Axios** - Cliente HTTP
- **TMDB API** - Base de datos de películas
- **expo-image-picker** - Cámara y galería

## 🚀 Instalación
```bash
npm install
npx expo start
```

Escanea el QR con Expo Go en tu dispositivo móvil.

## ✨ Funcionalidades

- 🔍 **Explorar películas** - Películas populares y búsqueda en tiempo real
- 📝 **Añadir notas** - Escribe reseñas personales con fotos
- ⭐ **Valorar** - Sistema de estrellas (1-5)
- ❤️ **Favoritos** - Marca y filtra tus películas preferidas
- 🎨 **Temas** - Claro, oscuro o automático según el sistema
- 📊 **Ordenamiento** - Por fecha, valoración o título
- 💾 **Persistencia** - Todos los datos se guardan localmente

## 🔌 API Externa

**TMDB (The Movie Database)**
- Base URL: `https://api.themoviedb.org/3`
- Endpoints:
  - `GET /movie/popular` - Películas populares
  - `GET /search/movie` - Búsqueda
  - `GET /movie/{id}` - Detalles de película

## 📱 Permisos

| Permiso | Uso | Cuándo |
|---------|-----|--------|
| **Cámara** | Tomar fotos para notas | Al pulsar "Cámara" en detalle |
| **Galería** | Seleccionar imágenes | Al pulsar "Galería" en detalle |

Se solicitan en tiempo de ejecución cuando el usuario intenta usar la funcionalidad.

## 🎯 Estructura del Proyecto
```
movie-tracker-simple/
├── app/                    # Rutas (Expo Router)
│   ├── (tabs)/            # Pestañas principales
│   │   ├── index.tsx      # Explorar películas
│   │   ├── favorites.tsx  # Favoritos
│   │   └── settings.tsx   # Ajustes
│   └── movie/[id].tsx     # Detalle de película
├── components/            # Componentes reutilizables
├── context/              # Estado global (Context API)
├── services/             # Cliente API (TMDB)
├── types/                # Tipos TypeScript
└── constants/            # Configuración y colores
```

## 💭 Reflexión: React Native vs Jetpack Compose

### React Native (Expo)
✅ Multiplataforma (iOS + Android + Web)  
✅ Hot reload instantáneo  
✅ Gran ecosistema (expo-*)  
✅ Desarrollo rápido  
❌ Bundle size mayor  

### Jetpack Compose
✅ Rendimiento óptimo  
✅ Integración perfecta con Android  
✅ Código nativo puro  
❌ Solo Android  

**Conclusión:** Para este proyecto, React Native fue ideal por permitir desarrollo multiplataforma con una única codebase, cumpliendo todos los requisitos del enunciado de forma eficiente.

## 📸 Demo

![Demo de la aplicación](./video.gif)

## 👤 Autor

**Javi** - Desarrollo de Aplicaciones Multiplataforma (DAM)  
Proyecto Final UT3 - 2025/2026

