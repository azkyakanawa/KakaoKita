'use client';
import { useEffect, useState } from 'react';

// Tombol "Install Aplikasi". Di Chrome (Android/desktop) memakai event beforeinstallprompt.
// Di iPhone/iPad (Safari) tidak ada tombol otomatis, jadi ditampilkan petunjuk manual.
export default function InstallButton() {
  const [promptEvent, setPromptEvent] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (standalone) setInstalled(true);
    setIsIos(/iphone|ipad|ipod/i.test(window.navigator.userAgent));

    const onPrompt = (e) => {
      e.preventDefault();
      setPromptEvent(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  async function install() {
    if (!promptEvent) return;
    promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
  }

  if (installed) return <span className="badge ok">Aplikasi sudah terpasang</span>;
  if (promptEvent) {
    return (
      <button className="btn" onClick={install}>
        Install Aplikasi
      </button>
    );
  }
  if (isIos) {
    return (
      <p className="muted" style={{ color: '#fff' }}>
        Di iPhone: ketuk tombol Bagikan, lalu pilih &quot;Tambah ke Layar Utama&quot;.
      </p>
    );
  }
  return null;
}
