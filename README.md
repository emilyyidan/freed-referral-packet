# Freed Referral Packet

A prototype demonstrating AI-powered referral packet generation for pediatric practices. Built as a proof-of-concept for streamlining the referral workflow between primary care physicians and specialists.

_EHR portion of the demo_
<img width="1700" height="895" alt="Screenshot 2026-02-12 at 6 57 42 PM" src="https://github.com/user-attachments/assets/6df4e24a-a69d-4f9d-a306-903d2b17b6b9" />

_Freed interface portion of the demo_
<img width="1683" height="946" alt="Screenshot 2026-02-12 at 6 58 02 PM" src="https://github.com/user-attachments/assets/16080fb9-2d8c-47d5-959e-e5cce5e785a1" />


## Context

This was built in late Jan 2026 in ~2 hrs (excluding prior user research) primarily using the Claude Code CLI running Opus 4.5. This was the first project where I almost entirely switched over from Cursor to the terminal interface because Opus 4.5 was good enough that I rarely found myself wanting to go into the code itself (except for quick copy changes, etc.). My upstream workflows around research and spec'ing was also largely using Claude.

I was also pleasantly surprised by the quality of the UI/UX that Claude came up with. The underlying API calls are also using Opus 4.5. 

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

All patient data that is shown in the EHR is hard coded for demo purposes

### Patient Clinical Data
- **8 SOAP notes** Prior SOAP notes, ahead of the demo (the 11-month visit)
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
- List view of other visits (non-functional)
- Templates, Settings, Help menu items (non-functional)
- Growth chart (placeholder only)

## Future Improvements

### Short-term Enhancements
- [ ] Support multiple referral types (not just cardiology)
      
### Medium-term Features
- [ ] Actual EHR integration
- [ ] Support for multiple patients (patient list/search)
- [ ] Template management for different referral types
- [ ] Referral tracking and status updates

### Technical Gaps
- [ ] Write unit tests for state management
- [ ] Write E2E tests for critical flows
- [ ] Implement proper error boundaries
- [ ] Add loading skeletons for better perceived performance
- [ ] Optimize PDF generation for larger packets

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | API key for Claude | Yes |

## License

This is a prototype for demonstration purposes.
