import { test, expect } from 'bun:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ProfileCard } from '../src/components/ProfileCard';
import { fetchUserImages } from '../src/utils/fetchUserImages';

test('readme layout renders a native SVG frame for live presence', () => {
  const data = {
    discord_status: 'online', listening_to_spotify: false, activities: [],
    discord_user: { id: '775329619259162654', username: 'sizwinz', global_name: 'SizWinz',
      discriminator: '0', public_flags: 0, avatar: '', primary_guild: null, avatar_decoration_data: null },
  };
  const images = { avatar: null, avatarDecoration: null, clanBadge: null, activityImages: [], userEmoji: null, albumCover: null };
  const svg = renderToStaticMarkup(<ProfileCard data={data} images={images} settings={{layout:'readme', theme:'dark'}} />);
  expect(svg).toContain('data-layout="readme"');
  expect(svg).not.toContain('foreignObject');
});

test('readme layout preserves an available avatar decoration', () => {
  const data = {
    discord_status: 'online', listening_to_spotify: false, activities: [],
    discord_user: { id: '775329619259162654', username: 'sizwinz', global_name: 'SizWinz',
      discriminator: '0', public_flags: 0, avatar: '', primary_guild: null,
      avatar_decoration_data: { asset: 'decoration' } },
  };
  const images = { avatar: null, avatarDecoration: 'ZGVjb3JhdGlvbg==', clanBadge: null,
    activityImages: [], userEmoji: null, albumCover: null };
  const svg = renderToStaticMarkup(<ProfileCard data={data} images={images} settings={{layout:'readme'}} />);
  expect(svg).toContain('data-role="avatar-decoration"');
});

test('encoded external artwork is fetched through the Discord media proxy', async () => {
  const originalFetch = globalThis.fetch;
  const urls = [];
  globalThis.fetch = async input => {
    urls.push(String(input));
    return new Response(new Uint8Array([137, 80, 78, 71]), {status: 200});
  };
  try {
    const asset = 'mp:external/hash/%3Fq%3Dposter%26s%3D10/https/example.com/images';
    await fetchUserImages({discord_user: {id:'775329619259162654', discriminator:'0'},
      activities:[{type:3,name:'Prime Video',application_id:'882669602319007804',assets:{large_image:asset}}]}, {layout:'readme'});
    expect(urls).toContain('https://media.discordapp.net/external/hash/%3Fq%3Dposter%26s%3D10/https/example.com/images');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
