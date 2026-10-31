// Ikon khusus dashboard admin (SVG sebaris, mengikuti warna teks).
const base = { width: '1em', height: '1em', viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true, focusable: false };

export const AIGrid = (p) => (
  <svg {...base} {...p}><rect x="3" y="3" width="8" height="8" rx="2.2" /><rect x="13" y="3" width="8" height="8" rx="2.2" /><rect x="3" y="13" width="8" height="8" rx="2.2" /><rect x="13" y="13" width="8" height="8" rx="2.2" /></svg>
);
export const AIUsers = (p) => (
  <svg {...base} {...p}><circle cx="9" cy="8" r="3.7" /><path d="M2 20c0-3.9 3.1-6.2 7-6.2s7 2.3 7 6.2z" /><circle cx="17.2" cy="9" r="2.8" /><path d="M17.2 14c3 0 4.8 1.7 4.8 4.6V20h-4.2c0-2.3-.6-4.2-2.4-5.3.5-.4 1.1-.7 1.8-.7z" /></svg>
);
export const AITrend = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="m3 17 6-6 4 4 8-8" /><path d="M15 7h6v6" /></svg>
);
export const AILeaf = (p) => (
  <svg {...base} {...p}><path d="M20.5 3.5c-8.6.2-14 4.3-14 10.3 0 1.1.2 2 .5 2.9-1 1.2-1.7 2.6-2 4.3l1.8.4c.2-1.1.7-2.1 1.4-2.9 1 .5 2.2.8 3.6.8 5.8 0 9.2-5.4 9.2-11.4 0-1-.1-1.9-.5-2.4zM11 15.5c-.9 0-1.6-.2-2.2-.5 1.2-2.2 3.2-4.2 6-5.7-2 1.9-3.4 4-4.1 6.2z" /></svg>
);
export const AIHandshake = (p) => (
  <svg {...base} {...p}><path d="M2 8.5 6.2 6l3.3 1.3L12 6h3.2l2.7 1.2L22 6v8.6l-3.6 3-1.3-1.2c-.5.8-1.4 1-2.2.6l-.3.4c-.6.9-1.7 1.1-2.6.6l-.2.3c-.6.8-1.8 1-2.7.3l-3-2.4L2 14.2zm3.4-.4-1.4.9v4.2l2.1 1.5 1.3-1.7L7 11.3l2-2.5-1-.4zm8.2.5-2.1.9L9 12.6l3.7 3 1.3-1.6 1.6 1.3.5-.7-4.5-3.7 1.4-1.3 3.3 2.7.9-1.1-3.9-3.2z" /></svg>
);
export const AICalc = (p) => (
  <svg {...base} {...p}><path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm1 2.5v3.8h10V4.5zM7.8 11a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zm4.2 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zm4.2 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM7.8 15.2a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zm4.2 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zm4.2 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z" fillRule="evenodd" /></svg>
);
export const AIMegaphone = (p) => (
  <svg {...base} {...p}><path d="M3 9.5A2.5 2.5 0 0 1 5.5 7H9l8-4v16l-8-4H8l1 5H6.2L5 15.9A2.5 2.5 0 0 1 3 13.5zM19 8.5a4 4 0 0 1 0 7zM21.2 5.6a8 8 0 0 1 0 12.8z" /></svg>
);
export const AICalendar = (p) => (
  <svg {...base} {...p}><path d="M7 2h2v2h6V2h2v2h1.5A2.5 2.5 0 0 1 21 6.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 19.5v-13A2.5 2.5 0 0 1 5.5 4H7zM5 9v10.5c0 .3.2.5.5.5h13c.3 0 .5-.2.5-.5V9zm2.5 2h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2z" fillRule="evenodd" /></svg>
);
export const AIUser = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="8" r="4.4" /><path d="M3.5 21c0-4.6 3.8-7.2 8.5-7.2s8.5 2.6 8.5 7.2z" /></svg>
);
export const AIMail = (p) => (
  <svg {...base} {...p}><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v.4l-9 6-9-6zM3 9.3l9 6 9-6v8.2a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z" /></svg>
);
export const AIIdCard = (p) => (
  <svg {...base} {...p}><path d="M4.5 4h15A2.5 2.5 0 0 1 22 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5v-11A2.5 2.5 0 0 1 4.5 4zM4 8v9.5c0 .3.2.5.5.5h15c.3 0 .5-.2.5-.5V8zm2.5 2h4v2h-4zm0 3.5h4v2h-4zM13 10h5v2h-5zm0 3.5h5v2h-5z" fillRule="evenodd" /></svg>
);
export const AIShield = (p) => (
  <svg {...base} {...p}><path d="M12 2 4 5.2v6c0 5 3.4 9.1 8 10.8 4.6-1.7 8-5.8 8-10.8v-6zm-1.2 13.4-3-3 1.4-1.4 1.6 1.6 4-4 1.4 1.4z" fillRule="evenodd" /></svg>
);
export const AIGear = (p) => (
  <svg {...base} {...p}><path d="M10.3 2h3.4l.5 2.6c.6.2 1.1.5 1.6.9l2.5-.9 1.7 3-2 1.7c.1.6.1 1.1 0 1.7l2 1.7-1.7 3-2.5-.9c-.5.4-1 .7-1.6.9l-.5 2.6h-3.4l-.5-2.6c-.6-.2-1.1-.5-1.6-.9l-2.5.9-1.7-3 2-1.7a5 5 0 0 1 0-1.7l-2-1.7 1.7-3 2.5.9c.5-.4 1-.7 1.6-.9zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" fillRule="evenodd" transform="translate(0 1.5)" /></svg>
);
export const AILock = (p) => (
  <svg {...base} {...p}><path d="M7 10V7.5a5 5 0 0 1 10 0V10h.5A2.5 2.5 0 0 1 20 12.5v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 19.5v-7A2.5 2.5 0 0 1 6.5 10zm2.2 0h5.6V7.5a2.8 2.8 0 0 0-5.6 0z" fillRule="evenodd" /></svg>
);
export const AILogout = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" /><path d="M16 8l4 4-4 4" /><path d="M20 12H9" /></svg>
);
export const AIChevronDown = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
);
export const AIChevronRight = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="m9 5 7 7-7 7" /></svg>
);
export const AICheck = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
export const AIArrow = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
);
export const AIPod = (p) => (
  <svg viewBox="0 0 48 48" width="1em" height="1em" aria-hidden="true" focusable="false" {...p}>
    <path d="M24 5c9 4 14 11 14 19s-5 15-14 19C15 39 10 32 10 24S15 9 24 5z" fill="#E0861F" />
    <path d="M24 5c-4 5-6 12-6 19s2 14 6 19" fill="none" stroke="#7A3A12" strokeWidth="2.4" />
    <path d="M24 5c4 5 6 12 6 19s-2 14-6 19" fill="none" stroke="#7A3A12" strokeWidth="2.4" />
  </svg>
);
export const AIPin = (p) => (
  <svg {...base} {...p}><path d="M12 22s7.5-6.4 7.5-12.5a7.5 7.5 0 1 0-15 0C4.5 15.6 12 22 12 22zm0-9.6a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8z" fillRule="evenodd" /></svg>
);
export const AIBars = (p) => (
  <svg {...base} {...p}><rect x="3" y="12" width="4.5" height="9" rx="1.2" /><rect x="9.8" y="7" width="4.5" height="14" rx="1.2" /><rect x="16.5" y="3" width="4.5" height="18" rx="1.2" /></svg>
);
export const AIClipboard = (p) => (
  <svg {...base} {...p}><path d="M9 2h6a1.5 1.5 0 0 1 1.5 1.5V4H18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1.5v-.5A1.5 1.5 0 0 1 9 2zm.2 2.2v1.6h5.6V4.2zM8 11h8v1.8H8zm0 3.5h8v1.8H8zm0 3.5h5v1.8H8z" fillRule="evenodd" /></svg>
);
export const AILand = (p) => (
  <svg {...base} {...p}><path d="M3 18.5 8.5 5l4 8 3-5L21 18.5zM3 20.5h18V22H3z" /></svg>
);
export const AIPlus = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
);
export const AIEye = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.7-7 10-7 10 7 10 7-3.7 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3.2" /></svg>
);
