export const designTokens = {
  colors: {
    brelio: {
      primary: '#01ABAD',
      secondary: '#8FB6D9',
      success: '#68BD44',
      background: '#F3F4F4',
      accent: '#EECD87',
      surface: '#FFFFFF',
      border: '#DCE3E6',
      text: '#1F2A30',
      textMuted: '#5F6B73',
    },
  },
  typography: {
    titleFont:
      'Pretendard, "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
    bodyFont:
      'Pretendard, "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
    numberFont:
      'Pretendard, "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
    h1: { fontSize: '2.125rem', lineHeight: '1.25', fontWeight: 700 },
    h2: { fontSize: '1.5rem', lineHeight: '1.35', fontWeight: 700 },
    body: { fontSize: '1rem', lineHeight: '1.65', fontWeight: 400 },
    caption: { fontSize: '0.875rem', lineHeight: '1.55', fontWeight: 500 },
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  radius: {
    card: '24px',
    button: '9999px',
    input: '14px',
  },
  shadow: {
    card: '0 6px 20px rgba(31, 42, 48, 0.04)',
    button: '0 2px 8px rgba(1, 171, 173, 0.18)',
  },
  layout: {
    contentMaxWidth: '960px',
  },
} as const;
