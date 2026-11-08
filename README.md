# NEXUS — Personal Identity (static PWA)

Arabic-first (RTL) 3D personal identity site. Plain HTML/CSS/JS, no build step, no API keys.

## Files
- `index.html` — the whole app
- `data.json` — the PUBLIC content every visitor sees (starts empty)
- `sw.js`, `manifest.webmanifest`, `icon*` — offline support and installable app
- `netlify.toml` — no-cache headers for `sw.js` and `data.json`

## Run locally
Serve over HTTP (service workers and `fetch` do not work from `file://`):

    npx serve .

## Deploy (Netlify)
Drag the folder onto https://app.netlify.com/drop, or run `npx netlify deploy --prod --dir .`.

## Edit your content
1. Open `https://YOUR-SITE/#edit` once on your device. The edit button then stays on that device.
2. Edit everything in the panel. Changes autosave to this browser (IndexedDB) as a draft.
3. Press "تنزيل data.json للنشر", replace `data.json` in the folder with the downloaded file, and redeploy.
4. Visitors now see your content. Only whoever can deploy the files can change the public content.

## Honest limits
- The edit button is a convenience, not authentication. Visitors who open `#edit` only change their own browser draft; they cannot change what others see.
- The draft lives in browser storage (not encrypted); clearing browser data or private mode removes it. Keep `data.json` and the backup file.
- Everything in `data.json` (photos included, as data URLs) is public.
- The contact box opens the visitor's mail app (`mailto:`); there is no server to send messages.
- Not included: ZIP backup (backup is one JSON file with images), image cropping, a React/TypeScript/Vite source version.

## Test checklist
Empty first load · edit and refresh · upload photo and refresh · add, edit, hide, reorder, delete socials/projects · change accent color · download backup and restore it · import an invalid file (data stays) · narrow mobile view · keyboard navigation and reduced motion · reopen offline after one online visit.

## المساعد الذكي (OpenAI)
- `ai.js` — زر "✨ اسأل عني" + نافذة محادثة تقرأ `data.json` كسياق وتجيب عن صاحب الموقع.
- `config.js` — إعدادات المفتاح والموديل. **لا تكتب المفتاح فيه داخل المستودع.**
- النشر على GitHub Pages: كل push على `main` يشغّل `.github/workflows/deploy.yml` الذي يحقن
  `OPENAI_API_KEY` من Secrets المتجر في `config.js` ثم ينشر الموقع.
- أي زائر يمكنه لصق مفتاحه من زر ⚙ داخل المساعد (يُحفظ على جهازه فقط، لا يُرسل إلا لـ api.openai.com).

> تنبيه: المفتاح المحقون في موقع منشور عام يمكن لأي زائر استخراجه من الكود. استخدم مفتاحاً
> بحد صرف منخفض (Project key + usage limit) وأوقف/بدّل المفتاح عند الحاجة.
