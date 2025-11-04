# Break Your Bell Jar — Theme & Sanity Setup Guide

This guide walks you through rebuilding the **Break Your Bell Jar** theme from scratch, wiring it to Sanity Studio, and understanding every design choice (fonts, colors, spacing, animation). Follow the steps in order—each one builds toward a fully working blog with a Sanity-powered CMS and a Next.js front end.

---

## What You Will Build

- **Sanity Studio** project with schemas for posts, authors, categories, and rich text content.
- **Next.js 16 (App Router)** site in `web/` that consumes Sanity content via GROQ queries.
- A polished theme featuring soft neutrals, serif/sans typography pairing, framer-motion animations, and responsive layouts.

---

## Tech Stack

- Node.js 18+ (tested with 18 LTS and 20 LTS)
- Sanity v4 Studio (`sanity` CLI)
- Next.js 16 with the App Router
- TypeScript, Tailwind CSS v4, Framer Motion, Lucide icons, next/font

---

## Project Layout

```
breakyourbelljar/
├── schemaTypes/              # Sanity document schemas
├── sanity.config.ts          # Studio configuration
├── sanity.cli.ts             # CLI + deployment metadata
├── web/                      # Next.js front end
│   ├── app/                  # App Router routes
│   ├── components/           # Reusable UI (Navigation, home, category)
│   ├── sanity/               # next-sanity client + queries
│   ├── public/               # Theme imagery (pattern, logo)
│   └── tailwind.config.ts    # Tailwind v4 config
└── README.md                 # You are here
```

---

## Prerequisites

1. Install the Sanity CLI globally: `npm install -g sanity`
2. Install dependencies in both workspaces:
	- Root Studio: `npm install`
	- Front end (`web/`): `cd web && npm install`
