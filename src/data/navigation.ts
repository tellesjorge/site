export type NavSubItem = {
  label: { pt: string; en: string }
  href: string
}

export type NavItem = {
  label: { pt: string; en: string }
  href: string
  dropdown?: NavSubItem[]
}

export const navigationItems: NavItem[] = [
  { label: { pt: 'Início', en: 'Home' }, href: '/' },
  { 
    label: { pt: 'Trajetória', en: 'Profile' }, 
    href: '/perfil',
    dropdown: [
      { label: { pt: 'Perfil Executivo', en: 'Executive Profile' }, href: '/perfil' },
      { label: { pt: 'Experiência', en: 'Experience' }, href: '/experiencia' },
      { label: { pt: 'Currículo', en: 'Resume' }, href: '/curriculo' }
    ]
  },
  { label: { pt: 'IA & Dashboards', en: 'AI & Dashboards' }, href: '/ia-dashboards' },
  { label: { pt: 'Consultoria', en: 'Consulting' }, href: '/consultoria' },
  { label: { pt: 'Artigos', en: 'Articles' }, href: '/artigos' }
]
