<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/f0a8579d-c805-4783-ae5a-e9d92e39cf07

## Run Locally

**Prerequisites:** Node.js 22.12 or newer


1. Install dependencies:
   `npm install`
2. No API key is required for the calculator.
3. Run the app:
   `npm run dev`

## Deploy on Netlify

The repository's root `netlify.toml` sets the base directory to `workday`,
runs `npm run build`, and publishes `dist` relative to that base directory.
Keep the extracted application files in `workday`; Netlify does not extract
the original ZIP archive during deployment.

The Netlify build runs TypeScript checks, generates production assets with Vite,
and verifies that `dist/index.html` references existing JavaScript and CSS files
in `/assets/`. A source-file reference or missing asset fails the deployment check.

The source `index.html` intentionally references `/src/main.tsx` for Vite to
compile. Do not replace it with a hard-coded asset filename. The generated
`dist/index.html` contains the hashed asset URLs and is the production entry point.
Do not publish the repository root or `workday` itself, or upload the source
folder as a static deployment. For a manual deployment, upload the generated
`workday/dist` folder, including its `assets` folder.

After deployment, use View Source on the live page and confirm its module script
loads `/assets/*.js` and its stylesheet loads `/assets/*.css`, both with HTTP 200.
Run `npm run verify:dist` to check an existing production output without rebuilding.
