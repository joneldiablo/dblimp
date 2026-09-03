# @dblimp/youtube

Componente reproductor de video de YouTube basado en **`react-youtube`** y la API IFrame de YouTube, totalmente integrable con los esquemas del framework DBLimp.

## Instalación

```bash
npm install @dblimp/youtube @dblimp/core react-youtube youtube-player
# o con yarn
yarn add @dblimp/youtube @dblimp/core react-youtube youtube-player
```

### Dependencias de pares (Peer Dependencies)
- `@dblimp/core`: `^1.0.0-dev`
- `react-youtube`: `^10.1.0`
- `youtube-player`: `^5.5.2`
- `react`: `^18.3.1 || ^19.0.0`
- `react-dom`: `^18.3.1 || ^19.0.0`

---

## Componentes Disponibles

- **`YouTubeVideo`**: Componente de video responsivo que permite incrustar reproductores de YouTube mediante identificador de video (`videoId`) o URL, controlando eventos de reproducción, pausa, finalización y opciones del reproductor (`autoplay`, `controls`, `rel`, etc.).

---

## Ejemplo de Uso

```tsx
import React from "react";
import YouTubeVideo from "@dblimp/youtube";

export const VideoDemo = () => (
  <div className="ratio ratio-16x9 shadow-sm rounded overflow-hidden">
    <YouTubeVideo
      name="introVideo"
      videoId="dQw4w9WgXcQ"
      opts={{
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1
        }
      }}
      onReady={(e) => console.log("Video listo:", e.target)}
      onPlay={() => console.log("Reproduciendo...")}
    />
  </div>
);
```

### En esquemas Goat

```json
{
  "name": "tutorial-video",
  "component": "YouTubeVideo",
  "videoId": "M7lc1UVf-VE",
  "classes": "rounded my-3 shadow"
}
```

---

## Licencia

ISC
