import { supabase } from './supabase';

// ─── Types based on data structure diagram ─────────────────────────────────────

export interface OpportunityRecord {
  opportunityReference: string;
  opportunityName: string;
  country: string;
  client: string;
  costCentre: string;
  opportunityDirector: string;
  opportunityManager: string;
}

export interface RiskAssessmentRecord {
  peReference: string;
  serviceType: string;
  bidDate: string;
  jointVenture: boolean;
  projectLocationCountry: string;
  cbreReferredContract: boolean;
  riskScore: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  nextAction: string;
  approxFee: number;
  currency: string;
  projectSize: 'small' | 'medium' | 'large' | 'major';
}

export interface Task {
  id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  userId: string;
  userName: string;
  locationLink: string;
  action: string;
  urgencyDate: string;
}

export interface ContractRecord {
  crReference: string;
  contractType: 'standalone' | 'msa' | 'work_order' | 'amendment';
  contractTitle: string;
  status: 'preparation' | 'rm_review' | 'negotiation' | 'approval' | 'signing' | 'active' | 'complete';
  nextAction: string;
  linkedContractData: string | null;
  reviewRequiredDate: string;
  riskReview: 'low' | 'medium' | 'high' | 'very_high';
  guardrailSeverity: 'green' | 'amber' | 'red';
  ourSigningDate: string | null;
  clientSigningDate: string | null;
  auditHistory: AuditEntry[];
  confidentialityLevel: 'standard' | 'confidential' | 'highly_confidential';
  approverIds: string[];
  tntSignatory1: Signatory | null;
  tntSignatory2: Signatory | null;
  contractLength: string;
}

export interface Signatory {
  id: string;
  name: string;
  position: string;
  email: string;
  signedDate: string | null;
  signature: string | null;
}

export interface AuditEntry {
  date: string;
  action: string;
  userId: string;
  userName: string;
  details: string;
}

export interface ContinueAtRisk {
  status: 'pending' | 'approved' | 'expired';
  approvalDate: string | null;
  approver: string | null;
  endDate: string | null;
}

export interface ContractFile {
  id: string;
  documentTitle: string;
  versionNumber: string;
  size: string;
  createdDate: string;
  modifiedDate: string;
  comment: string | null;
  primaryContractualDocument: boolean;
  finalSignedDocument: boolean;
}

export interface Comment {
  id: string;
  text: string;
  internalExternal: 'internal' | 'external';
  dateCreated: string;
  owner: string;
}

export interface Guardrail {
  id: number;
  documentLink: string;
  startPosition: number;
  endPosition: number;
  rawText: string;
  clauseCategory: string;
  riskLevel: 1 | 2 | 3 | 4 | 5 | 6;
  riskDescription: string;
  proposedAmendment: string;
  mitigation: Mitigation | null;
}

export interface Mitigation {
  guardrailReference: string;
  mitigationDescription: string;
  policyFacts: string;
}

export interface MSAKeyDealSummary {
  msaTitle: string;
  version: string;
  servicesCovered: string[];
  geographicalCoverage: string[];
  endDate: string;
  liabilityLevel: string;
  insuranceLevel: string;
  paymentTerms: string;
  workOrderTemplateLink: string | null;
  preApprovedFramework: boolean;
}

// ─── Example Data ───────────────────────────────────────────────────────────────

export const EXAMPLE_OPPORTUNITY: OpportunityRecord = {
  opportunityReference: 'OPP-2024-1823456',
  opportunityName: '1 London Street Development',
  country: 'United Kingdom',
  client: 'Brookfield Properties Ltd',
  costCentre: 'CC-UK-LON-001',
  opportunityDirector: 'Sarah Mitchell',
  opportunityManager: 'John Doe',
};

export const EXAMPLE_RISK_ASSESSMENT: RiskAssessmentRecord = {
  peReference: 'PE-2024-00456',
  serviceType: 'Project Management',
  bidDate: '2024-10-15',
  jointVenture: false,
  projectLocationCountry: 'United Kingdom',
  cbreReferredContract: false,
  riskScore: 65,
  status: 'approved',
  nextAction: 'Proceed to contract negotiation',
  approxFee: 2500000,
  currency: 'GBP',
  projectSize: 'large',
};

export const EXAMPLE_TASKS: Task[] = [
  {
    id: 'TASK-001',
    status: 'in_progress',
    userId: 'USR-JD001',
    userName: 'John Doe',
    locationLink: '/contract/review',
    action: 'Complete RM Review',
    urgencyDate: '2024-11-01',
  },
  {
    id: 'TASK-002',
    status: 'pending',
    userId: 'USR-SM002',
    userName: 'Sarah Mitchell',
    locationLink: '/contract/approve',
    action: 'Approve contract terms',
    urgencyDate: '2024-11-15',
  },
  {
    id: 'TASK-003',
    status: 'completed',
    userId: 'USR-RB003',
    userName: 'Robert Brown',
    locationLink: '/contract/prepare',
    action: 'Prepare initial contract draft',
    urgencyDate: '2024-10-20',
  },
];

