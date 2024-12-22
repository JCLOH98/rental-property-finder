
# rental-property-finder
A web scraper that helps users find rental properties by automatically gathering and organizing listings from various websites to discover available homes and apartments. **Currently support scraping data in Malaysia only.**

## Tech stack
- backend 
    - Express
    - Puppeteer (headless browser)
- frontend
    - TailwindCSS

## Dev Commands
- backend
    - `npm run dev` to run development server
- frontend
    - need to `npx tailwindcss -i ./styles.css -o ./output.css --watch` to build the **styles.css** *(will become output.css)*
    - need to `npx webpack --mode development --watch` to build the **index.js** *(will become bundle.css as it is setup in webpack.config.js)*


## Build Commands
- frontend
    - need to `npx tailwindcss -i ./styles.css -o ./output.css` to build the **styles.css** *(will become output.css)*
    - need to `npx webpack --mode production` to build the **index.js** *(will become bundle.css as it is setup in webpack.config.js)*


## Run Commands
- backend
    - `npm start`
- frontend 
    - just open the `index.html` after build

**Note**:
- refer to `https://pptr.dev/supported-browsers` to check the browser compability with pupeteer
- might need to setup OSRM server for map routing