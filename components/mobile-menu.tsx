"use client";

import { useState } from "react";

export function MobileMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-menu-wrap">
      <button className="ghost-button menu-button" onClick={() => setOpen((value) => !value)} type="button">
        {open ? "Cerrar" : "Menu"}
      </button>
      <div className={open ? "nav-links mobile-open" : "nav-links"}>{children}</div>
    </div>
  );
}
