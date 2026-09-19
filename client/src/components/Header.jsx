import { useState } from 'react'
import { NavLink } from 'react-router-dom'

function Header() {
    const [menuOpen, setMenuOpen] = useState(false)

    function closeMenu() {
        setMenuOpen(false)
    }

    return (
        <header className="site-header">
            <div className="header-inner">
                <NavLink
                    to="/"
                    className="site-logo"
                    onClick={closeMenu}
                >
                    PaddleMatch
                </NavLink>

                <button
                    type="button"
                    className="menu-button"
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <nav
                    className={`site-nav ${menuOpen ? 'nav-open' : ''
                        }`}
                    aria-label="Main navigation"
                >
                    <NavLink
                        to="/"
                        className="nav-link"
                        onClick={closeMenu}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/paddles"
                        className="nav-link"
                        onClick={closeMenu}
                    >
                        Paddle Match
                    </NavLink>

                    <NavLink
                        to="/players"
                        className="nav-link"
                        onClick={closeMenu}
                    >
                        Player Match
                    </NavLink>

                    <NavLink
                        to="/leaderboard"
                        className="nav-link"
                        onClick={closeMenu}
                    >
                        Leaderboard
                    </NavLink>
                </nav>
            </div>
        </header>
    )
}

export default Header
