# Live presence renderer

## Objective
Add an opt-in README-themed Discord SVG for sizwinz's profile. Complete and deployed. Profile README update/verification is handled in D:/Projects/Portfolio/SizWinz.

## Changes and decisions
- `layout=readme` selects `src/components/ReadmeCard.tsx` through ProfileCard; all other layouts retain the existing renderer.
- Native SVG at 744px, chamfered slate/cream frame, orange accents, presence indicator, compact live activity/music panels, Spotify progress at request time.
- `hideProfile=true` retains the original renderer so profile visibility is respected.
- Games/apps (type 0), streaming (1), watching (3), and competing (5) render in a dynamic two-column grid. Native avatar decorations, public badges, guild tags, custom status, and small activity icons are restored.
- Activity artwork failure retries the Discord application icon; missing/unknown artwork gets a native initials tile. Icon availability depends on what Discord publishes.
- Service repo remote `fork` is sizwinz/lanyard-profile-readme (renamed from Sahaj33-op); `origin` is upstream cnrad. Do not push custom work to upstream.
- Vercel project: lanyard-profile-readme-dnd9 / prj_d52dWCpyvaECI1FtMVwlVrphcpAY; team sahaj33-ops-projects. Production domain discord-rp-for-github.vercel.app.

## Verification
- Three regression tests added, each observed failing before its respective implementation; all pass (`bun test tests/readme-card.test.jsx`).
- `bunx tsc --noEmit` passed.
- Dark/light cards visually reviewed against live Discord and Spotify data on localhost:3016.
- Live Minecraft artwork and avatar decoration observed. Idle, missing-game-art, streaming, watching, and competing fixture SVGs generated without undefined/NaN output. Live Arrival poster, decoration, server tag, and progress reviewed in both themes.

## Next action
Verified staged default and native endpoints; promoted dpl_6ogem3ZdiBXK5C7F6tRfLhAqT7ys (implementation 5d13c2e). Public dark/light endpoints return native SVG successfully. External mp: artwork now resolves via media.discordapp.net, retaining encoded path/query segments; the supplied Arrival proxy URL returned HTTP 200 image/jpeg. No remaining service work. Future edits should retain the opt-in layout and the default renderer.
