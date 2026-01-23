# Freed Referral Packet

A prototype demonstrating AI-powered referral packet generation for pediatric practices. Built as a proof-of-concept for streamlining the referral workflow between primary care physicians and specialists.

## Overview

This prototype showcases how AI can assist clinicians in generating comprehensive referral packets by:
- Analyzing SOAP notes to detect when referrals are needed
- Auto-generating professional referral letters using Claude
- Allowing clinicians to select relevant labs, imaging, and visit notes to include
- Producing downloadable PDF packets ready for faxing or emailing

## Demo

**Live Demo:** [https://freed-referral-packet.vercel.app](https://freed-referral-packet.vercel.app)

The demo includes a **Reset Demo** button in the top banner that clears all progress and returns to the initial state.

## Features

### Freed Interface (`/freed`)
- SOAP note viewer with expandable sections
- AI-suggested referral detection based on visit notes
- Referral packet builder with selectable attachments
- Real-time AI letter generation via Claude API
- PDF generation with practice letterhead
- Email integration with pre-filled subject/body

### Mock EHR Interface (`/ehr`)
- Patient demographics banner
- Visit history with SOAP notes
- Lab results with normal/abnormal flagging
- Imaging results and reports
- Medication list
- Immunization records
- Growth chart placeholder

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Anthropic Claude API (claude-opus-4-5)
- **PDF Generation:** jsPDF
- **Deployment:** Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- Anthropic API key

### Installation

```bash
# Clone the repository
git clone https://github.com/emilyyidan/freed-referral-packet.git
cd freed-referral-packet

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate-referral/   # Claude API endpoint
│   ├── ehr/                     # Mock EHR interface
│   ├── freed/                   # Freed interface
│   └── layout.tsx               # Root layout with demo banner
├── components/
│   └── shared/
│       ├── DemoBanner.tsx       # Reset functionality
│       └── NavigationButton.tsx # Toggle between views
├── data/
│   └── patient.ts               # All mock patient data
└── lib/
    └── referralState.ts         # localStorage state management
```

## What's Hardcoded

The following values are hardcoded for demo purposes:

| Item | Value | Location |
|------|-------|----------|
| Patient name | Alex Wang | `src/data/patient.ts` |
| Patient DOB | February 21, 2025 | `src/data/patient.ts` |
| Patient age | 11 months | `src/data/patient.ts` |
| Provider name | Dr. Monica Kwan, MD | `src/data/patient.ts` |
| Practice name | Golden Gate Pediatrics | `src/data/patient.ts` |
| Practice address | 3838 California Street, San Francisco, CA 94118 | `src/data/patient.ts` |
| Practice phone | (415) 555-1234 | `src/data/patient.ts` |
| Practice fax | (415) 123-5555 | `src/data/patient.ts` |
| Referral specialty | Cardiology | `src/app/freed/page.tsx` |
| AI model | claude-opus-4-5-20251101 | `src/app/api/generate-referral/route.ts` |

## What's Mocked

The following data is simulated and does not come from a real EHR:

### Patient Clinical Data
- **8 SOAP notes** spanning from birth (Feb 2025) to 11-month visit (Jan 2026)
- **Lab results:** CBC, lead level, metabolic panel, newborn screening
- **Imaging:** 2 echocardiograms, hip ultrasound, lumbosacral spine ultrasound, kidney ultrasound
- **Medications:** Vitamin D drops, iron supplement
- **Immunizations:** Standard pediatric schedule (HepB, DTaP-IPV-Hib-HepB, Pneumo 15, Rotavirus, Influenza, COVID-19)
- **Vitals and growth data** for each visit

### Clinical Narrative
The mock data tells a coherent clinical story:
1. Newborn with murmur detected at birth
2. Echocardiogram reveals small muscular VSD, PDA, and PFO
3. PDA closes by 2-month follow-up
4. 11-month visit: cardiology referral recommended for continued VSD monitoring

### UI/UX Elements
- Search functionality (non-functional)
- "New visit" button (non-functional)
- Templates, Settings, Help menu items (non-functional)
- Growth chart (placeholder only)

## Future Improvements

### Short-term Enhancements
- [ ] Add ability to edit the generated referral letter inline
- [ ] Support multiple referral types (not just cardiology)
- [ ] Add print functionality for the referral packet
- [ ] Implement actual fax integration (e.g., via Twilio)
- [ ] Add confirmation toast/modal after sending referral

### Medium-term Features
- [ ] EHR integration via FHIR APIs
- [ ] Support for multiple patients (patient list/search)
- [ ] Template management for different referral types
- [ ] Referral tracking and status updates
- [ ] Bi-directional communication with specialists

### Long-term Vision
- [ ] Integration with real scheduling systems
- [ ] Automated follow-up reminders
- [ ] Analytics dashboard for referral patterns
- [ ] Multi-provider/multi-practice support
- [ ] Mobile-responsive design for tablet use in clinic

### Technical Debt
- [ ] Add unit tests for state management
- [ ] Add E2E tests for critical flows
- [ ] Implement proper error boundaries
- [ ] Add loading skeletons for better perceived performance
- [ ] Optimize PDF generation for larger packets

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | API key for Claude | Yes |

## License

This is a prototype for demonstration purposes.

---

Built with Claude Code
