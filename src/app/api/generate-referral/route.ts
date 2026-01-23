import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      patientInfo,
      providerInfo,
      soapNotes,
      specialty,
      relevantImaging,
      relevantLabs,
      medications
    } = body;

    const prompt = `You are a medical assistant helping a pediatrician generate a referral letter to a ${specialty} specialist.

Referring Provider:
- Name: ${providerInfo.name}, ${providerInfo.credentials}
- Practice: ${providerInfo.practice.name}
- Address: ${providerInfo.practice.address}, ${providerInfo.practice.city}, ${providerInfo.practice.state} ${providerInfo.practice.zip}
- Phone: ${providerInfo.practice.phone}
- Fax: ${providerInfo.practice.fax}
- NPI: ${providerInfo.npi}

Patient Information:
- Name: ${patientInfo.firstName} ${patientInfo.lastName}
- Date of Birth: ${patientInfo.dateOfBirth}
- Age: ${patientInfo.age}
- Sex: ${patientInfo.sex}

Most Recent Visit Note:
${soapNotes.map((note: { date: string; visitType: string; chiefComplaint: string; assessment: string; plan: string }) => `
Date: ${note.date}
Visit Type: ${note.visitType}
Chief Complaint: ${note.chiefComplaint}
Assessment: ${note.assessment}
Plan: ${note.plan}
`).join('\n---\n')}

Current Medications:
${medications.map((med: { name: string; dosage: string; frequency: string }) => `- ${med.name} ${med.dosage} ${med.frequency}`).join('\n')}

Relevant Imaging Results:
${relevantImaging.map((img: { type: string; date: string; impression: string }) => `
${img.type} (${img.date}):
Impression: ${img.impression}
`).join('\n')}

Relevant Lab Results:
${relevantLabs.map((lab: { name: string; date: string; results: { test: string; value: string; unit: string }[] }) => `
${lab.name} (${lab.date}):
${lab.results.map((r: { test: string; value: string; unit: string }) => `  - ${r.test}: ${r.value} ${r.unit}`).join('\n')}
`).join('\n')}

Please generate a professional referral letter to the ${specialty} specialist. The letter should:
1. Include a letterhead with the referring provider's practice name, address, phone, and fax
2. Be addressed "To the Pediatric ${specialty} Team"
3. Clearly state the reason for referral
4. Summarize relevant medical history
5. Include pertinent findings from recent examinations and tests
6. Specify what evaluation/management is being requested
7. Be concise but comprehensive
8. End with the referring provider's signature block including name, credentials, and contact info

Format the letter professionally with today's date. Use a warm but professional tone appropriate for a pediatric referral.`;

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-5-20251101',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const textContent = response.content.find(block => block.type === 'text');
    const generatedLetter = textContent ? textContent.text : '';

    return NextResponse.json({ letter: generatedLetter });
  } catch (error) {
    console.error('Error generating referral:', error);
    return NextResponse.json(
      { error: 'Failed to generate referral letter' },
      { status: 500 }
    );
  }
}
