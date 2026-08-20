/* Netlify Function — trae el número de seguidores del artista en Spotify.
   No tocar desde el front. Configuración por variables de entorno (ver CLAUDE.md).

   IMPORTANTE: la Web API de Spotify NO expone "oyentes mensuales" (monthly
   listeners) — ese número solo se ve dentro de las apps de Spotify. Lo único
   público vía API es el conteo de "followers" del artista, que es lo que
   devuelve esta función. */

let cachedToken = null;
let tokenExpiry = 0;

async function getToken(clientId, clientSecret) {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    },
    body: 'grant_type=client_credentials'
  });
  if (!res.ok) throw new Error('No se pudo autenticar contra Spotify');

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

exports.handler = async function () {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_ARTIST_ID } = process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_ARTIST_ID) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Faltan variables de entorno: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_ARTIST_ID. Configuralas en Netlify → Site settings → Environment variables.'
      })
    };
  }

  try {
    const token = await getToken(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET);

    const artistRes = await fetch(`https://api.spotify.com/v1/artists/${SPOTIFY_ARTIST_ID}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!artistRes.ok) throw new Error('No se pudo leer el artista en Spotify');

    const artist = await artistRes.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        // cachea 1h en el borde de Netlify — no pega a la API de Spotify en cada visita
        'Cache-Control': 'public, max-age=3600'
      },
      body: JSON.stringify({ followers: artist.followers.total })
    };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: err.message }) };
  }
};
