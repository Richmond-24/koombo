# ListAI — Photo → Listing, instantly

Upload a product photo. Gemini AI identifies it, OCR extracts text/ISBN, and your listing is filled in seconds.

## Setup (2 minutes)

### 1. Install
```bash
npm install
```

### 2. Add API Keys
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
GEMINI_API_KEY=your_key_here
OCR_SPACE_API_KEY=your_key_here
```

**Get free keys:**
- Gemini: https://aistudio.google.com/app/apikey (free)
- OCR.space: https://ocr.space/ocrapi/freekey (25,000 free/month)

### 3. Run
```bash
npm run dev
# Open http://localhost:3000
```

## Seller dashboard domain

To serve seller dashboards from a dedicated origin, set `NEXT_PUBLIC_SELLER_APP_URL` to the full seller app origin in the frontend deployment (for example, `https://seller.koombo.com`) and point that domain at the same Next.js deployment. Set `SELLER_APP_URL` to the same origin in the backend deployment so its CORS allowlist accepts the seller app. Requests to `/sellers/:sellerId` on the main site redirect to that origin, and seller onboarding dashboard links use it directly. Leave the frontend variable unset to keep dashboards on the current host.

Seller dashboard profile and seller-filtered listing requests require a seller token. New seller signups create a password, and sellers can sign in at `/seller/signin`. Older seller accounts without a password need support-assisted access recovery.

## How it works

```
📸 Upload photo
      ↓ (parallel)
🔍 Gemini 1.5 Flash Vision    +    📄 OCR.space
   • Product type & brand          • Raw text extraction
   • Condition assessment          • ISBN detection
   • Title + description           • Model numbers
   • Price suggestion
   • Tags
      ↓
📋 Form auto-filled — review, edit, copy or export
```

## API Route

`POST /api/analyze` — accepts `multipart/form-data` with `image` field

Returns:
```json
{
  "listing": {
    "title": "Engineering Mathematics 5th Ed — Stroud",
    "description": "Comprehensive maths textbook...",
    "category": "Textbooks & Education",
    "condition": "Good",
    "price": 35,
    "tags": ["textbook", "maths", "engineering"],
    "isbn": "9781292219824",
    "confidence": 0.94
  }
}
```

## Project structure

```
listai/
├── app/
│   ├── api/analyze/route.ts   ← Gemini + OCR pipeline
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── Lister.tsx             ← Full upload + form UI
├── lib/
│   ├── gemini.ts              ← Google Gemini API
│   └── ocr.ts                 ← OCR.space API
├── .env.local.example
└── package.json
```
