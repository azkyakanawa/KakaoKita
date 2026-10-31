// Ikon SVG kecil untuk landing page (tanpa pustaka tambahan).
const base = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

export const IconHome = (p) => (
  <svg {...base} {...p}><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v9.5h5v-5.5h3v5.5h5V10" /></svg>
);
export const IconLeaf = (p) => (
  <svg {...base} {...p}><path d="M5 19c0-8 5-13 15-14 0 10-5 15-13 15" /><path d="M5 19c3-5 6-8 10-10" /></svg>
);
export const IconGrid = (p) => (
  <svg {...base} {...p} fill="currentColor" stroke="none">
    <circle cx="7" cy="7" r="3" /><circle cx="17" cy="7" r="3" /><circle cx="7" cy="17" r="3" /><circle cx="17" cy="17" r="3" />
  </svg>
);
export const IconMail = (p) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7.5 8 6 8-6" /></svg>
);
export const IconUser = (p) => (
  <svg {...base} {...p} fill="currentColor" stroke="none"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4.2 3.6-6.5 8-6.5s8 2.3 8 6.5z" /></svg>
);
export const IconBars = (p) => (
  <svg {...base} {...p} fill="currentColor" stroke="none">
    <rect x="3" y="13" width="4" height="8" rx="1" /><rect x="10" y="8" width="4" height="13" rx="1" /><rect x="17" y="3" width="4" height="18" rx="1" />
  </svg>
);
export const IconPlay = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9.5" fill="currentColor" stroke="none" /><path d="m10 8.5 6 3.5-6 3.5z" fill="#fff" stroke="none" /></svg>
);
export const IconArrow = (p) => (
  <svg {...base} {...p}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
);
export const IconTrend = (p) => (
  <svg {...base} {...p} strokeWidth={3}><path d="m3 17 6-6 4 4 8-8" /><path d="M15 7h6v6" /></svg>
);
export const IconUsers = (p) => (
  <svg {...base} {...p} fill="currentColor" stroke="none">
    <circle cx="9" cy="8" r="3.6" /><path d="M2 20c0-3.8 3.1-6 7-6s7 2.2 7 6z" />
    <circle cx="17" cy="9" r="2.8" /><path d="M17 14c3 0 5 1.7 5 4.6V20h-4.2c0-2.3-.6-4.2-2.4-5.3.4-.4 1-.7 1.6-.7z" />
  </svg>
);
export const IconPhone = (p) => (
  <svg {...base} {...p} fill="currentColor" stroke="none"><path d="M6.6 3h3l1.4 4.2-2 1.5a12 12 0 0 0 5.3 5.3l1.5-2L20 13.4v3A3.6 3.6 0 0 1 16.4 20 15.4 15.4 0 0 1 4 7.6 3.6 3.6 0 0 1 6.6 3z" /></svg>
);
export const IconMailFill = (p) => (
  <svg {...base} {...p} fill="currentColor" stroke="none"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v.4l-9 6-9-6zM3 9.3l9 6 9-6v8.2a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z" /></svg>
);
export const IconPin = (p) => (
  <svg {...base} {...p} fill="currentColor" stroke="none"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12zm0-9.2a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6z" /></svg>
);
export const IconClose = (p) => (
  <svg {...base} {...p} strokeWidth={2.4}><path d="m6 6 12 12M18 6 6 18" /></svg>
);
export const IconDownload = (p) => (
  <svg {...base} {...p} strokeWidth={2.2}><path d="M12 4v11" /><path d="m7.5 11 4.5 4.5 4.5-4.5" /><path d="M4.5 15v3.5a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V15" /></svg>
);
export const IconCoins = (p) => (
  <svg viewBox="0 0 48 48" width="1em" height="1em" aria-hidden="true" focusable="false" {...p}>
    <ellipse cx="17" cy="35" rx="11" ry="4.5" fill="#C98A12" /><rect x="6" y="28" width="22" height="7" fill="#E8B130" /><ellipse cx="17" cy="28" rx="11" ry="4.5" fill="#F6CF52" />
    <ellipse cx="31" cy="25" rx="11" ry="4.5" fill="#C98A12" /><rect x="20" y="17" width="22" height="8" fill="#E8B130" /><ellipse cx="31" cy="17" rx="11" ry="4.5" fill="#F6CF52" />
  </svg>
);
export const IconSprout = (p) => (
  <svg viewBox="0 0 48 48" width="1em" height="1em" aria-hidden="true" focusable="false" {...p}>
    <path d="M24 42V24" stroke="#3F7A1F" strokeWidth="3" strokeLinecap="round" />
    <path d="M24 26c-9 0-14-5-14-13 9 0 14 5 14 13z" fill="#6DAE3A" />
    <path d="M24 22c0-8 5-13 14-13 0 8-5 13-14 13z" fill="#4C8A26" />
    <path d="M13 42h22" stroke="#7A4A25" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
export const IconGlobe = (p) => (
  <svg viewBox="0 0 48 48" width="1em" height="1em" aria-hidden="true" focusable="false" fill="none" stroke="#1F7A6E" strokeWidth="2.6" strokeLinecap="round" {...p}>
    <circle cx="24" cy="24" r="17" /><ellipse cx="24" cy="24" rx="7.5" ry="17" /><path d="M7 24h34M10 14h28M10 34h28" />
  </svg>
);
export const IconPod = (p) => (
  <svg viewBox="0 0 48 48" width="1em" height="1em" aria-hidden="true" focusable="false" {...p}>
    <path d="M24 5c9 4 14 11 14 19s-5 15-14 19C15 39 10 32 10 24S15 9 24 5z" fill="#E0861F" />
    <path d="M24 5c-4 5-6 12-6 19s2 14 6 19" fill="none" stroke="#7A3A12" strokeWidth="2.4" />
    <path d="M24 5c4 5 6 12 6 19s-2 14-6 19" fill="none" stroke="#7A3A12" strokeWidth="2.4" />
  </svg>
);
export const IconLock = (p) => (
  <svg {...base} {...p} fill="currentColor" stroke="none"><path d="M7 10V7.5a5 5 0 0 1 10 0V10h.5A2.5 2.5 0 0 1 20 12.5v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 19.5v-7A2.5 2.5 0 0 1 6.5 10zm2.2 0h5.6V7.5a2.8 2.8 0 0 0-5.6 0zM12 14a1.6 1.6 0 0 0-.9 2.9V18.5h1.8v-1.6A1.6 1.6 0 0 0 12 14z" fillRule="evenodd" /></svg>
);
export const IconEye = (p) => (
  <svg {...base} {...p}><path d="M2 12s3.7-7 10-7 10 7 10 7-3.7 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3.2" /></svg>
);
export const IconEyeOff = (p) => (
  <svg {...base} {...p}><path d="M3 3l18 18" strokeWidth={2.6} /><path d="M10.6 5.1A10 10 0 0 1 12 5c6.3 0 10 7 10 7a17 17 0 0 1-3.2 4" /><path d="M6.3 6.6C3.6 8.4 2 12 2 12s3.7 7 10 7c1.5 0 2.9-.4 4.1-1" /><path d="M9.9 9.9a3.2 3.2 0 0 0 4.2 4.2" /></svg>
);
