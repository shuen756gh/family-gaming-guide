// Refreshes the official Roblox game image URLs used by index.html.
// Roblox CDN links expire (the "180DAY-" prefix), so a monthly GitHub Action runs this.
// Images are hotlinked from Roblox, not copied into this repo.
import { readFile, writeFile } from 'node:fs/promises';

const OUT = new URL('../data/roblox-images.json', import.meta.url);
const GAMES = {
  rivals: { universeId: 6035872082, placeId: 17625359962, creator: 'Nosniy Games' },
  bloxFruits: { universeId: 994732206, placeId: 2753915549, creator: 'Gamer Robot Inc' },
};

const get = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
};

const ids = Object.values(GAMES).map((g) => g.universeId).join(',');
const [icons, thumbs] = await Promise.all([
  get(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${ids}&size=512x512&format=Png&isCircular=false`),
  get(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${ids}&countPerUniverse=4&defaults=true&size=768x432&format=Png&isCircular=false`),
]);

const games = {};
for (const [key, g] of Object.entries(GAMES)) {
  const icon = icons.data.find((d) => d.targetId === g.universeId && d.state === 'Completed');
  const shots = (thumbs.data.find((d) => d.universeId === g.universeId)?.thumbnails ?? [])
    .filter((t) => t.state === 'Completed')
    .map((t) => t.imageUrl);
  if (!icon || shots.length === 0) throw new Error(`Missing images for ${key}`);
  games[key] = { page: `https://www.roblox.com/games/${g.placeId}`, creator: g.creator, icon: icon.imageUrl, shots };
}

let previous = null;
try {
  previous = JSON.parse(await readFile(OUT, 'utf8'));
} catch {}

if (previous && JSON.stringify(previous.games) === JSON.stringify(games)) {
  console.log('Image URLs unchanged');
} else {
  const updated = new Date().toISOString().slice(0, 10);
  await writeFile(OUT, JSON.stringify({ updated, games }, null, 2) + '\n');
  console.log(`Wrote ${OUT.pathname} (${updated})`);
}