export const EXAMPLE_CONTRACT: ContractRecord = {
  crReference: 'CR-2024-12345678',
  contractType: 'standalone',
  contractTitle: '1 London Street Standalone One Off V1',
  status: 'rm_review',
  nextAction: 'Complete risk review and approve guardrails',
  linkedContractData: null,
  reviewRequiredDate: '2026-02-01',
  riskReview: 'medium',
  guardrailSeverity: 'amber',
  ourSigningDate: null,
  clientSigningDate: null,
  auditHistory: [
    {
      date: '2024-10-20T14:30:00Z',
      action: 'Contract Created',
      userId: 'USR-RB003',
      userName: 'Robert Brown',
      details: 'Initial contract draft uploaded',
    },
    {
      date: '2024-10-22T09:15:00Z',
      action: 'Submitted for Review',
      userId: 'USR-RB003',
      userName: 'Robert Brown',
      details: 'Contract submitted to RM for review',
    },
    {
      date: '2024-10-25T11:45:00Z',
      action: 'Guardrails Triggered',
      userId: 'SYSTEM',
      userName: 'System',
      details: '6 guardrails identified - 1 Very High, 1 Unacceptable, 1 High, 2 Medium, 1 Low',
    },
  ],
  confidentialityLevel: 'confidential',
  approverIds: ['USR-SM002', 'USR-DIR001'],
  tntSignatory1: {
    id: 'SIG-001',
    name: 'David Rose',
    position: 'Divisional Director',
    email: 'david.rose@turnerandtownsend.com',
    signedDate: null,
    signature: null,
  },
  tntSignatory2: {
    id: 'SIG-002',
    name: 'Emma Thompson',
    position: 'Regional Managing Director',
    email: 'emma.thompson@turnerandtownsend.com',
    signedDate: null,
    signature: null,
  },
  contractLength: '36 months',
};

export const EXAMPLE_FILES: ContractFile[] = [
  {
    id: 'FILE-001',
    documentTitle: 'Contract1234_GlobalMSA_v1.4',
    versionNumber: '1.4',
    size: '1.2mb',
    createdDate: '2024-10-15',
    modifiedDate: '2024-10-20',
    comment: 'Initial draft with client amendments',
    primaryContractualDocument: true,
    finalSignedDocument: false,
  },
  {
    id: 'FILE-002',
    documentTitle: 'Contract1234_GlobalMSA_v1.3',
    versionNumber: '1.3',
    size: '1.1mb',
    createdDate: '2024-10-10',
    modifiedDate: '2024-10-12',
    comment: 'Previous version',
    primaryContractualDocument: false,
    finalSignedDocument: false,
  },
  {
    id: 'FILE-003',
    documentTitle: 'Risk_Assessment_Summary.pdf',
    versionNumber: '1.0',
    size: '256kb',
    createdDate: '2024-10-08',
    modifiedDate: '2024-10-08',
    comment: null,
    primaryContractualDocument: false,
    finalSignedDocument: false,
  },
];

export const EXAMPLE_GUARDRAILS: Guardrail[] = [
  {
    id: 1,
    documentLink: '/documents/contract-v1.4.pdf#page=12',
    startPosition: 4520,
    endPosition: 4890,
    rawText: '"When reasonably requested by us you are to provide documentary evidence that the insurance required under this Appointment is being maintained."',
    clauseCategory: 'Insurance',
    riskLevel: 5,
    riskDescription: "Clauses requiring you to maintain PI insurance and prove it — where the same area of the contract doesn't clearly cap your overall liability. It's flagging possible exposure above your insurance limits.",
    proposedAmendment: 'Add explicit liability cap equal to insurance coverage limit of £10m.',
    mitigation: null,
  },
  {
    id: 2,
    documentLink: '/documents/contract-v1.4.pdf#page=8',
    startPosition: 2100,
    endPosition: 2350,
    rawText: 'Payment terms for sub-consultants extend beyond 60 days.',
    clauseCategory: 'Payment Terms',
    riskLevel: 6,
    riskDescription: 'Payment terms for sub-consultants extend beyond 60 days which exceeds company policy.',
    proposedAmendment: 'Standard payment terms should not exceed 30 days for sub-consultants.',
    mitigation: null,
  },
  {
    id: 3,
    documentLink: '/documents/contract-v1.4.pdf#page=15',
    startPosition: 6200,
    endPosition: 6580,
    rawText: '"The Consultant\'s aggregate liability to the Client arising out of or in connection with this Agreement shall be limited to an amount equal to 200% of the Fees or £10,000,000, whichever is greater."',
    clauseCategory: 'Liability / Limitation of liability',
    riskLevel: 4,
    riskDescription: 'Liability cap of £10m exceeds standard company limit of £5m.',
    proposedAmendment: "The Consultant's total aggregate liability shall be limited to £5,000,000 (five million pounds).",
    mitigation: {
      guardrailReference: 'GR-003',
      mitigationDescription: 'We have agreed a higher PI cap of £10m (standard £5m) but confirmed with Insurance that cover is available on existing terms. The higher cap is limited to this project only and excludes consequential loss and indirect damages. Fee levels have been uplifted to reflect the additional exposure.',
      policyFacts: 'Insurance team confirmed additional cover available at 0.5% premium increase.',
    },
  },
  {
    id: 4,
    documentLink: '/documents/contract-v1.4.pdf#page=18',
    startPosition: 7800,
    endPosition: 8100,
    rawText: 'Indemnity clause extends beyond standard template wording to include third party claims.',
    clauseCategory: 'Indemnity',
    riskLevel: 3,
    riskDescription: 'Indemnity wording is broader than standard template and may expose company to additional risk.',
    proposedAmendment: 'Review and narrow the indemnity scope to match template wording.',
    mitigation: null,
  },
  {
    id: 5,
    documentLink: '/documents/contract-v1.4.pdf#page=22',
    startPosition: 9500,
    endPosition: 9750,
    rawText: 'The limitation period for claims under this Agreement shall be 12 years from completion.',
    clauseCategory: 'Limitation period / Time bar',
    riskLevel: 3,
    riskDescription: 'Limitation period of 12 years exceeds standard 6 year period.',
    proposedAmendment: 'Reduce limitation period to standard 6 years from practical completion.',
    mitigation: null,
  },
  {
    id: 6,
    documentLink: '/documents/contract-v1.4.pdf#page=6',
    startPosition: 1200,
    endPosition: 1450,
    rawText: 'Payment shall be made within 90 days of receipt of a valid invoice.',
    clauseCategory: 'Payment Terms / Commercial',
    riskLevel: 2,
    riskDescription: 'Payment terms of 90 days are longer than standard 30 days but within acceptable range.',
    proposedAmendment: 'Negotiate reduction to 45 days if possible.',
    mitigation: null,
  },
];

