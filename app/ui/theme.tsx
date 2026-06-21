import { createTheme } from 'remix/ui/theme'

const MONACO_STACK =
  'Monaco, "SF Mono", "Andale Mono", "Courier New", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

export const AgentAdminTheme = createTheme({
  space: {
    none: '0px',
    px: '1px',
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    xxl: '24px',
  },
  radius: {
    none: '0px',
    sm: '0px',
    md: '2px',
    lg: '4px',
    xl: '4px',
    full: '4px',
  },
  fontFamily: {
    sans: MONACO_STACK,
    mono: MONACO_STACK,
  },
  fontSize: {
    xxxs: '10px',
    xxs: '11px',
    xs: '12px',
    sm: '13px',
    md: '14px',
    lg: '16px',
    xl: '20px',
    xxl: '28px',
  },
  lineHeight: {
    tight: '1.2',
    normal: '1.45',
    relaxed: '1.65',
  },
  letterSpacing: {
    tight: '0',
    normal: '0',
    meta: '0',
    wide: '0',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  control: {
    height: {
      sm: '26px',
      md: '32px',
      lg: '38px',
    },
  },
  surface: {
    lvl0: '#050505',
    lvl1: '#0a0a09',
    lvl2: '#11110f',
    lvl3: '#171714',
    lvl4: '#20201c',
  },
  shadow: {
    xs: 'none',
    sm: 'none',
    md: 'none',
    lg: 'none',
    xl: 'none',
  },
  colors: {
    text: {
      primary: '#f4f3ea',
      secondary: '#c7c5b8',
      muted: '#807d72',
      link: '#f4f3ea',
    },
    border: {
      subtle: '#20201d',
      default: '#34342f',
      strong: '#5d5b51',
    },
    focus: {
      ring: '#f4f3ea',
    },
    overlay: {
      scrim: 'rgb(0 0 0 / 0.72)',
    },
    action: {
      primary: {
        background: '#f4f3ea',
        backgroundHover: '#ffffff',
        backgroundActive: '#d8d6ca',
        foreground: '#050505',
        border: '#f4f3ea',
      },
      secondary: {
        background: '#0d0d0c',
        backgroundHover: '#171714',
        backgroundActive: '#20201c',
        foreground: '#f4f3ea',
        border: '#34342f',
      },
      danger: {
        background: '#d8d0c8',
        backgroundHover: '#eee7df',
        backgroundActive: '#bcb4ad',
        foreground: '#050505',
        border: '#d8d0c8',
      },
    },
  },
})
