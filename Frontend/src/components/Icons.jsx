/**
 * FinFlow SVG Icon Library
 * All icons are 24x24 viewBox, stroke-based (currentColor).
 * Pass `size`, `color`, `className`, `strokeWidth` as props.
 */

const defaults = { size: 20, color: 'currentColor', strokeWidth: 1.75 }

// 💰 Logo / Finance
export const LogoIcon = ({ size = 28, color = '#3b82f6', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.75" />
    <path d="M12 6v1m0 10v1M9.5 9.5C9.5 8.4 10.6 7.5 12 7.5s2.5.9 2.5 2c0 2-5 2-5 4 0 1.1 1.1 2 2.5 2s2.5-.9 2.5-2"
      stroke={color} strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

// 📊 Dashboard / Chart
export const DashboardIcon = ({ size = defaults.size, color = defaults.color, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="12" width="4" height="9" rx="1" stroke={color} strokeWidth={defaults.strokeWidth} />
    <rect x="10" y="7" width="4" height="14" rx="1" stroke={color} strokeWidth={defaults.strokeWidth} />
    <rect x="17" y="3" width="4" height="18" rx="1" stroke={color} strokeWidth={defaults.strokeWidth} />
  </svg>
)

// 📋 Records / List
export const RecordsIcon = ({ size = defaults.size, color = defaults.color, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
      stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round" />
    <rect x="9" y="3" width="6" height="4" rx="1" stroke={color} strokeWidth={defaults.strokeWidth} />
    <line x1="9" y1="12" x2="15" y2="12" stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round" />
    <line x1="9" y1="16" x2="13" y2="16" stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round" />
  </svg>
)

// 👥 Users
export const UsersIcon = ({ size = defaults.size, color = defaults.color, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="9" cy="7" r="4" stroke={color} strokeWidth={defaults.strokeWidth} />
    <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"
      stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round" />
    <path d="M16 3.13a4 4 0 010 7.75" stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round" />
    <path d="M21 21v-2a4 4 0 00-3-3.87" stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round" />
  </svg>
)

// 📈 Trending Up / Income
export const TrendingUpIcon = ({ size = defaults.size, color = defaults.color, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"
      stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="17 6 23 6 23 12"
      stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// 📉 Trending Down / Expense
export const TrendingDownIcon = ({ size = defaults.size, color = defaults.color, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" className={className}>
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"
      stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="17 18 23 18 23 12"
      stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// 💼 Balance / Wallet
export const WalletIcon = ({ size = defaults.size, color = defaults.color, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="7" width="20" height="14" rx="2" stroke={color} strokeWidth={defaults.strokeWidth} />
    <path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z"
      stroke={color} strokeWidth={defaults.strokeWidth} />
    <circle cx="17" cy="14" r="1.5" fill={color} />
  </svg>
)

// ✕ Close
export const CloseIcon = ({ size = 18, color = defaults.color, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// ← Arrow Left
export const ArrowLeftIcon = ({ size = 16, color = defaults.color, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="19" y1="12" x2="5" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <polyline points="12 19 5 12 12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// → Arrow Right
export const ArrowRightIcon = ({ size = 16, color = defaults.color, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <polyline points="12 5 19 12 12 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// + Plus / Add
export const PlusIcon = ({ size = 16, color = defaults.color, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// 🚪 Logout
export const LogoutIcon = ({ size = defaults.size, color = defaults.color, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
      stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round" />
    <polyline points="16 17 21 12 16 7"
      stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <line x1="21" y1="12" x2="9" y2="12"
      stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round" />
  </svg>
)

// 🔍 Monitoring / Alert
export const MonitoringIcon = ({ size = defaults.size, color = defaults.color, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round"/>
    <line x1="12" y1="17" x2="12.01" y2="17" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)

// 📜 Audit / History
export const AuditIcon = ({ size = defaults.size, color = defaults.color, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="14 2 14 8 20 8" stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="16" y1="13" x2="8" y2="13" stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round"/>
    <line x1="16" y1="17" x2="8" y2="17" stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round"/>
    <polyline points="10 9 9 9 8 9" stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round"/>
  </svg>
)

// 💰 Budget / Target
export const BudgetIcon = ({ size = defaults.size, color = defaults.color, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth={defaults.strokeWidth}/>
    <circle cx="12" cy="12" r="6" stroke={color} strokeWidth={defaults.strokeWidth}/>
    <circle cx="12" cy="12" r="2" fill={color}/>
  </svg>
)

// 📈 Forecast
export const ForecastIcon = ({ size = defaults.size, color = defaults.color, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// 🛡️ Compliance Shield
export const ComplianceIcon = ({ size = defaults.size, color = defaults.color, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="9 12 11 14 15 10" stroke={color} strokeWidth={defaults.strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)