export const EXAMPLE_COMMENTS: Comment[] = [
  {
    id: 'CMT-001',
    text: 'Client has agreed in principle to the liability cap revision. Awaiting formal confirmation.',
    internalExternal: 'internal',
    dateCreated: '2024-10-25T14:30:00Z',
    owner: 'John Doe',
  },
  {
    id: 'CMT-002',
    text: 'Insurance team has confirmed cover available for increased liability. See attached confirmation.',
    internalExternal: 'internal',
    dateCreated: '2024-10-24T10:15:00Z',
    owner: 'Sarah Mitchell',
  },
  {
    id: 'CMT-003',
    text: 'Please confirm the payment terms are acceptable given the project cash flow requirements.',
    internalExternal: 'external',
    dateCreated: '2024-10-23T16:45:00Z',
    owner: 'Client Representative',
  },
];

export const EXAMPLE_MSA_SUMMARY: MSAKeyDealSummary = {
  msaTitle: '1 London Street Development Services Agreement',
  version: '1.4',
  servicesCovered: ['Project Management', 'Cost Management', 'Programme Advisory'],
  geographicalCoverage: ['United Kingdom', 'Ireland'],
  endDate: '2027-12-31',
  liabilityLevel: '£10,000,000 aggregate',
  insuranceLevel: 'Professional Indemnity: £10m, Public Liability: £5m',
  paymentTerms: '30 days from invoice',
  workOrderTemplateLink: '/templates/work-order-v2.docx',
  preApprovedFramework: true,
};

// ─── Risk Assessment Status ────────────────────────────────────────────────────

export type RiskAssessmentStatus = 'required' | 'in_progress' | 'awaiting_approval' | 'complete';
export type ContractStatus = 'preparation' | 'rm_review' | 'negotiation' | 'approval' | 'signing' | 'active' | 'complete' | null;

export interface OpportunityRiskAssessment {
  id: string;
  name: string;
  date: string;
  status: RiskAssessmentStatus;
  riskScore?: number;
  serviceType?: string;
}

export interface OpportunityContract {
  id: string;
  name: string;
  date: string;
  status: ContractStatus;
  contractType?: string;
}

export interface OpportunityRow {
  id: string;
  name: string;
  reference: string;
  manager: string;
  managerInitials: string;
  director: string;
  directorInitials: string;
  client: string;
  clientInitials: string;
  address: string;
  city: string;
  country: string;
  riskAssessmentStatus: RiskAssessmentStatus;
  contractStatus: ContractStatus;
  riskAssessments: OpportunityRiskAssessment[];
  contracts: OpportunityContract[];
}

