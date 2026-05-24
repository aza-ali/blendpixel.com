# [![blendpixel.com](./text/blendpixel-com.svg)](https://blendpixel.com)

<video src="https://github.com/user-attachments/assets/9a889027-30c3-44fa-882a-1ed8058e037c" controls width="100%"></video>

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

## What it is

The landing site for my products: Orbit, Retina, and Listval.

Built with React 19, Tailwind, and Motion. Open source so you can study it, fork it, or build your own.

## Prerequisites

You'll need **<a href="https://nodejs.org"><img src="./text/nodejs.svg" align="absmiddle" alt="Node.js" /></a>** version 20 or higher. Check with `node --version` in your terminal (Terminal on Mac, Command Prompt on Windows). If you see something like `v20.x.x`, you're set.

## Run locally

1. **Fork this repo.** Click the **Fork** button at the top right of this page. GitHub creates a copy of the repo under your own account.

2. **Clone your fork.** On your fork's page, click the green **Code** button and copy the HTTPS URL. Then in your terminal:

   ```bash
   git clone <paste-the-URL-here>
   cd <repo-name>
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Start the dev server:**

   ```bash
   npm run dev
   ```

5. Open **http://localhost:5173** in your browser. Any changes you make to the code show up instantly.

## What's in here

- `src/pages/Home.tsx`: three-folder product landing
- `src/pages/Retina.tsx`: Retina product page with the logo-morph animation and FAQ
- `src/pages/RetinaTerms.tsx`: Retina terms of service
- `src/components/Folder/`: animated folder component used on the homepage
- `src/components/RetinaDemo.tsx`: interactive demo on the Retina page
- `public/`: assets referenced by the pages above

## Licensing

Code is MIT-licensed (see <a href="./LICENSE"><img src="./text/license.svg" align="absmiddle" alt="LICENSE" /></a>).

The names **BlendPixel**, **Retina**, **Orbit**, and **Listval** and their associated logos are not licensed under MIT. Forks must use their own name and branding.
