"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  React.useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        backgroundColor: "rgba(7, 10, 20, 0.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          height: "72px",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          id="nav-logo"
          onClick={closeMobileMenu}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: 800,
            fontSize: "1.35rem",
            color: "#ffffff",
            letterSpacing: "-0.01em",
          }}
        >
          <span
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: "var(--cyan-core)",
              boxShadow: "0 0 12px var(--cyan-core)",
              display: "inline-block",
            }}
          />
          <span>
            Kibo<span style={{ color: "var(--cyan-core)" }}>Code</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Navigasi Utama"
          style={{
            display: "none",
            alignItems: "center",
            gap: "28px",
          }}
          className="desktop-nav"
        >
          <Link
            href="/"
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "var(--text-main)",
              transition: "color 150ms ease",
            }}
          >
            Beranda
          </Link>
          <Link
            href="/#cara-belajar"
            style={{
              fontSize: "0.95rem",
              fontWeight: 500,
              color: "var(--text-muted)",
              transition: "color 150ms ease",
            }}
          >
            Cara Belajar
          </Link>
          <Link
            href="/adventure"
            style={{
              fontSize: "0.95rem",
              fontWeight: 500,
              color: "var(--text-muted)",
              transition: "color 150ms ease",
            }}
          >
            Peta Petualangan
          </Link>
          <Link
            href="/#kibo-mentor"
            style={{
              fontSize: "0.95rem",
              fontWeight: 500,
              color: "var(--text-muted)",
              transition: "color 150ms ease",
            }}
          >
            AI Mentor
          </Link>
        </nav>

        {/* Desktop CTA Action */}
        <div style={{ display: "none", alignItems: "center", gap: "12px" }} className="desktop-cta">
          <Link href="/adventure">
            <Button variant="cyan" size="sm" style={{ fontWeight: 700, borderRadius: "9999px" }}>
              Mulai Petualangan 🚀
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          id="nav-mobile-toggle"
          aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu navigasi"}
          aria-expanded={mobileMenuOpen}
          onClick={toggleMobileMenu}
          className="mobile-toggle"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            color: "#ffffff",
            fontSize: "1.25rem",
          }}
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          id="nav-mobile-menu"
          style={{
            backgroundColor: "rgba(10, 15, 29, 0.98)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <Link
            href="/"
            onClick={closeMobileMenu}
            style={{
              fontSize: "1.05rem",
              fontWeight: 600,
              color: "#ffffff",
              padding: "8px 0",
            }}
          >
            Beranda
          </Link>
          <Link
            href="/#cara-belajar"
            onClick={closeMobileMenu}
            style={{
              fontSize: "1.05rem",
              fontWeight: 500,
              color: "var(--text-muted)",
              padding: "8px 0",
            }}
          >
            Cara Belajar
          </Link>
          <Link
            href="/adventure"
            onClick={closeMobileMenu}
            style={{
              fontSize: "1.05rem",
              fontWeight: 500,
              color: "var(--text-muted)",
              padding: "8px 0",
            }}
          >
            Peta Petualangan (5 Wilayah)
          </Link>
          <Link
            href="/#kibo-mentor"
            onClick={closeMobileMenu}
            style={{
              fontSize: "1.05rem",
              fontWeight: 500,
              color: "var(--text-muted)",
              padding: "8px 0",
            }}
          >
            AI Mentor Kibo
          </Link>
          <div style={{ paddingTop: "8px" }}>
            <Link href="/adventure" onClick={closeMobileMenu}>
              <Button variant="cyan" size="md" style={{ width: "100%", borderRadius: "12px" }}>
                Mulai Petualangan 🚀
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Responsiveness Inline Styles for Navbar Elements */}
      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-cta {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}

export default Navbar;
