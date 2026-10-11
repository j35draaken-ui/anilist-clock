ANILIST LIVE DAY/NIGHT MAP — FIXED VERSION

1. In InfinityFree File Manager, open htdocs/.
2. Upload EVERYTHING in this folder into htdocs/.
3. Make sure these files exist:
   index.php
   sunmap.php
   sunmap_render.php
   sunmap_static.php
   gif_encoder.php
   check.php
   world.jpg
   cache/
4. If cache/ is missing, create it manually.
5. Open /check.php. Every item should say YES except the PHP version value itself.
6. Open /sunmap_static.php. You should see one current PNG map.
7. Open /sunmap.php. You should see an animated GIF.
8. Only after step 7 works, put this in AniList About:
   img480(https://YOUR-DOMAIN/sunmap.php)

IMPORTANT FIXES FROM THE FIRST VERSION
- The original twilight alpha array contained values >127. GD alpha must be 0..127.
- The original custom LZW GIF encoder was replaced. GD now encodes each frame itself,
  and the script assembles those valid GIF frame blocks into an animation.
- The animation is 18 frames covering 3 hours; each frame is shown for 0.60 seconds.
- The endpoint regenerates at each 10-minute UTC bucket. A visitor does not need cron.

If AniList shows a placeholder while /sunmap.php works directly in a browser, then the
remaining issue is AniList's image handling/proxy/cache, not PHP/GD. In that case keep
sunmap.php public and test it with a normal image URL first.

The map is an independent rendering based on solar-position calculations and the local
world.jpg texture supplied with this package. It is not a copy of timeanddate's image.

Because this version uses sunmap_v2.gif in the cache, it will not reuse the broken GIF from the previous version.

IMPORTANT FIX
--------------
Use this version of sunmap_render.php. It contains the required PHP opening tag.
The previous package accidentally omitted it, causing the PHP source code to be
printed and renderTwilightOverlay() to be undefined.

REAL-TIME BEHAVIOR
-------------------
Each frame represents 10 real minutes, and each frame remains visible for 10 minutes.
The 3-hour animation therefore runs at approximately real time rather than accelerated time.
New requests regenerate from the current minute so the first frame is near the current situation.

DARKNESS
--------
Night is rendered with a strong black overlay; twilight is progressively lighter.
