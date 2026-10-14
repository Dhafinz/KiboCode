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
        borderBottom: "1px solid var(--border-subtle, #DDE7F3)",
        backgroundColor: "rgba(255, 255, 255, 0.94)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 2px 10px rgba(36, 52, 77, 0.04)",
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
            color: "var(--color-deep-slate, #24344D)",
            letterSpacing: "-0.01em",
          }}
        >
          <span
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: "var(--color-sky-blue-deep, #0284C7)",
              boxShadow: "0 2px 8px rgba(2, 132, 199, 0.35)",
              display: "inline-block",
            }}
          />
          <span>
            Kibo<span style={{ color: "var(--color-soft-purple-deep, #6366F1)" }}>Code</span>
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
              fontWeight: 700,
              color: "var(--color-deep-slate, #24344D)",
              transition: "color 150ms ease",
            }}
          >
            Beranda
          </Link>
          <Link
            href="/#cara-belajar"
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "var(--color-slate-muted, #526581)",
              transition: "color 150ms ease",
            }}
          >
            Cara Belajar
          </Link>
          <Link
            href="/adventure"
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "var(--color-slate-muted, #526581)",
              transition: "color 150ms ease",
            }}
          >
            Peta Petualangan
          </Link>
          <Link
            href="/#kibo-mentor"
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "var(--color-slate-muted, #526581)",
              transition: "color 150ms ease",
            }}
          >
            AI Mentor
          </Link>
        </nav>

        {/* Desktop CTA Action */}
        <div style={{ display: "none", alignItems: "center", gap: "12px" }} className="desktop-cta">
          <Link href="/adventure">
            <Button variant="cyan" size="sm" style={{ fontWeight: 800, borderRadius: "9999px" }}>
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
            background: "#FFFFFF",
            border: "1px solid var(--border-subtle, #DDE7F3)",
            color: "var(--color-deep-slate, #24344D)",
            fontSize: "1.25rem",
            boxShadow: "var(--shadow-sm)",
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
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid var(--border-subtle, #DDE7F3)",
            boxShadow: "var(--shadow-lg)",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <Link
            href="/"
            onClick={closeMobileMenu}
            style={{
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "var(--color-deep-slate, #24344D)",
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
              fontWeight: 600,
              color: "var(--color-slate-muted, #526581)",
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
              fontWeight: 600,
              color: "var(--color-slate-muted, #526581)",
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
              fontWeight: 600,
              color: "var(--color-slate-muted, #526581)",
              padding: "8px 0",
            }}
          >
            AI Mentor Kibo
          </Link>
          <div style={{ paddingTop: "8px" }}>
            <Link href="/adventure" onClick={closeMobileMenu}>
              <Button variant="cyan" size="md" style={{ width: "100%", borderRadius: "12px", fontWeight: 800 }}>
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
