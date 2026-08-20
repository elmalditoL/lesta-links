# LESTA — página de links propia

Reemplazo de Linktree para el artista LESTA. Página única, estática, sin framework.

## Por qué existe
Linktree no deja tener identidad visual propia ni cambiar la estética por lanzamiento.
La idea es tener una página con **estructura fija** y **piel intercambiable**: cada era
musical trae su tema, la funcionalidad no se toca nunca.

## Estructura

```
index.html          esqueleto. Se toca casi nunca.
base.css            motor de estilos (layout, animaciones, accesibilidad). NO tocar.
app.js              motor (render de links + countdown). NO tocar.
config.js           links, foto, lanzamiento. Se toca seguido.
themes/
  era-1.css         tema neutro (día nublado, verde vegetación)
  carmesi.css       tema del lanzamiento CARMESÍ
netlify/functions/
  spotify-followers.js   backend chico para el contador de oyentes (ver abajo)
```

**Cambiar de era = cambiar una línea en `index.html`:**
```html
<link rel="stylesheet" href="themes/carmesi.css">
```

Los temas viejos quedan guardados. Se puede volver a uno anterior en dos segundos.

## Cómo funciona un tema
Cada archivo en `themes/` define las mismas variables CSS (`--bg`, `--ink`, `--accent`,
`--display`, `--body`, `--radius`, `--grain`) más los ajustes específicos de esa era.
`base.css` se carga **después** del tema y consume esas variables.

Para hacer un tema nuevo: copiar `carmesi.css`, renombrarlo, cambiar los valores.

## Countdown
En `config.js`, objeto `lanzamiento`:
- `activo: false` → la sección desaparece entera.
- Al llegar la fecha, el bloque se convierte solo en un botón "Escuchar ahora".
  No hay que entrar a cambiar nada a las 00:00.
- La fecha va en ISO con offset de Argentina: `"2026-08-20T00:00:00-03:00"`.

## Marquesina (cinta en loop)
En `config.js`, objeto `marquee`:
- `activo: false` → no aparece.
- `texto` es lo que se repite en loop (poné separadores tipo `" · "` al final para
  que quede prolijo cuando se repite).
- `velocidad` en segundos: más alto = más lento.
- El motor (`base.css`/`app.js`) ya resuelve el loop infinito sin cortes y respeta
  `prefers-reduced-motion`. Cada tema puede pintarla distinto — en `carmesi.css`
  es una cinta de tape rotada, en `era-1.css` usa el estilo base (tarjeta blanca).

## Oyentes (seguidores de Spotify en vivo)
En `config.js`, objeto `oyentes`. Muestra "X seguidores en Spotify" abajo del
wordmark, con el número real traído en vivo.

**Importante:** la Web API de Spotify no expone "oyentes mensuales" (monthly
listeners) — ese dato es interno de las apps de Spotify y no está disponible
públicamente. Lo que sí se puede traer es el conteo de **followers** del
artista, que es lo que implementa esto.

Cómo funciona: `app.js` le pega a `/.netlify/functions/spotify-followers`
(una Netlify Function, en `netlify/functions/spotify-followers.js`), que hace
el intercambio de credenciales con Spotify del lado del servidor (así el
Client Secret nunca queda expuesto en el navegador) y devuelve el número.
Si falla o no está configurado, el contador simplemente no aparece — no
rompe nada del resto de la página.

Setup para activarlo (una vez que el sitio esté en Netlify):
1. Crear una app en el [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   (con tu cuenta de Spotify — a partir de 2026 Spotify pide que la cuenta del
   developer sea Premium para poder crear apps en modo desarrollo).
2. Copiar el `Client ID` y el `Client Secret` de esa app.
3. El **Artist ID** ya lo tenemos: `5w9wW6x312Qx46yDLST3ai`
   (sacado de `open.spotify.com/artist/5w9wW6x312Qx46yDLST3ai`).
4. En Netlify → Site settings → Environment variables, cargar:
   `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` y `SPOTIFY_ARTIST_ID=5w9wW6x312Qx46yDLST3ai`.
5. En `config.js`, poner `oyentes.activo: true`.

Esto solo lee un dato público (followers), no requiere que nadie loguee su
cuenta de Spotify — el "Client Credentials Flow" alcanza y no necesita el
modo de acceso extendido de Spotify (eso es para leer datos privados de
usuarios).

## Identidad CARMESÍ (referencia)
De la landing del lanzamiento, para no perder los valores:

| Rol | Hex |
|---|---|
| Fondo | `#0B0A0B` |
| Fondo elevado | `#151114` |
| Carmesí (botones) | `#C0202B` |
| Carmesí profundo (cintas, vinilo) | `#7A1F26` |
| Texto | `#F4F4F4` |
| Texto secundario | `#8A7076` |

Tipografía: display condensada y erosionada, body monoespaciada tipo máquina de escribir.
En el tema se usan `Rubik Distressed` + `Space Mono` de Google Fonts como aproximación.
**Si la landing de Carmesí usa una fuente propia, copiar el `@font-face` real y reemplazar
`--display`** — es lo que más va a acercar el resultado al original.

Elementos de la landing que valdría la pena portar acá cuando esté la base andando:
- cinta de marquesina con texto en loop
- glow rojo detrás del wordmark (ya está en el tema)
- textura de grano sobre el fondo (ya está, subida a 0.09)

## Estado actual
- [x] Estructura de temas funcionando
- [x] Countdown con auto-swap
- [x] Tema era-1 y tema carmesi
- [x] Marquesina en loop (motor + estilo propio en carmesí)
- [x] Contador de oyentes vía Spotify API (Netlify Function lista, falta configurar credenciales)
- [ ] Poner URLs reales en `config.js` (hoy son placeholders)
- [ ] Subir la foto de perfil y apuntar `foto:` a ella
- [ ] Comprar dominio (`lesta.ar` o similar)
- [ ] Deploy
- [ ] Configurar credenciales de Spotify en Netlify y activar `oyentes.activo`
- [ ] Analytics de clicks

## Deploy
Es estático, arrastrás la carpeta a Netlify y ya está. Después conectás el dominio
desde el panel. Si preferís, Firebase Hosting también sirve — ya hay experiencia con
Firebase en el proyecto `mi-reporte`.

## Restricciones a respetar
- **Peso mínimo.** La mayoría entra desde el navegador interno de Instagram o TikTok,
  que es lento. Nada de frameworks, nada de librerías.
- Mobile first. La compu es el caso raro acá.
- Foco visible para teclado y `prefers-reduced-motion` respetado. Ya está resuelto en
  `base.css`, no romperlo.
