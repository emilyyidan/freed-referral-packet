'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { patientData, providerData, getMostRecentSOAPNote, getRecentSOAPNotes, hasPendingReferral } from '@/data/patient';
import NavigationButton from '@/components/shared/NavigationButton';
import {
  FileText,
  Plus,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Send,
  Calendar,
  User,
  Stethoscope,
  ClipboardList,
  Settings,
  HelpCircle,
  Check,
  X,
  Download,
  Mail,
  Printer,
  Edit3,
  Mic,
  Heart,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { getState, updateCurrentReferral, createReferral, completeReferral, getCurrentReferral, getNotesGenerated, setNotesGenerated as persistNotesGenerated } from '@/lib/referralState';
import jsPDF from 'jspdf';

type Tab = 'summary' | 'note' | 'transcript' | 'referral';

// Mock visit data for the sidebar
const visitPreviews = [
  {
    id: 'visit-001',
    patientName: 'Alex Wang',
    visitDate: 'Jan 20, 2026',
    visitType: '11 Month Well Child',
    labels: [{ text: 'Referral', color: 'bg-amber-500' }],
    isActive: true,
  },
  {
    id: 'visit-002',
    patientName: 'Maya Johnson',
    visitDate: 'Jan 15, 2026',
    visitType: 'Sick Visit',
    labels: [],
    isActive: false,
  },
  {
    id: 'visit-003',
    patientName: 'Ethan Chen',
    visitDate: 'Jan 14, 2026',
    visitType: '4 Year Well Child',
    labels: [{ text: 'Lab Review', color: 'bg-blue-500' }],
    isActive: false,
  },
  {
    id: 'visit-004',
    patientName: 'Sofia Rodriguez',
    visitDate: 'Jan 14, 2026',
    visitType: '2 Month Well Child',
    labels: [],
    isActive: false,
  },
  {
    id: 'visit-005',
    patientName: 'Liam O\'Brien',
    visitDate: 'Jan 13, 2026',
    visitType: 'Follow-up',
    labels: [],
    isActive: false,
  },
];

// Patient summary for Alex Wang - BEFORE the Jan 20 visit (no cardiology referral yet)
const preVisitSummary = {
  overview: "11-month-old male with history of small muscular ventricular septal defect (VSD) detected at birth. PDA and PFO resolved by 2 months. Growing well with no cardiac symptoms.",
  keyConditions: [
    { condition: "Ventricular Septal Defect (VSD)", status: "Active", notes: "Small muscular VSD identified at birth, monitoring ongoing" },
    { condition: "Patent Ductus Arteriosus (PDA)", status: "Resolved", notes: "Closed spontaneously by 2 months" },
    { condition: "Patent Foramen Ovale (PFO)", status: "Resolved", notes: "Closed by 2 months" },
  ],
  allergies: "No known allergies",
  currentMedications: ["Vitamin D 400 IU daily", "Iron supplement 15mg daily"],
  immunizations: "Up to date for age",
  growthStatus: "Tracking at 50th percentile for weight and length. Growth velocity appropriate.",
  lastVisit: "December 18, 2025 - 9 Month Well Child Visit",
  upcomingActions: ["11-month well child visit scheduled", "Continue routine immunizations"],
};

// Patient summary for Alex Wang - AFTER the Jan 20 visit (cardiology referral recommended)
const postVisitSummary = {
  overview: "11-month-old male with history of small muscular ventricular septal defect (VSD) detected at birth. Cardiac monitoring ongoing with cardiology follow-up recommended.",
  keyConditions: [
    { condition: "Ventricular Septal Defect (VSD)", status: "Active", notes: "Small muscular VSD, hemodynamically stable" },
    { condition: "Patent Ductus Arteriosus (PDA)", status: "Resolved", notes: "Closed spontaneously by 2 months" },
    { condition: "Patent Foramen Ovale (PFO)", status: "Resolved", notes: "Closed by 2 months" },
  ],
  allergies: "No known allergies",
  currentMedications: ["Vitamin D 400 IU daily", "Iron supplement 15mg daily"],
  immunizations: "Up to date for age",
  growthStatus: "Tracking at 50th percentile for weight and length. Growth velocity appropriate.",
  lastVisit: "January 20, 2026 - 11 Month Well Child Visit",
  upcomingActions: ["Cardiology referral for VSD evaluation", "12-month well child visit"],
};

// Mock transcript data for the visit
const visitTranscript = [
  { speaker: 'Dr. Kwan', timestamp: '00:00', text: "Good morning! How's Alex doing today?" },
  { speaker: 'Parent', timestamp: '00:05', text: "He's doing great overall. Very active, crawling everywhere, pulling up on furniture." },
  { speaker: 'Dr. Kwan', timestamp: '00:12', text: "That's wonderful to hear. Any concerns since your last visit?" },
  { speaker: 'Parent', timestamp: '00:18', text: "Not really. He's eating well, sleeping through the night most of the time. We were just wondering about the heart murmur follow-up." },
  { speaker: 'Dr. Kwan', timestamp: '00:28', text: "Yes, let's talk about that. I reviewed his echo from when he was a newborn. The good news is the PDA and PFO have closed. The small muscular VSD is still present but hasn't caused any issues." },
  { speaker: 'Parent', timestamp: '00:42', text: "Is that something we need to worry about?" },
  { speaker: 'Dr. Kwan', timestamp: '00:45', text: "Small muscular VSDs often close on their own, and Alex has been doing really well. He's growing appropriately, no signs of heart failure, good activity level. But given he's approaching his first birthday, I'd like to get a cardiology consult just to have a specialist take a look and give us their recommendations for ongoing monitoring." },
  { speaker: 'Parent', timestamp: '01:02', text: "That makes sense. Should we be limiting his activity at all?" },
  { speaker: 'Dr. Kwan', timestamp: '01:08', text: "Not at all. Let him play and explore as much as he wants. If the VSD were causing problems, we'd see symptoms like poor feeding, excessive sweating, or failure to thrive - and Alex has none of those." },
  { speaker: 'Parent', timestamp: '01:20', text: "That's reassuring. His older sister had some ear infections around this age - should we watch for that?" },
  { speaker: 'Dr. Kwan', timestamp: '01:28', text: "Good question. His ears look clear today. Just watch for tugging at ears, fever, or fussiness. Any changes in appetite or sleep?" },
  { speaker: 'Parent', timestamp: '01:38', text: "He's been eating more table foods now. We started some soft finger foods and he loves them." },
  { speaker: 'Dr. Kwan', timestamp: '01:45', text: "Perfect. At this age, you can offer a variety of soft foods. Continue with the vitamin D and iron supplements. Any words yet?" },
  { speaker: 'Parent', timestamp: '01:55', text: "He says 'mama' and 'dada' and tries to imitate sounds we make." },
  { speaker: 'Dr. Kwan', timestamp: '02:02', text: "Excellent. That's right on track developmentally. Let me do my examination now." },
  { speaker: 'Dr. Kwan', timestamp: '03:15', text: "Everything looks great. Heart sounds good - I can hear the murmur but it's soft and hasn't changed. Lungs are clear, abdomen is soft, good muscle tone, and he's hitting all his milestones." },
  { speaker: 'Parent', timestamp: '03:28', text: "Thank you, doctor. When should we schedule the cardiology appointment?" },
  { speaker: 'Dr. Kwan', timestamp: '03:32', text: "I'll put in the referral today and they should contact you within a week to schedule. It's not urgent, so within the next month or two is fine. Any other questions?" },
  { speaker: 'Parent', timestamp: '03:42', text: "I think that covers everything. Thank you!" },
  { speaker: 'Dr. Kwan', timestamp: '03:45', text: "You're welcome. Alex is doing wonderfully. I'll see you back for his 12-month visit. Take care!" },
];

export default function FreedPage() {
  const [activeTab, setActiveTab] = useState<Tab>('note');
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    subjective: true,
    objective: true,
    assessment: true,
    plan: true,
  });
  const [showReferralBuilder, setShowReferralBuilder] = useState(false);
  const [referralLetter, setReferralLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedItems, setSelectedItems] = useState({
    soapNotes: ['soap-001', 'soap-002', 'soap-003'],
    labs: ['lab-003'],
    imaging: ['img-001'],
  });
  const [specialistNotes, setSpecialistNotes] = useState('');
  const [referralStatus, setReferralStatus] = useState<'draft' | 'ready' | 'sent'>('draft');
  const [notesGenerated, setNotesGeneratedState] = useState(false);
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [referralBannerDismissed, setReferralBannerDismissed] = useState(false);
  const [isEditingLetter, setIsEditingLetter] = useState(false);
  const [editedLetter, setEditedLetter] = useState('');
  const [sentAt, setSentAt] = useState<string | null>(null);
  const [promoCardDismissed, setPromoCardDismissed] = useState(false);

  // Reusable component for referral sent status
  const ReferralSentStatus = ({ className = '' }: { className?: string }) => (
    <div className={`flex items-center gap-2 text-green-600 text-sm font-medium ${className}`}>
      <CheckCircle size={16} />
      Sent{sentAt && ` as of ${sentAt}`}
    </div>
  );

  // Wrapper to persist notesGenerated to localStorage
  const setNotesGenerated = (value: boolean) => {
    setNotesGeneratedState(value);
    persistNotesGenerated(value);
  };

  const recentNote = getMostRecentSOAPNote();
  const showReferralSuggestion = hasPendingReferral() && !showReferralBuilder && referralStatus !== 'sent' && notesGenerated;

  // Load saved state on mount
  useEffect(() => {
    // Load notesGenerated state
    const savedNotesGenerated = getNotesGenerated();
    setNotesGeneratedState(savedNotesGenerated);

    const currentReferral = getCurrentReferral();
    if (currentReferral) {
      setReferralLetter(currentReferral.referralLetter);
      setSelectedItems({
        soapNotes: currentReferral.selectedSOAPNotes,
        labs: currentReferral.selectedLabs,
        imaging: currentReferral.selectedImaging,
      });
      setSpecialistNotes(currentReferral.specialistNotes);
      setReferralStatus(currentReferral.status === 'sent' ? 'sent' : currentReferral.status === 'ready' ? 'ready' : 'draft');
      if (currentReferral.referralLetter) {
        setShowReferralBuilder(true);
        setActiveTab('referral');
      }
    }
  }, []);

  // Listen for demo reset event
  useEffect(() => {
    const handleDemoReset = () => {
      setActiveTab('note');
      setShowReferralBuilder(false);
      setReferralLetter('');
      setIsGenerating(false);
      setSelectedItems({
        soapNotes: ['soap-001', 'soap-002', 'soap-003'],
        labs: ['lab-003'],
        imaging: ['img-001'],
      });
      setSpecialistNotes('');
      setReferralStatus('draft');
      setNotesGenerated(false);
      setIsGeneratingNotes(false);
      setReferralBannerDismissed(false);
      setIsEditingLetter(false);
      setEditedLetter('');
      setPromoCardDismissed(false);
    };

    window.addEventListener('demo-reset', handleDemoReset);
    return () => window.removeEventListener('demo-reset', handleDemoReset);
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const generateNotes = async () => {
    setIsGeneratingNotes(true);
    // Simulate AI generating notes
    await new Promise(resolve => setTimeout(resolve, 2000));
    setNotesGenerated(true);
    setIsGeneratingNotes(false);
  };

  // Edit letter functions
  const handleEditLetter = () => {
    setEditedLetter(referralLetter);
    setIsEditingLetter(true);
  };

  const handleSaveLetter = () => {
    setReferralLetter(editedLetter);
    updateCurrentReferral({ referralLetter: editedLetter });
    setIsEditingLetter(false);
  };

  const handleCancelEdit = () => {
    setEditedLetter('');
    setIsEditingLetter(false);
  };

  // Use the appropriate summary based on whether notes have been generated
  const patientSummary = notesGenerated ? postVisitSummary : preVisitSummary;

  const generateReferralLetter = async () => {
    setIsGenerating(true);
    setShowReferralBuilder(true);
    setActiveTab('referral');

    // Create or update referral in state
    const currentReferral = getCurrentReferral();
    if (!currentReferral) {
      createReferral('Cardiology', patientData.id);
    }

    try {
      const response = await fetch('/api/generate-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientInfo: {
            firstName: patientData.firstName,
            lastName: patientData.lastName,
            dateOfBirth: patientData.dateOfBirth,
            age: patientData.age,
            sex: patientData.sex,
          },
          providerInfo: providerData,
          soapNotes: getRecentSOAPNotes(3),
          specialty: 'Cardiology',
          relevantImaging: patientData.imagingResults.filter(img =>
            selectedItems.imaging.includes(img.id)
          ),
          relevantLabs: patientData.labResults.filter(lab =>
            selectedItems.labs.includes(lab.id)
          ),
          medications: patientData.medications.filter(m => m.active),
        }),
      });

      const data = await response.json();
      setReferralLetter(data.letter);
      updateCurrentReferral({
        referralLetter: data.letter,
        selectedSOAPNotes: selectedItems.soapNotes,
        selectedLabs: selectedItems.labs,
        selectedImaging: selectedItems.imaging,
        status: 'in_progress',
      });
    } catch (error) {
      console.error('Error generating referral:', error);
      setReferralLetter('Error generating referral letter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleItemSelection = (category: 'soapNotes' | 'labs' | 'imaging', id: string) => {
    setSelectedItems(prev => {
      const current = prev[category];
      const updated = current.includes(id)
        ? current.filter(i => i !== id)
        : [...current, id];
      return { ...prev, [category]: updated };
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let yPos = 20;

    // Helper function to add text with word wrap
    const addWrappedText = (text: string, fontSize: number, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line: string) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, margin, yPos);
        yPos += fontSize * 0.5;
      });
      yPos += 5;
    };

    // Letterhead
    addWrappedText(providerData.practice.name, 14, true);
    addWrappedText(providerData.practice.address, 10);
    addWrappedText(`${providerData.practice.city}, ${providerData.practice.state} ${providerData.practice.zip}`, 10);
    addWrappedText(`Phone: ${providerData.practice.phone} | Fax: ${providerData.practice.fax}`, 10);
    yPos += 5;

    // Horizontal line
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // Title
    addWrappedText('REFERRAL PACKET', 16, true);
    addWrappedText(`Patient: ${patientData.firstName} ${patientData.lastName}`, 12, true);
    addWrappedText(`DOB: ${patientData.dateOfBirth} | MRN: ${patientData.mrn}`, 10);
    yPos += 10;

    // Referral Letter
    addWrappedText('REFERRAL LETTER', 14, true);
    addWrappedText(referralLetter, 10);
    yPos += 10;

    // Selected SOAP Notes
    if (selectedItems.soapNotes.length > 0) {
      addWrappedText('CLINICAL NOTES', 14, true);
      patientData.soapNotes
        .filter(note => selectedItems.soapNotes.includes(note.id))
        .forEach(note => {
          addWrappedText(`${note.visitType} - ${note.date}`, 11, true);
          addWrappedText(`Assessment: ${note.assessment}`, 10);
          addWrappedText(`Plan: ${note.plan}`, 10);
          yPos += 5;
        });
    }

    // Selected Labs
    if (selectedItems.labs.length > 0) {
      addWrappedText('LAB RESULTS', 14, true);
      patientData.labResults
        .filter(lab => selectedItems.labs.includes(lab.id))
        .forEach(lab => {
          addWrappedText(`${lab.name} - ${lab.date}`, 11, true);
          lab.results.forEach(result => {
            addWrappedText(`  ${result.test}: ${result.value} ${result.unit} (Ref: ${result.referenceRange})`, 10);
          });
          yPos += 5;
        });
    }

    // Selected Imaging
    if (selectedItems.imaging.length > 0) {
      addWrappedText('IMAGING RESULTS', 14, true);
      patientData.imagingResults
        .filter(img => selectedItems.imaging.includes(img.id))
        .forEach(img => {
          addWrappedText(`${img.type} - ${img.date}`, 11, true);
          addWrappedText(`Indication: ${img.indication}`, 10);
          addWrappedText(`Impression: ${img.impression}`, 10);
          yPos += 5;
        });
    }

    // Current Medications
    addWrappedText('CURRENT MEDICATIONS', 14, true);
    patientData.medications.filter(m => m.active).forEach(med => {
      addWrappedText(`• ${med.name} ${med.dosage} - ${med.frequency}`, 10);
    });

    return doc;
  };

  const handleDownload = () => {
    const doc = generatePDF();
    doc.save(`Referral_${patientData.lastName}_${patientData.firstName}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleEmail = () => {
    // First download the PDF
    handleDownload();

    // Then open email client
    const subject = encodeURIComponent(`Referral for ${patientData.firstName} ${patientData.lastName} - Pediatric Cardiology`);
    const body = encodeURIComponent(`Dear Pediatric Cardiology Team,

Please find attached the referral packet for ${patientData.firstName} ${patientData.lastName} (DOB: ${patientData.dateOfBirth}).

Reason for referral: Evaluation of ventricular septal defect (VSD) identified on echocardiogram.

Please contact our office if you have any questions.

${providerData.practice.name}
${providerData.practice.address}
${providerData.practice.city}, ${providerData.practice.state} ${providerData.practice.zip}
Phone: ${providerData.practice.phone}
Fax: ${providerData.practice.fax}

Best regards,
${providerData.name}, ${providerData.credentials}
`);

    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handlePrint = () => {
    const doc = generatePDF();
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  };

  const handleMarkComplete = () => {
    setReferralStatus('sent');
    setSentAt(new Date().toLocaleString());
    completeReferral();
  };

  return (
    <div className="freed-container">
      {/* Narrow screen message */}
      <div className="min-[670px]:hidden flex items-center justify-center h-full bg-gray-100 p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="text-purple-600" size={32} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Wider Screen Required</h2>
          <p className="text-gray-600">To view this demo, please use a device with a wider screen.</p>
        </div>
      </div>

      {/* Main app - hidden on narrow screens */}
      <div className="hidden min-[670px]:flex h-full">
      {/* Sidebar */}
      <div className="freed-sidebar flex flex-col">
        <div className="p-4 border-b border-white/10">
          <Image
            src="/freed-logo-white.svg"
            alt="Freed"
            width={100}
            height={24}
            className="opacity-90"
          />
        </div>

        <div className="p-3">
          <button className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium">
            <Plus size={16} />
            New visit
          </button>
        </div>

        <div className="px-3 py-2">
          <input
            type="text"
            placeholder="Search patient name..."
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm placeholder-white/50 focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="flex-1 mt-2 overflow-y-auto">
          <div className="px-3 pb-2">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Recent Visits</span>
          </div>
          <div className="space-y-1 px-2">
            {visitPreviews.map((visit) => (
              <div
                key={visit.id}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  visit.isActive
                    ? 'bg-purple-600/30 border border-purple-500/50'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`font-medium text-sm ${visit.isActive ? 'text-white' : 'text-white/90'}`}>
                    {visit.patientName}
                  </span>
                  <span className="text-xs text-white/50 whitespace-nowrap">{visit.visitDate}</span>
                </div>
                <div className="text-xs text-white/60 mt-1">{visit.visitType}</div>
                {(() => {
                  // Filter out Referral label for Alex's visit if notes aren't generated
                  const visibleLabels = visit.id === 'visit-001' && !notesGenerated
                    ? visit.labels.filter(l => l.text !== 'Referral')
                    : visit.labels;
                  return visibleLabels.length > 0 && (
                    <div className="flex gap-1.5 mt-2">
                      {visibleLabels.map((label, idx) => (
                        <span
                          key={idx}
                          className={`${label.color} text-white text-[10px] font-semibold px-2 py-0.5 rounded-full`}
                        >
                          {label.text}
                        </span>
                      ))}
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-auto flex-shrink-0">
          {/* Upgrade Card - shown after referral packet is generated */}
          {showReferralBuilder && !promoCardDismissed && (
            <div className="relative mx-3 mb-3 p-3 bg-gradient-to-br from-purple-500/40 to-purple-600/50 border border-purple-400/60 rounded-lg animate-slide-up">
              <button
                onClick={() => setPromoCardDismissed(true)}
                className="absolute top-2 right-2 p-1 text-white/50 hover:text-white/90 transition-colors"
              >
                <X size={14} />
              </button>
              <p className="text-white/90 text-sm leading-relaxed mb-3 pr-4">
                You can generate one referral packet a week on Core. Upgrade to Premier for unlimited referrals.
              </p>
              <button className="w-full bg-white text-purple-700 hover:bg-purple-50 py-2 px-3 rounded-lg text-sm font-semibold transition-colors">
                Get unlimited referrals
              </button>
            </div>
          )}

          <div className="border-t border-white/10">
            <div className="freed-sidebar-item">
              <Settings size={18} />
              <span>Settings</span>
            </div>
            <div className="freed-sidebar-item">
              <HelpCircle size={18} />
              <span>Help</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold text-lg">{patientData.firstName} {patientData.lastName}</h2>
            <span className="text-sm text-gray-500">{patientData.age} • {patientData.sex} • Jan 20, 2026</span>
          </div>
          <NavigationButton />
        </div>

        {/* Tabs */}
        <div className="bg-white border-b px-6 py-2 flex items-center gap-2">
          <button
            className={`freed-tab ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            <User size={14} className="inline mr-2" />
            Patient Summary
          </button>
          <button
            className={`freed-tab ${activeTab === 'note' ? 'active' : ''}`}
            onClick={() => setActiveTab('note')}
          >
            <FileText size={14} className="inline mr-2" />
            Note
          </button>
          <button
            className={`freed-tab ${activeTab === 'transcript' ? 'active' : ''}`}
            onClick={() => setActiveTab('transcript')}
          >
            <Mic size={14} className="inline mr-2" />
            Transcript
          </button>
          {showReferralBuilder && (
            <button
              className={`freed-tab ${activeTab === 'referral' ? 'active' : ''} flex items-center gap-2`}
              onClick={() => setActiveTab('referral')}
            >
              <ClipboardList size={14} />
              Referral Packet
              {referralStatus === 'sent' && <Check size={14} className="text-green-600" />}
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className={`freed-main ${activeTab === 'referral' ? '!pt-0' : ''}`}>
          {/* Patient Summary Tab */}
          {activeTab === 'summary' && (
            <div className="grid grid-cols-1 min-[1200px]:grid-cols-2 gap-6 items-start">
              {/* Left column - Patient Summary */}
              <div>
                <div className="freed-card mb-4">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Heart className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Overview</h3>
                      <p className="text-gray-600 text-sm mt-1">{patientSummary.overview}</p>
                    </div>
                  </div>
                </div>

                <div className="freed-card mb-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Key Conditions</h3>
                  <div className="space-y-3">
                    {patientSummary.keyConditions.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        {item.status === 'Active' ? (
                          <AlertCircle className="text-amber-500 mt-0.5" size={18} />
                        ) : (
                          <CheckCircle className="text-green-500 mt-0.5" size={18} />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{item.condition}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              item.status === 'Active' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="freed-card">
                    <h3 className="font-semibold text-gray-900 mb-2">Allergies</h3>
                    <p className="text-gray-600 text-sm">{patientSummary.allergies}</p>
                  </div>
                  <div className="freed-card">
                    <h3 className="font-semibold text-gray-900 mb-2">Immunizations</h3>
                    <p className="text-gray-600 text-sm">{patientSummary.immunizations}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="freed-card">
                    <h3 className="font-semibold text-gray-900 mb-2">Current Medications</h3>
                    <ul className="space-y-1">
                      {patientSummary.currentMedications.map((med, idx) => (
                        <li key={idx} className="text-gray-600 text-sm">• {med}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="freed-card">
                    <h3 className="font-semibold text-gray-900 mb-2">Growth Status</h3>
                    <p className="text-gray-600 text-sm">{patientSummary.growthStatus}</p>
                  </div>
                </div>

                <div className="freed-card">
                  <h3 className="font-semibold text-gray-900 mb-2">Upcoming Actions</h3>
                  <ul className="space-y-1">
                    {patientSummary.upcomingActions.map((action, idx) => (
                      <li key={idx} className="text-gray-600 text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right column - Post-visit Tasks (only shown when notes are generated) */}
              {notesGenerated ? (
                <div>
                  <div className="freed-card">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <ClipboardList size={18} className="text-purple-600" />
                      Post-visit Tasks
                    </h3>
                    <div className="space-y-3">
                      <div className={`p-3 border rounded-lg ${referralStatus === 'sent' ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${referralStatus === 'sent' ? 'border-green-500 bg-green-500' : 'border-amber-400'}`}>
                            {referralStatus === 'sent' && <Check size={14} strokeWidth={3} className="text-white" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">Cardiology Referral</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Refer to Pediatric Cardiology for VSD evaluation and monitoring
                            </p>
                            {referralStatus !== 'sent' && !showReferralBuilder && (
                              <button
                                onClick={generateReferralLetter}
                                className="mt-3 w-full bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                              >
                                <Sparkles size={16} />
                                Generate Referral Packet
                              </button>
                            )}
                            {showReferralBuilder && referralStatus !== 'sent' && (
                              <button
                                onClick={() => setActiveTab('referral')}
                                className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                              >
                                View Referral Packet
                              </button>
                            )}
                            {referralStatus === 'sent' && (
                              <ReferralSentStatus className="mt-3" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="freed-card bg-gray-50 border-dashed border-2 border-gray-200">
                    <h3 className="font-semibold text-gray-400 mb-4 flex items-center gap-2">
                      <ClipboardList size={18} />
                      Post-visit Tasks
                    </h3>
                    <p className="text-sm text-gray-400 text-center py-4">
                      Tasks will appear here after visit notes are generated
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Transcript Tab */}
          {activeTab === 'transcript' && (
            <div className="max-w-4xl">
              <div className="freed-card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Visit Transcript</h3>
                    <p className="text-sm text-gray-500">January 20, 2026 • 11 Month Well Child Visit</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mic size={14} />
                    <span>3:48 duration</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {visitTranscript.map((entry, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex-shrink-0 w-16 text-right">
                        <span className="text-xs text-gray-400 font-mono">{entry.timestamp}</span>
                      </div>
                      <div className="flex-1">
                        <span className={`text-sm font-medium ${
                          entry.speaker === 'Dr. Kwan' ? 'text-purple-600' : 'text-blue-600'
                        }`}>
                          {entry.speaker}
                        </span>
                        <p className="text-gray-700 mt-0.5">{entry.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Note Tab */}
          {activeTab === 'note' && (
            <>
              {/* Empty state when notes haven't been generated */}
              {!notesGenerated && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FileText className="text-purple-600" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No notes yet</h3>
                    <p className="text-gray-600 mb-6">
                      We are mimicking the process where Freed generates the SOAP notes from the visit transcript.
                    </p>
                    <button
                      onClick={generateNotes}
                      disabled={isGeneratingNotes}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                      {isGeneratingNotes ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Generating notes...
                        </>
                      ) : (
                        <>
                          <Sparkles size={20} />
                          Generate AI Notes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Referral Suggestion Card */}
              {notesGenerated && showReferralSuggestion && !referralBannerDismissed && (
                <div className="referral-suggestion relative">
                  <button
                    onClick={() => setReferralBannerDismissed(true)}
                    className="absolute top-2 right-2 p-2 hover:bg-white/50 rounded-lg"
                  >
                    <X size={18} className="text-gray-400" />
                  </button>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 pr-10">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0 hidden md:block">
                        <Sparkles className="text-amber-600" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="referral-badge">AI Suggested</span>
                          <span className="font-semibold text-gray-900">Referral packet needed</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Based on this visit note, it looks like you need to refer this patient to a{' '}
                          <strong>Pediatric Cardiologist</strong> for VSD evaluation.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                      <button
                        onClick={generateReferralLetter}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap"
                      >
                        Create Referral Packet
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Visit Info - only show when notes are generated */}
              {notesGenerated && (
              <div className="freed-card mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Calendar size={14} />
                      {recentNote.date}
                    </div>
                    <h3 className="font-semibold text-lg">{recentNote.visitType}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <User size={14} />
                      {recentNote.provider}
                    </div>
                  </div>
                </div>

                {/* Visit Summary */}
                <div className="soap-section">
                  <button
                    className="soap-section-header w-full flex items-center justify-between hover:bg-gray-50 p-2 -m-2 rounded-lg"
                    onClick={() => toggleSection('summary')}
                  >
                    <span className="flex items-center gap-2">
                      {expandedSections.summary ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      Visit Summary
                    </span>
                  </button>
                  {expandedSections.summary && (
                    <div className="soap-section-content mt-2 bg-gray-50 p-4 rounded-lg">
                      {`${patientData.firstName}, an ${patientData.age} old ${patientData.sex.toLowerCase()}, presented for a routine well-child visit. A Grade II/VI systolic heart murmur was newly appreciated on examination. Subsequent echocardiogram revealed a small membranous ventricular septal defect (VSD) with left-to-right shunt. The patient is otherwise healthy with normal growth and development. Referral to pediatric cardiology has been initiated for further evaluation and monitoring.`}
                    </div>
                  )}
                </div>

                {/* Subjective */}
                <div className="soap-section">
                  <button
                    className="soap-section-header w-full flex items-center hover:bg-gray-50 p-2 -m-2 rounded-lg"
                    onClick={() => toggleSection('subjective')}
                  >
                    <span className="flex items-center gap-2">
                      {expandedSections.subjective ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      Subjective
                    </span>
                  </button>
                  {expandedSections.subjective && (
                    <div className="soap-section-content mt-2">
                      <p className="font-medium text-gray-700 mb-2">Chief Complaint</p>
                      <p className="mb-4">{recentNote.chiefComplaint}</p>
                      <p className="font-medium text-gray-700 mb-2">History of Present Illness</p>
                      <p>{recentNote.subjective}</p>
                    </div>
                  )}
                </div>

                {/* Objective */}
                <div className="soap-section">
                  <button
                    className="soap-section-header w-full flex items-center hover:bg-gray-50 p-2 -m-2 rounded-lg"
                    onClick={() => toggleSection('objective')}
                  >
                    <span className="flex items-center gap-2">
                      {expandedSections.objective ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      Objective
                    </span>
                  </button>
                  {expandedSections.objective && (
                    <div className="soap-section-content mt-2">
                      <pre className="whitespace-pre-wrap font-sans">{recentNote.objective}</pre>
                    </div>
                  )}
                </div>

                {/* Assessment */}
                <div className="soap-section">
                  <button
                    className="soap-section-header w-full flex items-center hover:bg-gray-50 p-2 -m-2 rounded-lg"
                    onClick={() => toggleSection('assessment')}
                  >
                    <span className="flex items-center gap-2">
                      {expandedSections.assessment ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      Assessment
                    </span>
                  </button>
                  {expandedSections.assessment && (
                    <div className="soap-section-content mt-2">
                      <pre className="whitespace-pre-wrap font-sans">{recentNote.assessment}</pre>
                      {recentNote.icd10Codes && (
                        <div className="mt-4">
                          <p className="font-medium text-gray-700 mb-2">ICD-10 Codes</p>
                          <div className="flex flex-wrap gap-2">
                            {recentNote.icd10Codes.map(code => (
                              <span key={code.code} className="bg-gray-100 px-2 py-1 rounded text-sm">
                                {code.code}: {code.description}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Plan */}
                <div className="soap-section">
                  <button
                    className="soap-section-header w-full flex items-center hover:bg-gray-50 p-2 -m-2 rounded-lg"
                    onClick={() => toggleSection('plan')}
                  >
                    <span className="flex items-center gap-2">
                      {expandedSections.plan ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      Plan
                    </span>
                  </button>
                  {expandedSections.plan && (
                    <div className="soap-section-content mt-2">
                      <pre className="whitespace-pre-wrap font-sans">{recentNote.plan}</pre>
                      {/* Generate Referral Packet button */}
                      {referralStatus !== 'sent' && !showReferralBuilder && (
                        <button
                          onClick={generateReferralLetter}
                          className="mt-4 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                        >
                          <Sparkles size={16} />
                          Generate Referral Packet
                        </button>
                      )}
                      {showReferralBuilder && referralStatus !== 'sent' && (
                        <button
                          onClick={() => setActiveTab('referral')}
                          className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                        >
                          <ClipboardList size={16} />
                          View Referral Packet
                        </button>
                      )}
                      {referralStatus === 'sent' && (
                        <ReferralSentStatus className="mt-4" />
                      )}
                    </div>
                  )}
                </div>
              </div>
              )}
            </>
          )}

          {activeTab === 'referral' && (
            <div className="space-y-4">
              {/* Sticky Action Buttons */}
              <div className="sticky top-0 z-10 bg-white -mx-6 px-6 py-3 border-b border-gray-200 mb-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleDownload}
                    className="freed-btn-secondary flex items-center gap-2"
                    disabled={!referralLetter}
                  >
                    <Download size={16} />
                    Download PDF
                  </button>
                  <button
                    onClick={handleEmail}
                    className="freed-btn-secondary flex items-center gap-2"
                    disabled={!referralLetter}
                  >
                    <Mail size={16} />
                    Email
                  </button>
                  <button
                    onClick={handlePrint}
                    className="freed-btn-secondary flex items-center gap-2"
                    disabled={!referralLetter}
                  >
                    <Printer size={16} />
                    Print
                  </button>
                  {referralStatus !== 'sent' ? (
                    <button
                      onClick={handleMarkComplete}
                      className="freed-btn-primary flex items-center gap-2 ml-auto"
                      disabled={!referralLetter}
                    >
                      <Check size={16} />
                      Mark as Sent
                    </button>
                  ) : (
                    <ReferralSentStatus className="ml-auto" />
                  )}
                </div>
              </div>

              {/* Referral Letter */}
              <div className="freed-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Sparkles className="text-purple-600" size={20} />
                    Referral Letter
                  </h3>
                  {referralStatus !== 'sent' && !isEditingLetter && (
                    <button
                      onClick={handleEditLetter}
                      className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>
                  )}
                  {isEditingLetter && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCancelEdit}
                        className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded border border-gray-300 hover:border-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveLetter}
                        className="text-sm text-white bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
                {isGenerating ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="spinner"></div>
                    <span className="ml-3 text-gray-500">Generating referral letter...</span>
                  </div>
                ) : isEditingLetter ? (
                  <textarea
                    value={editedLetter}
                    onChange={(e) => setEditedLetter(e.target.value)}
                    className="w-full h-96 p-4 rounded-lg border border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 font-sans text-sm leading-relaxed resize-y"
                    autoFocus
                  />
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {referralLetter}
                    </pre>
                  </div>
                )}
              </div>

              {/* Attachments Selection */}
              <div className="freed-card">
                <h3 className="font-semibold text-lg mb-4">Packet Contents</h3>

                {/* SOAP Notes */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <FileText size={16} />
                    Clinical Notes
                  </h4>
                  <div className="space-y-2">
                    {patientData.soapNotes.slice(0, 4).map(note => (
                      <div
                        key={note.id}
                        onClick={() => referralStatus !== 'sent' && toggleItemSelection('soapNotes', note.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedItems.soapNotes.includes(note.id)
                            ? 'border-purple-300 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`custom-checkbox ${selectedItems.soapNotes.includes(note.id) ? 'checked' : ''}`}>
                          {selectedItems.soapNotes.includes(note.id) && <Check size={12} className="text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{note.visitType}</div>
                          <div className="text-xs text-gray-500">{note.date} • {note.provider}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Labs */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Stethoscope size={16} />
                    Lab Results
                  </h4>
                  <div className="space-y-2">
                    {patientData.labResults.map(lab => (
                      <div
                        key={lab.id}
                        onClick={() => referralStatus !== 'sent' && toggleItemSelection('labs', lab.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedItems.labs.includes(lab.id)
                            ? 'border-purple-300 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`custom-checkbox ${selectedItems.labs.includes(lab.id) ? 'checked' : ''}`}>
                          {selectedItems.labs.includes(lab.id) && <Check size={12} className="text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{lab.name}</div>
                          <div className="text-xs text-gray-500">{lab.date}</div>
                        </div>
                        <span className={`ehr-status-badge ${lab.status}`}>{lab.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Imaging */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <FileText size={16} />
                    Imaging Results
                  </h4>
                  <div className="space-y-2">
                    {patientData.imagingResults.map(img => (
                      <div
                        key={img.id}
                        onClick={() => referralStatus !== 'sent' && toggleItemSelection('imaging', img.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedItems.imaging.includes(img.id)
                            ? 'border-purple-300 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`custom-checkbox ${selectedItems.imaging.includes(img.id) ? 'checked' : ''}`}>
                          {selectedItems.imaging.includes(img.id) && <Check size={12} className="text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{img.type}</div>
                          <div className="text-xs text-gray-500">{img.date} • {img.facility}</div>
                        </div>
                        {img.type === 'Echocardiogram' && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Recommended</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Medications - Always included */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Current Medications (always included)</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    {patientData.medications.filter(m => m.active).map(med => (
                      <div key={med.name} className="text-sm text-gray-600 mb-1">
                        • {med.name} {med.dosage} - {med.frequency}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
