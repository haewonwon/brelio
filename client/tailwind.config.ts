import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brelio: {
          primary: '#01ABAD',
          'primary-strong': '#01989A',
          secondary: '#8FB6D9',
          success: '#68BD44',
          background: '#F3F4F4',
          accent: '#EECD87',
          surface: '#FFFFFF',
          border: '#DCE3E6',
          text: '#1F2A30',
          muted: '#5F6B73',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard',
          'Noto Sans KR',
          'Apple SD Gothic Neo',
          'Malgun Gothic',
          'sans-serif',
        ],
      },
      borderRadius: {
        card: '24px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 6px 20px rgba(31, 42, 48, 0.04)',
        button: '0 2px 8px rgba(1, 171, 173, 0.18)',
      },
      maxWidth: {
        layout: '960px',
      },
      spacing: {
        4.5: '1.125rem',
      },
    },
  },
};

export default config;
