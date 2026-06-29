export type NavItem = {
  label: string
  href: string
}

export const navigationItems: NavItem[] = [
  { label: 'Início', href: '/' },
  { label: 'Perfil Executivo', href: '/perfil' },
  { label: 'Experiência', href: '/experiencia' },
  { label: 'IA & Dashboards', href: '/ia-dashboards' },
  { label: 'Consultoria', href: '/consultoria' },
  { label: 'Artigos', href: '/artigos' },
  { label: 'Currículo', href: '/curriculo' },
  { label: 'Contato', href: '/contato' },
]
