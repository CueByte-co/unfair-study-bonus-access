```markdown
# unfair-study-bonus-access

Static site for "bonus access verification" — a simple license-key gate that reveals Notion links.

Files:
- index.html — static UI (GitHub Pages target).
- server.js — optional Express verification server (deploy separately).
- .github/workflows/pages.yml — GitHub Actions workflow to auto-deploy to GitHub Pages.
- .env.example — environment variables for the optional server.

Deploy to GitHub Pages (recommended static flow):
1. Create a GitHub repository named `unfair-study-bonus-access` in the CueByte-co account.
2. Push these files to the repository's `main` branch.
3. The included Actions workflow will deploy to GitHub Pages automatically on push.
4. After the Action runs, your site will be available at:
   `https://CueByte-co.github.io/unfair-study-bonus-access/`
5. In Gumroad, set this as the post-purchase redirect or include it in the receipt message.

Secure server-side verification (optional):
- Deploy server.js to Vercel/Heroku/Railway and set GUMROAD_PRODUCT_PERMA and optionally GUMROAD_ACCESS_TOKEN.
- Edit `index.html` and set `VERIFY_ENDPOINT` to your server verify URL (e.g. https://your-server.example.com/api/verify).

Security notes:
- Client-only checks (no VERIFY_ENDPOINT) are only format validation and can be bypassed — use server-side verification for real protection.
- Do NOT put any Gumroad tokens into client-side code.
```
