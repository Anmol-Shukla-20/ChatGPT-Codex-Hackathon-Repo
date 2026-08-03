# PS8: AI for Societal Good

## Project Title
**BharatSetu AI**

## Problem Statement
BharatSetu AI is built for the PS8 track, **AI for Societal Good**. The platform helps citizens discover and understand Indian Government Schemes based on their profile and uploaded documents, while also providing an AI chatbot for scheme guidance.

Many citizens face difficulty finding the right schemes because:
- Eligibility rules are scattered across multiple portals.
- Scheme information is difficult to search and compare.
- Users often do not know which documents are required.
- Existing portals are not personalized to the citizen’s profile.

BharatSetu AI solves this by combining profile-based recommendations, document-aware assistance, and conversational AI support into a single citizen-friendly workflow.

## Objectives
- Recommend relevant schemes using citizen profile data.
- Use uploaded documents to improve eligibility matching.
- Help users complete and save their profile.
- Provide an AI chatbot for scheme guidance.
- Show official government links for trusted verification.

## Technical Stack
- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** Supabase PostgreSQL
- **Storage:** Supabase Storage using the `documents` bucket
- **Authentication:** Supabase Auth with Google login
- **AI:** Grok xAI API
- **Deployment:** Vercel
- **Data Source:** `government_schemes.json` local dataset for scheme recommendations

## How the Stack Solves the Problem
- **Next.js and React** provide a fast, responsive user experience.
- **Supabase Auth** secures user access and keeps data tied to the signed-in citizen.
- **Supabase PostgreSQL** stores profiles, documents, and chat history.
- **Supabase Storage** keeps uploaded documents available for reuse.
- **Grok xAI** powers the chatbot for interactive guidance.
- **government_schemes.json** ensures scheme recommendations remain available even if external APIs are unavailable.

## User Flow
1. User signs in with Google.
2. User completes or updates their profile.
3. User uploads documents such as PDF, JPG, or PNG.
4. System saves document metadata and uses OCR-assisted autofill where possible.
5. Recommendation engine ranks schemes based on profile and documents.
6. User can open the chatbot for further scheme guidance.
7. Every scheme links to its official government source.

## Societal Impact
BharatSetu AI improves access to public welfare programs by making scheme discovery simpler, faster, and more transparent. It reduces confusion, saves time, and helps citizens identify benefits they are eligible for.

## Summary
BharatSetu AI addresses a real public-service challenge by using AI to connect citizens with relevant government schemes in a reliable and personalized way. It is designed for public benefit, trust, and practical deployment.