export const OPPORTUNITY_ROWS: OpportunityRow[] = [
  {
    id: 'OPP-001',
    name: '1 London Street Development',
    reference: 'OPP-2024-1823456',
    manager: 'John Doe',
    managerInitials: 'JD',
    director: 'Sarah Mitchell',
    directorInitials: 'SM',
    client: 'Brookfield Properties Ltd',
    clientInitials: 'BP',
    address: '1 London Street',
    city: 'London',
    country: 'United Kingdom',
    riskAssessmentStatus: 'complete',
    contractStatus: 'rm_review',
    riskAssessments: [
      { id: 'RA-001', name: 'Pre-bid Risk Assessment', date: '15/10/2025', status: 'complete', riskScore: 45, serviceType: 'Project Management' },
    ],
    contracts: [
      { id: 'CR-001', name: '1 London Street Standalone Contract V1', date: '20/10/2025', status: 'rm_review', contractType: 'Standalone' },
    ],
  },
  {
    id: 'OPP-002',
    name: 'TD TR5938 Town and Country Decommission',
    reference: '123456ENG',
    manager: 'David Smith',
    managerInitials: 'DS',
    director: 'Mark Thompson',
    directorInitials: 'MT',
    client: 'TD Bank Group',
    clientInitials: 'TD',
    address: '66 Wellington Street',
    city: 'Toronto',
    country: 'Canada',
    riskAssessmentStatus: 'complete',
    contractStatus: 'negotiation',
    riskAssessments: [
      { id: 'RA-002', name: 'Decommission Risk Assessment', date: '01/09/2025', status: 'complete', riskScore: 62, serviceType: 'Facilities Management' },
    ],
    contracts: [
      { id: 'CR-002', name: 'TD Decommission Services Agreement', date: '05/09/2025', status: 'negotiation', contractType: 'MSA' },
      { id: 'CR-003', name: 'TD Phase 1 Work Order', date: '10/09/2025', status: 'preparation', contractType: 'Work Order' },
    ],
  },
  {
    id: 'OPP-003',
    name: 'EMD Millipore Corp - Confidentiality Agreement',
    reference: '193475ENG',
    manager: 'Susan Davies',
    managerInitials: 'SD',
    director: 'Catherine Price',
    directorInitials: 'CP',
    client: 'Exelead a Merck Millipore Sigma Company',
    clientInitials: 'MS',
    address: '400 Summit Drive',
    city: 'Burlington',
    country: 'United States',
    riskAssessmentStatus: 'awaiting_approval',
    contractStatus: null,
    riskAssessments: [
      { id: 'RA-003', name: 'Initial Risk Assessment', date: '28/03/2026', status: 'awaiting_approval', riskScore: 28, serviceType: 'Consulting' },
    ],
    contracts: [],
  },
  {
    id: 'OPP-004',
    name: 'Renovation And Rehabilitation Services Of Embassy',
    reference: '173432ENG',
    manager: 'Kalp Patel',
    managerInitials: 'KP',
    director: 'Ahmed Al-Rashid',
    directorInitials: 'AR',
    client: 'The Embassy of the State of Kuwait',
    clientInitials: 'KW',
    address: '2 Albert Gate',
    city: 'London',
    country: 'United Kingdom',
    riskAssessmentStatus: 'in_progress',
    contractStatus: null,
    riskAssessments: [
      { id: 'RA-004', name: 'Embassy Renovation Risk Assessment', date: '01/04/2026', status: 'in_progress', serviceType: 'Construction Management' },
    ],
    contracts: [],
  },
  {
    id: 'OPP-005',
    name: 'Google Vizag E3 Sites Cost Management Services',
    reference: '323414ENG',
    manager: 'Jennifer Budge',
    managerInitials: 'JB',
    director: 'Priya Sharma',
    directorInitials: 'PS',
    client: 'Google India Private Limited',
    clientInitials: 'G',
    address: 'Hitech City',
    city: 'Visakhapatnam',
    country: 'India',
    riskAssessmentStatus: 'complete',
    contractStatus: 'approval',
    riskAssessments: [
      { id: 'RA-005', name: 'E3 Sites Risk Assessment', date: '15/02/2026', status: 'complete', riskScore: 35, serviceType: 'Cost Management' },
    ],
    contracts: [
      { id: 'CR-005', name: 'Google E3 Cost Management Services Agreement', date: '20/02/2026', status: 'approval', contractType: 'MSA' },
    ],
  },
  {
    id: 'OPP-006',
    name: 'Project Management Services – Paris HQ Fit-Out',
    reference: '223474ENG',
    manager: 'John Pilkington',
    managerInitials: 'JP',
    director: 'Marie Dubois',
    directorInitials: 'MD',
    client: 'CBRE GWS France SAS',
    clientInitials: 'CB',
    address: '145 Rue de Bercy',
    city: 'Paris',
    country: 'France',
    riskAssessmentStatus: 'complete',
    contractStatus: 'signing',
    riskAssessments: [
      { id: 'RA-006', name: 'Paris HQ Fit-Out Risk Assessment', date: '01/01/2026', status: 'complete', riskScore: 42, serviceType: 'Project Management' },
    ],
    contracts: [
      { id: 'CR-006', name: 'CBRE Paris HQ Fit-Out Contract', date: '10/01/2026', status: 'signing', contractType: 'Standalone' },
    ],
  },
  {
    id: 'OPP-007',
    name: 'Manchester Arena District Master Plan',
    reference: '334512ENG',
    manager: 'Rachel Morris',
    managerInitials: 'RM',
    director: 'James Wilson',
    directorInitials: 'JW',
    client: 'Aviva Investors',
    clientInitials: 'AV',
    address: '1 Poultry',
    city: 'London',
    country: 'United Kingdom',
    riskAssessmentStatus: 'required',
    contractStatus: null,
    riskAssessments: [],
    contracts: [],
  },
  {
    id: 'OPP-008',
    name: 'HSBC Data Centre Resilience Programme',
    reference: '445623ENG',
    manager: 'Omar Hassan',
    managerInitials: 'OH',
    director: 'Richard Chen',
    directorInitials: 'RC',
    client: 'HSBC Holdings plc',
    clientInitials: 'HS',
    address: '8 Canada Square',
    city: 'London',
    country: 'United Kingdom',
    riskAssessmentStatus: 'complete',
    contractStatus: 'active',
    riskAssessments: [
      { id: 'RA-008', name: 'Data Centre Risk Assessment', date: '15/06/2025', status: 'complete', riskScore: 55, serviceType: 'Technical Services' },
    ],
    contracts: [
      { id: 'CR-008', name: 'HSBC Data Centre Resilience MSA', date: '01/07/2025', status: 'active', contractType: 'MSA' },
      { id: 'CR-009', name: 'Phase 1 Work Order - London', date: '15/07/2025', status: 'active', contractType: 'Work Order' },
      { id: 'CR-010', name: 'Phase 2 Work Order - Birmingham', date: '01/09/2025', status: 'active', contractType: 'Work Order' },
    ],
  },
  {
    id: 'OPP-009',
    name: 'Edinburgh Waterfront Mixed-Use Development',
    reference: '556734ENG',
    manager: 'Claire Sutton',
    managerInitials: 'CS',
    director: 'Andrew MacLeod',
    directorInitials: 'AM',
    client: 'Lendlease Europe',
    clientInitials: 'LL',
    address: 'Ocean Terminal',
    city: 'Edinburgh',
    country: 'United Kingdom',
    riskAssessmentStatus: 'in_progress',
    contractStatus: null,
    riskAssessments: [
      { id: 'RA-009', name: 'Waterfront Development Risk Assessment', date: '25/03/2026', status: 'in_progress', serviceType: 'Development Management' },
    ],
    contracts: [],
  },
  {
    id: 'OPP-010',
    name: 'Crossrail Station Fit-Out Works',
    reference: '667845ENG',
    manager: 'Peter Walsh',
    managerInitials: 'PW',
    director: 'Helen Brooks',
    directorInitials: 'HB',
    client: 'Transport for London',
    clientInitials: 'TfL',
    address: '55 Broadway',
    city: 'London',
    country: 'United Kingdom',
    riskAssessmentStatus: 'complete',
    contractStatus: 'complete',
    riskAssessments: [
      { id: 'RA-010', name: 'Crossrail Station Risk Assessment', date: '01/03/2024', status: 'complete', riskScore: 72, serviceType: 'Construction Management' },
    ],
    contracts: [
      { id: 'CR-011', name: 'Crossrail Station Fit-Out Contract', date: '15/03/2024', status: 'complete', contractType: 'Standalone' },
    ],
  },
];

