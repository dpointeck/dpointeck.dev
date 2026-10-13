import { Link, useLocation } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { IconTwitter, IconGithub, IconHome } from '../svg'
import { ThemeSwitcher } from './ThemeSwitcher'
import { PageTransitionLogo } from './PageTransition'
import './Nav.css'

const socialLinks = [
  { name: 'twitter', icon: IconTwitter, url: 'https://twitter.com/home' },
  { name: 'github', icon: IconGithub, url: 'https://github.com/dpointeck' },
]

const pages = [
  { name: 'about', href: '/about' },
  { name: 'journal', href: '/journal' },
  { name: 'uses', href: '/uses' },
]

function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const location = useLocation()
  const isActive =
    location.pathname === href ||
    (href !== '/' && location.pathname.startsWith(href))

  return (
    <Link to={href} className={`nav-link ${isActive ? 'active' : ''}`}>
      {children}
    </Link>
  )
}

function HomeLink() {
  const location = useLocation()
  const isActive = location.pathname === '/'

  return (
    <Link
      to="/"
      className={`mobile-home-link ${isActive ? 'active' : ''}`}
      aria-label="Home"
    >
      <IconHome className="mobile-home-icon" />
    </Link>
  )
}

export function Nav() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Only show nav after mount to prevent both showing at once
    setMounted(true)
  }, [])

  if (!mounted) {
    // Reserve space but don't show content to prevent layout shift
    return (
      <>
        <nav
          className="desktop-nav"
          aria-hidden="true"
          style={{ visibility: 'hidden', minHeight: '4rem' }}
        >
          <div className="container mx-auto">
            <div className="nav-container" />
          </div>
        </nav>
        <nav
          className="mobile-nav"
          aria-hidden="true"
          style={{ visibility: 'hidden', minHeight: '4rem' }}
        >
          <div className="mobile-nav-content" />
        </nav>
      </>
    )
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="desktop-nav" aria-label="Main navigation">
        <div className="container mx-auto">
          <div className="nav-container">
            <div className="brand">
              <Link
                to="/"
                className="brand-link"
                aria-label="daniel pointecker"
              >
                daniel pointecker
              </Link>
              <div className="social-nav">
                {socialLinks.map((link) => (
                  <a
                    href={link.url}
                    key={link.name}
                    aria-label={link.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <link.icon className="icon" width="16" height="16" />
                  </a>
                ))}
                <ThemeSwitcher />
              </div>
            </div>
            <div className="nav-logo">
              <PageTransitionLogo />
            </div>
            <div className="nav-menu">
              {pages.map((page) => (
                <NavLink key={page.name} href={page.href}>
                  {page.name}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="mobile-nav" aria-label="Mobile navigation">
        <div className="mobile-nav-content">
          <HomeLink />
          {pages.map((page) => (
            <NavLink key={page.name} href={page.href}>
              {page.name}
            </NavLink>
          ))}
          <ThemeSwitcher />
        </div>
      </nav>
    </>
  )
}
