# AniList Clock Studio

A small Node.js app that creates animated clock images for AniList bios. Start it with `npm start`; the creator is served at `/` and the generated image at `/clock.svg`.

## Choosing a place

Search for a country or city and choose a result to set the matching time zone and flag. The list includes common cities and multiple time zones for large countries. For anything not listed, open **Advanced settings** to enter an IANA time zone and flag code directly.

## Optional location lookup

**Use my current location** is optional and only requests browser geolocation after the visitor presses the button. If permission is granted, approximate coordinates are sent from the browser to TimeAPI.io for the time zone lookup and BigDataCloud for the country/city lookup. This app does not store coordinates, but those external services' privacy policies apply. Visitors can decline permission and use search instead.

## Sharing a clock

The creator updates a direct `/clock.svg` URL and the AniList `~~~img(URL)~~~` snippet as settings change. Both contain the chosen time zone, flag, label, and theme.
