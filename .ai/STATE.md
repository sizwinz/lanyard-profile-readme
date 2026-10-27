# Live presence renderer

## Objective
Add an opt-in README-themed Discord SVG for sizwinz's profile. Implementation and local validation complete; deployment verification pending.

## Changes and decisions
- `layout=readme` selects `src/components/ReadmeCard.tsx` through ProfileCard; all other layouts retain the existing renderer.
- Native SVG at 744px, chamfered slate/cream frame, orange accents, presence indicator, compact live activity/music panels, Spotify progress at request time.
- `hideProfile=true` retains the original renderer so profile visibility is respected.
- Service repo remote `fork` is Sahaj33-op/lanyard-profile-readme; `origin` is upstream cnrad. Do not push custom work to upstream.
- Vercel project: lanyard-profile-readme-dnd9 / prj_d52dWCpyvaECI1FtMVwlVrphcpAY; team sahaj33-ops-projects. Production domain discord-rp-for-github.vercel.app.

## Verification
- Exactly one renderer test added and observed failing before implementation, then passing (`bun test tests/readme-card.test.jsx`).
- `bunx tsc --noEmit` passed.
- Dark/light cards visually reviewed against live Discord and Spotify data on localhost:3016.

## Next action
Verify staged deployment, promote only the verified opt-in renderer, then add layout=readme and width=744 to the profile README and its generator. Preserve existing profile text. Do not store credentials or env values here.
