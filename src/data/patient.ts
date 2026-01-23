// Patient data for Alex Wang - 11 month old
// This data is shared between the mock EHR and Freed interfaces

export interface Vitals {
  date: string;
  weight: { value: number; unit: string; percentile: number };
  height: { value: number; unit: string; percentile: number };
  headCircumference?: { value: number; unit: string; percentile: number };
  heartRate?: number;
  respiratoryRate?: number;
  temperature?: { value: number; unit: string };
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  prescribedBy: string;
  active: boolean;
}

export interface LabResult {
  id: string;
  name: string;
  date: string;
  category: string;
  status: 'normal' | 'abnormal' | 'critical';
  results: {
    test: string;
    value: string;
    unit: string;
    referenceRange: string;
    flag?: 'H' | 'L' | 'C';
  }[];
  orderedBy: string;
  notes?: string;
}

export interface ImagingResult {
  id: string;
  type: string;
  date: string;
  indication: string;
  findings: string;
  impression: string;
  performedBy: string;
  facility: string;
}

export interface SOAPNote {
  id: string;
  date: string;
  visitType: string;
  provider: string;
  chiefComplaint: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  icd10Codes?: { code: string; description: string }[];
}

export interface Immunization {
  name: string;
  dates: string[];
}

export interface Provider {
  name: string;
  credentials: string;
  specialty: string;
  npi: string;
  practice: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    fax: string;
  };
}

// Primary Care Provider data
export const providerData: Provider = {
  name: 'Monica Kwan',
  credentials: 'MD',
  specialty: 'Pediatrics',
  npi: '1720212772',
  practice: {
    name: 'Golden Gate Pediatrics',
    address: '3838 California Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94118',
    phone: '(415) 555-1234',
    fax: '(415) 123-5555',
  },
};

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: string;
  sex: string;
  mrn: string;
  insuranceProvider: string;
  insuranceId: string;
  guardian: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  allergies: string[];
  primaryCareProvider: string;
  vitalsHistory: Vitals[];
  medications: Medication[];
  labResults: LabResult[];
  imagingResults: ImagingResult[];
  soapNotes: SOAPNote[];
  immunizations: Immunization[];
}

// Calculate age helper
const calculateAge = (dob: string): string => {
  const birthDate = new Date(dob);
  const today = new Date();
  const months = (today.getFullYear() - birthDate.getFullYear()) * 12 +
    (today.getMonth() - birthDate.getMonth());
  return `${months} months`;
};

