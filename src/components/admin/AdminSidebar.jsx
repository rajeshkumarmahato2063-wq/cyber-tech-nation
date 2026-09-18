import React from 'react';
import { Layers, Users, Shield, MessageSquare, HelpCircle, Award, BarChart3, QrCode, Bell, FileText, Settings, Radio } from 'lucide-react';

/**
 * Cyber Admin Navigation Sidebar / Tab Bar - Production Ready
 */
const AdminSidebar = ({ activeTab, setActiveTab, counts = {} }) => {
  const tabs = [
    { id: 'overview', label: 'Overview & Charts', icon: BarChart3 },
    { id: 'live_ops', label: 'Live Event Controls', icon: Radio },
    { id: 'registrations', label: 'Registrations', icon: Layers, count: counts.registrations },
    { id: 'checkin', label: 'QR Check-In', icon: QrCode },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'maintenance', label: 'Maintenance & Backups', icon: Settings },
    { id: 'teams', label: 'Teams Roster', icon: Users, count: counts.teams },
    { id: 'users', label: 'User Roles', icon: Shield, count: counts.users },
    { id: 'audit', label: 'Audit Logs', icon: FileText },
    { id: 'contacts', label: 'Inquiries', icon: MessageSquare, count: counts.contacts },
    { id: 'faqs', label: 'Manage FAQs', icon: HelpCircle },
    { id: 'sponsors', label: 'Manage Sponsors', icon: Award },
  ];


  return (
    <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-white/10 shrink-0 font-mono text-xs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              isActive
                ? 'bg-cyan-500 text-[#050816] shadow-[0_0_15px_rgba(0,229,255,0.4)] font-bold'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? 'bg-[#050816]/30 text-[#050816]' : 'bg-white/10 text-cyan-300'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default AdminSidebar;

