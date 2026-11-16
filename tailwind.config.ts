import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{js,ts,jsx,tsx,html}'], theme: { extend: { colors: { tamkeen: '#E65416', charcoal: '#303236', 'charcoal-soft': '#3B3D42', offwhite: '#F5F5F5', beige: '#D8D6C9', grey: '#52555A' } } }, plugins: [] };
export default config;
