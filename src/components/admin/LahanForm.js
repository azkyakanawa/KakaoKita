'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { kecilkanFoto } from '@/lib/foto';

const DOKUMEN = [
  'SHM (Sertifikat Hak Milik)',
  'SKT (Surat Keterangan Tanah)',
  'Girik / Letter C',
  'Akta Jual Beli',
  'Surat Garapan / Sewa',
  'Lainnya',
];

// Form tambah / ubah lahan. Hanya dipakai admin; petani tidak punya akses menulis (diatur RLS).
export default function LahanForm({ petaniId, lahan, onSaved, onCancel }) {
  const edit = Boolean(lahan);
  const [f, setF] = useState({
    nama: lahan?.nama || '',
    desa: lahan?.desa || '',
    kecamatan: lahan?.kecamatan || '',
    luas_ha: lahan?.luas_ha ?? '',
    status: lahan?.status || 'aktif',
    jenis_dokumen: lahan?.jenis_dokumen || '',
    nomor_dokumen: lahan?.nomor_dokumen || '',
    catatan: lahan?.catatan || '',
  });
  const [file, setFile] = useState(null);
  const [hapusFoto, setHapusFoto] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    if (!f.nama.trim()) { setMsg('Nama lahan wajib diisi.'); return; }
    const luas = Number(String(f.luas_ha).replace(',', '.'));
    if (!(luas > 0)) { setMsg('Luas lahan harus lebih dari 0 hektar.'); return; }

    setLoading(true);
    try {
      let foto_url = hapusFoto ? null : lahan?.foto_url || null;
      let foto_path = hapusFoto ? null : lahan?.foto_path || null;
      const fotoLama = lahan?.foto_path || null;

      if (file) {
        const blob = await kecilkanFoto(file);
        const path = `${petaniId}/${crypto.randomUUID()}.jpg`;
        const up = await supabase.storage.from('lahan').upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' });
        if (up.error) throw new Error('Gagal mengunggah foto: ' + up.error.message);
        foto_url = supabase.storage.from('lahan').getPublicUrl(path).data.publicUrl;
        foto_path = path;
      }

      const payload = {
        petani_id: petaniId,
        nama: f.nama.trim(),
        desa: f.desa.trim() || null,
        kecamatan: f.kecamatan.trim() || null,
        luas_ha: luas,
        status: f.status,
        jenis_dokumen: f.jenis_dokumen || null,
        nomor_dokumen: f.nomor_dokumen.trim() || null,
        catatan: f.catatan.trim() || null,
        foto_url,
        foto_path,
      };

      const q = edit
        ? supabase.from('lands').update(payload).eq('id', lahan.id)
        : supabase.from('lands').insert(payload);
      const { error } = await q;
      if (error) {
        if (file && foto_path) await supabase.storage.from('lahan').remove([foto_path]); // batalkan unggahan
        throw new Error(error.message);
      }

      // hapus foto lama bila diganti atau dihapus
      if (fotoLama && fotoLama !== foto_path) await supabase.storage.from('lahan').remove([fotoLama]);
      onSaved();
    } catch (err) {
      setMsg(err.message || 'Gagal menyimpan lahan.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h3>{edit ? 'Ubah data lahan' : 'Tambah lahan'}</h3>
      <p className="muted">Data dokumen lahan hanya diisi oleh admin setelah dicek langsung. Petani hanya bisa melihatnya.</p>
      {msg && <div className="alert">{msg}</div>}

      <div className="row">
        <div className="field"><label htmlFor="l-nama">Nama lahan</label>
          <input id="l-nama" className="input" required placeholder="mis. Kebun Utama" value={f.nama} onChange={set('nama')} /></div>
        <div className="field"><label htmlFor="l-luas">Luas (hektar)</label>
          <input id="l-luas" className="input" inputMode="decimal" required placeholder="mis. 1.5" value={f.luas_ha} onChange={set('luas_ha')} /></div>
        <div className="field"><label htmlFor="l-status">Status</label>
          <select id="l-status" className="input" value={f.status} onChange={set('status')}>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select></div>
      </div>

      <div className="row">
        <div className="field"><label htmlFor="l-desa">Desa</label>
          <input id="l-desa" className="input" placeholder="mis. Sukamaju" value={f.desa} onChange={set('desa')} /></div>
        <div className="field"><label htmlFor="l-kec">Kecamatan</label>
          <input id="l-kec" className="input" placeholder="mis. Jatiroto" value={f.kecamatan} onChange={set('kecamatan')} /></div>
      </div>

      <div className="row">
        <div className="field"><label htmlFor="l-jenis">Jenis dokumen</label>
          <select id="l-jenis" className="input" value={f.jenis_dokumen} onChange={set('jenis_dokumen')}>
            <option value="">- Belum ada / belum dicek -</option>
            {DOKUMEN.map((d) => <option key={d} value={d}>{d}</option>)}
          </select></div>
        <div className="field"><label htmlFor="l-nomor">Nomor dokumen</label>
          <input id="l-nomor" className="input" placeholder="Nomor sesuai dokumen asli" value={f.nomor_dokumen} onChange={set('nomor_dokumen')} /></div>
      </div>

      <div className="field"><label htmlFor="l-catatan">Catatan (opsional)</label>
        <textarea id="l-catatan" className="input" rows={2} placeholder="mis. Dicek di lapangan tanggal ..." value={f.catatan} onChange={set('catatan')} /></div>

      <div className="field">
        <label htmlFor="l-foto">Foto lahan (opsional)</label>
        <input id="l-foto" className="input" type="file" accept="image/*" onChange={(e) => { setFile(e.target.files?.[0] || null); setHapusFoto(false); }} />
        {edit && lahan.foto_url && !file && (
          <label className="check"><input type="checkbox" checked={hapusFoto} onChange={(e) => setHapusFoto(e.target.checked)} /> Hapus foto yang ada</label>
        )}
        <span className="muted">Foto otomatis dikecilkan sebelum diunggah.</span>
      </div>

      <div className="ad-actions">
        <button className="btn" disabled={loading}>{loading ? 'Menyimpan...' : edit ? 'Simpan perubahan' : 'Simpan lahan'}</button>
        <button type="button" className="btn secondary" onClick={onCancel} disabled={loading}>Batal</button>
      </div>
    </form>
  );
}
