# Deployment Guide — Olga's GuideHub

## Before You Deploy — Personalize First

Open `index.html` and replace every placeholder:

| Find                           | Replace with                          |
|--------------------------------|---------------------------------------|
| `VIDEO_ID_1` / `VIDEO_ID_2` / `VIDEO_ID_3` | YouTube video IDs (the part after `v=` in the URL) |
| `TIKTOK_VIDEO_ID_1/2/3`        | TikTok video numeric IDs (from the video URL) |
| `@YourChannelHandle`           | Your actual YouTube channel handle    |
| `olga@olgasguidehub.com`       | Your real email address               |
| Photo placeholder divs         | `<img src="your-photo.jpg" alt="Olga" />` |
| All `href="#"` resource links  | Links to your actual PDFs / Google Docs |
| Social media `href="#"` links  | Your real YouTube, TikTok, Instagram URLs |

---

## Option 1 — GitHub Pages (Free, Recommended)

### Step 1 — Create a GitHub repository
1. Go to [github.com](https://github.com) → **New repository**
2. Name it `olgasguidehub` (or `your-username.github.io` for a root site)
3. Set it to **Public**, then click **Create repository**

### Step 2 — Upload your files
**Via GitHub web interface (easiest):**
1. Click **Add file → Upload files**
2. Drag in `index.html`, `style.css`, `script.js`
3. Click **Commit changes**

**Via Git (if you have Git installed):**
```bash
cd C:\Users\ljolk\olgasguidehub
git init
git add .
git commit -m "Initial site launch"
git remote add origin https://github.com/YOUR_USERNAME/olgasguidehub.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages
1. In your repo → **Settings → Pages**
2. Under **Source**, select **Deploy from a branch**
3. Branch: `main` / folder: `/ (root)` → **Save**
4. Your site will be live at:
   `https://YOUR_USERNAME.github.io/olgasguidehub/`

*(Takes 1-2 minutes to go live after saving)*

---

## Option 2 — Netlify Drop (Fastest — 30 seconds)

1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag your entire `olgasguidehub` folder onto the page
3. Done — you get a live URL instantly (e.g. `random-name.netlify.app`)
4. Optional: Connect a custom domain in Netlify settings

---

## Option 3 — Custom Domain (Professional)

After deploying to GitHub Pages or Netlify:

1. Buy a domain at Namecheap, GoDaddy, or Google Domains
   (e.g. `olgasguidehub.com`)

2. **For GitHub Pages:** In repo Settings → Pages → Custom domain, enter your domain.
   Then add a CNAME record in your domain's DNS:
   ```
   CNAME  www  YOUR_USERNAME.github.io
   ```

3. **For Netlify:** Site settings → Domain management → Add custom domain.
   Netlify walks you through the DNS setup automatically.

---

## Adding a Real Contact Form (No Backend Needed)

Replace the form's `action` with a free Formspree endpoint:

1. Go to [formspree.io](https://formspree.io) → create a free account
2. Create a new form → copy your endpoint (e.g. `https://formspree.io/f/xabcdefg`)
3. In `index.html`, change:
   ```html
   <form class="contact-form" id="contactForm" novalidate>
   ```
   to:
   ```html
   <form class="contact-form" id="contactForm" action="https://formspree.io/f/YOUR_ID" method="POST" novalidate>
   ```
4. In `script.js`, replace the `setTimeout` simulation block with a real `fetch` call,
   or simply let the form submit naturally (remove `e.preventDefault()`).

---

## Adding Newsletter Signup

Use [Mailchimp](https://mailchimp.com) (free up to 500 subscribers):

1. Create a Mailchimp account → Audience → Signup forms → Embedded forms
2. Copy the form `action` URL Mailchimp gives you
3. Replace the `#newsletterForm` submit handler in `script.js` with a fetch to that URL

---

## File Structure

```
olgasguidehub/
├── index.html        ← All pages (single-page site)
├── style.css         ← All styles
├── script.js         ← All interactivity
└── DEPLOYMENT.md     ← This file (not deployed, just for you)
```

---

## Performance Tips

- Compress your photos before uploading (use [squoosh.app](https://squoosh.app))
- Keep images under 200 KB each for fast load times
- The site already uses `loading="lazy"` on all video iframes

---

*Built with ❤️ for Olga's GuideHub*
