# Happy Birthday, Jana

A mobile-first birthday gift site for **Jana** (October 5). Open the wrapped gift, watch the ribbon untie, then celebrate with balloons, falling roses, a heart-written name, and candles to blow out.

## Preview locally

Open `index.html` in a browser, or from this folder:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy on GitHub Pages

1. Create a public GitHub repository and push this folder to the `main` branch.
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Set branch to `main` and folder to `/ (root)`.
5. Save. After a minute, the site will be at:

   `https://<your-username>.github.io/<repo-name>/`

Share that link with Jana so she can open it on her phone.

## Replace the music

The included loop is an original music-box piece (royalty-free). To use a song she loves, replace:

- `assets/audio/bg.mp3`
- `assets/audio/bg.wav` (optional fallback)

Keep the same filenames, or update the `<audio>` tags in `index.html`. Music starts when she taps **Open your gift** (phones block autoplay until a tap). Use the speaker button in the corner to mute.

## Customize the final line

Edit this line in `index.html`:

```html
<p class="final-line" id="finalLine">For Jana, with all my love</p>
```
