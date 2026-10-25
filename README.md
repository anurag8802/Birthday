# Kumkum's Birthday Surprise

## Run locally

```sh
npm install
npm run dev
```

Open the local URL Vite prints in the terminal. The layout is designed for mobile screens, including Samsung Galaxy S24-sized viewports.

## Add your photos

The 26 photos supplied in `pics/` are copied into `public/photos/` as `memory-01.jpeg` through `memory-26.jpeg` and shown in order in the gallery. Captions can be edited in `src/App.jsx`.

Put the supplied rose-and-sunflower bouquet photo at `public/images/bouquet.jpg`. The bouquet scene will use it in place of the animated illustration; while the file is missing, the illustration remains as a fallback.

The candle scene uses the supplied cake illustration at `public/images/birthday-cake.svg`.

The seven images from `goel/` are included in `public/goel/` and rotate every three seconds on the second-last “The End Goal: With You” screen.

The attached birthday video is included at `public/videos/birthday-surprise.mp4`. It uses on-demand playback (`preload="none"`) and only starts loading after the play button is tapped.

## Deploy on GitHub Pages

1. Create a new GitHub repository, for example `kumkum-birthday`.
2. In this project folder, open a terminal and run:

	```sh
	git init
	git add .
	git commit -m "Create birthday surprise site"
	git branch -M main
	git remote add origin https://github.com/YOUR-USERNAME/kumkum-birthday.git
	git push -u origin main
	```

	Replace `YOUR-USERNAME` with your GitHub username. Use the exact repository name you created in the remote URL.
3. On GitHub, open the repository's **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
4. Open the **Actions** tab and wait for “Deploy birthday surprise to GitHub Pages” to finish successfully.
5. Your site will be available at `https://YOUR-USERNAME.github.io/kumkum-birthday/`. Use that public URL for the QR code.

The included workflow builds the app and publishes it automatically whenever you push to `main`. It also sets the Vite base path to the repository name, which is required for project pages.

The `public/` photos and video are included in the repository and deployment. Anyone with the public site URL can view them.