"use client";

import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Override toast styling sesuai tema MimbarPro */}
      <style>{`
        :root {
          --toastify-color-light: #fff;
          --toastify-color-dark: #0f1c2e;
          --toastify-color-info: #14b89a;
          --toastify-color-success: #14b89a;
          --toastify-color-warning: #f59e0b;
          --toastify-color-error: #ef4444;
          --toastify-color-progress-light: #14b89a;
          --toastify-color-progress-dark: #14b89a;
          --toastify-font-family: var(--font-outfit, 'Outfit', sans-serif);
          --toastify-text-color-light: #0d4f44;
          --toastify-text-color-dark: #e2faf6;
        }
        .Toastify__toast {
          border-radius: 14px !important;
          border: 1px solid rgba(20, 184, 154, 0.2) !important;
          box-shadow: 0 8px 32px rgba(20, 184, 154, 0.15) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          font-family: var(--font-outfit, 'Outfit', sans-serif) !important;
          font-size: 0.875rem !important;
          padding: 12px 16px !important;
        }
        .Toastify__toast--light {
          background: rgba(255, 255, 255, 0.92) !important;
          color: #0d4f44 !important;
        }
        .Toastify__toast--dark {
          background: rgba(10, 22, 40, 0.92) !important;
          color: #e2faf6 !important;
          border-color: rgba(20, 184, 154, 0.15) !important;
        }
        .Toastify__progress-bar {
          border-radius: 0 0 14px 14px !important;
          height: 3px !important;
        }
        .Toastify__progress-bar--success,
        .Toastify__progress-bar--info {
          background: linear-gradient(90deg, #14b89a, #f59e0b) !important;
        }
        .Toastify__toast-icon svg { fill: #14b89a !important; }
        .Toastify__close-button { color: #14b89a !important; opacity: 0.7; }
        .Toastify__close-button:hover { opacity: 1; }
        /* Fix centering on all screen sizes */
        .Toastify__toast-container--bottom-center {
          left: 50% !important;
          transform: translateX(-50%) !important;
          bottom: 24px !important;
          width: min(92vw, 400px) !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      `}</style>

      <ToastContainer
        position="bottom-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        className=""
      />
    </>
  );
}
