import React from 'react';

/**
 * HarviewLogo - Professional brand icon for Harview AI
 * @param {number} size - Icon size in pixels (default: 40)
 * @param {string} className - Additional CSS classes
 */
function HarviewLogo({ size = 40, className = '' }) {
    const id = React.useId().replace(/:/g, '');
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ flexShrink: 0 }}
        >
            <defs>
                <linearGradient id={`grad1-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
                <linearGradient id={`grad2-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.9" />
                </linearGradient>
                <filter id={`glow-${id}`} x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Background rounded square */}
            <rect width="48" height="48" rx="13" fill={`url(#grad1-${id})`} />
            {/* Inner highlight */}
            <rect x="1" y="1" width="46" height="23" rx="12" fill="white" fillOpacity="0.07" />

            {/* Neural / Brain circuit lines */}
            {/* Left circuit node */}
            <circle cx="10" cy="24" r="2.5" fill={`url(#grad2-${id})`} filter={`url(#glow-${id})`} />
            {/* Right circuit node */}
            <circle cx="38" cy="24" r="2.5" fill={`url(#grad2-${id})`} filter={`url(#glow-${id})`} />
            {/* Top node */}
            <circle cx="24" cy="10" r="2.5" fill={`url(#grad2-${id})`} filter={`url(#glow-${id})`} />
            {/* Bottom node */}
            <circle cx="24" cy="38" r="2.5" fill={`url(#grad2-${id})`} filter={`url(#glow-${id})`} />

            {/* Circuit connecting lines */}
            <line x1="12.5" y1="24" x2="17" y2="24" stroke="white" strokeOpacity="0.4" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="31" y1="24" x2="35.5" y2="24" stroke="white" strokeOpacity="0.4" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="24" y1="12.5" x2="24" y2="17" stroke="white" strokeOpacity="0.4" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="24" y1="31" x2="24" y2="35.5" stroke="white" strokeOpacity="0.4" strokeWidth="1.2" strokeLinecap="round" />

            {/* Center stylized "H" — clean geometric letter */}
            {/* Left vertical bar */}
            <rect x="15" y="15" width="4.5" height="18" rx="2" fill="white" />
            {/* Right vertical bar */}
            <rect x="28.5" y="15" width="4.5" height="18" rx="2" fill="white" />
            {/* Horizontal crossbar */}
            <rect x="15" y="21.75" width="18" height="4.5" rx="2" fill="white" fillOpacity="0.9" />

            {/* Micro accent dot top-right corner */}
            <circle cx="39" cy="9" r="3" fill="#60A5FA" fillOpacity="0.85" />
        </svg>
    );
}

export default HarviewLogo;
