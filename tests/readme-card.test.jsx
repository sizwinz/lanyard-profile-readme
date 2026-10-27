import { test, expect } from 'bun:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ProfileCard } from '../src/components/ProfileCard';

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
