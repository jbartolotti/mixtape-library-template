# Quick Start Guide

Welcome to your Mixtape Library Template! Follow these steps to get your site up and running.

## Step 1: Personalize Your Site (5 minutes)

Edit `_data/settings.yml`:

1. **Update owner information:**
   ```yaml
   owner:
     name: "Your Name"
     email: "your.email@example.com"
     bio: "Your music story..."
   ```

2. **Customize theme colors** (optional):
   ```yaml
   theme:
     primary_color: "#e63946"
     secondary_color: "#457b9d"
     # Pick colors at coolors.co or htmlcolorcodes.com
   ```

3. **Set your lending policy:**
   ```yaml
   policy:
     description: "Your approach to tape sharing..."
     guidelines:
       - "Your rules here"
   ```

## Step 2: Configure Tape Options (2 minutes)

Edit `_data/tape_options.yml`:

1. **Mark which tape types you have:**
   ```yaml
   tape_types:
     - name: "Type I (Normal/Ferric)"
       available: true  # Change to false if you don't offer this
   ```

2. **Set available Dolby options:**
   ```yaml
   dolby_options:
     - name: "Dolby B"
       available: true  # Adjust based on your deck
   ```

3. **Customize genre list** to match your collection

## Step 3: Add Your First Tape (10 minutes)

1. **Create a new file** in `_tapes/` named `my-first-tape.md`

2. **Copy this template:**
   ```yaml
   ---
   title: "My First Mixtape"
   author: "self"
   length: "90 minutes"
   genre: "Alternative Rock"
    tags:
       - "alternative rock"
       - "90s"
       - "road trip"
   description: "A collection of my favorite indie tracks from the 90s"
   requestable: true
   tape_type: "Type I"
   dolby: "none"
   front_image: "my-first-tape-front.jpg"
   back_image: ""
   tracklist:
     - "Band Name - Song Title"
     - "Another Band - Another Song"
     - "Add more tracks here..."
   ---
   ```

   The `tags` field should be a YAML list. These tags become filter options on the catalog page.

3. **Scan your tape cover** and save as `images/my-first-tape-front.jpg`

## Step 4: Test Locally (Optional)

If you have Ruby installed:

```bash
bundle install
bundle exec jekyll serve
# Visit http://localhost:4000
```

## Step 5: Deploy to GitHub Pages (2 minutes)

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Customize my mixtape library"
   git push
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Source: **Deploy from a branch**
   - Branch: **main** → **/ (root)**
   - Click **Save**

3. **Visit your site!**
   - Your URL: `https://yourusername.github.io/repository-name/`
   - Wait 1-2 minutes for the initial build

## Step 6: Add More Tapes

Repeat Step 3 for each tape in your collection. The site will automatically:
- Display them in the catalog
- Create individual detail pages
- Make them available in the request form (if `requestable: true`)

## Tips for Success

✅ **Name files consistently:** Use lowercase with hyphens (e.g., `summer-mix-96.md`)

✅ **Match image names:** If your tape file is `summer-mix-96.md`, name images `summer-mix-96-front.jpg`

✅ **Use descriptive titles:** Make tape names searchable and memorable

✅ **Write good descriptions:** Help people understand the vibe before requesting

✅ **Optimize images:** Keep files under 500KB (use TinyPNG or similar)

✅ **Test the request form:** Make sure it generates proper email text

## Need Help?

- 📖 See full [README.md](README.md) for detailed documentation
- 🐛 Found a bug? Open an issue on GitHub
- 💡 Want to customize CSS? Edit `assets/styles/main.css`
- 🎨 All theme colors use CSS variables for easy tweaking

---

**You're all set! Start sharing your mixtape collection with the world. 📼**