3. Create a free Sanity project at [sanity.io/manage](https://www.sanity.io/manage) if you do not already have one.

> Tip: Keep two terminals open—one at the repository root for the Studio and another inside `web/` for the Next.js app.

---

## Step 1 — Set Up Sanity Studio

1. **Create (or reuse) a Sanity project**
	```powershell
	sanity init --dataset production --project <your-project-id>
	```
	Use “Clean project with no predefined dataset” and TypeScript when prompted.

2. **Update configuration**
	- Edit `sanity.config.ts` and `sanity.cli.ts` with your own `projectId`, `dataset`, and optional `appId`.
	- The provided codebase uses `projectId = 7sp6215z` and dataset `production`—swap these with your IDs after you create the project.

3. **Define schemas**
	Place the four schema files from `schemaTypes/` into your project:
	- `schemaTypes/post.ts`
	- `schemaTypes/category.ts`
	- `schemaTypes/author.ts`
	- `schemaTypes/blockContent.ts`

	| Document | Purpose | Key fields |
	|----------|---------|------------|
	| `post`   | Blog posts | `title`, `featured` (boolean highlight), `slug`, `author`, `mainImage` (with `alt`, `caption`), `gallery`, `categories` (references), `publishedAt`, `body` (rich text) |
	| `category` | Collections that drive `/reflections` & `/opinions` | `title`, `slug`, `description` |
	| `author` | Writer profiles | `name`, `slug`, `image`, `bio` |
	| `blockContent` | Rich text blocks | Headings, quotes, bullet lists, inline marks (bold, emphasis, links), and inline images |

4. **Create starter content** inside Sanity Studio (`npm run dev` at the repo root):
	- Add two categories with slugs `reflections` and `opinions`.
	- Add at least one author.
	- Create posts and tick **“Featured Post”** on exactly one post to populate the homepage highlight. Assign categories via references.

5. **Sanity Studio usage**
	- Run locally: `npm run dev`
	- Open `http://localhost:3333`
	- Deploy optional hosted Studio: `npm run deploy`

---

## Step 2 — Connect Next.js Front End

1. **Environment alignment**
	- In `web/sanity/config.ts`, replace the exported `projectId` and `dataset` with the same values used in the Studio. No API token is required for public reads.
	- If you change the dataset name, update the GROQ queries in `web/sanity/queries.ts` accordingly.

2. **Install front-end dependencies**
	```powershell
	cd web
	npm install
	```

3. **Run the development server**
	```powershell
	npm run dev
	```
	Visit `http://localhost:3000` to see the theme fed by Sanity content.

---

## Step 3 — Theme Design Breakdown

### Fonts

- [Roboto](https://fonts.google.com/specimen/Roboto) weights 300–700 via `next/font`: body copy, UI labels.
- [Cormorant](https://fonts.google.com/specimen/Cormorant) weights 300–400: hero titles, headings, article prose.
- Defined in `web/app/layout.tsx` and applied globally in `web/app/globals.css` and `web/tailwind.config.ts`.

### Color Palette

| Usage | Hex | Reference |
|-------|-----|-----------|
| Background gradient base | `#ffffff` | `:root` in `web/app/globals.css` |
| Primary accent (amber) | `#c18a4e` | Buttons, hover states, drop caps |
| Secondary accent (sky) | `#6a8ca4` | Opinions category emphasis |
| Surface neutrals | `#fefbf7`, `#f1e3d4`, `#eadfd0` | Card backgrounds, pills |
| Text base | `#171717`, `#6f5d4d`, `#57483c` | Headlines, body copy |

- Background uses layered radial gradients plus a fixed `pattern.svg` texture in `web/public/pattern.svg`.
- Cards and sections use soft shadows such as `shadow-[0_56px_150px_-80px_rgba(110,93,77,0.45)]` for depth.

### Layout Essentials

- **Navigation (`web/components/Navigation.tsx`)**
  - Sticky pill-shaped bar with blurred glassmorphism backdrop.
  - Desktop nav highlights the active route via a framer-motion animated pill (`motion.span`).
  - Mobile nav uses a slide-in drawer with overlay and `lucide-react` icons (`Menu`, `X`).

- **Home Hero (`web/components/home/HomeContent.tsx`)**
  - Animated hero tagline (“Gentle rebellion” pill, large serif title, and CTA buttons).
  - Featured post card spans two columns with image on the left and metadata on the right.
  - Remaining posts appear in a responsive grid with subtle hover lift and accent calendar icons.

- **Category Templates (`web/components/category/CategoryPageContent.tsx`)**
  - Shared component for `/reflections` and `/opinions`.
  - Accent variants (`amber`, `sky`) control gradients, badge colors, and hover states.
  - Empty state prompts editors to open the Studio when no posts are assigned.

- **Article Page (`web/app/blog/[slug]/page.tsx`)**
  - Rich text rendered with Portable Text and custom class names for typography defined in `web/app/globals.css` (`article-paragraph`, `article-heading-2`, etc.).
  - Drop cap first paragraph, stylised blockquotes, numbered and bullet list treatments, inline code styling.
  - Optional gallery section with hover captions.

### Animation

- Framer Motion powers fade and rise transitions (`fadeInUp`, `staggerContainer` in `HomeContent` and `CategoryPageContent`).
- Motion layout ID keeps the navigation pill smooth between pages.

---

## Step 4 — Sanity Queries & Data Flow

- Queries live in `web/sanity/queries.ts` using `defineQuery`.
  - `postsQuery`: all posts sorted by `publishedAt` desc.
  - `featuredPostQuery`: first post with `featured == true`.
  - `postQuery`: fetches a single post plus gallery images.
- Pages fetch data on the server using `sanityFetch` from `web/sanity/config.ts`.
  - Home (`web/app/page.tsx`) pulls the featured post and filters it out of the main list.
  - Category routes (`web/app/reflections/page.tsx`, `web/app/opinions/page.tsx`) query posts by category slug and pass them into `CategoryPageContent`.
  - Individual post route (`web/app/blog/[slug]/page.tsx`) statically generates pages via `generateStaticParams()` for SSG.

**Important content requirements:**

- At least one post should have `featured: true` (toggle in Sanity) to populate the homepage hero card.
- Posts must reference categories with slugs `reflections` or `opinions` to appear on their respective pages.
- Supply `alt` text for images to maintain accessibility—it is surfaced in the theme.

---

## Step 5 — Incremental Static Regeneration (ISR)

- Route `web/app/api/revalidate/route.ts` revalidates site caches when Sanity publishes content.
- Configure a Sanity webhook:
  1. In the Sanity project settings, add a webhook target `https://<your-site>/api/revalidate`.
  2. Generate a secret (e.g., via `openssl rand -hex 32`) and set it as the webhook secret.
  3. Add the same value to your Next.js environment (`SANITY_WEBHOOK_SECRET`).
  4. Deploy the front end so POST requests trigger `revalidatePath('/', 'layout')`.

During local development you can skip the webhook and rely on live reload (`npm run dev`).

---

## Step 6 — Running Locally

1. **Sanity Studio**
	```powershell
	npm install
	npm run dev
	```
	Studio runs on `http://localhost:3333`.

2. **Next.js Front End**
	```powershell
	cd web
	npm install
	npm run dev
	```
	Front end runs on `http://localhost:3000`.

Edits published in the Studio will appear instantly in the local front end because `useCdn` is disabled in `web/sanity/config.ts`.

---

## Step 7 — Deployment Checklist

- **Sanity Studio:** `npm run deploy` to host the Studio on Sanity’s infrastructure.
- **Next.js App:** Deploy via Vercel or your preferred platform.
  - Ensure the `SANITY_PROJECT_ID`, `SANITY_DATASET`, and `SANITY_WEBHOOK_SECRET` environment variables match production values.
  - `next.config.ts` already allows remote images from `cdn.sanity.io`.
- **Content Pipeline:** Keep slugs consistent and maintain at most one featured post to retain homepage layout.

---

## Customising the Theme

- **Accent Variants:** Extend `accents` in `web/components/category/CategoryPageContent.tsx` to introduce new category colorways.
- **Fonts:** Update `web/app/layout.tsx` to import new typefaces via `next/font`, then adjust `--font-sans` and `--font-serif` in `web/app/globals.css`.
- **Background Texture:** Replace `web/public/pattern.svg` and `web/public/bybj.png` for new patterns or logos.
- **Animations:** Modify motion variants inside `HomeContent` or `CategoryPageContent` to alter timing or easing.
- **Copywriting:** Update strings in the hero, footers, and empty states directly within their respective components.

---

## Troubleshooting

- **No posts showing on category pages** — Confirm that posts reference a category with the correct slug and that the GROQ queries match your dataset.
- **Featured slot empty** — Ensure exactly one post has the `featured` boolean set to true.
- **Webhook returns 401** — Check that the Sanity webhook secret matches `process.env.SANITY_WEBHOOK_SECRET` in your deployment environment.
- **Fonts not loading** — Verify the `next/font` import in `web/app/layout.tsx` and confirm that the `--font-roboto` / `--font-cormorant` CSS variables exist in `globals.css`.

With these instructions, even a beginner can reproduce the Break Your Bell Jar theme, launch Sanity Studio, and populate the site with richly styled content.
