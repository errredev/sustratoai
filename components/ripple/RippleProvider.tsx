"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Ripple {
  x: number;
  y: number;
  color: string;
  id: string;
  scale?: number;
}

// ——— Contexto ———
// Actualizamos la firma para aceptar un parámetro de escala opcional
const RippleContext = createContext<
  ((e: React.MouseEvent, color?: string, scale?: number) => void) | null
>(null);

export const useRipple = () => {
  const context = useContext(RippleContext);
  if (!context) {
    throw new Error("useRipple debe ser usado dentro de un RippleProvider");
  }
  return context;
};

// ——— Componente Wave (tres ondas) ———
const Wave: React.FC<{
  x: number;
  y: number;
  color: string;
  scale?: number;
}> = ({ x, y, color, scale = 12 }) => (
  <>
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: scale, opacity: 0.0 }}
        transition={{ duration: 0.7, delay: i * 0.05, ease: "easeOut" }}
        style={{
          position: "fixed",
          left: x,
          top: y,
          width: 16,
          height: 16,
          borderRadius: "9999px",
          background: color,
          pointerEvents: "none",
          zIndex: 50,
          transform: "translate(-50%, -50%)",
        }}
      />
    ))}
  </>
);

const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// ——— Provider ———
export const RippleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const triggerRipple = useCallback(
    (e: React.MouseEvent, color = "#4f46e5", scale = 12) => {
      const { clientX: x, clientY: y } = e;
      const id = generateId();
      setRipples((r) => [...r, { x, y, color, id, scale }]);
      // limpia el estado después de la animación
      setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 800);
    },
    []
  );

  return (
    <RippleContext.Provider value={triggerRipple}>
      {children}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {ripples.map((rp) => (
              <Wave key={rp.id} {...rp} />
            ))}
          </AnimatePresence>,
          document.body
        )}
    </RippleContext.Provider>
  );
};
