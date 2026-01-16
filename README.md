# Smart Reconciliation Visualizer

A premium, privacy-focused financial reconciliation dashboard built with **React (Vite)** and **TypeScript**. 
Key features include auto-reconciliation of datasets, mismatch detection, and a Soft UI inspired aesthetic.

![Soft UI Dashboard](https://raw.githubusercontent.com/creativetimofficial/soft-ui-dashboard-tailwind/master/assets/img/soft-ui-dashboard-tailwind.jpg)
*(Concept Inspiration)*

## 🚀 Live Demo
[Insert Deployment URL Here]

---

## 💡 The "Senior Engineer" Approach
This project was architected with a specific focus on **Privacy**, **Performance**, and **User Experience**.

### 1. Architecture: Client-Side SPA (Vite)
Instead of a server-heavy approach (Next.js/Node.js), I chose a **Client-Side Single Page Application**.
*   **Why?**
    *   **Data Privacy:** Financial data (CSVs) is sensitive. By processing everything in the browser memory, data *never* leaves the user's machine. Security compliance is simplified.
    *   **Performance:** Instant reconciliation feedback. No network latency for uploading/processing large files.
    *   **Simplicity:** The application is a static asset. It can be deployed anywhere (AWS S3, Vercel, Netlify, GitHub Pages) with zero maintenance.

### 2. Design System: Soft UI
I implemented a **Soft UI (Neumorphism)** aesthetic using Tailwind CSS.
*   **Why?**
    *   Financial tools are often boring. This dashboard uses soft shadows, gradients, and glassmorphism to create a "Premium Fintech" feel that delights users.
    *   Visual hierarchy is established through depth (shadows) rather than just borders.

### 3. Tech Stack
*   **Framework:** React 19 + Vite (Fastest dev experience, optimized build).
*   **Styling:** Tailwind CSS + `clsx` + `tailwind-merge`.
*   **Animation:** Framer Motion (for smooth transitions and entry effects).
*   **Charts:** Recharts (Declarative, component-based charting).
*   **Logic:** PapaParse (Robust CSV parsing).

---

## 🛠️ How to Run
1.  **Clone the repository**
    ```bash
    git clone <repo-url>
    cd smart-reconciliator
    ```
2.  **Install Dependencies**
    ```bash
    npm install
    ```
3.  **Start Development Server**
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:5173` to view the app.

---

## 🧩 Key Features
*   **Drag & Drop Upload:** intuitive file handling with validation.
*   **Auto-Reconciliation:** Automatically detects "ID" and "Amount" columns (using fuzzy matching logic).
*   **Detailed Reporting:**
    *   **Matches:** Exact ID and Amount match.
    *   **Mismatches:** ID matches, but Amount differs (highlighted difference).
    *   **Missing:** Record found in one file but not the other.
*   **Visualizations:** Interactive charts to instantly gauge reconciliation health.

## 📝 Assumptions
*   **CSV Format:** Input files assume a header row.
*   **Fuzzy Matching:** The system attempts to guess columns named "id", "ref", "amount", "total" etc. In a production version, a "Column Mapping" step would be added.
*   **Data Volume:** Optimized for typical browser limits (up to ~50k rows). usage of Web Workers would act as an enhancement for larger datasets.

---

**Author:** [Your Name]
**Date:** January 16, 2026
