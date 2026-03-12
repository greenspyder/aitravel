import { Theme, ThemeName } from '@/types/chat'

export const THEMES: Record<ThemeName, Theme> = {
  romantic: {
    name: 'romantic',
    label: 'Romantic',
    from: '#FF006E',
    via: '#8338EC',
    to: '#3A86FF',
    textColor: '#ffffff',
    accentColor: '#FF006E',
  },
  friendship: {
    name: 'friendship',
    label: 'Friendship',
    from: '#00B4D8',
    via: '#0077B6',
    to: '#023E8A',
    textColor: '#ffffff',
    accentColor: '#00B4D8',
  },
  dark: {
    name: 'dark',
    label: 'Dark',
    from: '#0D0D0D',
    via: '#1C1C1E',
    to: '#2C2C2E',
    textColor: '#ffffff',
    accentColor: '#A0A0A0',
  },
  neon: {
    name: 'neon',
    label: 'Neon',
    from: '#0D0D0D',
    via: '#1a0a2e',
    to: '#0D0D0D',
    textColor: '#ffffff',
    accentColor: '#39FF14',
  },
}

export function getThemeGradient(theme: Theme): string {
  return `linear-gradient(135deg, ${theme.from}, ${theme.via}, ${theme.to})`
}

export function getThemeStyle(theme: Theme): React.CSSProperties {
  return {
    background: getThemeGradient(theme),
    color: theme.textColor,
  }
}
