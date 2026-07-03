'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeModalProps {
  username: string;
}

export function QRCodeModal({ username }: QRCodeModalProps) {
  const [qrSrc, setQrSrc] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!show) return;

    const profileUrl = `${window.location.origin}/${username}`;
    QRCode.toDataURL(
      profileUrl,
      {
        width: 300,
        margin: 2,
        color: {
          dark: '#FF6B6B', // Mizari Coral Brand Color
          light: '#ffffff',
        },
      },
      (err, url) => {
        if (err) console.error(err);
        else setQrSrc(url);
      }
    );
  }, [show, username]);

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-slate-200 transition-colors"
      >
        <span className="text-sm">📱</span>
        <span>Get QR Code</span>
      </button>

      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-scale-up">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Mizari QR Code</h3>
            <p className="text-xs text-gray-500 mt-1">Download and share offline or on social media.</p>

            <div className="mt-6 flex justify-center">
              {qrSrc ? (
                <div className="rounded-2xl border-4 border-gray-50 bg-white p-3 shadow-md dark:border-slate-800">
                  <img src={qrSrc} alt="QR Code" className="h-48 w-48" />
                </div>
              ) : (
                <div className="h-48 w-48 animate-pulse bg-gray-100 dark:bg-slate-800 rounded-2xl" />
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href={qrSrc}
                download={`${username}-mizari-qr.png`}
                className="flex-1 rounded-2xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] py-2.5 text-xs font-bold text-white shadow-md hover:brightness-110 text-center"
              >
                📥 Download PNG
              </a>
              <button
                onClick={() => setShow(false)}
                className="flex-1 rounded-2xl border border-gray-200 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
