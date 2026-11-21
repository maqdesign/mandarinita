import { serveHeroImage } from '../../../../../_lib/hero-image.js';

export async function onRequestGet({ params, env }) {
  return serveHeroImage(params.filename, env);
}
