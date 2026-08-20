/* CONFIG — tus links, tu foto, tu lanzamiento. Es lo unico que tocas seguido. */
const CONFIG = {
  nombre: "LESTA",
  tagline: "Escuchá en Spotify",
  foto: "",                    // poné la URL de tu foto acá

  // Seguidores en Spotify, traídos en vivo vía Netlify Function.
  // Requiere deploy en Netlify + variables de entorno. Ver CLAUDE.md.
  // (La API de Spotify no da "oyentes mensuales", solo "followers".)
  oyentes: {
    activo: false,
    endpoint: "/.netlify/functions/spotify-followers"
  },

  // Cinta de marquesina en loop. Útil para un lanzamiento, un anuncio, tour, etc.
  marquee: {
    activo: false,
    texto: "NUEVO SINGLE · 20 DE AGOSTO · ",
    velocidad: 22   // segundos por vuelta completa. más alto = más lento
  },

  // Lanzamiento. Poné activo:false cuando no tengas nada por salir.
  lanzamiento: {
    activo: true,
    titulo: "NUEVO SINGLE",    // el nombre del tema
    fecha: "2026-08-20T00:00:00-03:00",
    preLabel: "Próximo lanzamiento",
    postLabel: "Ya disponible",
    // TODO: cuando tengas el link puntual del single (pre-save / track), reemplazar
    // estos dos por ese, hoy apuntan al perfil de artista.
    linkPreSave: "https://open.spotify.com/artist/5w9wW6x312Qx46yDLST3ai",  // antes de salir
    linkEscuchar: "https://open.spotify.com/artist/5w9wW6x312Qx46yDLST3ai"  // después de salir
  },

  links: [
    { titulo:"Spotify",   url:"https://open.spotify.com/artist/5w9wW6x312Qx46yDLST3ai", icono:"spotify", destacado:true },
    // ⚠️ usé @LESTA__ (tu canal personal) porque fue el que me pasaste. El otro,
    // @Lesta. (el que arma DistroKid), tiene mezclado contenido de otro artista —
    // ver charla con Claude sobre eso. Cuando esté resuelto, decidís cuál linkear acá.
    { titulo:"YouTube",   url:"https://www.youtube.com/@LESTA__",   icono:"youtube" },
    { titulo:"TikTok",    url:"https://www.tiktok.com/@lestayk",    icono:"tiktok" },
    { titulo:"Instagram", url:"https://instagram.com/", icono:"instagram" },
    { titulo:"Merch",     url:"#", icono:"bag", proximamente:true }
  ],

  footer: "LESTA © 2026"
};
