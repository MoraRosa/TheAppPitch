/**
 * BrandLayout
 *
 * Shared chrome (header + footer) for any platform-branded surface --
 * marketing pages and the authenticated account/billing surface both
 * mount their content inside this layout so navigation feels continuous
 * across host boundaries.
 *
 * Marketing renders this layout with no auth controls; the account
 * surface passes its own right-aligned controls (sign out, business
 * switcher, etc.) via the `headerRight` prop.
 *
 * @module shared/BrandLayout
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { APP_METADATA } from "@theapp/config";
import { media } from "./brand.js";

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--brand-color-neutral0);
  color: var(--brand-color-neutral900);
  font-family: var(--brand-font-sans);
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: var(--brand-zIndex-header);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--brand-space-4);
  padding: var(--brand-space-4) var(--brand-space-6);
  border-bottom: var(--brand-borderWidth-hairline) solid
    var(--brand-color-neutral200);
  background: var(--brand-glass-fillStrong);
  backdrop-filter: blur(var(--brand-glass-blur));
  -webkit-backdrop-filter: blur(var(--brand-glass-blur));
`;

const Brand = styled(Link)`
  font-weight: var(--brand-fontWeight-bold);
  font-size: var(--brand-fontSize-lg);
  letter-spacing: var(--brand-letterSpacing-tight);
  color: var(--brand-color-neutral900);
  text-decoration: none;
  white-space: nowrap;
`;

/* Desktop nav + right controls, inline from the md breakpoint up. */
const DesktopCluster = styled.div`
  display: none;

  ${media.up.md} {
    display: flex;
    align-items: center;
    gap: var(--brand-space-8);
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: var(--brand-space-6);

  a {
    color: var(--brand-color-neutral700);
    text-decoration: none;
    font-size: var(--brand-fontSize-sm);
    font-weight: var(--brand-fontWeight-medium);
    transition: color var(--brand-motion-fast) var(--brand-motion-ease);
  }
  a:hover {
    color: var(--brand-color-primary600);
  }
`;

/* Hamburger toggle -- only present below the md breakpoint. */
const MenuToggle = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--brand-space-8);
  height: var(--brand-space-8);
  padding: 0;
  border: var(--brand-borderWidth-hairline) solid var(--brand-color-neutral200);
  border-radius: var(--brand-radius-md);
  background: var(--brand-color-neutral0);
  color: var(--brand-color-neutral900);
  cursor: pointer;
  transition: border-color var(--brand-motion-fast) var(--brand-motion-ease);

  &:hover {
    border-color: var(--brand-color-primary500);
  }
  &:focus-visible {
    outline: var(--brand-borderWidth-thick) solid var(--brand-color-primary500);
    outline-offset: var(--brand-focusRing-offset);
  }

  ${media.up.md} {
    display: none;
  }
`;

/* Dimmed backdrop behind the open mobile drawer. */
const Scrim = styled.div`
  position: fixed;
  inset: 0;
  z-index: var(--brand-zIndex-overlay);
  background: var(--brand-glass-scrim);

  ${media.up.md} {
    display: none;
  }
`;

/* Mobile drawer. Slides in from the right; motion is disabled under
   prefers-reduced-motion (opacity-only). */
const Drawer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: var(--brand-zIndex-menu);
  width: min(80vw, 320px);
  display: flex;
  flex-direction: column;
  gap: var(--brand-space-6);
  padding: var(--brand-space-8) var(--brand-space-6);
  background: var(--brand-color-neutral0);
  border-left: var(--brand-borderWidth-hairline) solid
    var(--brand-color-neutral200);
  box-shadow: var(--brand-shadow-glass);

  nav {
    display: flex;
    flex-direction: column;
    gap: var(--brand-space-4);
  }
  nav a {
    color: var(--brand-color-neutral900);
    text-decoration: none;
    font-size: var(--brand-fontSize-lg);
    font-weight: var(--brand-fontWeight-medium);
  }
  nav a:hover {
    color: var(--brand-color-primary600);
  }

  ${media.up.md} {
    display: none;
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DrawerClose = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--brand-space-8);
  height: var(--brand-space-8);
  padding: 0;
  border: none;
  border-radius: var(--brand-radius-md);
  background: none;
  color: var(--brand-color-neutral700);
  cursor: pointer;

  &:hover {
    color: var(--brand-color-neutral900);
  }
  &:focus-visible {
    outline: var(--brand-borderWidth-thick) solid var(--brand-color-primary500);
    outline-offset: var(--brand-focusRing-offset);
  }
`;

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const Main = styled.main`
  flex: 1;
  width: 100%;
  max-width: var(--brand-size-contentMax);
  margin: 0 auto;
  padding: var(--brand-space-8) var(--brand-space-6);
`;

const Footer = styled.footer`
  border-top: var(--brand-borderWidth-hairline) solid
    var(--brand-color-neutral200);
  padding: var(--brand-space-8) var(--brand-space-6);
  font-size: var(--brand-fontSize-sm);
  color: var(--brand-color-neutral500);
`;

const FooterInner = styled.div`
  max-width: var(--brand-size-contentMax);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--brand-space-4);
`;

const FooterCopyright = styled.div`
  text-align: center;
`;

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode} [props.nav]          Center/left nav links
 * @param {React.ReactNode} [props.headerRight]  Right-aligned controls
 *   (e.g. "Sign in" CTA on marketing, account menu on account surface)
 * @param {React.ReactNode} [props.footerNav]    Optional block rendered
 *   above the copyright line. Marketing uses this for legal/blog/etc.
 *   links; the account surface leaves it unset.
 */
export default function BrandLayout({ children, nav, headerRight, footerNav }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef(null);
  const drawerRef = useRef(null);
  const location = useLocation();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Close on route change so navigating from a drawer link never leaves
  // the overlay stranded open on the destination page.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // While open: Escape closes and returns focus to the toggle; move
  // initial focus into the drawer; lock body scroll behind the scrim.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawerRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const hasNav = Boolean(nav);

  return (
    <Page>
      <Header>
        <Brand to="/">{APP_METADATA.NAME}</Brand>

        {/* Desktop: inline nav + right controls from md up. */}
        <DesktopCluster>
          {hasNav ? <Nav>{nav}</Nav> : null}
          {headerRight ? <div>{headerRight}</div> : null}
        </DesktopCluster>

        {/* Mobile: single hamburger that opens the drawer. Only shown
            when there is nav or right-side content to reveal. */}
        {(hasNav || headerRight) && (
          <MenuToggle
            ref={toggleRef}
            type="button"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="brand-mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </MenuToggle>
        )}
      </Header>

      {menuOpen && (
        <>
          <Scrim onClick={closeMenu} />
          <Drawer
            id="brand-mobile-menu"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            tabIndex={-1}
          >
            <DrawerHeader>
              <Brand to="/" onClick={closeMenu}>
                {APP_METADATA.NAME}
              </Brand>
              <DrawerClose
                type="button"
                aria-label="Close menu"
                onClick={() => {
                  closeMenu();
                  toggleRef.current?.focus();
                }}
              >
                <CloseIcon />
              </DrawerClose>
            </DrawerHeader>
            {hasNav ? <nav aria-label="Primary">{nav}</nav> : null}
            {headerRight ? <div>{headerRight}</div> : null}
          </Drawer>
        </>
      )}

      <Main id="main-content">{children}</Main>
      <Footer>
        <FooterInner>
          {footerNav ? footerNav : null}
          <FooterCopyright>
            &copy; {new Date().getFullYear()} {APP_METADATA.NAME}
          </FooterCopyright>
        </FooterInner>
      </Footer>
    </Page>
  );
}
