import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export function Navbar() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        backgroundColor: "rgba(10, 15, 29, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          height: "64px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          id="nav-logo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: 800,
            fontSize: "1.25rem",
            color: "#ffffff",
          }}
        >
          <span
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              backgroundColor: "var(--cyan-core)",
              boxShadow: "0 0 10px var(--cyan-core)",
              display: "inline-block",
            }}
          />
          <span>Kibo<span style={{ color: "var(--cyan-core)" }}>Code</span></span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Badge variant="purple" size="sm" id="badge-phase-foundation">
            P0 • Foundation
          </Badge>
        </div>
      </div>
    </header>
  );
}
