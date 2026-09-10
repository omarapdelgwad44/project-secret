# Happy Birthday Storybook

An interactive birthday gift: a wrapped present opens into a cinematic little storybook. Open the gift, turn the pages, draw a rose, blow out the candles, and send a wish into the stars.

## Preview locally

```bash
npm install
npm run dev
```

Then visit the local URL Vite prints (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

The compiled site is written to `dist/`. Deploy that folder (GitHub Pages, Netlify, or any static host). Because the Vite `base` is `./`, it also works from a project subdirectory.

## Customize

- **Name:** tap the pencil in the storybook header. Default is `Jana`.
- **Music:** replace `public/audio/bg.mp3` (optional `public/audio/bg.wav`). Music starts when **Open your gift** is pressed. Use the speaker button to mute.
- Previous static versions remain in `v1/` and `v2/` for reference.

## GitHub Pages

Pushes to `main` build `dist/` and publish it with GitHub Actions.

Live site: https://omarapdelgwad44.github.io/project-secret/
