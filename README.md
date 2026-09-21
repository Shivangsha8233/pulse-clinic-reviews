# Pulse Health Clinic — Smart AI Review & QR Google Reputation System

A dedicated, mobile-first patient review experience for **Pulse Health Clinic** (Madhapur, Hyderabad) featuring:
1. **Interactive 1 to 5 Star Rating**.
2. **Doctor & Treatment Specific Filtering** (Dr. G. Vijay Kumar & Dr. Y. Devi Priya).
3. **AI-Powered Natural Human Review Generator** (Free, zero API keys required).
4. **1-Tap Clipboard Copy & Google Review Direct Opener** (Directly opens Google's review write-box).
5. **Smart Reputation Filter** (Steers 4–5 star reviews to Google; directs 1–3 star feedback privately to the Medical Director via WhatsApp).
6. **Printable Reception Desk QR Standee** (Ready to print on A4/A5 or table tent cards).

---

## 📍 Google Maps Place Integration
- **Place ID**: `ChIJrcsBE6ORyzsRNNWqRuAR6Ok`
- **Direct 1-Click Review URL**:
  `https://search.google.com/local/writereview?placeid=ChIJrcsBE6ORyzsRNNWqRuAR6Ok`

---

## 🤖 Free AI Review Engine (No API Key Required)

This application uses a hybrid zero-friction generative engine:
1. **Free Online Inference**: Connects to Pollinations AI text endpoint (`https://text.pollinations.ai/`) for spontaneous unique human-sounding sentences with zero authentication or API tokens.
2. **Instant Local Human Generative Fallback**: 40+ medical context templates curated specifically for Dr. Vijay Kumar (General Surgery, Piles, Cysts, Lipoma) and Dr. Devi Priya (PRP/GFC Hair, Botox, Skin Peels) in Madhapur/Hitec City.
3. Generates 3 distinct styles:
   - **Detailed & Professional** (Highlights doctor explanation, clinic hygiene, and recovery)
   - **Warm & Conversational** (Personal gratitude and polite staff care)
   - **Short & Impactful** (Quick 5-star recommendation)

---

## 🛡️ Smart Reputation Funnel
- **4 or 5 Stars**: Encourages patient to pick an AI review, copies to clipboard in 1 tap, and redirects directly to Google Reviews to paste and submit.
- **1 to 3 Stars**: Respectfully intercepts dissatisfied feedback and routes it directly to clinic management / WhatsApp (`+91 7396639211`), preventing negative public Google ratings while resolving complaints immediately.

---

## 🖨️ Reception Desk Standee
Click the **"Desk QR Stand"** button on the top right to view or print the reception desk table tent card. It includes:
- Live QR code pointing to the review page.
- "Loved your visit today? Help others find us in Madhapur!" headline.
- 5 Gold Stars.
- Print button (`Ctrl+P` / `Cmd+P` optimized with `@media print`).

---

## 🔒 Git Isolation
This directory (`review/`) is excluded from the parent `Pulse` git repository via `.gitignore` and `.git/info/exclude`.
