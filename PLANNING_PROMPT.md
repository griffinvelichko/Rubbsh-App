You are a senior full-stack engineer. Produce a concrete, step-by-step **implementation plan** for an extremely simple, **mobile-optimized Next.js (App Router + TypeScript)** web app that classifies a photographed waste item and shows binning instructions. You must do deep research to determine the best implementation strategy to implement the following web app using NEXT.JS

---

## Tools & Research You MUST Use

* **context7-mcp** → research and cite findings (with links) on:

  * Mobile camera UX best practices (`MediaDevices.getUserMedia` with `facingMode: "environment"`).
  * iOS Safari and Android Chrome quirks (autoplay, HTTPS, gesture requirements, permission behavior).
  * Image compression and EXIF stripping prior to upload.
  * Accessibility, performance, and privacy for live camera interfaces.
* **sequential-thinking-mcp** → decompose the project into strict, ordered implementation phases with acceptance criteria for each step.
* **Internet access** → confirm APIs, browser limitations, and ReactBits component usage examples.

---

## MVP Scope (Two Pages Only)

### 1. **Home (Camera) Page**

* Must use **live camera only**, initialized via `getUserMedia({ video: { facingMode: "environment" } })`.
* **Do not allow** gallery selection or file input fallback — no `<input type="file">` elements.
* Fullscreen camera preview with **one large capture button** centered near the bottom.
* **Top of screen:** short, action-oriented text, e.g.
  `"Take a pic of your garbage to see where it should go."`
* On capture → freeze frame → compress → send to API → navigate to Suggestions page.

### 2. **Suggestions Page**

* Displays parsed JSON result from Grok-4-fast response.
* Each part (name, instruction, bin) shown as a **card**, color-coded by bin type.
* Include a single **“Retake photo”** button to go back to the live camera.
* Clean, minimal text and layout optimized for mobile.

---

## LLM Invocation

* App sends the captured image to `/api/classify`, which forwards to **`grok-4-fast`**.
* The API must load a fixed **system prompt** from `/prompts/waste-system.md` — never inline.
* This prompt enforces the JSON response format below.

---

## Strict JSON Contract

**Success**

```json
{
  "error": false,
  "error_description": "",
  "summary": "string",
  "parts": [
    {
      "name": "string",
      "separation_instruction": "one short sentence",
      "bin": "FoodScraps" | "RecyclableContainers" | "Paper" | "Garbage"
    }
  ]
}
```

**Error**

```json
{"error": true, "error_description": "Reason", "summary": "", "parts": []}
```

---

## UI Framework & Styling Requirements

* Use **[ReactBits](https://reactbits.dev/get-started/installation)** components for all UI elements whenever possible.
* Create a **clean, glassy aesthetic** (light transparency, blur, subtle shadows).
* Absolutely **do NOT use any Shadcn components** — all layout, buttons, modals, and cards must come from ReactBits or a different UNIQUE library.
* **All CSS must be centralized in `globals.css`.**

  * No inline styling, no `style={{}}` objects, and no component-level CSS files.
  * Define all colors, glass effects, margins, paddings, font sizes, transitions, and layout utilities in `globals.css`.
  * Each React component should only use class names that reference these predefined styles (e.g. `className="btn-primary"`).
  * Ensure full consistency between the camera page and the suggestion page by reusing global utility classes.
* Ensure **mobile-first responsive design**, large tap targets, and high-contrast color mapping for bins.

---

## Deliverables for Your Plan

1. **Architecture & Flow**

   * ASCII diagram: Camera → `/api/classify` → Grok-4-fast → JSON → Suggestions page.
   * Explain data flow, error handling, and state transitions.

2. **File Tree (Minimal)**

Create a minimal file tree that follow **NEXT.JS** exactly.

3. **Camera Implementation Details**

   * Exact `getUserMedia` constraints for rear camera only.
   * Handle iOS Safari permission model (user gesture required).
   * Stop camera stream on unmount or page switch.
   * Include error handling for blocked permissions.
   * Client-side compression to ~1280px width, remove EXIF, encode as base64.

4. **API Design**

   * `POST /api/classify`:

     * Accepts image (base64 or binary).
     * Loads `/prompts/waste-system.md`.
     * Calls `grok-4-fast` with system prompt.
     * Enforces timeout, validates JSON with Zod.
     * Returns normalized JSON or error.
   * Include environment variables (`GROK_API_KEY`, etc.), size limits, privacy notes.

5. **UI/UX Details (Mobile-First)**

   * Home page:

     * Fullscreen live camera preview.
     * Transparent glass header for instruction text.
     * Floating circular capture button (ReactBits `Button` variant).
   * Suggestions page:

     * ReactBits for unique UI elements.
     * Color map by bin type (accessible contrast).
     * Retake button fixed bottom-center.
   * All layouts and visual rules defined exclusively in `globals.css`.

6. **Types & Validation**

   * TypeScript interface and Zod schema for JSON structure.
   * Validation on both API and client.

7. **Testing**

   * Unit tests for JSON parser and API handler.
   * Mock Grok-4-fast response.
   * Playwright test for camera permission flow.

8. **Deployment**

   * Vercel target, HTTPS requirement, mobile PWA considerations, CSP.

9. **Examples**

   * Include 2–3 mock responses (coffee cup, soda can, takeout container).
   * Show how JSON translates visually into the UI.

---

**Constraints**

* USE **NEXT JS**
* Keep it **fast, minimal, and mobile-focused**.
* Use **ReactBits** — **no Shadcn or inline styles.**
* All styling centralized in `globals.css`.
* No file uploads, no auth, no persistence.
* Cite all external technical references found via `context7-mcp` research.
