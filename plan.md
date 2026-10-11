# AniList Clock Studio — Implementation Plan

## Product scope

Build a public, account-free creator for animated clock images that users can embed in AniList bios. The creator lets visitors choose an IANA timezone, a country or regional flag, an optional label, and a dark/light theme; it previews the live result and generates a hosted direct image URL plus the AniList `~~~img(URL)~~~` snippet. The direct image endpoint must work without JavaScript at the image URL and must encode the configuration in query parameters.

## Implementation approach

- Use a dependency-free Node 22 HTTP server so the hosted runtime has no package-install or bundler risk.
- Serve a responsive static creator UI from `public/`.
- Serve `/clock.svg` from the same origin. The endpoint validates query values, derives current time with `Intl.DateTimeFormat` and an IANA timezone, fetches and base64-embeds a flag SVG server-side, then returns an animated SMIL SVG with `Cache-Control: no-store`.
- Keep all creator state in the URL controls and generated image URL; no account, database, cookies, or saved records are required.
- Use a Dockerfile and the Webdev server deployment contract so the same process serves the UI, health check, and image endpoint.
- Provide concise built-in help explaining the direct image URL, AniList syntax, and sharing behavior.

## Project structure

- `server.js` — HTTP server, static-file handler, `/clock.svg` renderer, timezone/flag validation, and health response.
- `public/index.html` — creator markup, accessible controls, copy actions, live configuration summary, and help content.
- `public/styles.css` — visual system and responsive layout.
- `public/app.js` — preset selection, URL generation, preview refresh, clipboard actions, and small UI state.
- `public/manus-routes.json` — route manifest for the single page.
- `Dockerfile` / `package.json` — reproducible server startup and publish contract.
- `app.config.ts` — platform project logo metadata.

## Design direction

- **Design movement:** editorial digital instrument panel — part indie web tool, part precise timekeeping console.
- **Core principles:** clear hierarchy, tactile controls, high contrast, and visible cause/effect between a setting and its shareable output.
- **Color philosophy:** ink navy and warm paper create a calm, trustworthy base; electric cyan marks live time and active controls; coral provides a small human accent for sharing and attention without turning the tool into a toy.
- **Layout paradigm:** an asymmetric two-column studio with the configuration rail anchoring the left and a large preview/share stage on the right, followed by a horizontal explanatory strip.
- **Signature elements:** a segmented “LIVE SVG” status pill, hairline measurement ticks around the preview, and coral tape-like callouts for the copy/share moment.
- **Interaction philosophy:** every change updates the preview and links immediately; presets accelerate the first successful result, while custom fields stay visible for power users.
- **Animation:** use restrained fades and 150–220ms control transitions in the UI; let the clock SVG carry the only continuous motion through digit-strip steps and a blinking colon.
- **Typography:** system sans stack for legibility, with uppercase micro-labels and wide tracking for instrument-panel metadata; strong display headings are compact and editorial rather than bubbly.
- **Brand essence:** “The no-deploy clock maker for AniList profiles.” Personality: precise, friendly, quietly nerdy.
- **Brand voice:** direct and reassuring. Example lines: “Pick a region. We’ll handle the rest.” / “Copy once. Your profile keeps ticking.”
- **Wordmark & mark:** a small cyan clock face with one coral hand beside a split wordmark: `AniList` in compact bold and `CLOCK STUDIO` in tracked microtype.
- **Signature brand color:** electric cyan `#55d6e8`, used only for active/live states and the central time signal.

## Required behavior

- Popular region presets include Europe, North America, South America, Asia, Africa, and Australia examples.
- Custom IANA timezone and lowercase flag-code controls remain available.
- Invalid timezones fall back to UTC and show a friendly warning label; unsupported flags fall back to a neutral globe marker without breaking the image.
- Labels are XML-escaped and length-limited.
- Copy buttons use the Clipboard API with a fallback and provide visible confirmation.
- The `/clock.svg` response is `image/svg+xml`, contains no external image references, and is not browser-cached as a stale clock.