export const patientData: Patient = {
  id: 'pt-001',
  firstName: 'Alex',
  lastName: 'Wang',
  dateOfBirth: '2025-02-21',
  age: '11 months',
  sex: 'Male',
  mrn: 'MRN-2025-0892',
  insuranceProvider: 'Cigna',
  insuranceId: '110238214',
  guardian: {
    name: 'James Wang',
    relationship: 'Father',
    phone: '(917) 555-1234',
    email: 'james.wang@email.com',
  },
  address: {
    street: '1000 Van Ness Ave',
    city: 'San Francisco',
    state: 'CA',
    zip: '94118',
  },
  allergies: ['None'],
  primaryCareProvider: 'Dr. Monica Kwan, MD',

  vitalsHistory: [
    {
      date: '2026-01-20',
      weight: { value: 9.8, unit: 'kg', percentile: 55 },
      height: { value: 74, unit: 'cm', percentile: 50 },
      headCircumference: { value: 46, unit: 'cm', percentile: 60 },
      heartRate: 128,
      respiratoryRate: 32,
      temperature: { value: 98.6, unit: 'F' },
    },
    {
      date: '2025-11-25',
      weight: { value: 9.5, unit: 'kg', percentile: 52 },
      height: { value: 73, unit: 'cm', percentile: 48 },
      headCircumference: { value: 45.5, unit: 'cm', percentile: 58 },
      heartRate: 125,
      respiratoryRate: 30,
      temperature: { value: 98.4, unit: 'F' },
    },
    {
      date: '2025-08-26',
      weight: { value: 8.0, unit: 'kg', percentile: 48 },
      height: { value: 68, unit: 'cm', percentile: 42 },
      headCircumference: { value: 44, unit: 'cm', percentile: 52 },
      heartRate: 132,
      respiratoryRate: 36,
      temperature: { value: 98.6, unit: 'F' },
    },
    {
      date: '2025-07-01',
      weight: { value: 7.0, unit: 'kg', percentile: 45 },
      height: { value: 65, unit: 'cm', percentile: 40 },
      headCircumference: { value: 43, unit: 'cm', percentile: 50 },
      heartRate: 135,
      respiratoryRate: 38,
      temperature: { value: 98.4, unit: 'F' },
    },
    {
      date: '2025-05-02',
      weight: { value: 5.8, unit: 'kg', percentile: 42 },
      height: { value: 59, unit: 'cm', percentile: 38 },
      headCircumference: { value: 40, unit: 'cm', percentile: 45 },
      heartRate: 140,
      respiratoryRate: 40,
      temperature: { value: 98.4, unit: 'F' },
    },
    {
      date: '2025-04-04',
      weight: { value: 5.0, unit: 'kg', percentile: 40 },
      height: { value: 56, unit: 'cm', percentile: 35 },
      headCircumference: { value: 38, unit: 'cm', percentile: 42 },
      heartRate: 145,
      respiratoryRate: 42,
      temperature: { value: 98.5, unit: 'F' },
    },
  ],

  medications: [
    {
      name: 'Vitamin D3 Drops',
      dosage: '400 IU',
      frequency: 'Once daily',
      startDate: '2025-02-20',
      prescribedBy: 'Dr. Monica Kwan, MD',
      active: true,
    },
    {
      name: 'Infant Multivitamin with Iron',
      dosage: '1 mL',
      frequency: 'Once daily',
      startDate: '2025-06-15',
      prescribedBy: 'Dr. Monica Kwan, MD',
      active: true,
    },
  ],

  labResults: [
    {
      id: 'lab-001',
      name: 'Complete Blood Count (CBC)',
      date: '2025-11-25',
      category: 'Hematology',
      status: 'normal',
      results: [
        { test: 'WBC', value: '9.5', unit: 'K/uL', referenceRange: '6.0-17.5' },
        { test: 'RBC', value: '4.5', unit: 'M/uL', referenceRange: '3.8-5.4' },
        { test: 'Hemoglobin', value: '11.8', unit: 'g/dL', referenceRange: '10.5-14.0' },
        { test: 'Hematocrit', value: '35', unit: '%', referenceRange: '32-42' },
        { test: 'Platelets', value: '285', unit: 'K/uL', referenceRange: '150-400' },
      ],
      orderedBy: 'Dr. Monica Kwan, MD',
    },
    {
      id: 'lab-004',
      name: 'Newborn Screening Labs',
      date: '2025-02-23',
      category: 'Newborn',
      status: 'normal',
      results: [
        { test: 'Blood Type', value: 'O', unit: 'Positive', referenceRange: 'N/A' },
        { test: 'Direct Coombs Test (DCT)', value: 'Negative', unit: '', referenceRange: 'Negative' },
        { test: 'Transcutaneous Bilirubin', value: '5.5', unit: 'mg/dL', referenceRange: '<12 (day 2-3)' },
      ],
      orderedBy: 'Dr. Carolyn Hume, MD',
      notes: 'Jaundice risk assessment: None. O Positive blood type.',
    },
    {
      id: 'lab-002',
      name: 'Lead Level',
      date: '2025-10-20',
      category: 'Toxicology',
      status: 'normal',
      results: [
        { test: 'Blood Lead Level', value: '1.2', unit: 'mcg/dL', referenceRange: '<3.5' },
      ],
      orderedBy: 'Dr. Monica Kwan, MD',
    },
    {
      id: 'lab-003',
      name: 'Metabolic Panel',
      date: '2026-01-20',
      category: 'Chemistry',
      status: 'normal',
      results: [
        { test: 'Glucose', value: '85', unit: 'mg/dL', referenceRange: '60-100' },
        { test: 'BUN', value: '12', unit: 'mg/dL', referenceRange: '5-18' },
        { test: 'Creatinine', value: '0.2', unit: 'mg/dL', referenceRange: '0.1-0.4' },
        { test: 'Sodium', value: '140', unit: 'mEq/L', referenceRange: '136-145' },
        { test: 'Potassium', value: '4.8', unit: 'mEq/L', referenceRange: '3.5-5.5' },
      ],
      orderedBy: 'Dr. Monica Kwan, MD',
    },
  ],

  imagingResults: [
    {
      id: 'img-001',
      type: 'Echocardiogram',
      date: '2026-01-20',
      indication: 'Follow-up of known muscular VSD; heart murmur on examination',
      findings: 'Small mid to apical muscular VSD with left-to-right shunt. Maximum velocity 3.2 m/sec, gradient 41 mmHg. PDA has closed (not visualized). PFO still present with minimal L-R shunt. Normal left and right ventricular size and function. No evidence of pulmonary hypertension. All valves normal.',
      impression: 'Small muscular VSD, stable from prior. PDA resolved. PFO persists. Recommend pediatric cardiology follow-up for ongoing monitoring.',
      performedBy: 'Dr. Robert Kim, MD - Pediatric Cardiology',
      facility: 'SF Children\'s Imaging Center',
    },
    {
      id: 'img-005',
      type: 'Echocardiogram (Newborn)',
      date: '2025-02-24',
      indication: 'Murmur detected on newborn examination',
      findings: `CONCLUSIONS: Small mid to apical muscular VSD. Small PDA (2.6mm). PFO. All shunts L-R. Otherwise normal echo.

VSD: Small muscular ventricular septum defect with left to right shunt. Maximum velocity 3.18 m/sec and gradient 40 mmHg.

PFO: Evidence of patent foramen ovale by color doppler with left to right shunting.

PDA: Small (2.6 mm) Patent Ductus Arteriosus present with left to right shunt.

RIGHT VENTRICLE: Normal cavity size, wall thickness, and systolic function. No evidence of pulmonary hypertension.

LEFT VENTRICLE: Normal cavity size, wall thickness, and systolic function.

All valves normal in structure and function. Coronary artery origins appear normal. No pericardial effusion.`,
      impression: 'Small mid to apical muscular VSD with L-R shunt. Small PDA. PFO. All shunts left-to-right. Otherwise normal newborn echocardiogram. Results discussed with Dr. Aicardi (Pediatric Cardiology).',
      performedBy: 'Dominic J Blurton, MD - Reading Physician',
      facility: 'California Pacific Medical Center - Van Ness',
    },
    {
      id: 'img-002',
      type: 'Hip Ultrasound',
      date: '2025-02-26',
      indication: 'Newborn screening - breech presentation at birth; ventricular septal defect (Q21.0)',
      findings: 'Bilateral hip joints demonstrate normal alpha angles (>60 degrees). Femoral heads are well-seated in acetabula. No evidence of developmental dysplasia.',
      impression: 'Normal bilateral hip ultrasound. No evidence of developmental dysplasia of the hip.',
      performedBy: 'Dr. Lisa Martinez, MD - Pediatric Radiology',
      facility: 'Golden Gate Pediatrics - One Daniel Burnham Court',
    },
    {
      id: 'img-003',
      type: 'Lumbosacral Spine Ultrasound',
      date: '2025-03-07',
      indication: 'Other symptoms and signs involving the musculoskeletal system (R29.898)',
      findings: 'Conus medullaris terminates at appropriate level (L1-L2). No evidence of tethered cord. Filum terminale appears normal in thickness. No intraspinal mass or lipoma identified. Normal vertebral body alignment.',
      impression: 'Normal lumbosacral spine ultrasound. No evidence of spinal dysraphism or tethered cord.',
      performedBy: 'Dr. Lisa Martinez, MD - Pediatric Radiology',
      facility: 'Golden Gate Pediatrics - 3838 California St',
    },
    {
      id: 'img-004',
      type: 'Kidney Ultrasound',
      date: '2025-05-20',
      indication: 'Prenatal hydronephrosis - follow-up',
      findings: 'Right kidney measures 5.2 cm, left kidney measures 5.0 cm. Mild right-sided hydronephrosis (SFU Grade 1) persists but stable compared to prior prenatal imaging. No stones or masses identified. Normal bladder.',
      impression: 'Stable mild right hydronephrosis. Recommend follow-up ultrasound in 6 months.',
      performedBy: 'Dr. Lisa Martinez, MD - Pediatric Radiology',
      facility: 'SF Children\'s Imaging Center',
    },
  ],

  soapNotes: [
    // Most recent visit - the one that triggers the referral
    {
      id: 'soap-001',
      date: '2026-01-20',
      visitType: '11-Month Well-Child Visit',
      provider: 'Dr. Monica Kwan, MD',
      chiefComplaint: 'Routine well-child examination',
      subjective: `Mother brings Alex in for his 11-month well-child visit. She reports he has been doing well overall. He is eating a variety of solid foods including purees and some soft finger foods. He is taking formula about 24 oz per day. Sleep is going well with about 11-12 hours at night and two naps during the day.

Developmentally, he is crawling well, pulling to stand, and cruising along furniture. He says "mama" and "dada" appropriately and babbles frequently. He waves bye-bye and plays peek-a-boo. He has good pincer grasp.

Mother notes that he occasionally seems to breathe faster when very active, but otherwise has had no respiratory concerns. No fevers, coughs, or illnesses since last visit. No concerns about hearing or vision.`,
      objective: `Vital Signs:
- Weight: 9.8 kg (55th percentile)
- Length: 74 cm (50th percentile)
- Head Circumference: 46 cm (60th percentile)
- Heart Rate: 128 bpm
- Respiratory Rate: 32/min
- Temperature: 98.6°F

General: Alert, active, well-appearing infant in no distress
HEENT: Anterior fontanelle soft and flat, approximately 2x2 cm. Eyes clear, red reflex present bilaterally. Ears - TMs clear bilaterally. Oropharynx clear, 6 teeth present.
Cardiovascular: Grade II/VI systolic murmur best heard at left lower sternal border. Regular rhythm. Normal S1, S2. No gallop or rub. Femoral pulses 2+ bilaterally.
Respiratory: Clear to auscultation bilaterally. No retractions or nasal flaring.
Abdomen: Soft, non-tender, no hepatosplenomegaly
GU: Normal male genitalia, testes descended bilaterally
Extremities: Full range of motion, no hip clicks
Skin: No rashes or lesions
Neuro: Age-appropriate tone and reflexes. Sitting independently, crawling, pulling to stand.`,
      assessment: `1. Healthy 11-month-old male presenting for well-child visit
2. New Grade II/VI systolic heart murmur - likely innocent but given new finding, echocardiogram was ordered and shows small membranous VSD with L-to-R shunt
3. Development appropriate for age
4. Growth appropriate, following curve`,
      plan: `1. Discussed echocardiogram results with mother - small VSD identified. Explained this is a common congenital heart defect that often closes on its own.
2. REFERRAL TO PEDIATRIC CARDIOLOGY for evaluation and ongoing monitoring of VSD. Discussed importance of cardiology follow-up to monitor for any changes.
3. Continue current diet - advance textures as tolerated
4. Continue Vitamin D supplementation
5. Immunizations given today: Hep B #3, IPV #3, Hib #4, PCV13 #4
6. Anticipatory guidance provided on safety (baby-proofing, car seat), development, and nutrition
7. Return for 12-month well-child visit

Mother verbalized understanding of plan and referral. Questions answered.`,
      icd10Codes: [
        { code: 'Z00.121', description: 'Encounter for routine child health examination with abnormal findings' },
        { code: 'Q21.0', description: 'Ventricular septal defect' },
        { code: 'R01.1', description: 'Cardiac murmur, unspecified' },
      ],
    },
    {
      id: 'soap-002',
      date: '2025-11-25',
      visitType: '9-Month Well-Child Visit',
      provider: 'Dr. Monica Kwan, MD',
      chiefComplaint: 'Routine well-child examination',
      subjective: `Mother brings Alex for his 9-month well-child visit. He has been healthy with no illnesses. Eating well with purees and starting soft finger foods. Taking about 26 oz of formula daily. Sleeping well.

Crawling on hands and knees, pulling to stand with support. Babbling with consonant sounds. Good social interaction, stranger anxiety present which is appropriate for age.`,
      objective: `Vital Signs:
- Weight: 9.5 kg (52nd percentile)
- Length: 73 cm (48th percentile)
- Head Circumference: 45.5 cm (58th percentile)
- Heart Rate: 125 bpm
- Temperature: 98.4°F

General: Well-appearing, active infant
HEENT: Normal exam
Cardiovascular: Regular rate and rhythm. Normal S1, S2. Soft systolic murmur at LLSB, stable from prior.
Respiratory: Clear bilaterally
Abdomen: Soft, non-tender
Neuro: Age-appropriate development`,
      assessment: `1. Healthy 9-month-old male
2. Known VSD - stable, soft murmur on exam
3. Development appropriate for age
4. Growth following expected curve`,
      plan: `1. Continue current feeding plan
2. Continue vitamin D supplementation
3. Immunizations given: COVID-19 Moderna, Flu
4. VSD monitoring - continue to follow
5. Return for 12-month visit`,
      icd10Codes: [
        { code: 'Z00.129', description: 'Encounter for routine child health examination without abnormal findings' },
        { code: 'Q21.0', description: 'Ventricular septal defect' },
      ],
    },
    {
      id: 'soap-003',
      date: '2025-08-26',
      visitType: '6-Month Well-Child Visit',
      provider: 'Dr. Monica Kwan, MD',
      chiefComplaint: 'Routine well-child examination',
      subjective: `Six-month well visit. Alex is doing well on formula, taking about 30 oz daily. Mother ready to start solid foods. Sleeping 10-11 hours at night with 2-3 naps.

Rolling both ways, sitting with support. Reaching for objects, transferring to mouth. Laughing and squealing. Good eye contact and social smile.`,
      objective: `Vital Signs:
- Weight: 8.0 kg (48th percentile)
- Length: 68 cm (42nd percentile)
- Head Circumference: 44 cm (52nd percentile)

General: Well-appearing, active
HEENT: Anterior fontanelle open, flat
Cardiovascular: RRR, soft systolic murmur at LLSB (known VSD)
Respiratory: Clear
Abdomen: Soft, no masses
GU: Normal male, testes descended`,
      assessment: `1. Healthy 6-month-old male
2. Ready for solid foods
3. Known VSD - stable
4. Normal development`,
      plan: `1. Begin infant cereals and single-ingredient purees
2. Start iron supplement
3. Continue Vitamin D
4. Immunizations given: DTaP-IPV-Hib-HepB, Pneumo 15, Rotavirus, Flu
5. Return at 9 months`,
      icd10Codes: [
        { code: 'Z00.129', description: 'Encounter for routine child health examination without abnormal findings' },
        { code: 'Q21.0', description: 'Ventricular septal defect' },
      ],
    },
    {
      id: 'soap-004',
      date: '2025-07-01',
      visitType: '4-Month Well-Child Visit',
      provider: 'Dr. Monica Kwan, MD',
      chiefComplaint: 'Routine well-child examination',
      subjective: `Four-month visit. Alex is doing well on formula, taking 5-6 oz every 3-4 hours. Good urine and stool output. Sleeping better at night, about 6-8 hour stretches.

Good head control, reaching for objects, social smile, cooing and laughing.`,
      objective: `Vital Signs:
- Weight: 7.0 kg (45th percentile)
- Length: 65 cm (40th percentile)
- Head Circumference: 43 cm (50th percentile)

Physical exam unremarkable. Soft systolic murmur at LLSB, known VSD. Age-appropriate development.`,
      assessment: `1. Healthy 4-month-old male
2. Known VSD - stable
3. Normal growth and development`,
      plan: `1. Continue formula feeding
2. Continue Vitamin D supplementation
3. Immunizations given
4. Return at 6 months
5. Kidney ultrasound ordered for follow-up of prenatal hydronephrosis`,
      icd10Codes: [
        { code: 'Z00.129', description: 'Encounter for routine child health examination without abnormal findings' },
        { code: 'Q21.0', description: 'Ventricular septal defect' },
      ],
    },
    {
      id: 'soap-005',
      date: '2025-05-02',
      visitType: '2-Month Well-Child Visit',
      provider: 'Dr. Juliana Stone, MD',
      chiefComplaint: 'Routine well-child examination',
      subjective: `Two-month well visit. Alex is doing well on formula, feeding every 3 hours. Good urine and stool output. Starting to sleep longer stretches at night.

Beginning to smile socially, tracking objects, good head control when prone.`,
      objective: `Vital Signs:
- Weight: 5.8 kg (42nd percentile)
- Length: 59 cm (38th percentile)
- Head Circumference: 40 cm (45th percentile)

General: Well-appearing, alert infant
Cardiovascular: Soft systolic murmur at LLSB (known VSD from newborn echo)
Respiratory: Clear
Abdomen: Soft
Development: Age-appropriate`,
      assessment: `1. Healthy 2-month-old male
2. Known small VSD - clinically stable
3. Normal growth and development`,
      plan: `1. Continue formula feeding
2. Continue Vitamin D supplementation
3. Immunizations given: DTaP-IPV-Hib-HepB, Pneumo 15, Rotavirus
4. Return at 4 months`,
      icd10Codes: [
        { code: 'Z00.129', description: 'Encounter for routine child health examination without abnormal findings' },
        { code: 'Q21.0', description: 'Ventricular septal defect' },
      ],
    },
    {
      id: 'soap-006',
      date: '2025-04-04',
      visitType: '6-Week Well-Child Visit',
      provider: 'Dr. Juliana Stone, MD',
      chiefComplaint: 'Routine well-child examination',
      subjective: `Six-week well visit. Alex is doing well on formula, eating every 2-3 hours. Good weight gain. Parents report no concerns.

Starting to have more alert periods, beginning to track faces.`,
      objective: `Vital Signs:
- Weight: 5.0 kg (40th percentile)
- Length: 56 cm (35th percentile)
- Head Circumference: 38 cm (42nd percentile)

General: Well-appearing infant
Cardiovascular: Soft systolic murmur at LLSB (known VSD)
Development: Age-appropriate`,
      assessment: `1. Healthy 6-week-old male
2. Known VSD - stable
3. Normal growth`,
      plan: `1. Continue formula feeding
2. Continue Vitamin D
3. Immunizations given: DTaP-IPV-Hib-HepB, Pneumo 15, Rotavirus
4. Return at 2 months`,
      icd10Codes: [
        { code: 'Z00.129', description: 'Encounter for routine child health examination without abnormal findings' },
        { code: 'Q21.0', description: 'Ventricular septal defect' },
      ],
    },
    {
      id: 'soap-007',
      date: '2025-02-26',
      visitType: 'Newborn Visit',
      provider: 'Dr. Juliana Stone, MD',
      chiefComplaint: 'Newborn examination',
      subjective: `5-day-old male here for newborn visit. Born at 39 weeks via C-section for breech presentation. Birth weight 3.4 kg. Echo on day 3 of life showed small muscular VSD, small PDA, and PFO. Feeding well - both breast and bottle feeding. Good urine and stool output.`,
      objective: `Vital Signs:
- Weight: 3.3 kg (regained to near birth weight)

General: Well-appearing newborn, appropriate tone
HEENT: Anterior fontanelle soft, flat
Cardiovascular: Grade 2/6 systolic holosystolic murmur at LLSB, consistent with known VSD
Hips: Barlow and Ortolani negative bilaterally
Skin: Mild jaundice, improving`,
      assessment: `1. Healthy 5-day-old male
2. Known small muscular VSD, small PDA, PFO from newborn echo - all with L-R shunts
3. Breech presentation - needs hip ultrasound screening
4. Physiologic jaundice - improving`,
      plan: `1. Continue breast and formula feeding on demand
2. Start Vitamin D supplementation
3. Ordered hip ultrasound for breech presentation screening
4. Bilirubin check not indicated - clinically improving
5. HepB vaccine given at birth
6. Follow-up with pediatric cardiology arranged
7. Return in 2 weeks`,
      icd10Codes: [
        { code: 'Z00.110', description: 'Health examination for newborn under 8 days old' },
        { code: 'Q21.0', description: 'Ventricular septal defect' },
        { code: 'Q25.0', description: 'Patent ductus arteriosus' },
      ],
    },
    {
      id: 'soap-008',
      date: '2025-02-23',
      visitType: 'Newborn Hospital Progress Note',
      provider: 'Dr. Carolyn Hume, MD',
      chiefComplaint: 'Well baby progress note - Day 2 of life',
      subjective: `Vital signs have remained within normal limits since the last exam. Alex passed the cardiac screen and was circumcised by Dr. Meister yesterday at 1:30pm.

Feeding: Breast feeding well and nipple feeding well. Latch Score: 7.
Voids/Stool: Voiding and stooling normally.`,
      objective: `Current weight: 3.25 kg (7 lb 2.6 oz)
Change from birthweight: -6%
Temp: 98.1°F (36.7°C)
HR: 120  RR: 44

General: Vigorous, healthy infant and non-dysmorphic
Head: Normocephalic, atraumatic, anterior fontanel soft, flat, open
Resp: No grunting, flaring or retractions. Normal resp rate. Chest clear to auscultation.
Heart: Regular rate and rhythm, normal S1 and S2, normal pulses
  - Murmur: Grade 2/6 systolic holosystolic, high pitched, vibratory quality at ULSB (NEW)
Abdomen: Soft, nontender, nondistended, normal bowel sounds, no hepatosplenomegaly
Skin: No rashes, significant lesions, or induration
GU: Healing circumcision, no active bleeding, Vaseline gauze in place

STUDIES:
- Oxygen saturation screening for CHD: PASS (Preductal: 99%, Postductal: 98%)
- Baby blood type: O POSITIVE
- DCT: Negative (02/21/25)
- Transcutaneous Bilirubin: 5.5 (02/23/25) - Jaundice risk: None`,
      assessment: `Term newborn born via C-section for breech presentation, with new onset murmur heard on today's exam, doing well.
- Nutrition assessment: Low risk - parents choosing to both breast and bottle feed with formula
- Infection risk assessment: Low risk`,
      plan: `1. Routine care, plan discussed with parent(s)
2. Continue with Vaseline gauze to healing circumcision site
3. Echocardiogram ordered to evaluate murmur
4. Parents aware that he will need a hip ultrasound as outpatient at 4-6 weeks of life
5. Parents to call office tomorrow to schedule first newborn appointment day after discharge`,
      icd10Codes: [
        { code: 'Z00.110', description: 'Health examination for newborn under 8 days old' },
        { code: 'R01.1', description: 'Cardiac murmur, unspecified' },
        { code: 'Z38.01', description: 'Single liveborn infant, delivered by cesarean' },
      ],
    },
  ],

  immunizations: [
    { name: 'HepB', dates: ['2025-02-21'] },
    { name: 'DTaP-IPV-Hib-HepB', dates: ['2025-04-04', '2025-05-02', '2025-08-26'] },
    { name: 'Pneumo 15 (PCV15)', dates: ['2025-04-04', '2025-05-02', '2025-08-26'] },
    { name: 'Rotavirus', dates: ['2025-04-04', '2025-05-02', '2025-08-26'] },
    { name: 'Influenza', dates: ['2025-08-26', '2025-11-25'] },
    { name: 'COVID-19 Moderna', dates: ['2025-11-25'] },
  ],
};

// Helper function to get the most recent SOAP note
export const getMostRecentSOAPNote = (): SOAPNote => {
  return patientData.soapNotes[0];
};

// Helper function to get recent SOAP notes (last N)
export const getRecentSOAPNotes = (count: number = 3): SOAPNote[] => {
  return patientData.soapNotes.slice(0, count);
};

// Helper to check if there's a pending referral
export const hasPendingReferral = (): boolean => {
  const recentNote = getMostRecentSOAPNote();
  return recentNote.plan.toLowerCase().includes('referral');
};

// Get referral-relevant imaging based on specialty
export const getRelevantImaging = (specialty: string): ImagingResult[] => {
  const specialtyImageMapping: Record<string, string[]> = {
    cardiology: ['Echocardiogram', 'EKG', 'Chest X-ray'],
    nephrology: ['Kidney Ultrasound', 'Renal Scan'],
    orthopedics: ['Hip Ultrasound', 'X-ray', 'MRI'],
  };

  const relevantTypes = specialtyImageMapping[specialty.toLowerCase()] || [];
  return patientData.imagingResults.filter(img =>
    relevantTypes.some(type => img.type.toLowerCase().includes(type.toLowerCase()))
  );
};
