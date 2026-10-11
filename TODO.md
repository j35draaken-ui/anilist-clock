# AniList Clock Studio — Outcome Checklist

- [x] A responsive creator interface lets visitors configure an animated clock image on desktop and mobile.
- [x] Popular region presets and a custom IANA timezone control support automatic daylight-saving-time handling.
- [x] A searchable country/city picker sets the matching time zone and flag without requiring visitors to know technical codes.
- [x] An optional, user-initiated location lookup asks for browser permission and clearly discloses its external time-zone and reverse-geocoding services.
- [x] Country or regional flag selection uses flag codes and bakes the selected flag into the generated SVG for AniList image compatibility.
- [x] Optional custom labels and selectable dark/light visual themes update the result.
- [x] A live preview updates as settings change and shows hours, minutes, and seconds.
- [x] A public image endpoint serves the animated SVG directly without client-side JavaScript at the image URL.
- [x] Timezone, flag, label, and theme settings are URL-encoded so every clock can be shared without an account or personal deployment.
- [x] The UI exposes a direct image URL and AniList-compatible `~~~img(URL)~~~` snippet, each with a dedicated copy button.
- [x] Invalid or unsupported timezone and flag values produce friendly rendered fallbacks instead of broken output.
- [x] Built-in help explains configuration, embedding, URL sharing, and AniList usage.
- [ ] The finished app is hosted through the project’s public deployment.
