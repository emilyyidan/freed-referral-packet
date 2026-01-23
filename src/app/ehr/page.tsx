'use client';

import { useState } from 'react';
import { patientData } from '@/data/patient';
import NavigationButton from '@/components/shared/NavigationButton';
import {
  User,
  FileText,
  FlaskConical,
  ImageIcon,
  Pill,
  Activity,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Syringe,
} from 'lucide-react';

type EHRTab = 'summary' | 'visits' | 'labs' | 'imaging' | 'medications' | 'vitals' | 'immunizations';

export default function EHRPage() {
  const [activeTab, setActiveTab] = useState<EHRTab>('summary');
  const [expandedNotes, setExpandedNotes] = useState<string[]>(['soap-001']);

  const toggleNoteExpand = (id: string) => {
    setExpandedNotes(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="ehr-container">
      {/* Header */}
      <div className="ehr-header">
        <div className="flex items-center gap-4">
          <h1>MedChart EHR</h1>
          <span className="text-sm opacity-75">v4.2.1</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">Dr. Monica Kwan, MD</span>
          <NavigationButton />
        </div>
      </div>

      {/* Patient Banner */}
      <div className="ehr-patient-banner">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="text-blue-600" size={24} />
          </div>
          <div>
            <div className="label">Patient</div>
            <div className="value text-lg">{patientData.lastName}, {patientData.firstName}</div>
          </div>
        </div>
        <div>
          <div className="label">DOB</div>
          <div className="value">{formatDate(patientData.dateOfBirth)}</div>
        </div>
        <div>
          <div className="label">Age</div>
          <div className="value">{patientData.age}</div>
        </div>
        <div>
          <div className="label">Sex</div>
          <div className="value">{patientData.sex}</div>
        </div>
        <div>
          <div className="label">MRN</div>
          <div className="value">{patientData.mrn}</div>
        </div>
        <div>
          <div className="label">PCP</div>
          <div className="value">{patientData.primaryCareProvider}</div>
        </div>
        <div>
          <div className="label">Allergies</div>
          <div className="value">{patientData.allergies.join(', ')}</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="ehr-nav">
        <button
          className={`ehr-nav-item ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
        <button
          className={`ehr-nav-item ${activeTab === 'visits' ? 'active' : ''}`}
          onClick={() => setActiveTab('visits')}
        >
          Visit Notes
        </button>
        <button
          className={`ehr-nav-item ${activeTab === 'labs' ? 'active' : ''}`}
          onClick={() => setActiveTab('labs')}
        >
          Lab Results
        </button>
        <button
          className={`ehr-nav-item ${activeTab === 'imaging' ? 'active' : ''}`}
          onClick={() => setActiveTab('imaging')}
        >
          Imaging
        </button>
        <button
          className={`ehr-nav-item ${activeTab === 'medications' ? 'active' : ''}`}
          onClick={() => setActiveTab('medications')}
        >
          Medications
        </button>
        <button
          className={`ehr-nav-item ${activeTab === 'vitals' ? 'active' : ''}`}
          onClick={() => setActiveTab('vitals')}
        >
          Growth Chart
        </button>
        <button
          className={`ehr-nav-item ${activeTab === 'immunizations' ? 'active' : ''}`}
          onClick={() => setActiveTab('immunizations')}
        >
          Immunizations
        </button>
      </div>

      {/* Main Content */}
      <div className="ehr-main">
        {activeTab === 'summary' && (
          <div className="grid grid-cols-2 gap-4">
            {/* Active Issues */}
            <div className="ehr-card">
              <div className="ehr-card-header flex items-center gap-2">
                <AlertCircle size={16} />
                Active Issues
              </div>
              <div className="ehr-card-body">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <AlertCircle size={14} className="text-yellow-600" />
                    <span className="text-sm">Ventricular septal defect (VSD) - Q21.0</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded">
                    <Activity size={14} className="text-blue-600" />
                    <span className="text-sm">Mild right hydronephrosis (stable) - N13.30</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Vitals */}
            <div className="ehr-card">
              <div className="ehr-card-header flex items-center gap-2">
                <Activity size={16} />
                Recent Vitals ({formatDate(patientData.vitalsHistory[0].date)})
              </div>
              <div className="ehr-card-body">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Weight:</span>{' '}
                    <span className="font-medium">{patientData.vitalsHistory[0].weight.value} {patientData.vitalsHistory[0].weight.unit}</span>{' '}
                    <span className="text-gray-400">({patientData.vitalsHistory[0].weight.percentile}%ile)</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Length:</span>{' '}
                    <span className="font-medium">{patientData.vitalsHistory[0].height.value} {patientData.vitalsHistory[0].height.unit}</span>{' '}
                    <span className="text-gray-400">({patientData.vitalsHistory[0].height.percentile}%ile)</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Head Circ:</span>{' '}
                    <span className="font-medium">{patientData.vitalsHistory[0].headCircumference?.value} {patientData.vitalsHistory[0].headCircumference?.unit}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">HR:</span>{' '}
                    <span className="font-medium">{patientData.vitalsHistory[0].heartRate} bpm</span>
                  </div>
                  <div>
                    <span className="text-gray-500">RR:</span>{' '}
                    <span className="font-medium">{patientData.vitalsHistory[0].respiratoryRate}/min</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Temp:</span>{' '}
                    <span className="font-medium">{patientData.vitalsHistory[0].temperature?.value}°{patientData.vitalsHistory[0].temperature?.unit}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Medications */}
            <div className="ehr-card">
              <div className="ehr-card-header flex items-center gap-2">
                <Pill size={16} />
                Current Medications
              </div>
              <div className="ehr-card-body">
                <table className="ehr-table">
                  <thead>
                    <tr>
                      <th>Medication</th>
                      <th>Dosage</th>
                      <th>Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientData.medications.filter(m => m.active).map(med => (
                      <tr key={med.name}>
                        <td className="font-medium">{med.name}</td>
                        <td>{med.dosage}</td>
                        <td>{med.frequency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Lab Results */}
            <div className="ehr-card">
              <div className="ehr-card-header flex items-center gap-2">
                <FlaskConical size={16} />
                Recent Lab Results
              </div>
              <div className="ehr-card-body">
                <table className="ehr-table">
                  <thead>
                    <tr>
                      <th>Test</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientData.labResults.slice(0, 3).map(lab => (
                      <tr key={lab.id}>
                        <td className="font-medium">{lab.name}</td>
                        <td>{formatDate(lab.date)}</td>
                        <td><span className={`ehr-status-badge ${lab.status}`}>{lab.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Insurance Info */}
            <div className="ehr-card col-span-2">
              <div className="ehr-card-header">Insurance & Contact Information</div>
              <div className="ehr-card-body">
                <div className="grid grid-cols-4 gap-6 text-sm">
                  <div>
                    <div className="text-gray-500 text-xs uppercase mb-1">Insurance</div>
                    <div className="font-medium">{patientData.insuranceProvider}</div>
                    <div className="text-gray-500">{patientData.insuranceId}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs uppercase mb-1">Guardian</div>
                    <div className="font-medium">{patientData.guardian.name}</div>
                    <div className="text-gray-500">{patientData.guardian.relationship}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs uppercase mb-1">Contact</div>
                    <div>{patientData.guardian.phone}</div>
                    <div className="text-gray-500">{patientData.guardian.email}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs uppercase mb-1">Address</div>
                    <div>{patientData.address.street}</div>
                    <div className="text-gray-500">{patientData.address.city}, {patientData.address.state} {patientData.address.zip}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visits' && (
          <div className="space-y-3">
            {patientData.soapNotes.map(note => (
              <div key={note.id} className="ehr-card">
                <button
                  className="ehr-card-header w-full flex items-center justify-between cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleNoteExpand(note.id)}
                >
                  <div className="flex items-center gap-3">
                    {expandedNotes.includes(note.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <FileText size={16} />
                    <span>{note.visitType}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-normal text-gray-500">
                    <span>{formatDate(note.date)}</span>
                    <span>{note.provider}</span>
                  </div>
                </button>
                {expandedNotes.includes(note.id) && (
                  <div className="ehr-card-body space-y-4">
                    <div>
                      <h4 className="text-xs uppercase text-gray-500 font-semibold mb-1">Chief Complaint</h4>
                      <p className="text-sm">{note.chiefComplaint}</p>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase text-gray-500 font-semibold mb-1">Subjective</h4>
                      <p className="text-sm whitespace-pre-wrap">{note.subjective}</p>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase text-gray-500 font-semibold mb-1">Objective</h4>
                      <pre className="text-sm whitespace-pre-wrap font-sans">{note.objective}</pre>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase text-gray-500 font-semibold mb-1">Assessment</h4>
                      <p className="text-sm whitespace-pre-wrap">{note.assessment}</p>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase text-gray-500 font-semibold mb-1">Plan</h4>
                      <p className="text-sm whitespace-pre-wrap">{note.plan}</p>
                    </div>
                    {note.icd10Codes && (
                      <div>
                        <h4 className="text-xs uppercase text-gray-500 font-semibold mb-1">ICD-10 Codes</h4>
                        <div className="flex flex-wrap gap-2">
                          {note.icd10Codes.map(code => (
                            <span key={code.code} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {code.code} - {code.description}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'labs' && (
          <div className="space-y-4">
            {patientData.labResults.map(lab => (
              <div key={lab.id} className="ehr-card">
                <div className="ehr-card-header flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FlaskConical size={16} />
                    {lab.name}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`ehr-status-badge ${lab.status}`}>{lab.status}</span>
                    <span className="text-sm font-normal text-gray-500">{formatDate(lab.date)}</span>
                  </div>
                </div>
                <div className="ehr-card-body">
                  <table className="ehr-table">
                    <thead>
                      <tr>
                        <th>Test</th>
                        <th>Result</th>
                        <th>Unit</th>
                        <th>Reference Range</th>
                        <th>Flag</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lab.results.map(result => (
                        <tr key={result.test}>
                          <td className="font-medium">{result.test}</td>
                          <td>{result.value}</td>
                          <td>{result.unit}</td>
                          <td className="text-gray-500">{result.referenceRange}</td>
                          <td>
                            {result.flag && (
                              <span className={`ehr-status-badge ${result.flag === 'H' ? 'abnormal' : result.flag === 'C' ? 'critical' : 'abnormal'}`}>
                                {result.flag}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-3 text-sm text-gray-500">
                    Ordered by: {lab.orderedBy}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'imaging' && (
          <div className="space-y-4">
            {patientData.imagingResults.map(img => (
              <div key={img.id} className="ehr-card">
                <div className="ehr-card-header flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={16} />
                    {img.type}
                  </div>
                  <span className="text-sm font-normal text-gray-500">{formatDate(img.date)}</span>
                </div>
                <div className="ehr-card-body space-y-3">
                  <div>
                    <h4 className="text-xs uppercase text-gray-500 font-semibold mb-1">Indication</h4>
                    <p className="text-sm">{img.indication}</p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase text-gray-500 font-semibold mb-1">Findings</h4>
                    <p className="text-sm">{img.findings}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <h4 className="text-xs uppercase text-blue-700 font-semibold mb-1">Impression</h4>
                    <p className="text-sm text-blue-900">{img.impression}</p>
                  </div>
                  <div className="text-sm text-gray-500 flex justify-between">
                    <span>Performed by: {img.performedBy}</span>
                    <span>{img.facility}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="ehr-card">
            <div className="ehr-card-header flex items-center gap-2">
              <Pill size={16} />
              Medication List
            </div>
            <div className="ehr-card-body">
              <table className="ehr-table">
                <thead>
                  <tr>
                    <th>Medication</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Start Date</th>
                    <th>Prescribed By</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patientData.medications.map(med => (
                    <tr key={med.name}>
                      <td className="font-medium">{med.name}</td>
                      <td>{med.dosage}</td>
                      <td>{med.frequency}</td>
                      <td>{formatDate(med.startDate)}</td>
                      <td>{med.prescribedBy}</td>
                      <td>
                        <span className={`ehr-status-badge ${med.active ? 'normal' : 'abnormal'}`}>
                          {med.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'vitals' && (
          <div className="ehr-card">
            <div className="ehr-card-header flex items-center gap-2">
              <Activity size={16} />
              Growth Chart & Vitals History
            </div>
            <div className="ehr-card-body">
              {/* Placeholder for growth chart */}
              <div className="growth-chart mb-6">
                <div className="text-center">
                  <Activity size={32} className="mx-auto mb-2 opacity-50" />
                  <p>Growth chart visualization</p>
                  <p className="text-xs mt-1">Weight and length tracking over time</p>
                </div>
              </div>

              {/* Vitals table */}
              <table className="ehr-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Weight (kg)</th>
                    <th>Weight %ile</th>
                    <th>Length (cm)</th>
                    <th>Length %ile</th>
                    <th>Head Circ (cm)</th>
                    <th>HR (bpm)</th>
                    <th>Temp (°F)</th>
                  </tr>
                </thead>
                <tbody>
                  {patientData.vitalsHistory.map((vital, idx) => (
                    <tr key={idx}>
                      <td className="font-medium">{formatDate(vital.date)}</td>
                      <td>{vital.weight.value}</td>
                      <td>{vital.weight.percentile}%</td>
                      <td>{vital.height.value}</td>
                      <td>{vital.height.percentile}%</td>
                      <td>{vital.headCircumference?.value || '-'}</td>
                      <td>{vital.heartRate || '-'}</td>
                      <td>{vital.temperature?.value || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'immunizations' && (
          <div className="ehr-card">
            <div className="ehr-card-header flex items-center gap-2">
              <Syringe size={16} />
              Immunization Record
            </div>
            <div className="ehr-card-body">
              <table className="ehr-table">
                <thead>
                  <tr>
                    <th>Vaccine</th>
                    <th>Dates Administered</th>
                    <th>Doses</th>
                  </tr>
                </thead>
                <tbody>
                  {patientData.immunizations.map(imm => (
                    <tr key={imm.name}>
                      <td className="font-medium">{imm.name}</td>
                      <td>{imm.dates.map(d => formatDate(d)).join(', ')}</td>
                      <td>
                        <span className="ehr-status-badge normal">{imm.dates.length} dose{imm.dates.length > 1 ? 's' : ''}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800">
                  <strong>Immunization Status:</strong> Up to date for age. Next vaccines due at 12-month visit.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
