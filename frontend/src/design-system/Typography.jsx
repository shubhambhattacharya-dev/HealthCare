// STRICT TYPOGRAPHY SYSTEM (Refactoring UI Chapter 3)
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    heading: ['Inter', 'system-ui', 'sans-serif'],
  },

  // 4-TIER HIERARCHY SYSTEM
  fontSize: {
    // Body text (base: 16px)
    xs: '0.75rem',    // 12px - captions
    sm: '0.875rem',   // 14px - small text
    base: '1rem',     // 16px - body text
    lg: '1.125rem',   // 18px - large body

    // Headings (scale by 1.25 ratio)
    xl: '1.25rem',    // 20px - h4
    '2xl': '1.5rem',  // 24px - h3
    '3xl': '1.875rem',// 30px - h2
    '4xl': '2.25rem', // 36px - h1
    '5xl': '2.8125rem',// 45px - hero subtitle
    '6xl': '3.75rem', // 60px - hero title
  },

  fontWeight: {
    normal: '400',     // body text
    medium: '500',     // emphasis
    semibold: '600',   // subheadings
    bold: '700',       // headings
    extrabold: '800',  // hero text
  },

  // Optimized line heights for readability
  lineHeight: {
    tight: '1.25',    // headings (1.1-1.2)
    normal: '1.5',    // body text (1.5-1.6)
    relaxed: '1.75',  // spacious content (1.7+)
  },

  // Letter spacing for different contexts
  letterSpacing: {
    tight: '-0.025em',   // headings
    normal: '0',         // body
    wide: '0.025em',     // uppercase text
  },
};

export default typography;