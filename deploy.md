# Deployment Instructions

## 1. Create GitHub Repository

```bash
# Navigate to the website directory
cd /Users/zacharycutler/.openclaw/workspace/kalibrate-website

# Initialize git repository
git init
git add .
git commit -m "Initial website build"

# Create repository on GitHub (via web interface or gh CLI)
# Repository name: kalibrate-website

# Add remote and push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kalibrate-website.git
git push -u origin main
```

## 2. Enable GitHub Pages

1. Go to repository settings
2. Scroll to "Pages" section
3. Source: Deploy from a branch
4. Branch: main
5. Folder: / (root)
6. Save

## 3. Configure Custom Domain

In the repository settings Pages section:
1. Add custom domain: `kalibrate.me`
2. Check "Enforce HTTPS"

## 4. DNS Configuration

Update your domain DNS settings to point to GitHub Pages:

**A Records:**
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

**CNAME Record:**
- `www` → `YOUR_USERNAME.github.io`

## 5. Verification

- Wait for DNS propagation (up to 24 hours)
- GitHub will automatically generate SSL certificate
- Site will be live at https://kalibrate.me

## URL Continuity Verified

✅ `/privacy-policy` → `/privacy-policy.html`
✅ `/terms-of-use` → `/terms-of-use.html`

App Store compliance maintained - no reference updates needed.