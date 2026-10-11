SUNMAP - AniList PATH_INFO workaround

WHY:
InfinityFree may return 404 for /sunmap.gif when no .htaccess rewrite is working.
This version does NOT require /sunmap.gif to exist and does NOT require .htaccess.

USE THIS URL:
https://YOUR-DOMAIN/sunmap.php/sunmap.gif

The server executes sunmap.php and treats /sunmap.gif as PATH_INFO. InfinityFree supports
this form for PHP scripts.

1. Upload the files to htdocs as usual.
2. Confirm https://YOUR-DOMAIN/sunmap.php works.
3. Open https://YOUR-DOMAIN/sunmap.php/sunmap.gif in a browser.
4. In AniList About, use:
   img480https://YOUR-DOMAIN/sunmap.php/sunmap.gif

Do NOT use parentheses around the URL.

You do not need to create .htaccess for this workaround.
