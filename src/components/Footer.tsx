import { Link } from '@tanstack/react-router'

export function Footer() {
  return (
    <footer className="pt-12 pb-8 container mx-auto flex justify-center">
      <nav
        className="text-sm flex gap-4 items-center"
        aria-label="Footer navigation"
      >
        <Link to="/site-notice" className="footer-link">
          Site Notice
        </Link>
        <span aria-hidden="true">&middot;</span>
        <Link to="/privacy-policy" className="footer-link">
          Privacy
        </Link>
      </nav>
    </footer>
  )
}
