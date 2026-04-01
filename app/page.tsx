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

// Mock data for tasks
const TASKS = [
  {
    id: 1,
    name: '[Task name]',
    activity: '[Activity name]',
    workItem: '[Work item name]',
    client: '[Upload case studies]',
    dueDate: '[DD/MM/YYYY]',
    relativeDate: 'Overdue: 1 month',
    status: '[Commission name]',
    workspaceLink: 'View Workspace',
    priority: 'high',
  },
  {
    id: 2,
    name: '[Task name]',
    activity: '[Activity name]',
    workItem: '[Work item name]',
    client: '',
    dueDate: '[DD/MM/YYYY]',
    relativeDate: 'Overdue: 1 week',
    status: '[Commission name]',
    workspaceLink: 'View Workspace',
    priority: 'high',
  },
  {
    id: 3,
    name: '[Task name]',
    activity: '[Activity name]',
    workItem: '[Work item name]',
    client: '[Submit deliverables]',
    dueDate: '[DD/MM/YYYY]',
    relativeDate: 'Overdue: 2 days',
    status: '[Commission name]',
    workspaceLink: 'View Workspace',
    priority: 'high',
  },
  {
    id: 4,
    name: '[Task name]',
    activity: '[Activity name]',
    workItem: '[Work item name]',
    client: '',
    dueDate: '[DD/MM/YYYY]',
    relativeDate: 'Due: today',
    status: '[Commission name]',
    workspaceLink: 'View Workspace',
    priority: 'medium',
  },
  {
    id: 5,
    name: '[Task name]',
    activity: '[Activity name]',
    workItem: '[Work item name]',
    client: '[Upload case studies]',
    dueDate: '[DD/MM/YYYY]',
    relativeDate: 'Due: two days',
    status: '[Commission name]',
    workspaceLink: 'View Workspace',
    priority: 'medium',
  },
  {
    id: 6,
    name: '[Task name]',
    activity: '[Activity name]',
    workItem: '[Work item name]',
    client: '',
    dueDate: '[DD/MM/YYYY]',
    relativeDate: 'Due: 1 week',
    status: '[Commission name]',
    workspaceLink: 'View Workspace',
    priority: 'low',
  },
  {
    id: 7,
    name: '[Task name]',
    activity: '[Activity name]',
    workItem: '[Work item name]',
    client: '[Upload case studies]',
    dueDate: '[DD/MM/YYYY]',
    relativeDate: 'Due: 2 weeks',
    status: '[Commission name]',
    workspaceLink: 'View Workspace',
    priority: 'low',
  },
  {
    id: 8,
    name: '[Task name]',
    activity: '[Activity name]',
    workItem: '[Work item name]',
    client: '',
    dueDate: '[DD/MM/YYYY]',
    relativeDate: 'Due: 3 weeks',
    status: '[Commission name]',
    workspaceLink: 'View Workspace',
    priority: 'low',
  },
  {
    id: 9,
    name: '[Task name]',
    activity: '[Activity name]',
    workItem: '[Work item name]',
    client: '',
    dueDate: '[DD/MM/YYYY]',
    relativeDate: 'Due: 1 month',
    status: '[Commission name]',
    workspaceLink: 'View Workspace',
    priority: 'low',
  },
  {
    id: 10,
    name: '[Task name]',
    activity: '[Activity name]',
    workItem: '[Work item name]',
    client: '',
    dueDate: '[DD/MM/YYYY]',
    relativeDate: 'Due: 2 months',
    status: '[Commission name]',
    workspaceLink: 'View Workspace',
    priority: 'low',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'tasks' | 'engagements'>('tasks');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('due-overdue');
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

  // Form state for Create Opportunity
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
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-amber-600';
      case 'low':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
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
    // Handle form submission
    console.log('Creating record:', {
      opportunityName,
      country,
      costCentre,
      organisationLocation,
      client,
      opportunityDirector,
      opportunityManager,
    });
    resetForm();
    setIsCreateSheetOpen(false);
    // Navigate to opportunity page
    router.push('/opportunity');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1e2a5e] to-[#3d4eaa] text-white">
        <div className="px-4 py-3">
          {/* Top nav */}
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
              <span className="text-sm">Hi [User first name]</span>
              <button className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                <span className="text-xs font-medium">U</span>
              </button>
              <div className="flex items-center gap-1.5 text-sm">
                <HelpCircle size={16} />
                <span>Support</span>
              </div>
            </div>
          </div>

          {/* Title section */}
          <div className="flex items-start justify-between pb-4">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Contracts app</h1>
              <p className="text-white/70 text-sm leading-relaxed">
                Use the Contract Application to run Bid / No Bid decisions and manage
                <br />
                your contracts through to approval.
              </p>
            </div>
            <Button
              onClick={() => setIsCreateSheetOpen(true)}
              className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white font-medium rounded-full px-5"
            >
              Create new Opportunity record
            </Button>
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
            {/* Section Title */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Tasks assigned to you</h2>
              <p className="text-sm text-muted-foreground">
                All tasks assigned to you across all of your workspaces are listed below
              </p>
            </div>

            {/* Task Registry */}
            <Card className="border border-border bg-white shadow-sm">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="text-xs font-semibold text-foreground tracking-wider uppercase">
                  Task Registry
                </h3>
              </div>

              {/* Filters */}
              <div className="px-4 py-3 border-b border-border">
                {/* Status Filter Tabs */}
                <div className="flex gap-4 mb-3">
                  <button
                    onClick={() => setFilterStatus('due-overdue')}
                    className={`text-sm pb-1 border-b-2 transition-colors ${
                      filterStatus === 'due-overdue'
                        ? 'border-[#3d4eaa] text-[#3d4eaa] font-medium'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Due and overdue (20)
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

                {/* Search */}
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

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                        Task
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                        Client/Contract
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                        Due Date
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                        Flag
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {TASKS.map((task) => (
                      <tr
                        key={task.id}
                        className="border-b border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-0.5">
                            <div className="font-medium text-[#3d4eaa]">{task.name}</div>
                            <div className="text-xs text-muted-foreground">{task.activity}</div>
                            <div className="text-xs text-muted-foreground">{task.workItem}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {task.client && (
                            <span className="text-[#3d4eaa] hover:underline cursor-pointer">
                              {task.client}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="text-muted-foreground">{task.dueDate}</div>
                          <div className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.relativeDate}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="text-muted-foreground">{task.status}</div>
                          <span className="text-xs text-[#3d4eaa] hover:underline cursor-pointer">
                            {task.workspaceLink}
                          </span>
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

              {/* Pagination */}
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
                <span>Page [#] of [#]</span>
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
              <div className="px-5 pt-5 pb-3 border-b border-border">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Opportunity Records</p>
              </div>

              <div className="px-5 pt-4 pb-3 flex items-center gap-3 border-b border-border">
                {/* Search */}
                <div className="relative flex-1 max-w-xs">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-border rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#4a90d9]"
                  />
                </div>
                {/* Filters */}
                <div className="flex items-center gap-1">
                  {['Current', 'Conclude', 'View only'].map((f, i) => (
                    <button
                      key={f}
                      className={`px-3 py-1 text-xs rounded border transition-colors ${
                        i === 0
                          ? 'bg-[#3d4eaa] text-white border-[#3d4eaa]'
                          : 'bg-white text-muted-foreground border-border hover:border-gray-400'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="text-left px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Engagement Name</th>
                    <th className="text-left px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Opportunity Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'T&T TR6638 Turner and Country Documentation', ref: '17365961' },
                    { name: 'Grey Mcguire Corp Confidentiality Agreement', ref: '17365962' },
                    { name: 'Innovation and Administration Centres of Delivery', ref: '17432945' },
                    { name: 'Google Along C3 Drive Case Management Services', ref: '17519783' },
                    { name: 'Airport Management Services', ref: '17365963' },
                    { name: 'T&T TR6638 Turner and Country Documentation', ref: '17365964' },
                    { name: 'DPG Williams Corp Confidentiality Agreement', ref: '17415822' },
                    { name: 'Renovation and Administration Services at Gateway', ref: '17415823' },
                    { name: 'Google Along C3 Drive Case Management Services', ref: '32361489' },
                    { name: 'Project Management Services', ref: '17365965' },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => router.push('/opportunity')}
                    >
                      <td className="px-5 py-3">
                        <span className="text-[#4a90d9] hover:underline font-medium">{row.name}</span>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{row.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-[#1e2a5e] text-white mt-auto">
        <div className="px-4 py-4 text-xs text-white/60 space-y-1">
          <div className="flex gap-3">
            <a href="#" className="hover:text-white transition-colors uppercase text-[10px] tracking-wide">
              Terms & Conditions
            </a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors uppercase text-[10px] tracking-wide">
              Privacy Policy
            </a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors uppercase text-[10px] tracking-wide">
              Cookies Policy
            </a>
          </div>
          <div className="text-[10px]">All rights reserved. Turner & Townsend © 2025</div>
        </div>
      </footer>

      {/* Create Opportunity Sheet */}
      <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-xl font-semibold">Create Opportunity record</SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground leading-relaxed">
              Use this form to set up a new opportunity record for your engagement. Enter the client
              location, country and cost centre then search and add the director and opportunity
              manager.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 px-4 pb-4">
            {/* Opportunity Name */}
            <div className="space-y-2">
              <Label htmlFor="opportunityName">Opportunity name*</Label>
              <Input
                id="opportunityName"
                value={opportunityName}
                onChange={(e) => setOpportunityName(e.target.value)}
                placeholder=""
                className="bg-white"
              />
              <p className="text-xs text-muted-foreground">
                Must be a unique name and not previously used on other engagements
              </p>
            </div>

            {/* Country */}
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

            {/* Cost Centre */}
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

            {/* CLIENT Section */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Client
              </h4>

              {/* Organisation Location */}
              <div className="space-y-2">
                <Label htmlFor="organisationLocation">Organisation location*</Label>
                <Input
                  id="organisationLocation"
                  value={organisationLocation}
                  onChange={(e) => setOrganisationLocation(e.target.value)}
                  placeholder=""
                  className="bg-white"
                />
                <p className="text-xs text-muted-foreground">
                  Select the location of the organisation
                </p>
              </div>

              {/* Client Search */}
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
                <p className="text-xs text-muted-foreground">
                  You can search for organisations registered to the selected country by their legal
                  name or ID
                </p>
              </div>
            </div>

            {/* OPPORTUNITY DIRECTOR Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Opportunity Director
              </h4>
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

            {/* OPPORTUNITY MANAGER Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Opportunity Manager
              </h4>
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
                onClick={() => {
                  resetForm();
                  setIsCreateSheetOpen(false);
                }}
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