export function getOpportunityById(id: string): OpportunityRow | undefined {
  return OPPORTUNITY_ROWS.find(opp => opp.id === id);
}

export function getRiskAssessmentStatusStyle(status: RiskAssessmentStatus): { label: string; className: string } {
  switch (status) {
    case 'required':
      return { label: 'Required', className: 'bg-red-100 text-red-700' };
    case 'in_progress':
      return { label: 'In Progress', className: 'bg-amber-100 text-amber-700' };
    case 'awaiting_approval':
      return { label: 'Awaiting Approval', className: 'bg-blue-100 text-blue-700' };
    case 'complete':
      return { label: 'Complete', className: 'bg-green-100 text-green-700' };
  }
}

export function getContractStatusStyle(status: ContractStatus): { label: string; className: string } | null {
  if (!status) return null;
  switch (status) {
    case 'preparation':
      return { label: 'Preparation', className: 'bg-gray-100 text-gray-600' };
    case 'rm_review':
      return { label: 'RM Review', className: 'bg-amber-100 text-amber-700' };
    case 'negotiation':
      return { label: 'Negotiation', className: 'bg-orange-100 text-orange-700' };
    case 'approval':
      return { label: 'Approval', className: 'bg-blue-100 text-blue-700' };
    case 'signing':
      return { label: 'Signing', className: 'bg-purple-100 text-purple-700' };
    case 'active':
      return { label: 'Active', className: 'bg-green-100 text-green-700' };
    case 'complete':
      return { label: 'Complete', className: 'bg-green-200 text-green-800' };
    default:
      return null;
  }
}

// ─── Risk level helpers ─────────────────────────────────────────────────────────

export function getRiskLevelLabel(level: 1 | 2 | 3 | 4 | 5 | 6): string {
  const labels: Record<number, string> = {
    1: 'LOW',
    2: 'LOW',
    3: 'MEDIUM',
    4: 'HIGH',
    5: 'VERY HIGH',
    6: 'UNACCEPTABLE',
  };
  return labels[level];
}

export function getRiskLevelColor(level: 1 | 2 | 3 | 4 | 5 | 6): string {
  const colors: Record<number, string> = {
    1: 'bg-green-100 text-green-700',
    2: 'bg-green-100 text-green-700',
    3: 'bg-amber-100 text-amber-700',
    4: 'bg-red-100 text-red-700',
    5: 'bg-red-200 text-red-800',
    6: 'bg-gray-800 text-white',
  };
  return colors[level];
}

