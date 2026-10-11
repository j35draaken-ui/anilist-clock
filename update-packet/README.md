# AniList Clock Update Packet

Upload the **contents of `htdocs/`** into your InfinityFree account's `htdocs` folder, allowing these six files to overwrite the matching files:

- `.htaccess`
- `app.js`
- `clock.php`
- `index.html`
- `styles.css`
- `world.jpg`

Keep the existing `flags/` and `fonts/` folders in `htdocs`; they are unchanged and are not included. The rewrite in `.htaccess` maps the generated `/clock.svg?...` image URL to `clock.php` and preserves its query string.

After uploading, reload the clock creator, copy its newly generated AniList snippet, and replace the old image snippet in your bio. Do not upload the `htdocs` folder itself—upload the files inside it. The other files elsewhere in this packet are source-layout copies/reference files; use `htdocs/` for deployment.
