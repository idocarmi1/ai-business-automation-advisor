const LEADS_KEY = 'autobiz_demo_leads';

export function createLead(payload) {
  const lead = {
    id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    createdAt: new Date().toISOString(),
    eventType: payload.eventType,
    fullName: payload.fullName || '',
    email: payload.email || '',
    businessName: payload.businessName || '',
    selectedPlan: payload.selectedPlan || '',
    assessment: payload.assessment || null,
    recommendation: payload.recommendation || null,
    phone: payload.phone || '',
    message: payload.message || '',
  };

  const leads = getLeads();
  localStorage.setItem(LEADS_KEY, JSON.stringify([lead, ...leads]));
  return lead;
}

export function getLeads() {
  try {
    return JSON.parse(localStorage.getItem(LEADS_KEY)) || [];
  } catch {
    return [];
  }
}

export function clearLeads() {
  localStorage.removeItem(LEADS_KEY);
}

export function exportLeadsToCsv() {
  const leads = getLeads();
  const headers = ['eventType', 'fullName', 'email', 'businessName', 'selectedPlan', 'createdAt'];
  const rows = leads.map((lead) => headers.map((field) => csvCell(lead[field])).join(','));
  return [headers.join(','), ...rows].join('\n');
}

function csvCell(value) {
  return `"${String(value || '').replaceAll('"', '""')}"`;
}
