/** Maps patient sidebar labels to URL path segments. */
export const PATIENT_TABS = {
  Dashboard: '',
  Appointments: 'appointments',
  Reports: 'reports',
  Messages: 'messages',
  'Learning Hub': 'learning-hub',
  Settings: 'settings',
};

export function tabToSegment(tab) {
  return PATIENT_TABS[tab] ?? '';
}

export function segmentToTab(segment) {
  if (!segment) return 'Dashboard';
  for (const [tab, path] of Object.entries(PATIENT_TABS)) {
    if (path === segment) return tab;
  }
  return 'Dashboard';
}

export function getActiveTabFromPath(pathname, basePrefix = '') {
  const base = (basePrefix || '').replace(/\/$/, '');
  let path = (pathname || '/').replace(/\/$/, '') || '/';

  if (base && path.startsWith(base)) {
    path = path.slice(base.length) || '/';
  }

  const segment = path.replace(/^\//, '').split('/')[0] || '';
  return segmentToTab(segment);
}

export function getNavigatePath(tab, basePrefix = '') {
  const segment = tabToSegment(tab);
  const base = (basePrefix || '').replace(/\/$/, '');
  if (!segment) return base || '/';
  return base ? `${base}/${segment}` : `/${segment}`;
}