export function getOverallRiskFromGuardrails(guardrails: Guardrail[]): 'low' | 'medium' | 'high' | 'very_high' {
  const maxRisk = Math.max(...guardrails.map(g => g.riskLevel));
  if (maxRisk >= 5) return 'very_high';
  if (maxRisk >= 4) return 'high';
  if (maxRisk >= 3) return 'medium';
  return 'low';
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENTS
// ═══════════════════════════════════════════════════════════════════════════════
// Document model for the Documents tab on the Contract page.
// A contract has a primary document (e.g. the MSA) and supplementary documents
// (e.g. insurance certificates, side letters). Each document has one or more
// versions. By default only the primary document is reviewed, but any
// supplementary document can be flagged for inclusion in the review workflow.

export interface DocumentVersion {
  v: number;
  name: string;
  size?: string;
  created?: string;
  modified?: string;
  uploaded: string;
}

export interface ContractDocument {
  id: string;
  primary: boolean;
  name: string;
  type: string;
  reviewRequested: boolean;
  versions: DocumentVersion[];
}

export const INITIAL_DOCS: ContractDocument[] = [
  {
    id: 'doc-1',
    primary: true,
    name: 'HSBC-1LondonStreet-MSA',
    type: 'Docx',
    reviewRequested: true,
    versions: [
      { v: 3, name: 'HSBC-1LondonStreet-MSA-V3', size: '1mb', created: '17/01/26', modified: '18/01/26', uploaded: '18/01/26' },
      { v: 2, name: 'HSBC-1LondonStreet-MSA-V2', uploaded: '05/01/26' },
      { v: 1, name: 'HSBC-1LondonStreet-MSA-V1', uploaded: '23/12/25' },
    ],
  },
  {
    id: 'doc-2',
    primary: false,
    name: 'HSBC-1LondonStreet-Insurance',
    type: 'Docx',
    reviewRequested: false,
    versions: [
      { v: 1, name: 'HSBC-1LondonStreet-Insurance', size: '1mb', created: '17/01/26', modified: '17/01/26', uploaded: '17/01/26' },
    ],
  },
  {
    id: 'doc-3',
    primary: false,
    name: 'HSBC-1LondonStreet-SideLetter',
    type: 'Docx',
    reviewRequested: false,
    versions: [
      { v: 1, name: 'HSBC-1LondonStreet-SideLetter', size: '450kb', created: '15/01/26', modified: '15/01/26', uploaded: '15/01/26' },
    ],
  },
];
// ═══════════════════════════════════════════════════════════════════════════
// APPEND THIS BLOCK TO THE BOTTOM OF lib/contract-data.ts
// (after the formatDate function at the very end of the file)
// ═══════════════════════════════════════════════════════════════════════════

// Import the Supabase client at the top of the file if not already imported.
// Add this line near the top of lib/contract-data.ts with your other imports:
//
//     import { supabase } from './supabase';
//
// Then paste the function below at the very end of the file.

/**
 * Load all opportunities from Supabase, including their nested
 * risk assessments and contracts. Returns an empty array on error
 * so the caller can fall back to hardcoded data if needed.
 */
export async function getAllOpportunitiesFromDB(): Promise<OpportunityRow[]> {
  try {
    const { data: opps, error: oppsError } = await supabase
      .from('opportunities')
      .select('*')
      .order('created_at');

    if (oppsError) {
      console.error('Supabase opportunities error:', oppsError);
      return [];
    }
    if (!opps || opps.length === 0) return [];

    const { data: allRas } = await supabase.from('risk_assessments').select('*');
    const { data: allCts } = await supabase.from('contracts').select('*');

    return opps.map((o: any) => ({
      id: o.id,
      name: o.name,
      reference: o.reference,
      manager: o.manager || '',
      managerInitials: o.manager_initials || '',
      director: o.director || '',
      directorInitials: o.director_initials || '',
      client: o.client,
      clientInitials: o.client_initials || '',
      address: o.address || '',
      city: o.city || '',
      country: o.country || '',
      riskAssessmentStatus: o.risk_assessment_status as RiskAssessmentStatus,
      contractStatus: o.contract_status as ContractStatus,
      riskAssessments: (allRas || [])
        .filter((r: any) => r.opportunity_id === o.id)
        .map((r: any) => ({
          id: r.id,
          name: r.name,
          date: r.date || '',
          status: r.status as RiskAssessmentStatus,
          riskScore: r.risk_score ?? undefined,
          serviceType: r.service_type ?? undefined,
        })),
      contracts: (allCts || [])
        .filter((c: any) => c.opportunity_id === o.id)
        .map((c: any) => ({
          id: c.id,
          name: c.name,
          date: c.date || '',
          status: c.status as ContractStatus,
          contractType: c.contract_type ?? undefined,
        })),
    }));
  } catch (err) {
    console.error('Supabase connection error:', err);
    return [];
  }
}
// ═══════════════════════════════════════════════════════════════════════════
// PART 1 OF PATCH 1
// APPEND THESE TWO FUNCTIONS to the bottom of lib/contract-data.ts
// (right after the existing getAllOpportunitiesFromDB function)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Load a single opportunity by ID from Supabase, including its nested
 * risk assessments and contracts. Returns null if not found or on error.
 */
export async function getOpportunityByIdFromDB(id: string): Promise<OpportunityRow | null> {
  try {
    const { data: opp, error: oppError } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (oppError) {
      console.error('Supabase opportunity lookup error:', oppError);
      return null;
    }
    if (!opp) return null;

    const { data: ras } = await supabase
      .from('risk_assessments')
      .select('*')
      .eq('opportunity_id', id);

    const { data: cts } = await supabase
      .from('contracts')
      .select('*')
      .eq('opportunity_id', id);

    return {
      id: opp.id,
      name: opp.name,
      reference: opp.reference,
      manager: opp.manager || '',
      managerInitials: opp.manager_initials || '',
      director: opp.director || '',
      directorInitials: opp.director_initials || '',
      client: opp.client,
      clientInitials: opp.client_initials || '',
      address: opp.address || '',
      city: opp.city || '',
      country: opp.country || '',
      riskAssessmentStatus: opp.risk_assessment_status as RiskAssessmentStatus,
      contractStatus: opp.contract_status as ContractStatus,
      riskAssessments: (ras || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        date: r.date || '',
        status: r.status as RiskAssessmentStatus,
        riskScore: r.risk_score ?? undefined,
        serviceType: r.service_type ?? undefined,
      })),
      contracts: (cts || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        date: c.date || '',
        status: c.status as ContractStatus,
        contractType: c.contract_type ?? undefined,
      })),
    };
  } catch (err) {
    console.error('Supabase connection error:', err);
    return null;
  }
}

