# Kuntur · Coctelería andina (Huancayo)

SPA hecha con **Vite + React 18** para la **Práctica Semana 07 – React Hooks**
(Desarrollo de Aplicaciones Web, IS093A · UNCP).

Es la web de un bar de coctelería andina: carta con catálogo en vivo, carrito, sesión,
reservas con validación en tiempo real y modo día/noche.

## Cómo ejecutarlo en Visual Studio Code

Requisitos: **Node.js ≥ 20** y VS Code.

1. `Archivo > Abrir carpeta…` y elige la carpeta `kuntur-bar`.
2. VS Code te sugerirá instalar las extensiones recomendadas (ES7+ React Snippets, ESLint, Error Lens). Acepta.
3. Abre la terminal (`` Ctrl+` ``) y ejecuta:

```bash
npm install
npm run dev
```

4. Se abre `http://localhost:5173`. (También puedes usar `Ctrl+Shift+B` y se inicia la tarea "Iniciar Kuntur".)

> Necesita internet: el catálogo (con imágenes) se descarga de **TheCocktailDB** (gratis, sin API key).
> Importante: el Profiler solo mide en `npm run dev` (en `npm run build` React lo desactiva).

## Qué cubre cada paso de la guía

| Paso | Dónde está | Qué mirar |
| --- | --- | --- |
| 1. Render + StrictMode + Profiler | `src/main.jsx`, `src/utils/profilerStore.js`, `src/components/MetricsPanel.jsx` | Botón de actividad (abajo-izquierda) = panel de commits por árbol (`App`, `Carta`). Compara con React DevTools > Profiler. |
| 2. `useEffect` + async/await + AbortController | `src/hooks/useFetch.js` | Cleanup con `controller.abort()`. Comentario que explica por qué `[]` ≠ "una sola vez" en StrictMode. |
| 3. `useContext` por dominio | `src/context/ThemeContext.jsx`, `AuthContext.jsx`, `CartContext.jsx` | 3 contextos separados; el carrito además se divide en *estado* y *acciones* para evitar re-renders. |
| 4. `useMemo`, `useCallback`, `useRef`, `React.memo` | `Menu.jsx` (filtro con `useMemo`, `useRef` en el buscador, atajo `/`), `DrinkCard.jsx` (`memo`), `App.jsx` (`useCallback`), `Dialog.jsx` (`useRef`) | En el panel Profiler escribe en "Reservas": los commits de **Carta** no suben. |
| 5. Hooks personalizados | `useFetch`, `useForm`, `useDebounce`, `useLocalStorage` en `src/hooks/` | `useForm` se reutiliza en Login y Reservas. `npm run lint` valida las Reglas de Hooks. |
| `useReducer` | `CartContext.jsx` (`cartReducer`) | add / inc / dec / remove / clear |

## Validación en tiempo real

- **Reservas**: nombre y apellido, DNI (8 dígitos, solo números), celular peruano (9 dígitos, empieza con 9),
  correo, fecha (no pasada, máx. 60 días, **lunes cerrado**), hora, personas (1–12), comentario (140 máx.), términos.
- **Login**: correo y contraseña (8+, mayúscula y número) con medidor de seguridad.
- Cada campo muestra icono de error/correcto y mensaje mientras escribes; si envías con errores, el foco va al primer campo inválido.

## Evidencias que pide la guía

1. **Capturas de VS Code** de cada paso: abre los archivos de la tabla anterior.
2. **Capturas de la SPA** en `localhost:5173`: portada, carta, detalle de un trago, carrito, login con errores, reserva con errores y ticket final.
3. **Enlace de GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Práctica Semana 07 - React Hooks (Kuntur)"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/kuntur-bar.git
   git push -u origin main
   ```
4. **Video corto** explicando los 5 pasos → súbelo a Google Drive y compártelo con el correo indicado en la guía.

## Sobre la "Regla de laboratorio"

La guía pide que cada intervención de IA en ciclos de render o dependencias lleve el comentario
`// IA: [problema] → Solución manual: [explicación]`. Están en `useFetch.js`, `Dialog.jsx` y `Menu.jsx`.
Antes de entregar, lee el código de los hooks hasta poder explicarlo con tus palabras: lo vas a necesitar en el video.

## Notas

- Los nombres de los tragos vienen en inglés desde la API; las instrucciones salen en español cuando la API las tiene.
- Los precios son simulados (se calculan a partir del id del trago).
- La sesión y el carrito son de demostración y se guardan solo en `localStorage`.

## Estructura

```
src/
  api/cocktails.js        catálogo (URLs, normalización, precios simulados)
  context/                ThemeContext · AuthContext · CartContext (useReducer)
  hooks/                  useFetch · useForm · useDebounce · useLocalStorage
  components/             Header · Hero · Menu · DrinkCard · DrinkModal · CartDrawer
                          LoginModal · ReservationForm · Field · Dialog · MetricsPanel · Footer
  utils/                  validators · format · profilerStore
```
