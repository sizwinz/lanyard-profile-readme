# Live presence renderer

## Objective
Add an opt-in README-themed Discord SVG for sizwinz's profile. Expanded activity/decorations support implemented; final staged deployment verification pending.

## Changes and decisions
- `layout=readme` selects `src/components/ReadmeCard.tsx` through ProfileCard; all other layouts retain the existing renderer.
- Native SVG at 744px, chamfered slate/cream frame, orange accents, presence indicator, compact live activity/music panels, Spotify progress at request time.
- `hideProfile=true` retains the original renderer so profile visibility is respected.
- Games/apps (type 0), streaming (1), watching (3), and competing (5) render in a dynamic two-column grid. Native avatar decorations, public badges, guild tags, custom status, and small activity icons are restored.
- Activity artwork failure retries the Discord application icon; missing/unknown artwork gets a native initials tile. Icon availability depends on what Discord publishes.
- Service repo remote `fork` is Sahaj33-op/lanyard-profile-readme; `origin` is upstream cnrad. Do not push custom work to upstream.
- Vercel project: lanyard-profile-readme-dnd9 / prj_d52dWCpyvaECI1FtMVwlVrphcpAY; team sahaj33-ops-projects. Production domain discord-rp-for-github.vercel.app.

## Verification
- Two regression tests added, each observed failing before its respective implementation; both pass (`bun test tests/readme-card.test.jsx`).
- `bunx tsc --noEmit` passed.
- Dark/light cards visually reviewed against live Discord and Spotify data on localhost:3016.
- Live Minecraft artwork and avatar decoration observed. Idle, missing-game-art, streaming, watching, and competing fixture SVGs generated without undefined/NaN output; visual review pending.

## Next action
Verify staged deployment, promote only the verified opt-in renderer, then add layout=readme and width=744 to the profile README and its generator. Preserve existing profile text. Do not store credentials or env values here.
