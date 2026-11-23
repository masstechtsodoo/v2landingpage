# Mass Tech — masstech.mn

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · fully static (SSG) · MN/EN.

```bash
pnpm install
pnpm dev        # http://localhost:3000  →  redirects to /mn
pnpm build && pnpm start
```

## Pages

| URL | Content |
| --- | --- |
| `/mn`, `/en` | Home — hero, partner logos, 3 core areas, about, why us, projects, contact form |
| `/[locale]/products` | 50 products, filter by category / sub-group, search |
| `/[locale]/products/[slug]` | Product detail + "request a quote" |
| `/[locale]/news` | News & projects (12 projects with photos) |
| `/[locale]/news/[slug]` | Project detail + photo gallery |
| `/[locale]/contact` | Contact info, map, form |
| `/[locale]/about` | Company, vision, mission, values |

`/` redirects to `/mn` (or `/en` for English browsers, remembers the choice in a cookie).
Old URLs `/product`, `/about` redirect to the new ones.

## Where things live

| What | File |
| --- | --- |
| Phone, email, address, partner list, hero/section images | `lib/site.ts` |
| All UI text + Home/About copy (MN & EN) | `lib/dictionaries.ts` |
| Products / news when no API is connected (and build fallback) | `content/*.json` |
| Admin panel | `app/admin`, `components/admin`, `lib/admin` |
| Colors, font | `app/globals.css` (`@theme`) |

`content/*.json` was generated from the two Word files ("Вэбсайтын мэдээлэл"). Edit the JSON directly for small changes.

## Adding images

**Hero & sections** — put files in `public/images/` and set the paths in `lib/site.ts → imagery`
(`homeHero`, `aboutHero`, `whyChoose`, `coreAreas.radiation|medical|energy`). Until set, a branded gradient is shown.
Recommended: hero ≥ 2400 px wide, JPG/WebP, under ~500 KB.

**Partner logos** — put SVG/transparent PNG files in `public/partners/` and add `logo: "/partners/nuctech.svg"`
to the matching entry in `lib/site.ts → partners`. Without a logo the name is shown as text.

**Products** — upload in `/admin` → Бүтээгдэхүүн (stored on Cloudinary). Without the backend: drop a file named exactly `<slug>.webp` (or .jpg/.png/.avif) into `public/images/products/`.
It is picked up automatically on the next build. A transparent or white background works best (square-ish, ≥ 1200 px).

**Projects** — photos are in `public/images/projects/` (extracted from the Word file); listed per project in `content/projects.json`.

## Backend & admin panel

Content can be managed at **`/admin`** when the backend (`masstech-api`, on Render) is connected:

| Env var (Vercel) | |
| --- | --- |
| `API_URL` | e.g. `https://masstech-api.onrender.com` |

With `API_URL` set:
- Products and news come from the API (cached with ISR, refreshed every 5 min).
  Saving in `/admin` refreshes the public pages **immediately**.
- The contact form stores messages in the database (`/admin` → Зурвасууд) and the API can e-mail them.
- If the API cannot be reached during a build, the bundled `content/*.json` is used so deploys never fail.

Without `API_URL` the site runs fully static from `content/*.json` (the admin panel then shows "API_URL is not set").

Admin login is handled by `/api/admin/session`; the API token is kept in an httpOnly cookie and all admin requests
go through `/api/admin/*` (server-side proxy), so no tokens are exposed in the browser.

## Contact form

With `API_URL`: messages go to the backend (see above).
Without it: either Resend (`RESEND_API_KEY`, see `.env.example`) or, by default, the visitor's e-mail app opens with the message filled in.

## Product image file names

**Radiation Monitoring**

