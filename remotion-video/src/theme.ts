// Theme colors and fonts for Pé de Chumbo
export const theme = {
    colors: {
        primary: '#E10600',
        secondary: '#FF6B35',
        accent: '#FFB800',
        dark: '#0D0D0D',
        darker: '#000000',
        light: '#FFFFFF',
        gray: '#1A1A1A',
    },
    fonts: {
        display: 'Teko, sans-serif',
        technical: 'Roboto Mono, monospace',
    },
} as const;

export type ThemeColors = typeof theme.colors;
