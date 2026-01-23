'use client';

import { useState, useEffect } from 'react';
import { patientData, providerData, getMostRecentSOAPNote, getRecentSOAPNotes, hasPendingReferral } from '@/data/patient';
import NavigationButton from '@/components/shared/NavigationButton';
import {
  FileText,
  Plus,
  ChevronDown,
  ChevronRight,
  Copy,
  ThumbsUp,
  ThumbsDown,
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
} from 'lucide-react';
import { getState, updateCurrentReferral, createReferral, completeReferral, getCurrentReferral } from '@/lib/referralState';
import jsPDF from 'jspdf';

type Tab = 'note' | 'referral';

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

  const recentNote = getMostRecentSOAPNote();
  const showReferralSuggestion = hasPendingReferral() && !showReferralBuilder && referralStatus !== 'sent';

  // Load saved state on mount
  useEffect(() => {
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

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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
    completeReferral();
  };

  return (
    <div className="freed-container flex">
      {/* Sidebar */}
      <div className="freed-sidebar flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Sparkles className="text-purple-400" size={24} />
            <span>freed</span>
          </div>
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

        <nav className="flex-1 mt-2">
          <div className="freed-sidebar-item active">
            <Calendar size={18} />
            <span>Visits</span>
          </div>
          <div className="freed-sidebar-item">
            <FileText size={18} />
            <span>Templates</span>
          </div>
        </nav>

        <div className="mt-auto border-t border-white/10">
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold text-lg">{patientData.firstName} {patientData.lastName}</h2>
            <span className="text-sm text-gray-500">{patientData.age} • {patientData.sex}</span>
          </div>
          <NavigationButton />
        </div>

        {/* Tabs */}
        <div className="bg-white border-b px-6 py-2 flex items-center gap-2">
          <button
            className={`freed-tab ${activeTab === 'note' ? 'active' : ''}`}
            onClick={() => setActiveTab('note')}
          >
            <FileText size={14} className="inline mr-2" />
            Note
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
        <div className="freed-main overflow-auto">
          {activeTab === 'note' && (
            <>
              {/* Referral Suggestion Card */}
              {showReferralSuggestion && (
                <div className="referral-suggestion">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Sparkles className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="referral-badge">AI Suggested</span>
                          <span className="font-semibold text-gray-900">Referral packet needed</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Based on this visit note, it looks like you need to refer this patient to a{' '}
                          <strong>Pediatric Cardiologist</strong> for VSD evaluation.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={generateReferralLetter}
                        className="freed-btn-primary text-sm"
                      >
                        Create Referral Packet
                      </button>
                      <button className="p-2 hover:bg-white/50 rounded-lg">
                        <X size={18} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Visit Info */}
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
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Copy all">
                      <Copy size={18} className="text-gray-400" />
                    </button>
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
                    <div className="flex items-center gap-1">
                      <ThumbsUp size={14} className="text-gray-300 hover:text-green-500 cursor-pointer" />
                      <ThumbsDown size={14} className="text-gray-300 hover:text-red-500 cursor-pointer" />
                      <Copy size={14} className="text-gray-300 hover:text-gray-600 cursor-pointer ml-2" />
                    </div>
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
                    className="soap-section-header w-full flex items-center justify-between hover:bg-gray-50 p-2 -m-2 rounded-lg"
                    onClick={() => toggleSection('subjective')}
                  >
                    <span className="flex items-center gap-2">
                      {expandedSections.subjective ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      Subjective
                    </span>
                    <Copy size={14} className="text-gray-300 hover:text-gray-600 cursor-pointer" />
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
                    className="soap-section-header w-full flex items-center justify-between hover:bg-gray-50 p-2 -m-2 rounded-lg"
                    onClick={() => toggleSection('objective')}
                  >
                    <span className="flex items-center gap-2">
                      {expandedSections.objective ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      Objective
                    </span>
                    <Copy size={14} className="text-gray-300 hover:text-gray-600 cursor-pointer" />
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
                    className="soap-section-header w-full flex items-center justify-between hover:bg-gray-50 p-2 -m-2 rounded-lg"
                    onClick={() => toggleSection('assessment')}
                  >
                    <span className="flex items-center gap-2">
                      {expandedSections.assessment ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      Assessment
                    </span>
                    <Copy size={14} className="text-gray-300 hover:text-gray-600 cursor-pointer" />
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
                    className="soap-section-header w-full flex items-center justify-between hover:bg-gray-50 p-2 -m-2 rounded-lg"
                    onClick={() => toggleSection('plan')}
                  >
                    <span className="flex items-center gap-2">
                      {expandedSections.plan ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      Plan
                    </span>
                    <Copy size={14} className="text-gray-300 hover:text-gray-600 cursor-pointer" />
                  </button>
                  {expandedSections.plan && (
                    <div className="soap-section-content mt-2">
                      <pre className="whitespace-pre-wrap font-sans">{recentNote.plan}</pre>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'referral' && (
            <div className="space-y-4">
              {/* Referral Letter */}
              <div className="freed-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Sparkles className="text-purple-600" size={20} />
                    Referral Letter
                  </h3>
                  {referralStatus !== 'sent' && (
                    <button className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1">
                      <Edit3 size={14} />
                      Edit
                    </button>
                  )}
                </div>
                {isGenerating ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="spinner"></div>
                    <span className="ml-3 text-gray-500">Generating referral letter...</span>
                  </div>
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
                      <label
                        key={note.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedItems.soapNotes.includes(note.id)
                            ? 'border-purple-300 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedItems.soapNotes.includes(note.id)}
                          onChange={() => toggleItemSelection('soapNotes', note.id)}
                          className="sr-only"
                          disabled={referralStatus === 'sent'}
                        />
                        <div className={`custom-checkbox ${selectedItems.soapNotes.includes(note.id) ? 'checked' : ''}`}>
                          {selectedItems.soapNotes.includes(note.id) && <Check size={12} className="text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{note.visitType}</div>
                          <div className="text-xs text-gray-500">{note.date} • {note.provider}</div>
                        </div>
                      </label>
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
                      <label
                        key={lab.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedItems.labs.includes(lab.id)
                            ? 'border-purple-300 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedItems.labs.includes(lab.id)}
                          onChange={() => toggleItemSelection('labs', lab.id)}
                          className="sr-only"
                          disabled={referralStatus === 'sent'}
                        />
                        <div className={`custom-checkbox ${selectedItems.labs.includes(lab.id) ? 'checked' : ''}`}>
                          {selectedItems.labs.includes(lab.id) && <Check size={12} className="text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{lab.name}</div>
                          <div className="text-xs text-gray-500">{lab.date}</div>
                        </div>
                        <span className={`ehr-status-badge ${lab.status}`}>{lab.status}</span>
                      </label>
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
                      <label
                        key={img.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedItems.imaging.includes(img.id)
                            ? 'border-purple-300 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedItems.imaging.includes(img.id)}
                          onChange={() => toggleItemSelection('imaging', img.id)}
                          className="sr-only"
                          disabled={referralStatus === 'sent'}
                        />
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
                      </label>
                    ))}
                  </div>
                </div>

                {/* Current Medications - Always included */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-3">Current Medications (always included)</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    {patientData.medications.filter(m => m.active).map(med => (
                      <div key={med.name} className="text-sm text-gray-600 mb-1">
                        • {med.name} {med.dosage} - {med.frequency}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specialist Notes */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Notes for Finding a Specialist</h4>
                  <textarea
                    value={specialistNotes}
                    onChange={(e) => setSpecialistNotes(e.target.value)}
                    placeholder="E.g., Prefer a specialist near downtown, or specific provider recommendations..."
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none h-24 focus:outline-none focus:border-purple-400"
                    disabled={referralStatus === 'sent'}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="freed-card">
                {referralStatus === 'sent' ? (
                  <div className="flex items-center justify-center gap-2 text-green-600 py-4">
                    <Check size={24} />
                    <span className="font-medium">Referral packet sent</span>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-lg mb-4">Send Referral Packet</h3>
                    <div className="flex flex-wrap gap-3">
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
                    </div>
                    <div className="border-t mt-4 pt-4">
                      <button
                        onClick={handleMarkComplete}
                        className="freed-btn-primary flex items-center gap-2"
                        disabled={!referralLetter}
                      >
                        <Check size={16} />
                        Mark as Sent
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
