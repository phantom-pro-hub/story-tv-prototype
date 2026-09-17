# Story TV - Lightweight Interactive Web Prototype

A high-performance, ultra-lightweight, zero-dependency interactive prototype for the **Story TV** vertical short drama mobile application. Designed for instant loading on any mobile or desktop browser and 1-click deployment to **GitHub Pages**.

---

## 🚀 Live Demo & Local Quickstart

### Run Locally in 5 Seconds
No Node.js, npm, or build steps required. Simply run Python's built-in web server:

```bash
# From this directory:
python3 -m http.server 8080
```
Open **[http://localhost:8080](http://localhost:8080)** in your browser.

> Alternatively, you can directly open `index.html` in any modern web browser (Chrome, Safari, Firefox, Edge).

---

## 🌐 Deploy to GitHub Pages (1-Click)

Because this repository uses pure standard HTML5, CSS3, and modern ES6 JavaScript with zero build steps, you can host it on GitHub Pages immediately:

1. Create a GitHub repository and push these files (`index.html`, `style.css`, `app.js`, `README.md`).
2. Go to **Settings** > **Pages** in your GitHub repository.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**.
5. Your prototype will be live globally at `https://phantom-pro-hub.github.io/story-tv-prototype/`!

---

## 📱 Interactive User Journey

The prototype faithfully models the complete end-to-end user acquisition, onboarding, consumption, and retention flows:

### 1. Login Sampler
- Branded Story TV splash screen with hero taglines and episode counters.
- **One-tap entry**: Clicking **"Explore Stories (Quick Login)"** directly logs in and transitions forward without requiring tedious OTP input.
- Demo phone login also available.

### 2. Initial Personalisation
- Snappy, tactile preference selectors:
  - **Gender**: Female, Male, Other.
  - **Age Group**: 18-24, 25-34, 35-44, 45+.
  - **Language (4 Options)**: **Hindi** (हिन्दी), **Telugu** (తెలుగు), **Kannada** (ಕನ್ನಡ), **Tamil** (தமிழ்).
  - **Favorite Genre (4 Options)**: **Comedy** 😂, **Romance** ❤️, **Drama** 🎭, **Action** ⚡.
- Bottom **"Next →"** button.

### 3. Location Access Permission
- Directly triggered upon tapping Next.
- Clean system permission dialog explaining value ("trending local stories & regional dubbed dramas").
- **Seamless Next Transition**: Whether the user taps **"Allow While Using App"** or **"Don't Allow"**, it immediately proceeds to the full-screen video reel without friction.

### 4. Full-Screen Instagram-Style Short Video Reels
- 9:16 vertical short drama experience with audio toggle (🔊/🔇), creator handles, like button with pop animation, and cliffhanger episode tags.
- **Gestures Supported** (both Touch on mobile and Mouse drag on desktop, plus Arrow keys):
  - **Swipe Up**: Moves to next short video. Total of **3 videos** visible:
    - Video 1: *The Billionaire's Hidden Heiress* (Episode 1)
    - Video 2: *Contract Marriage with the CEO* (Episode 3)
    - Video 3: *Revenge of the Disowned Son* (Episode 5)
  - **After 3rd Video**: Swiping up automatically transitions the user to the **Start Trial Screen**.
  - **Swipe Left or Right**: On any of the 3 videos, swiping horizontally immediately opens the **Start Trial Screen**.
  - **"Start Trial • ₹1 Only →" CTA**: Floating at the bottom of each reel, tapping it immediately opens the **Start Trial Screen**.

### 5. Start Trial Screen (Screenshot 1 Accurate)
- Pixel-accurate implementation of attached screenshot 1:
  - Header: Back arrow & **FAQs** link.
  - Heading: **"Start Trial for ₹99"** with clean strikethrough.
  - Hero metallic typography: **₹1**.
  - Vibrant green social proof: **"5 Crore+ people bought the trial offer till now!"**.
  - Deep burgundy preview card with woman in orange dress, speaker mute toggle, and gradient **"START TRIAL ₹1"** badge. Subtitle: *"Cancel the plan anytime"*.
  - **3-Step Timeline with Icons**:
    1. 🔒 **Start your Trial Plan** — *Pay ₹1 and unlock all dramas*
    2. ⭐ **Watch new dramas for 1 days** — *Romance, revenge and much more*
    3. 🎬 **Notified before autopay** — *Pay ₹699/3 months after 1 days*
  - **Payment Selector**: Crisp **GPay** logo badge + *"Change >"*.
  - Sticky bottom pink pill button: **"Start Trial →"**.

### 6. Trial Activated Success Screen
- Celebratory confirmation screen with green checkmark animation, details of ₹1 paid via GPay, and scheduled autopay date (18th Sep, 2026).
- Seamlessly navigates to the **Subscription Settings** page.

### 7. Subscription Settings Page (Screenshot 2 Accurate)
- Starts in **Active Trial** mode with an interactive demo banner:
  - *"👉 Tap 'Cancel Plan' below to test the Leave Trial Retention Funnel"*.
- **Premium Plan Card**: Shows Active Trial status and next autopay date.
- **Premium Benefits**: 4 benefit icons (Unlimited Access, Ads Free, HD Quality, Multiple Logins).
- **Help and Support**:
  - *"Contact us"*
  - *"Cancel Plan"* (with ⊝ icon)
- **FAQs Accordion**: Expandable answers for Q1 through Q5.

---

## 🛡️ Multi-Step Leave Trial Retention Funnel

When the user taps **"Cancel Plan"**, the retention journey is initiated:

| Funnel Step | Retention Strategy | Offers & Action | Primary CTA (Retain) | Secondary Unhighlighted CTA |
|---|---|---|---|---|
| **Step 1** | **Features Missed** | HD Quality, Device Sharing, Unlimited Access, Ads Free Bingeing | **Keep Plan** *(returns to active settings)* | *Proceed to cancel* |
| **Interlude 1** | **Reel Teaser** | Full-screen cliffhanger teaser clip | **Continue Trial** *(returns to active settings)* | *Proceed to cancel* |
| **Step 2** | **1-Day Extension** | Free +24h VIP access; autopay pushed back to 19th Sep; ₹0 charged today | **Keep Plan & Claim +1 Day** *(updates autopay)* | *Proceed to cancel* |
| **Interlude 2** | **Reel Teaser** | Full-screen revelation teaser clip | **Continue Trial** *(returns to active settings)* | *Proceed to cancel* |
| **Step 3** | **Weekly Autopay** | Switch from ₹699/3mo to flexible ₹49/week with no long lock-in | **Switch to Weekly & Keep Plan** *(sets weekly pass)* | *Proceed to cancel* |
| **Interlude 3** | **Reel Teaser** | Full-screen climax confrontation teaser clip | **Continue Trial** *(returns to active settings)* | *Proceed to cancel* |
| **Step 4** | **Sachet ₹10 Buy** | Buy just the current show for ₹10 one-time payment; cancels recurring autopay | **Buy Show for ₹10 & Cancel Autopay** *(cancels autopay, unlocks show)* | *Proceed to cancel without buying* |

### Final Cancelled State
If the user proceeds past Step 4, autopay is cancelled and the **Subscription Settings** screen transforms to match **Screenshot 2**:
- Red badge: **"Autopay cancelled"**
- **"Show access expired on: 8th Sep, 2026"**
- Bright magenta **"Renew Now →"** button (which allows reactivating the trial).
- Instant confirmation toast notification.

---

## 🛠️ Demo Toolbar Features

At the top of the screen on desktop:
- **Step Selector**: Instant dropdown jump to any of the 17 screens/states in the prototype.
- **Device Frame Toggle**: Switch between an iPhone 16 Pro mockup frame (393x852) and Full Browser responsive view.
- **Ambient Web Audio**: Built-in sound synthesis so sound effects and dramatic musical stings work with zero external audio files.