- `cx6040d-x-ray-inspection-system.webp` — NUCTECH CX6040D —X-ray Inspection System
- `cx7555bi-x-ray-inspection-system.webp` — CX7555BI X-ray Inspection System
- `cx7555d-x-ray-inspection-system.webp` — CX7555D X-ray Inspection System
- `cx8065ti-x-ray-inspection-system.webp` — CX8065TI X-ray Inspection System
- `cx100100d-x-ray-inspection-system.webp` — CX100100D X-ray Inspection System
- `cx100100db-x-ray-inspection-system.webp` — CX100100DB X-Ray Inspection System
- `cx130130d-x-ray-inspection-system.webp` — CX130130D X-Ray Inspection System
- `cx150180d-x-ray-inspection-system.webp` — CX150180D X-ray Inspection System
- `mx100100d-x-ray-inspection-system.webp` — MX100100D X-ray Inspection System
- `key-line-passenger-smart-checkpoint.webp` — Key-Line Passenger Smart Checkpoint
- `wedrop-self-service-baggage-check-system.webp` — WeDrop Self-Service Baggage Check System
- `mw2000aa-millimeter-wave-body-inspection-device.webp` — MW2000AA Millimeter Wave Body Inspection Device
- `wepass-smart-access-control-system.webp` — WePass Smart Access Control System
- `bi2002-human-body-inspection-system.webp` — BI2002 Human Body Inspection System
- `bs1000wa-t1-walk-through-temperature-and.webp` — BS1000WA-T1 Walk-Through Temperature and Weapon Detector
- `tr2000dc-desktop-explosives-and-narcotics-trace.webp` — TR2000DC Desktop Explosives and Narcotics Trace Detector
- `tr1000qc-handheld-multifunction-contraband-detector.webp` — TR1000QC Handheld Multifunction Contraband Detector
- `tr3000de-explosive-express-trace-detector.webp` — TR3000DE Explosive Express Trace Detector
- `rt1003eb-liquid-security-inspector.webp` — RT1003EB Liquid Security Inspector
- `mks-11gn-sprd-spectra-search-dosimeter.webp` — MKS-11GN SPRD SPECTRA Search Dosimeter-Radiometer
- `dks-02pn-prd-cadmium-search-alarm.webp` — DKS-02PN PRD CADMIUM Search Alarm Dosimeter
- `dkg-24-prd-guarder-personal-radiation.webp` — DKG-24 PRD GUARDER Personal radiation dosimeter
- `it-09-data-panel.webp` — IT-09 Data Panel
- `bdbg-09-intelligent-detecting-unit-of.webp` — BDBG-09 Intelligent Detecting Unit of Gamma Radiation
- `epd-27-doseg-and-dosegx-electronic.webp` — EPD-27 DoseG and DoseGX Electronic Personal Dosimeter
- `rkg-14-virtuoso-multipurpose-environment-activity.webp` — RKG-14 VIRTUOSO Multipurpose environment activity radiometer
- `bs-09-gamma-radiation-alarm-unit.webp` — BS-09 Gamma Radiation Alarm Unit
- `dosimeter-radiometer-mks-05-terra.webp` — Dosimeter-radiometer MKS-05 TERRA
- `mks-um-multipurpose-survey-meter.webp` — MKS-UM Multipurpose Survey Meter
- `radmonitor-computer-aided-system-of-radiation.webp` — RadMonitor Computer-Aided System of Radiation control
- `georad-m-software-and-hardware-system.webp` — GeoRad-M Software and Hardware System
- `radiation-protective-clothing-and-equipment-set.webp` — Radiation Protective Clothing and Equipment Set

**Medical**

- `neuviz-ace-128-computed-tomography-system.webp` — NeuViz ACE 128 Computed Tomography System (CT)
- `neumr-1-5t-magnetic-resonance-imaging.webp` — NeuMR 1.5T Magnetic Resonance Imaging System (MRI)
- `neuvision-850-digital-radiography-system-dr.webp` — NeuVision 850 Digital Radiography System (DR)
- `climber-035-open-mri-system.webp` — CLIMBER 035 Open MRI System
- `climber-035-complete-mobile-mri-diagnostic.webp` — CLIMBER 035 Complete Mobile MRI Diagnostic System
- `venusx-radiotherapy-linear-accelerator-linac.webp` — VenusX Radiotherapy Linear Accelerator (LINAC)
- `nstar-mr055-liquid-helium-free-superconducting.webp` — NSTAR MR055 Liquid-Helium-Free Superconducting MRI System
- `smart3d-x-intelligent-dental-and-maxillofacial.webp` — Smart3D-X Intelligent Dental and Maxillofacial Cone Beam Computed Tomography System (CBCT)
- `fusionscanner-su-series-intraoral-scanner.webp` — FusionScanner SU Series Intraoral Scanner
- `hires3d-series-dental-and-maxillofacial-cone.webp` — HiRes3D Series Dental and Maxillofacial Cone Beam Computed Tomography System (CBCT)
- `ultra3d-dual-source-dual-detector-cone.webp` — Ultra3D Dual-Source, Dual-Detector Cone Beam Computed Tomography System (CBCT)
- `dw-t30-cart-based-color-doppler.webp` — DW-T30 — Cart-Based Color Doppler Ultrasound System
- `afm-800m-fetal-monitor.webp` — AFM-800M — Fetal Monitor
- `lrm-6-semi-automatic-microtome-with.webp` — LRM-6 — Semi-Automatic Microtome with Touchscreen

**Energy**

- `gsl-link-i-series-integrated-solar.webp` — GSL-Link I Series — Integrated Solar Energy and Battery Storage System
- `mobile-foldable-solar-power-container-power.webp` — Mobile Foldable Solar Power Container — Power SPV / Power SES Series
- `jdjz-s1-pro-ev-charger.webp` — JDJZ S1 Pro — EV Charger
- `kstar-7-kw-ac-ev-charger.webp` — KSTAR — 7 kW AC EV Charger