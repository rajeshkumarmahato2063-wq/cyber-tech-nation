import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/admin';
import { userService } from '../services/user';
import { contactService } from '../services/contact';
import { faqService } from '../services/faq';
import { sponsorService } from '../services/sponsor';
import { useRealtime } from './useRealtime';

/**
 * Custom useAdmin Hook - Manages admin dashboard state, queries & mutations
 */
export const useAdmin = () => {
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    pendingRegistrations: 0,
    approvedRegistrations: 0,
    rejectedRegistrations: 0,
    totalTeams: 0,
    totalContacts: 0,
  });

  const [analytics, setAnalytics] = useState({
    domainBreakdown: [],
    statusDistribution: [],
  });

  const [registrations, setRegistrations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [sponsors, setSponsors] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Search State
  const [statusFilter, setStatusFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadAllAdminData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, analyticsRes, regRes, teamsRes, usersRes, contactsRes, faqsRes, sponsorsRes] =
        await Promise.all([
          adminService.getDashboardStats(),
          adminService.getAnalyticsData(),
          adminService.getAllRegistrations({
            status: statusFilter,
            domain: domainFilter,
            search: searchTerm,
          }),
          adminService.getAllTeams(),
          userService.getAllUsers(),
          contactService.getContactMessages(),
          faqService.getFAQs(),
          sponsorService.getSponsors(),
        ]);

      setStats(statsRes);
      setAnalytics(analyticsRes);
      setRegistrations(regRes.registrations || regRes || []);
      setTeams(teamsRes || []);
      setUsers(usersRes || []);
      setContacts(contactsRes || []);
      if (faqsRes) setFaqs(faqsRes);
      if (sponsorsRes) setSponsors(sponsorsRes);
    } catch (err) {
      console.warn('useAdmin data fetch error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, domainFilter, searchTerm]);

  useEffect(() => {
    loadAllAdminData();
  }, [loadAllAdminData]);

  // Connect Realtime auto-update
  useRealtime(['registrations', 'contacts', 'teams', 'profiles', 'sponsors'], () => {
    loadAllAdminData();
  });

  // Action Mutations
  const updateRegistrationStatus = async (id, status) => {
    try {
      await adminService.updateRegistrationStatus(id, status);
      await loadAllAdminData();
    } catch (err) {
      throw err;
    }
  };

  const deleteRegistration = async (id) => {
    try {
      await adminService.deleteRegistration(id);
      await loadAllAdminData();
    } catch (err) {
      throw err;
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await userService.updateUserRole(userId, newRole);
      await loadAllAdminData();
    } catch (err) {
      throw err;
    }
  };

  const deleteUser = async (userId) => {
    try {
      await userService.deleteUser(userId);
      await loadAllAdminData();
    } catch (err) {
      throw err;
    }
  };

  return {
    stats,
    analytics,
    registrations,
    teams,
    users,
    contacts,
    faqs,
    sponsors,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    domainFilter,
    setDomainFilter,
    searchTerm,
    setSearchTerm,
    refreshAdminData: loadAllAdminData,
    updateRegistrationStatus,
    deleteRegistration,
    updateUserRole,
    deleteUser,
  };
};

export default useAdmin;
