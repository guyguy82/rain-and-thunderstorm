# Rain and Thunderstorm Landing Page

Official landing page for the double single **My Favorite Rain** and **My Favorite Thunderstorm** by **Alexandr Misko**, built as a separate static project in the **Final Boss** album campaign.

This repository is intentionally separate from the `intergalactic-march-landing-page` project so the two release pages can evolve independently without mixing assets, copy, or deployment history.

## Stack

- Static HTML in `index.html`
- Styles in `styles/main.css`
- Behavior in `scripts/main.js`
- Images and icons in `assets/`
- No build step
- No framework dependency

## Project Structure

```text
rain-and-thunderstorm/
├── assets/
│   ├── My-favorite-rain-fixed.jpg
│   ├── My-favorite-rainstorm.jpg
│   ├── final-boss-cover.jpg
│   ├── intergalactic-march.jpg
│   ├── tablature-preview.jpg
│   ├── umbrella-street.jpg
│   └── favicon.svg
├── scripts/
│   └── main.js
├── styles/
│   └── main.css
├── index.html
├── README.md
└── .gitignore
```

## Main Features

- Combined top section with:
  - clickable `Rain` / `Thunderstorm` title toggles
  - active square cover image
  - smaller selector covers
  - active streaming panel
  - shared double-single video
- `Final Boss` album countdown section
- Sticky `Final Boss ETA` chip with expandable details
- Official tablature section
- Previously released singles section
- Final Boss email signup form connected to Google Apps Script
- Mobile-responsive layout
- Reduced-motion-safe interaction behavior

## Local Preview

Run a simple local server from the project root:

```bash
cd /Users/guy/codex-app/rain-and-thunderstorm
python3 -m http.server 8081
```

Then open:

- `http://127.0.0.1:8081`

If port `8081` is already in use, start the server on another free port such as `8082`.

## Main Configuration

All page content is driven from the `PAGE_CONFIG` object in `scripts/main.js`.

### Update here when assets or links change

- `artistName`
- `youtubeEmbedUrl`
- `album.releaseISO`
- `album.preSaveSpotifyUrl`
- `album.coverImage`
- `tablature.previewImage`
- `tablature.buyUrl`
- `tablature.intro`
- `tablature.points`
- `previousSingles`
- `subscribe.googleAppsScriptUrl`
- `subscribe.source`
- `singles[0]` for `My Favorite Rain`
- `singles[1]` for `My Favorite Thunderstorm`

### Single configuration

Each single has:

- `title`
- `coverImage`
- `blurb`
- `streamingLinks`

If a streaming URL is empty, that platform shows `Coming soon` and stays disabled.

## Video Behavior

The YouTube area uses a custom poster first and loads the real player only after click.

This is intentional:

- it keeps the resting layout clean
- it avoids the heavy YouTube title/share overlay before playback
- it still falls back safely if the URL is missing

Accepted input format in `PAGE_CONFIG.youtubeEmbedUrl`:

- standard YouTube embed URL such as `https://www.youtube.com/embed/VIDEO_ID`

## Email Signup

The email form uses the same Google Apps Script pattern as the Intergalactic March landing page.

Form details:

- endpoint lives in `PAGE_CONFIG.subscribe.googleAppsScriptUrl`
- hidden honeypot field is included to reduce basic bot submissions
- payload includes:
  - `email`
  - `source`
  - `page`
  - `timestamp`
  - `userAgent`

Important:

- the Google Apps Script URL is treated as part of the public integration flow, not as a secret
- no private API keys or tokens should be added to this repository

## Deployment

This project is designed for static hosting.

### GitHub Pages

If you deploy with GitHub Pages:

1. Push the repo to GitHub.
2. Open the repository on GitHub.
3. Go to `Settings` -> `Pages`.
4. Under `Build and deployment`, choose `Deploy from a branch`.
5. Select:
   - Branch: `main`
   - Folder: `/ (root)`
6. Save.

Because the site uses relative paths like `assets/...`, `styles/...`, and `scripts/...`, it works cleanly as a GitHub Pages static site.

## Security and Repo Hygiene

This repository is intentionally kept simple and low-risk.

### What should not be committed

- `.env`
- `.env.*`
- `.DS_Store`
- editor metadata such as `.vscode/` and `.idea/`
- logs such as `*.log`

### Current security posture

- no secret API tokens are stored in the repo
- no server code is deployed from this project
- the form integration uses a public Apps Script endpoint only
- all user-editable content is centralized in `PAGE_CONFIG`

### Practical warning

Do not place private credentials, OAuth secrets, or service account keys in `main.js`, `index.html`, or any file under `assets/`.

## Release Workflow

Typical update flow:

1. Replace artwork in `assets/`
2. Update copy and links in `scripts/main.js`
3. Preview locally
4. Commit changes
5. Push to `main`
6. Verify the deployed page

## Recommended Verification Checklist

Before pushing:

1. Confirm both active single switches work.
2. Confirm the shared video launches correctly.
3. Confirm the countdown is still valid.
4. Confirm streaming links point to the correct platforms.
5. Confirm the form still submits to the intended Google Apps Script endpoint.
6. Confirm mobile layout still holds up.
7. Confirm no local junk files are staged in git.

## Notes

- `Buy tablature` is currently visible but can remain disabled until the real purchase link is added.
- The previously released singles section currently includes:
  - `Umbrella Street`
  - `Intergalactic March`
- This repo is meant to stay release-specific and should not absorb unrelated album campaign pages.
