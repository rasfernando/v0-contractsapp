'use client';

import { useState } from 'react';
import { HelpCircle, Grid3X3, ExternalLink, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

export default function OpportunityPage() {
  const [isRiskSheetOpen, setIsRiskSheetOpen] = useState(false);
  const [isContractSheetOpen, setIsContractSheetOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(true);

  // Hide success message after 5 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => setShowSuccess(false), 5000);
    return () => clearTimeout(timer);
  }, []);

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
          <div>
            <h1 className="text-2xl font-semibold mb-1">HSBC</h1>
            <p className="text-white/70 text-sm">1 LOMBARD STREET · LONDON</p>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mx-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-green-800 font-medium">Opportunity record created successfully</span>
            </div>
            <button onClick={() => setShowSuccess(false)} className="text-green-600 hover:text-green-700">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 px-4 py-6">
        {/* Next Step Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">Next step: Complete a Risk Assessment</h2>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            A risk assessment is required on this opportunity before assigning contracts. You can create and manage your contracts here, but a risk assessment must be completed to progress the opportunity. It is a 1 to 1 relationship.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsRiskSheetOpen(true)}
              className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white font-medium"
            >
              Create a Risk
            </Button>
            <Button
              onClick={() => setIsContractSheetOpen(true)}
              variant="outline"
              className="border-[#4a90d9] text-[#4a90d9] hover:bg-blue-50"
            >
              Create a Contract
            </Button>
          </div>
        </Card>

        {/* Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - General Information */}
          <Card className="bg-white border border-border p-6 col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              General Information
            </h3>

            <div className="space-y-6">
              {/* Client */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Client
                </h4>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded bg-red-100 flex items-center justify-center flex-shrink-0">
                    <div className="text-center">
                      <div className="text-red-600 font-bold text-xl leading-none">H</div>
                      <div className="text-red-600 font-bold text-xl leading-none">S</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">HSBC</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <div>123 Lombard Road</div>
                      <div>London</div>
                      <div>UK</div>
                    </div>
                    <a href="#" className="text-xs text-[#4a90d9] hover:underline mt-2 inline-flex items-center gap-1">
                      VIEW WEBSITE
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">Client</div>
                  <div className="text-foreground">HSBC</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">Address</div>
                  <div className="text-foreground">1 LOMBARD STREET</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">City</div>
                  <div className="text-foreground">LONDON</div>
                </div>
              </div>

              {/* Director */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Director
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold">MW</span>
                  </div>
                  <div>
                    <div className="font-semibold text-[#4a90d9]">Mary Watkins</div>
                    <div className="text-xs text-muted-foreground">London</div>
                  </div>
                </div>
              </div>

              {/* Opportunity Manager */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Opportunity Manager
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-300 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold">JD</span>
                  </div>
                  <div>
                    <div className="font-semibold text-[#4a90d9]">John Douglas</div>
                    <div className="text-xs text-muted-foreground">London</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Middle Column - Pre-Engagement Records */}
          <Card className="bg-white border border-border p-6 col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">
              Pre-Engagement Records
            </h3>

            <div className="space-y-4 text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                <MapPin size={32} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  There are no pre-engagement records linked to this engagement.
                </p>
                <p className="text-xs text-muted-foreground">
                  Use the button below to create a pre-engagement record.
                </p>
              </div>
              <Button
                onClick={() => setIsRiskSheetOpen(true)}
                className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white font-medium w-full mt-6"
              >
                Create a Risk Assessment
              </Button>
            </div>
          </Card>

          {/* Right Column - Contract Records */}
          <Card className="bg-white border border-border p-6 col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">
              Contract Records
            </h3>

            <div className="space-y-4 text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                <Users size={32} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  There are no contracts linked to this Engagement.
                </p>
                <p className="text-xs text-muted-foreground">
                  Use the button below to create a contract record.
                </p>
              </div>
              <Button
                onClick={() => setIsContractSheetOpen(true)}
                className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white font-medium w-full mt-6"
              >
                Create a contract record
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Changes Section */}
        <div className="mt-8">
          <Card className="bg-white border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Recent Changes</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">
                      Date
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">
                      Action
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">
                      Performed by
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm text-foreground">25/04/2026</td>
                    <td className="px-6 py-3 text-sm text-foreground">Opportunity Created</td>
                    <td className="px-6 py-3 text-sm text-[#4a90d9] hover:underline cursor-pointer">
                      John Douglas
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Archive Link */}
        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-red-600 hover:text-red-700 font-medium">
            Archive this Opportunity
          </a>
        </div>
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

      {/* Create Risk Assessment Sheet */}
      <Sheet open={isRiskSheetOpen} onOpenChange={setIsRiskSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-xl font-semibold">Create Risk Assessment</SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground leading-relaxed">
              Set up a new risk assessment record for this opportunity. Complete all required fields to proceed.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 px-4 pb-4">
            <div className="space-y-2">
              <Label>Risk Name*</Label>
              <Input placeholder="Enter risk assessment name" className="bg-white" />
            </div>

            <div className="space-y-2">
              <Label>Risk Level*</Label>
              <Select>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <textarea className="w-full p-2 border border-border rounded bg-white text-sm" rows={4} placeholder="Enter risk description" />
            </div>
          </div>

          <SheetFooter className="px-4 py-4 border-t border-border">
            <Button
              onClick={() => setIsRiskSheetOpen(false)}
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white">
              Create Risk Assessment
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Create Contract Sheet */}
      <Sheet open={isContractSheetOpen} onOpenChange={setIsContractSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-xl font-semibold">Create Contract Record</SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground leading-relaxed">
              Set up a new contract record for this opportunity. Complete all required fields to proceed.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 px-4 pb-4">
            <div className="space-y-2">
              <Label>Contract Name*</Label>
              <Input placeholder="Enter contract name" className="bg-white" />
            </div>

            <div className="space-y-2">
              <Label>Contract Value*</Label>
              <Input placeholder="Enter contract value" type="number" className="bg-white" />
            </div>

            <div className="space-y-2">
              <Label>Contract Status*</Label>
              <Select>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <textarea className="w-full p-2 border border-border rounded bg-white text-sm" rows={4} placeholder="Enter contract description" />
            </div>
          </div>

          <SheetFooter className="px-4 py-4 border-t border-border">
            <Button
              onClick={() => setIsContractSheetOpen(false)}
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white">
              Create Contract
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
