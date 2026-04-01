'use client';

import { useState } from 'react';
import { Search, Settings, HelpCircle, Bell, Flag, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data for tasks
const TASKS = [
  {
    id: 1,
    name: '[Task name]',
    activity: '[Activity name]',
    workItem: '[Work item name]',
    client: '[Global case studies]',
    dueDate: '(DD/MM/YYYY)',
    relativeDate: 'Overdue 1 month',
    status: '[Commission name]',
    workspaceLink: 'View Workspace',
    priority: 'high',
  },
  {
    id: 2,
    name: '[Task name]',
    activity: '[Activity name]',
    workItem: '[Work item name]',
    client: '[Global]',
    dueDate: '(DD/MM/YYYY)',
    relativeDate: 'Overdue 1 week',
    status: '[Commission name]',
    workspaceLink: 'View Workspace',
    priority: 'high',
  },
  {
    id: 3,
    name: '[Task name]',
    activity: '[Activity name]',
    workItem: '[Work item name]',
    client: '[Submissions delivered]',
    dueDate: '(DD/MM/YYYY)',
    relativeDate: 'Overdue 2 days',
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
    dueDate: '(DD/MM/YYYY)',
    relativeDate: 'Due today',
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
    dueDate: '(DD/MM/YYYY)',
    relativeDate: 'Due 1 week',
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
    dueDate: '(DD/MM/YYYY)',
    relativeDate: 'Due 2 weeks',
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
    dueDate: '(DD/MM/YYYY)',
    relativeDate: 'Due 2 weeks',
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
    dueDate: '(DD/MM/YYYY)',
    relativeDate: 'Due 3 weeks',
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
    dueDate: '(DD/MM/YYYY)',
    relativeDate: 'Due 1 month',
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
    dueDate: '(DD/MM/YYYY)',
    relativeDate: 'Due 2 months',
    status: '[Commission name]',
    workspaceLink: 'View Workspace',
    priority: 'low',
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'engagements'>('tasks');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('due-overdue');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-amber-600';
      case 'low':
        return 'text-neutral-600';
      default:
        return 'text-neutral-600';
    }
  };

  const getPriorityBgColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50';
      case 'medium':
        return 'bg-amber-50';
      case 'low':
        return 'bg-neutral-50';
      default:
        return 'bg-neutral-50';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#2d3561] to-[#3d4edf] text-white">
        <div className="px-8 py-6">
          {/* Top nav */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center">
                <span className="text-xs font-bold">H</span>
              </div>
              <span className="text-sm font-medium">HIVE</span>
              <span className="text-xs text-white/60 ml-2">Contracts App</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">Hi [User first name]</span>
              <button className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                <span className="text-xs">👤</span>
              </button>
              <button className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                <HelpCircle size={16} />
              </button>
              <span className="text-sm">Support</span>
            </div>
          </div>

          {/* Title section */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Contracts app</h1>
              <p className="text-white/80 text-sm">
                Use the Contract Application to find / No Bid decisions and manage
                <br />
                your contracts through to approval.
              </p>
            </div>
            <Button className="bg-[#4f9ef9] hover:bg-[#3a8aff] text-white font-medium">
              Create new RM record
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-white">
        <div className="px-8 flex gap-8">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'tasks'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Tasks assigned to you
          </button>
          <button
            onClick={() => setActiveTab('engagements')}
            className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'engagements'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Engagement records
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {/* Section Title */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Tasks assigned to you</h2>
              <p className="text-sm text-muted-foreground">
                All tasks assigned to you across all of your workspaces are listed below
              </p>
            </div>

            {/* Task Registry */}
            <Card className="border border-border bg-white">
              <div className="p-6 border-b border-border">
                <h3 className="text-xs font-semibold text-foreground tracking-wider">
                  TASK REGISTRY
                </h3>
              </div>

              {/* Filters */}
              <div className="p-6 border-b border-border space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    className="pl-9 bg-white border-border"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Status Filter */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterStatus('due-overdue')}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      filterStatus === 'due-overdue'
                        ? 'bg-primary text-white'
                        : 'bg-muted text-foreground hover:bg-secondary'
                    }`}
                  >
                    Due and overdue (20)
                  </button>
                  <button
                    onClick={() => setFilterStatus('completed')}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      filterStatus === 'completed'
                        ? 'bg-primary text-white'
                        : 'bg-muted text-foreground hover:bg-secondary'
                    }`}
                  >
                    Completed tasks (2)
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-foreground">
                        Task
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-foreground">
                        Client/Contract
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-foreground">
                        Due Date
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-foreground">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-foreground">
                        Flag
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {TASKS.map((task) => (
                      <tr
                        key={task.id}
                        className={`border-b border-border hover:bg-muted/50 transition-colors ${getPriorityBgColor(
                          task.priority
                        )}`}
                      >
                        <td className="px-6 py-4 text-sm">
                          <div className="space-y-1">
                            <div className="font-medium text-primary">{task.name}</div>
                            <div className="text-xs text-muted-foreground">{task.activity}</div>
                            <div className="text-xs text-muted-foreground">{task.workItem}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="text-primary hover:underline cursor-pointer">
                            {task.client}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="font-medium text-foreground">{task.dueDate}</div>
                          <div className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.relativeDate}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="text-primary hover:underline cursor-pointer">
                            {task.status}
                          </div>
                          <div className="text-xs text-primary hover:underline cursor-pointer">
                            View Workspace
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button className="text-muted-foreground hover:text-foreground transition-colors">
                            <Flag size={18} className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/30 text-xs text-muted-foreground">
                <div>Items per page: 10</div>
                <div className="flex items-center gap-2">
                  <span>Page (3 of 4)</span>
                  <button className="px-2 py-1 hover:bg-muted rounded transition-colors">
                    ←
                  </button>
                  <button className="px-2 py-1 hover:bg-muted rounded transition-colors">
                    →
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'engagements' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Engagement records</h2>
              <p className="text-sm text-muted-foreground">Your active engagements</p>
            </div>
            <Card className="p-8 text-center text-muted-foreground">
              <p>Engagement records content goes here</p>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-[#2d3561] text-white mt-12">
        <div className="px-8 py-6 text-xs text-white/60 space-y-2">
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">
              TERMS & CONDITIONS
            </a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">
              PRIVACY POLICY
            </a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">
              COOKIES POLICY
            </a>
          </div>
          <div>All rights reserved. Turner & Townsend © 2025</div>
        </div>
      </footer>
    </div>
  );
}
