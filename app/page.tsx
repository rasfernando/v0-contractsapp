'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, HelpCircle, Flag, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  OPPORTUNITY_ROWS,
  getRiskAssessmentStatusStyle,
  getContractStatusStyle,
} from '@/lib/contract-data';
import { useUser, canCreateOpportunity, getRoleLabel } from '@/lib/user-context';
import { UserSwitcher } from '@/components/user-switcher';

const TASK_REGISTRY = [
  {
    id: 1,
    name: 'Complete RM Review',
    activity: 'Contract Review',
    workItem: '1 London Street Standalone Contract V1',
    client: 'Brookfield Properties Ltd',
    dueDate: '01/03/2026',
    relativeDate: 'Overdue: 1 month',
    status: 'RM Review',
    workspaceLink: 'View Contract',
    priority: 'high',
    opportunityId: 'OPP-001',
    assignedTo: 'contract_reviewer',
  },
  {
    id: 2,
    name: 'Negotiate Terms',
    activity: 'Contract Negotiation',
    workItem: 'TD Decommission Services Agreement',
    client: 'TD Bank Group',
    dueDate: '25/03/2026',
    relativeDate: 'Overdue: 1 week',
    status: 'Negotiation',
    workspaceLink: 'View Contract',
    priority: 'high',
    opportunityId: 'OPP-002',
    assignedTo: 'opportunity_manager',
  },
  {
    id: 3,
    name: 'Approve Risk Assessment',
    activity: 'Risk Assessment Approval',
    workItem: 'Initial Risk Assessment',
    client: 'Exelead a Merck Millipore Sigma Company',
    dueDate: '30/03/2026',
    relativeDate: 'Overdue: 2 days',
    status: 'Awaiting Approval',
    workspaceLink: 'View Assessment',
    priority: 'high',
    opportunityId: 'OPP-003',
    assignedTo: 'contract_reviewer',
  },
  {
    id: 4,
    name: 'Complete Risk Assessment',
    activity: 'Risk Assessment',
    workItem: 'Embassy Renovation Risk Assessment',
    client: 'The Embassy of the State of Kuwait',
    dueDate: '02/04/2026',
    relativeDate: 'Due: today',
    status: 'In Progress',
    workspaceLink: 'View Assessment',
    priority: 'medium',
    opportunityId: 'OPP-004',
    assignedTo: 'opportunity_manager',
  },
  {
    id: 5,
    name: 'Final Approval Review',
    activity: 'Contract Approval',
    workItem: 'Google E3 Cost Management Services Agreement',
    client: 'Google India Private Limited',
    dueDate: '04/04/2026',
    relativeDate: 'Due: 2 days',
    status: 'Approval',
    workspaceLink: 'View Contract',
    priority: 'medium',
    opportunityId: 'OPP-005',
    assignedTo: 'approver',
  },
  {
    id: 6,
    name: 'Sign Contract',
    activity: 'Contract Signing',
    workItem: 'CBRE Paris HQ Fit-Out Contract',
    client: 'CBRE GWS France SAS',
    dueDate: '09/04/2026',
    relativeDate: 'Due: 1 week',
    status: 'Signing',
    workspaceLink: 'View Contract',
    priority: 'low',
    opportunityId: 'OPP-006',
    assignedTo: 'authorised_signatory',
  },
  {
    id: 7,
    name: 'Create Risk Assessment',
    activity: 'Risk Assessment Required',
    workItem: 'Manchester Arena District Master Plan',
    client: 'Aviva Investors',
    dueDate: '16/04/2026',
    relativeDate: 'Due: 2 weeks',
    status: 'Required',
    workspaceLink: 'View Opportunity',
    priority: 'low',
    opportunityId: 'OPP-007',
    assignedTo: 'opportunity_manager',
  },
  {
    id: 8,
    name: 'Review Active Contract',
    activity: 'Contract Management',
    workItem: 'HSBC Data Centre Resilience MSA',
    client: 'HSBC Holdings plc',
    dueDate: '23/04/2026',
    relativeDate: 'Due: 3 weeks',
    status: 'Active',
    workspaceLink: 'View Contract',
    priority: 'low',
    opportunityId: 'OPP-008',
    assignedTo: 'opportunity_manager',
  },
  {
    id: 9,
    name: 'Complete Risk Assessment',
    activity: 'Risk Assessment',
    workItem: 'Waterfront Development Risk Assessment',
    client: 'Lendlease Europe',
    dueDate: '02/05/2026',
    relativeDate: 'Due: 1 month',
    status: 'In Progress',
    workspaceLink: 'View Assessment',
    priority: 'low',
    opportunityId: 'OPP-009',
    assignedTo: 'opportunity_manager',
  },
  {
    id: 10,
    name: 'Archive Completed Contract',
    activity: 'Contract Closure',
    workItem: 'Crossrail Station Fit-Out Contract',
    client: 'Transport for London',
    dueDate: '02/06/2026',
    relativeDate: 'Due: 2 months',
    status: 'Complete',
    workspaceLink: 'View Contract',
    priority: 'low',
    opportunityId: 'OPP-010',
    assignedTo: 'authorised_signatory',
  },
  {
    id: 11,
    name: 'Review MSA Terms',
    activity: 'Contract Review',
    workItem: 'Amazon Logistics Framework Agreement',
    client: 'Amazon UK Services Ltd',
    dueDate: '05/04/2026',
    relativeDate: 'Due: 3 days',
    status: 'RM Review',
    workspaceLink: 'View Contract',
    priority: 'high',
    opportunityId: 'OPP-011',
    assignedTo: 'contract_reviewer',
  },
  {
    id: 12,
    name: 'Review Risk Assessment',
    activity: 'Risk Assessment Approval',
    workItem: 'Data Centre Construction Assessment',
    client: 'Microsoft Ireland',
    dueDate: '10/04/2026',
    relativeDate: 'Due: 1 week',
    status: 'Awaiting Review',
    workspaceLink: 'View Assessment',
    priority: 'medium',
    opportunityId: 'OPP-012',
    assignedTo: 'contract_reviewer',
  },
  {
    id: 13,
    name: 'Approve High-Value Contract',
    activity: 'Contract Approval',
    workItem: 'Shell Rotterdam Refinery Services',
    client: 'Shell International B.V.',
    dueDate: '08/04/2026',
    relativeDate: 'Due: 6 days',
    status: 'Pending Approval',
    workspaceLink: 'View Contract',
    priority: 'high',
    opportunityId: 'OPP-013',
    assignedTo: 'approver',
  },
  {
    id: 14,
    name: 'Review and Approve Amendment',
    activity: 'Contract Approval',
    workItem: 'BP Aberdeen Amendment 3',
    client: 'BP Exploration Operating Co.',
    dueDate: '15/04/2026',
    relativeDate: 'Due: 2 weeks',
    status: 'Amendment Review',
    workspaceLink: 'View Contract',
    priority: 'medium',
    opportunityId: 'OPP-014',
    assignedTo: 'approver',
  },
  {
    id: 15,
    name: 'Execute Framework Agreement',
    activity: 'Contract Signing',
    workItem: 'Network Rail Southern Framework',
    client: 'Network Rail Infrastructure Ltd',
    dueDate: '12/04/2026',
    relativeDate: 'Due: 10 days',
    status: 'Ready to Sign',
    workspaceLink: 'View Contract',
    priority: 'medium',
    opportunityId: 'OPP-015',
    assignedTo: 'authorised_signatory',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<'tasks' | 'engagements'>('tasks');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('due-overdue');
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

  const userTasks = TASK_REGISTRY.filter(task => task.assignedTo === currentUser.role);

  const [opportunityName, setOpportunityName] = useState('');
  const [country, setCountry] = useState('');
  const [costCentre, setCostCentre] = useState('');
  const [organisationLocation, setOrganisationLocation] = useState('');
  const [client, setClient] = useState('');
  const [opportunityDirector, setOpportunityDirector] = useState('');
  const [opportunityManager, setOpportunityManager] = useState('');

  const isFormValid =
    opportunityName && country && costCentre && organisationLocation && client && opportunityDirector && opportunityManager;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-amber-600';
      default: return 'text-muted-foreground';
    }
  };

  const resetForm = () => {
    setOpportunityName('');
    setCountry('');
    setCostCentre('');
    setOrganisationLocation('');
    setClient('');
    setOpportunityDirector('');
    setOpportunityManager('');
  };

  const handleCreateRecord = () => {
    resetForm();
    setIsCreateSheetOpen(false);
    router.push('/opportunity');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1e2a5e] to-[#3d4eaa] text-white">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
                <Grid3X3 size={18} />
              </button>
              <Search size={18} className="text-white/70" />
              <div className="flex items-center gap-1.5 ml-2">
                <div className="w-5 h-5 rounded bg-amber-400 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-amber-900">H</span>
                </div>
                <span className="text-sm font-semibold tracking-wide">HIVE</span>
              </div>
              <span className="text-sm text-white/70 ml-2">Contracts App</span>
            </div>
            <div className="flex items-center gap-4">
              <UserSwitcher />
              <div className="flex items-center gap-1.5 text-sm">
                <HelpCircle size={16} />
                <span>Support</span>
              </div>
            </div>
          </div>

          <div className="flex items-start justify-between pb-4">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Contracts app</h1>
              <p className="text-white/70 text-sm leading-relaxed">
                Use the Contract Application to run Bid / No Bid decisions and manage
                <br />
                your contracts through to approval.
              </p>
            </div>
            {canCreateOpportunity(currentUser.role) && (
              <Button
                onClick={() => setIsCreateSheetOpen(true)}
                className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white font-medium rounded-full px-5"
              >
                Create new Opportunity record
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-white">
        <div className="px-4 flex gap-6">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-3 px-1 text-sm border-b-2 transition-colors ${
              activeTab === 'tasks'
                ? 'border-[#3d4eaa] text-[#3d4eaa] font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Tasks assigned to you
          </button>
          <button
            onClick={() => setActiveTab('engagements')}
            className={`py-3 px-1 text-sm border-b-2 transition-colors ${
              activeTab === 'engagements'
                ? 'border-[#3d4eaa] text-[#3d4eaa] font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Opportunity records
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6">
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Tasks assigned to you</h2>
              <p className="text-sm text-muted-foreground">
                Showing tasks for <span className="font-medium text-foreground">{getRoleLabel(currentUser.role)}</span> ({currentUser.name})
              </p>
            </div>

            <Card className="border border-border bg-white shadow-sm">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="text-xs font-semibold text-foreground tracking-wider uppercase">Task Registry</h3>
              </div>

              <div className="px-4 py-3 border-b border-border">
                <div className="flex gap-4 mb-3">
                  <button
                    onClick={() => setFilterStatus('due-overdue')}
                    className={`text-sm pb-1 border-b-2 transition-colors ${
                      filterStatus === 'due-overdue'
                        ? 'border-[#3d4eaa] text-[#3d4eaa] font-medium'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Due and overdue ({userTasks.length})
                  </button>
                  <button
                    onClick={() => setFilterStatus('completed')}
                    className={`text-sm pb-1 border-b-2 transition-colors ${
                      filterStatus === 'completed'
                        ? 'border-[#3d4eaa] text-[#3d4eaa] font-medium'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Completed tasks (2)
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    className="pl-9 bg-white border-border h-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Task</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Client/Contract</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Due Date</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Status</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Flag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userTasks.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center">
                          <div className="text-muted-foreground">
                            <div className="text-lg font-medium mb-1">No tasks assigned</div>
                            <div className="text-sm">There are no tasks assigned to your role ({getRoleLabel(currentUser.role)})</div>
                          </div>
                        </td>
                      </tr>
                    )}
                    {userTasks.map((task) => (
                      <tr key={task.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-0.5">
                            <div className="font-medium text-[#3d4eaa]">{task.name}</div>
                            <div className="text-xs text-muted-foreground">{task.activity}</div>
                            <div className="text-xs text-muted-foreground">{task.workItem}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {task.client && (
                            <span className="text-[#3d4eaa] hover:underline cursor-pointer">{task.client}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="text-muted-foreground">{task.dueDate}</div>
                          <div className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>{task.relativeDate}</div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="text-muted-foreground">{task.status}</div>
                          <span className="text-xs text-[#3d4eaa] hover:underline cursor-pointer">{task.workspaceLink}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-muted-foreground hover:text-foreground transition-colors">
                            <Flag size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-4 py-3 border-t border-border flex items-center justify-end gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>Items per page:</span>
                  <Select defaultValue="10">
                    <SelectTrigger className="w-16 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <span>Page 1 of 1</span>
                <div className="flex gap-1">
                  <button className="p-1.5 hover:bg-muted rounded transition-colors">&lt;</button>
                  <button className="p-1.5 hover:bg-muted rounded transition-colors">&gt;</button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'engagements' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Opportunities</h2>
            </div>

            <Card className="bg-white border border-border">
              <div className="px-5 pt-5 pb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Opportunity Records</p>
              </div>

              <div className="px-5 pb-3">
                <div className="relative max-w-xs">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-border rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#4a90d9]"
                  />
                </div>
              </div>

              <div className="px-5 flex items-center gap-6 border-b border-border">
                {['Current', 'Complete', 'View only'].map((f, i) => (
                  <button
                    key={f}
                    className={`pb-2.5 text-sm transition-colors ${
                      i === 0
                        ? 'text-[#4a90d9] border-b-2 border-[#4a90d9] font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Engagement Name</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Opportunity Reference</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Opportunity Manager</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Risk Assessment Status</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contract Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {OPPORTUNITY_ROWS.map((row) => {
                      const raStyle = getRiskAssessmentStatusStyle(row.riskAssessmentStatus);
                      const ctStyle = getContractStatusStyle(row.contractStatus);
                      return (
                        <tr
                          key={row.id}
                          className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => router.push(`/opportunity?id=${row.id}`)}
                        >
                          <td className="px-5 py-3">
                            <span className="text-[#4a90d9] hover:underline font-medium">{row.name}</span>
                          </td>
                          <td className="px-5 py-3 text-muted-foreground">{row.reference}</td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-gray-600">{row.managerInitials}</span>
                              </div>
                              <div>
                                <div className="text-[#4a90d9] font-medium text-sm">{row.manager}</div>
                                <div className="text-xs text-muted-foreground">Associate Director</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-foreground">{row.client}</td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded uppercase whitespace-nowrap ${raStyle.className}`}>
                              {raStyle.label}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            {ctStyle ? (
                              <span className={`px-2 py-1 text-xs font-semibold rounded uppercase whitespace-nowrap ${ctStyle.className}`}>
                                {ctStyle.label}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">–</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="px-5 py-3 flex items-center justify-end gap-4 border-t border-border text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>Items per page:</span>
                  <select className="border border-border rounded px-2 py-1 bg-white text-sm">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span>Page 1 of 1</span>
                  <button className="p-1 border border-border rounded hover:bg-gray-50 disabled:opacity-50" disabled>&lt;</button>
                  <button className="p-1 border border-border rounded hover:bg-gray-50 disabled:opacity-50" disabled>&gt;</button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-[#1e2a5e] text-white mt-auto">
        <div className="px-4 py-4 text-xs text-white/60 space-y-1">
          <div className="flex gap-3">
            <a href="#" className="hover:text-white transition-colors uppercase text-[10px] tracking-wide">Terms &amp; Conditions</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors uppercase text-[10px] tracking-wide">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors uppercase text-[10px] tracking-wide">Cookies Policy</a>
          </div>
          <div className="text-[10px]">All rights reserved. Turner &amp; Townsend &copy; 2025</div>
        </div>
      </footer>

      {/* Create Opportunity Sheet */}
      <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-xl font-semibold">Create Opportunity record</SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground leading-relaxed">
              Use this form to set up a new opportunity record for your engagement. Enter the client
              location, country and cost centre then search and add the director and opportunity manager.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 px-4 pb-4">
            <div className="space-y-2">
              <Label htmlFor="opportunityName">Opportunity name*</Label>
              <Input
                id="opportunityName"
                value={opportunityName}
                onChange={(e) => setOpportunityName(e.target.value)}
                placeholder=""
                className="bg-white"
              />
              <p className="text-xs text-muted-foreground">Must be a unique name and not previously used on other engagements</p>
            </div>

            <div className="space-y-2">
              <Label>Country*</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                  <SelectItem value="fr">France</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cost centre*"
                  value={costCentre}
                  onChange={(e) => setCostCentre(e.target.value)}
                  className="pl-9 bg-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Client</h4>

              <div className="space-y-2">
                <Label htmlFor="organisationLocation">Organisation location*</Label>
                <Input
                  id="organisationLocation"
                  value={organisationLocation}
                  onChange={(e) => setOrganisationLocation(e.target.value)}
                  placeholder=""
                  className="bg-white"
                />
                <p className="text-xs text-muted-foreground">Select the location of the organisation</p>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Client*"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="pl-9 bg-white"
                  />
                </div>
                <p className="text-xs text-muted-foreground">You can search for organisations registered to the selected country by their legal name or ID</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Opportunity Director</h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search individuals*"
                  value={opportunityDirector}
                  onChange={(e) => setOpportunityDirector(e.target.value)}
                  className="pl-9 bg-white"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Opportunity Manager</h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search individuals*"
                  value={opportunityManager}
                  onChange={(e) => setOpportunityManager(e.target.value)}
                  className="pl-9 bg-white"
                />
              </div>
            </div>
          </div>

          <SheetFooter className="border-t border-border pt-4">
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => { resetForm(); setIsCreateSheetOpen(false); }}
                className="flex-1 border-[#3d4eaa] text-[#3d4eaa] hover:bg-[#3d4eaa]/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateRecord}
                disabled={!isFormValid}
                className="flex-1 bg-[#3d4eaa] hover:bg-[#2d3e9a] text-white disabled:opacity-50"
              >
                Create record
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
