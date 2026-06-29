export type NavItem = {
  label: { pt: string; en: string }
  href: string
}

export const navigationItems: NavItem[] = [
  { label: { pt: 'Início', en: 'Home' }, href: '/' },
  { label: { pt: 'Perfil Executivo', en: 'Executive Profile' }, href: '/perfil' },
  { label: { pt: 'Experiência', en: 'Experience' }, href: '/experiencia' },
  { label: { pt: 'IA & Dashboards', en: 'AI & Dashboards' }, href: '/ia-dashboards' },
  { label: { pt: 'Consultoria', en: 'Consulting' }, href: '/consultoria' },
  { label: { pt: 'Artigos', en: 'Articles' }, href: '/artigos' },
  { label: { pt: 'Currículo', en: 'Resume' }, href: '/curriculo' },
  { label: { pt: 'Contato', en: 'Contact' }, href: '/contato' },
]
