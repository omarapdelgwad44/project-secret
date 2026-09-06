# A little something

A private, mobile-first birthday surprise. Three quiet scenes: a wrapped card, a letter, then the finale.

Live: https://omarapdelgwad44.github.io/project-secret/

## Preview locally

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## Where to change things

Edit **[`config.js`](config.js)** only:

| What | Field |
| --- | --- |
| Welcome line | `welcome` |
| Date | `date` |
| Ribbon button | `untie` |
| Letter title | `letterTitle` |
| Letter text | `letterBody` |
| Surprise button | `openSurprise` |
| Finale heading | `finaleTitle` |
| Name in hearts | `name` |
| Closing line | `finaleMessage` (`finaleMessageLang`: `"ar"` or `"en"`) |
| Photo | `photo`: `"assets/photo.jpg"` (leave `""` for the heart placeholder) |
| Music | replace `assets/audio/bg.mp3` (and optional `bg.wav`) |
| Replay label | `replay` |

Colors live in [`styles.css`](styles.css) under `:root` (`--ivory`, `--burgundy`, `--wine`, `--rose`, `--gold`, `--ink`).

## GitHub Pages

Files sit at the repo root. In **Settings → Pages**, deploy `main` from `/ (root)`.
