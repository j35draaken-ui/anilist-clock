# AniList Clock Studio

A small app that creates animated clock images for AniList bios. The creator is served at `/`; generated images use `/clock.php` for hosting compatibility.

## Host on InfinityFree

The InfinityFree version uses PHP and Apache rewrites, so it does not need a Node.js process or Manus hosting.

1. In the InfinityFree control panel, open the hosting account for `anilistime.free.nf` and its **File Manager**.
2. Open the account's `htdocs` folder (InfinityFree's web root). If the File Manager hides dotfiles, enable hidden-file display before uploading `.htaccess`; use FTP if it will not accept that filename.
3. Upload the contents of this project's `public/` folder directly into `htdocs`. This includes the `flags/` and `fonts/` folders; keep those folders and their contents in place.
4. Upload `infinityfree/clock.php` directly into `htdocs`. `.htaccess` is optional; upload it only if you want old `/clock.svg` URLs and the `/_health` convenience route to keep working.
5. Visit `https://anilistime.free.nf/`, then check `https://anilistime.free.nf/clock.php?tz=Asia%2FTokyo&flag=jp&label=Tokyo&theme=dark`.

New clock links call `clock.php` directly, so they do not depend on Apache rewrite rules. Keep the PHP script in the same web-root folder as `index.html`. Without `.htaccess`, old `/clock.svg` links cannot be preserved on InfinityFree, but newly generated `/clock.php` links work directly. Do not upload `server.js` or the Dockerfile to InfinityFree; those are only for running the Node version locally or in a Node/Docker host.

All 256 FlagCDN codes accepted by the flag-code input are bundled locally; neither clock renderer makes outbound requests. Unsupported codes still show the neutral marker. Fonts are also self-hosted. The site needs no third-party service for its normal UI, preview, or clock images.

The flag artwork is bundled from FlagCDN. The self-hosted DM Mono and Space Grotesk fonts are licensed under the SIL Open Font License; their license texts are included in `public/fonts/`.

## Run locally with Node.js

Requires Node.js 22 or later. Run `npm start`; the creator is served at `/` and the generated image at `/clock.svg`.

## Choosing a place

Search for a country or city and choose a result to set the matching time zone and flag. The list includes common cities and multiple time zones for large countries. For anything not listed, open **Advanced settings** to enter an IANA time zone and flag code directly.

The creator starts with the browser's configured time zone (without requesting GPS) instead of a fixed Berlin preset. The selected city or your current location is used as the clock label.

## Location, map, and daylight badge

The clock includes the original embedded world map with the original moving sun marker and day/night, civil, nautical, and astronomical twilight boundaries. Its 18-frame animation advances in ten-minute steps across three hours. The map is included directly in the SVG and can be switched off under **Location map**. Customize the selected-location marker color and size and overall night shading there. Choosing a city preset sets its approximate city-center coordinates; for custom time zones, enter latitude and longitude or use GPS. Location coordinates are included in the generated public image URL. The bundled 480×240 `world.jpg` is included when uploading the contents of `public/` to InfinityFree.

The clock also includes a small location dot and a day/night badge by default. You can hide the badge or customize its dot, day, and night colors under **Location & daylight badge**. With latitude and longitude, the badge estimates whether the sun is above the horizon using the selected date and location. Without them, it clearly uses a simple 06:00–18:00 local-time estimate instead.

## Optional location shortcuts

**Use my current location** is an optional browser-side GPS lookup. Only after the visitor presses the button and grants permission, their approximate coordinates are sent directly from their browser to TimeAPI.io and BigDataCloud. InfinityFree's PHP host does not make these requests. If the services are unavailable or blocked, visitors can search for a place or use the offline option.

GPS coordinates are rounded to one decimal place (roughly 11 km) before they are added to the shareable image URL. This is enough for the daylight estimate while avoiding publishing the browser's full coordinate precision. The selected time zone, country flag, and locality are also saved in the URL.

**Use device time zone (offline)** reads the browser's configured IANA time zone locally, with no GPS permission or network lookup. Since a time zone does not identify a city or country, visitors can search for a place to add a city label and flag.

## Sharing a clock

The creator updates a direct `/clock.php` URL and the AniList `~~~img(URL)~~~` snippet as settings change. Both contain the chosen time zone, flag, label, theme, map visibility and marker/night styling, daylight-badge visibility and colors, and optional coordinates. The Node server responds to both `/clock.php` and `/clock.svg`; the PHP host responds to `/clock.php` directly and supports `/clock.svg` when its rewrite rules are enabled.
