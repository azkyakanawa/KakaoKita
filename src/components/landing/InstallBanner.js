'use client';
import { useEffect, useState } from 'react';
import { IconDownload, IconClose } from './Icons';

// Banner "KakaoKita dapat diinstal..." di bagian bawah layar.
// Chrome/Android: memakai beforeinstallprompt. iPhone: menampilkan petunjuk Bagikan.
// Browser lain: menampilkan petunjuk menu browser.
export default function InstallBanner() {
  const [visible, setVisible] = useState(false);
  const [promptEvent, setPromptEvent] = useState(null);
  const [hint, setHint] = useState('');

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    let closed = false;
    try { closed = sessionStorage.getItem('kk-install-closed') === '1'; } catch {}
    if (!standalone && !closed) setVisible(true);

    const onPrompt = (e) => { e.preventDefault(); setPromptEvent(e); };
    const onInstalled = () => { setVisible(false); setPromptEvent(null); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  function close() {
    setVisible(false);
    try { sessionStorage.setItem('kk-install-closed', '1'); } catch {}
  }

  async function install() {
    if (promptEvent) {
      promptEvent.prompt();
      await promptEvent.userChoice;
      setPromptEvent(null);
      return;
    }
    const ios = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    setHint(
      ios
        ? 'Di iPhone: ketuk tombol Bagikan, lalu pilih "Tambah ke Layar Utama".'
        : 'Buka menu browser (titik tiga), lalu pilih "Instal aplikasi" atau "Tambahkan ke layar utama".'
    );
  }

  if (!visible) return null;
  return (
    <div className="lp-install" role="region" aria-label="Pasang aplikasi">
      <span className="lp-install-icon"><IconDownload /></span>
      <p className="lp-install-text">
        {hint || 'KakaoKita dapat diinstal di perangkat Anda untuk pengalaman yang lebih baik!'}
      </p>
      <button type="button" className="lp-pill dark lp-install-btn" onClick={install}>Install Sekarang</button>
      <button type="button" className="lp-install-close" onClick={close} aria-label="Tutup banner"><IconClose /></button>
    </div>
  );
}