/**
 * Create a new opportunity in Supabase. Returns the created opportunity
 * or throws an error if something goes wrong. The caller is responsible
 * for handling errors.
 */
export async function createOpportunityInDB(input: {
  name: string;
  country: string;
  client: string;
  director: string;
  manager: string;
  city?: string;
  address?: string;
}): Promise<OpportunityRow> {
  // Generate a unique ID based on timestamp
  const id = `OPP-${Date.now()}`;
  const reference = `OPP-${new Date().getFullYear()}-${Date.now().toString().slice(-7)}`;

  const initials = (s: string) =>
    s
      .split(' ')
      .map((w) => w[0])
      .filter(Boolean)
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const { data, error } = await supabase
    .from('opportunities')
    .insert({
      id,
      name: input.name,
      reference,
      manager: input.manager,
      manager_initials: initials(input.manager),
      director: input.director,
      director_initials: initials(input.director),
      client: input.client,
      client_initials: initials(input.client),
      address: input.address || '',
      city: input.city || '',
      country: input.country,
      risk_assessment_status: 'required',
      contract_status: null,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create opportunity:', error);
    throw new Error(`Failed to create opportunity: ${error.message}`);
  }

  return {
    id: data.id,
    name: data.name,
    reference: data.reference,
    manager: data.manager || '',
    managerInitials: data.manager_initials || '',
    director: data.director || '',
    directorInitials: data.director_initials || '',
    client: data.client,
    clientInitials: data.client_initials || '',
    address: data.address || '',
    city: data.city || '',
    country: data.country || '',
    riskAssessmentStatus: data.risk_assessment_status as RiskAssessmentStatus,
    contractStatus: data.contract_status as ContractStatus,
    riskAssessments: [],
    contracts: [],
  };
}
// ═══════════════════════════════════════════════════════════════════════════
// PATCH 2 — PART 2
// APPEND THIS FUNCTION to the bottom of lib/contract-data.ts
// (right after createOpportunityInDB)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input shape for creating a risk assessment. All fields are optional
 * except opportunityId and name — the wizard validates before calling.
 */
export interface CreateRiskAssessmentInput {
  opportunityId: string;
  name: string;
  serviceType?: string;
  projectScope?: string;
  startDate?: string;
  endDate?: string;
  jointVenture?: boolean;
  cbreReferred?: boolean;
  estimatedFee?: string;
  margin?: string;
  probabilityOfWinning?: string;
  proposalDate?: string;
  boundaries?: string;
  riskGuidanceReviewed?: boolean;
  riskCategories?: string[];
  otherText?: string;
  note?: string;
  riskScore?: number;
}

/**
 * Create a risk assessment in Supabase and update the parent
 * opportunity's risk_assessment_status to 'awaiting_approval'.
 * Returns the created risk assessment or throws on error.
 */
export async function createRiskAssessmentInDB(
  input: CreateRiskAssessmentInput
): Promise<OpportunityRiskAssessment> {
  const id = `RA-${Date.now()}`;
  const today = new Date().toLocaleDateString('en-GB');

  // Insert the risk assessment
  const { data, error } = await supabase
    .from('risk_assessments')
    .insert({
      id,
      opportunity_id: input.opportunityId,
      name: input.name,
      date: today,
      status: 'awaiting_approval',
      risk_score: input.riskScore ?? null,
      service_type: input.serviceType ?? 'Project Management',
      project_scope: input.projectScope ?? null,
      start_date: input.startDate ?? null,
      end_date: input.endDate ?? null,
      joint_venture: input.jointVenture ?? false,
      cbre_referred: input.cbreReferred ?? false,
      estimated_fee: input.estimatedFee ?? null,
      margin: input.margin ?? null,
      probability_of_winning: input.probabilityOfWinning ?? null,
      proposal_date: input.proposalDate ?? null,
      boundaries: input.boundaries ?? null,
      risk_guidance_reviewed: input.riskGuidanceReviewed ?? false,
      risk_categories: input.riskCategories ?? [],
      other_text: input.otherText ?? null,
      note: input.note ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create risk assessment:', error);
    throw new Error(`Failed to create risk assessment: ${error.message}`);
  }

  // Update the parent opportunity's status to 'awaiting_approval'
  const { error: updateError } = await supabase
    .from('opportunities')
    .update({ risk_assessment_status: 'awaiting_approval' })
    .eq('id', input.opportunityId);

  if (updateError) {
    console.error('Failed to update opportunity status:', updateError);
    // Don't throw — the risk assessment was created successfully,
    // the status update is a nice-to-have
  }

  return {
    id: data.id,
    name: data.name,
    date: data.date || today,
    status: 'awaiting_approval' as RiskAssessmentStatus,
    riskScore: data.risk_score ?? undefined,
    serviceType: data.service_type ?? undefined,
  };
}
// ═══════════════════════════════════════════════════════════════════════════
// PATCH 3a — PART 2
// APPEND THIS FUNCTION to the bottom of lib/contract-data.ts
// (right after createRiskAssessmentInDB)
// ═══════════════════════════════════════════════════════════════════════════

export interface CreateContractInput {
  opportunityId: string;
  contractFlow: 'client' | 'supplier';
  contractType: string;
  contractTitle: string;
  reviewRequiredDate: string;
  creationMethod: 'builder' | 'upload';
  msaLinkedId?: string | null;
  uploadedFileNames?: string[];
}

/**
 * Create a contract record in Supabase and update the parent opportunity's
 * contract_status to 'rm_review'. Returns the created contract or throws.
 */
export async function createContractInDB(
  input: CreateContractInput
): Promise<OpportunityContract> {
  const id = `CR-${Date.now()}`;
  const today = new Date().toLocaleDateString('en-GB');

  const { data, error } = await supabase
    .from('contracts')
    .insert({
      id,
      opportunity_id: input.opportunityId,
      name: input.contractTitle,
      date: today,
      status: 'rm_review',
      contract_type: input.contractType,
      contract_flow: input.contractFlow,
      creation_method: input.creationMethod,
      contract_title: input.contractTitle,
      review_required_date: input.reviewRequiredDate,
      msa_linked_id: input.msaLinkedId ?? null,
      uploaded_file_names: input.uploadedFileNames ?? [],
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create contract:', error);
    throw new Error(`Failed to create contract: ${error.message}`);
  }

  // Update the parent opportunity's contract_status
  const { error: updateError } = await supabase
    .from('opportunities')
    .update({ contract_status: 'rm_review' })
    .eq('id', input.opportunityId);

  if (updateError) {
    console.error('Failed to update opportunity contract status:', updateError);
    // Don't throw — the contract was created successfully
  }

  return {
    id: data.id,
    name: data.name,
    date: data.date || today,
    status: 'rm_review' as ContractStatus,
    contractType: data.contract_type ?? undefined,
  };
}
// ═══════════════════════════════════════════════════════════════════════════
// PATCH 3b — PART 2
// APPEND THIS BLOCK to the bottom of lib/contract-data.ts
// (right after createContractInDB)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Full contract record loaded from Supabase, including all the fields
 * captured during contract creation. Used by the contract overview page.
 */
export interface FullContractRecord {
  id: string;
  opportunityId: string;
  name: string;
  date: string;
  status: ContractStatus;
  contractType: string;
  contractFlow: string;
  creationMethod: string;
  contractTitle: string;
  reviewRequiredDate: string;
  msaLinkedId: string | null;
  uploadedFileNames: string[];
  contractReference: string;
}

/**
 * Load a single contract by ID, or null if not found / on error.
 */
export async function getContractByIdFromDB(
  id: string
): Promise<FullContractRecord | null> {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Supabase contract lookup error:', error);
      return null;
    }
    if (!data) return null;

    return {
      id: data.id,
      opportunityId: data.opportunity_id,
      name: data.name,
      date: data.date || '',
      status: data.status as ContractStatus,
      contractType: data.contract_type || '',
      contractFlow: data.contract_flow || '',
      creationMethod: data.creation_method || '',
      contractTitle: data.contract_title || data.name || '',
      reviewRequiredDate: data.review_required_date || '',
      msaLinkedId: data.msa_linked_id || null,
      uploadedFileNames: data.uploaded_file_names || [],
      contractReference: data.contract_reference || data.id,
    };
  } catch (err) {
    console.error('Supabase connection error:', err);
    return null;
  }
}
