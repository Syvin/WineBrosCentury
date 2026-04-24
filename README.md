# Wine Century Brothers

Official brand site for **Wine Century Brothers**, premier international distributor of fine wines and luxury spirits in the Philippines since 2010. Designed for immersive product discovery and inquiry-led sales.

## 🚀 Tech Stack

### Frontend & Design
- **Next.js 16** - React framework using the App Router for optimal performance.
- **GSAP & ScrollTrigger** - Advanced scroll orchestration and cinematic animations.
- **Lenis** - High-performance smooth scrolling.
- **Framer Motion 12** - Production-ready motion library for state-driven interactions.
- **Tailwind CSS 4** - Utility-first styling with modern CSS features.
- **React Three Fiber / Drei** - 3D rendering for immersive visual elements.
- **Liquid Glass** - Specialized shader effects for premium UI surfaces.
- **Lucide React & Tabler Icons** - Premium iconography.

### Backend & Data
- **Supabase** - Core backend services (Database, Storage, Auth).
- **Google Sheets API** - Primary inventory management and inquiry backup.
- **Zod** - Schema validation for data integrity across the pipeline.

## 📁 Project Structure

```bash
app/              # Next.js App Router: Sections and main page assembly
components/       # UI Components: Design system, layout, and section-specific modules
lib/              # Utilities: API clients (Supabase/Google), sync actions, and hooks
public/           # Assets: Product images, brand logos, and 3D models
types/            # TypeScript: Database schemas and application-wide interfaces
```

## ⚙️ Development

### Prerequisites
- Node.js 18+
- Supabase Project (Database & Storage configured)
- Google Cloud Service Account (with Sheets API enabled)

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Data Pipeline
This project uses a unique hybrid data architecture:
1. **Source**: Inventory is managed by staff via a **Google Sheet**.
2. **Sync**: A `googleSync` server action mirrors images to Supabase Storage and upserts records to the Supabase Database.
3. **Delivery**: The frontend fetches from Supabase with `unstable_cache` for high-performance delivery and high availability.

## 🚢 Deployment
Optimized for deployment on modern platforms. Ensure the following environment variables are set:
- `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` / `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SHEETS_SPREADSHEET_ID`

## License
MIT

