
# rental-property-finder
A web scraper that helps users find rental properties by automatically gathering and organizing listings from various websites to discover available homes and apartments.\
\
**CURRENTLY SUPPORT GETTING DATA IN MALAYSIA ONLY.**

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
- backend
    - no build as will run as server.
- frontend
    - need to `npx tailwindcss -i ./styles.css -o ./output.css` to build the **styles.css** *(will become output.css)*
    - need to `npx webpack --mode production` to build the **index.js** *(will become bundle.css as it is setup in webpack.config.js)*


## Run Commands
- backend
    - `npm start`
- frontend 
    - just open the `index.html` after build


## Note
- refer to [`https://pptr.dev/supported-browsers`](https://pptr.dev/supported-browsers) to check the browser compability with pupeteer
- might need to setup OSRM server for map routing (can refer to [`https://ipv6.rs/tutorial/Windows_10/Open_Source_Routing_Machine_(OSRM)/`](https://ipv6.rs/tutorial/Windows_10/Open_Source_Routing_Machine_(OSRM)/))

> **If you find this project helpful and enjoyable, consider supporting it with a tip on [Kofi](https://ko-fi.com/jcloh98).**