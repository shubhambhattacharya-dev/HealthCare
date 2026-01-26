// SYSTEMATIC 8px GRID SYSTEM (Refactoring UI Chapter 4)
const spacing = {
  // Base units (8px = 0.5rem) - Systematic scale
  0: '0px',
  1: '0.25rem',      // 4px  - xs padding
  2: '0.5rem',       // 8px  - sm padding
  3: '0.75rem',      // 12px - component spacing
  4: '1rem',         // 16px - md padding
  6: '1.5rem',       // 24px - lg padding
  8: '2rem',         // 32px - xl padding
  10: '2.5rem',      // 40px - section spacing
  12: '3rem',        // 48px - large sections
  16: '4rem',        // 64px - page sections
  20: '5rem',        // 80px - hero spacing
  24: '6rem',        // 96px - major sections
  32: '8rem',        // 128px - full height sections
};

// Semantic spacing aliases for consistent usage
export const semanticSpacing = {
  // Component internals
  component: {
    padding: {
      xs: spacing[2],    // 8px
      sm: spacing[3],    // 12px
      md: spacing[4],    // 16px
      lg: spacing[6],    // 24px
      xl: spacing[8],    // 32px
    },
    gap: {
      xs: spacing[1],    // 4px
      sm: spacing[2],    // 8px
      md: spacing[3],    // 12px
      lg: spacing[4],    // 16px
    }
  },

  // Layout sections
  layout: {
    section: {
      sm: spacing[8],    // 32px
      md: spacing[12],   // 48px
      lg: spacing[16],   // 64px
      xl: spacing[20],   // 80px
    },
    container: {
      padding: spacing[4], // 16px
      maxWidth: '1280px', // 80rem
    }
  },

  // Typography spacing
  typography: {
    lineHeight: {
      tight: '1.25',    // headings
      normal: '1.5',    // body
      relaxed: '1.75',  // spacious
    },
    margin: {
      heading: spacing[3], // 12px below headings
      paragraph: spacing[4], // 16px between paragraphs
    }
  }
};

export default spacing;