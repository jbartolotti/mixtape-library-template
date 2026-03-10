# Mixtape Library Template

A clean, forkable GitHub Pages template for cataloging and sharing your cassette mixtape collection. Built with Jekyll. Coded with AI assistance.

## Features

- **Dual View Modes**: Grid view with hover previews and detailed list view

- **Tag Filtering**: Filter catalog/list by one or more tape tags
- **Request Generator**: Client-side form that creates formatted email text
- **Easy Content Management**: Add tapes via simple markdown files
- **GitHub Pages Ready**: Deploy for free with zero configuration
- **Fully Customizable**: Theme colors, fonts, and exchange policies

## Quick Start

### 1. Fork & Enable GitHub Pages

1. Click **Fork** at the top right (rename if desired)
   - **Note:** If you rename the fork, you must also update the `baseurl` field in `_config.yml` to match your new repo name (e.g., `baseurl: "/my-mixtapes"`). If you keep the default name, no changes needed.
2. Go to **Settings** → **Pages**
3. Under Source, select **main** branch and **/ (root)** folder
4. Click **Save**

Your site will be live at `https://yourusername.github.io/your-repo-name/`

### 2. Customize Site Settings

Edit `_data/settings.yml` for your personal info, theme colors, exchange policies, format preferences, and request toggle. Edit `_data/tape_options.yml` to define your available tape types, Dolby options you can record with, and genre categories you can record for custom mixtape requests.

**Essential settings in `_data/settings.yml`:**

```yaml
owner:
  name: "Your Name"
  email: "your.email@example.com"
  bio: "Your bio here..."
  accepting_requests: true  # Toggle to pause/resume requests

theme:
  primary_color: "#e63946"  # Customize site colors
  secondary_color: "#457b9d"
  
policy:
  description: "Your exchange policy..."  # Set guidelines and costs
  
genre_preferences:  # List your favorite genres/artists so people know what to make for you in an exchange
  - "Shoegaze: Slowdive, My Bloody Valentine"
  
preferred_tape_types: ["type_ii"]  # Your preferred formats when people send tapes to you. Use values from _data/tape_options.yml
preferred_dolby_options: ["dolby_b"]
```

### 3. Add Your Tapes

Create markdown files in `_tapes/`, one for each tape:

```yaml
---
title: "Midnight Dreaming"
author: "self"
date_recorded: "2023-04-03"
length: "90 minutes"
genre: "Shoegaze / Dream Pop"
tags:
  - "shoegaze"
  - "dream pop"
description: "A hazy journey through reverb-soaked guitars..."
requestable: true
tape_type: "Type II"
dolby: "Dolby B"
front_image: "midnight-dreaming-front.jpg"
back_image: "midnight-dreaming-back.jpg"
tracklist:
  - title: "Side A"
    tracks:
      - "Slowdive - Alison"
      - "My Bloody Valentine - When You Sleep"
  - title: "Side B"
    tracks:
      - "Cocteau Twins - Cherry-Coloured Funk"
      - "Ride - Vapour Trail"
---
```

Use `date_recorded` for date text (avoid Jekyll's reserved `date` key). `tracklist` supports either a simple flat list, or grouped sections (`title` + `tracks`) for A/B sides.


### 4. Add Images

Save cover photos to `/images/` matching your tape filenames. Up to two images per tape are supported, and both vertical and horizontal artwork are supported. Leave the back_image field blank in the tape markdown file to omit.

Grid cards always display art in a vertical orientation. If you upload horizontal artwork, the grid view rotates it automatically while the list view and tape detail page display the original orientation.

## Key Files

- **`_data/settings.yml`** - Your info, theme colors, exchange policies
- **`_data/tape_options.yml`** - Available tape types, Dolby options, genres
- **`_tapes/`** - Add your personal tape markdown files here (takes precedence over `sample_tapes/`)
- **`sample_tapes/`** - Example tapes; only used if `_tapes/` is empty
- **`images/`** - Add your personal tape cover photos here
- **`sample_images/`** - Example images; used only by sample tapes

## Local Development (Optional)

To test changes before pushing:

```bash
bundle install
bundle exec jekyll serve
# View at http://localhost:4000
```

## Updating from Template

To pull template improvements into your fork without conflicts:

```bash
git remote add upstream https://github.com/jbartolotti/mixtape-library-template.git
git fetch upstream
git merge upstream/main
```

**Important:** If you've added tapes to `_tapes/`, the template will automatically use those instead of the sample tapes in `sample_tapes/`. This means:
- Your personal tapes are never overwritten during merges
- Template updates to `sample_tapes/` won't conflict with your content
- If you delete all your personal tapes, the catalog will display `sample_tapes/` as a fallback

## Troubleshooting

**Site not building?** Check Settings → Pages → Actions tab for errors

**Images not showing?** Verify filenames match exactly (case-sensitive) and are in `/images/`

**Request form broken?** Open browser console (F12) to check for JavaScript errors

## How Requests Work

Users select tapes → fill out form → generate formatted email text → manually copy & send to you. No data is sent automatically. Once you receive a request email, work out any specifics or trade details further over email.

## License

MIT License - free to use for personal or commercial projects

---

