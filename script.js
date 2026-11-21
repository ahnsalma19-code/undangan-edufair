/* =========================================================
   Undangan Edu Fair & Career Day 2026 — script.js
   SMKN 6 Kota Tangerang Selatan
   Nama tamu dibaca dari ?to=... ATAU #Nama_Lengkap
   ========================================================= */

/* ---------- Data acara ---------- */
var EVENT_DATE = new Date("2026-12-12T07:30:00+07:00");

var RUNDOWN = [
  ["07.30", "Registrasi Tamu & Peserta"],
  ["08.00", "Pembukaan & Sambutan Kepala Sekolah"],
  ["08.45", "Talkshow: Masa Depan Karier Digital"],
  ["10.00", "Pembukaan Booth Kampus & Perusahaan"],
  ["12.00", "Ishoma"],
  ["13.00", "Sharing Session Alumni"],
  ["14.30", "Penutupan & Doorprize"]
];

var BENEFIT = [
  ["🎓", "Konsultasi jurusan & beasiswa langsung dari kampus"],
  ["💼", "Info lowongan magang & rekrutmen perusahaan"],
  ["🧭", "Mentoring karier bersama alumni"],
  ["📄", "Review CV & portofolio gratis"],
  ["🎁", "Merchandise & doorprize menarik"],
  ["📜", "E-sertifikat kehadiran"]
];

/* Data tamu bawaan (sama isinya dengan data-tamu.csv) */
var TAMU_AWAL = [
  { id: "1", nama_tamu: "Dr. Rina Kusumawati, M.Pd.", instansi: "Universitas Indonesia", kategori: "Universitas", no_whatsapp: "6281234567890" },
  { id: "2", nama_tamu: "Budi Santoso, S.Kom.", instansi: "PT Telkom Indonesia (Persero) Tbk", kategori: "Perusahaan", no_whatsapp: "6281398765432" },
  { id: "3", nama_tamu: "Siti Rahmawati", instansi: "Institut Teknologi Bandung", kategori: "Universitas", no_whatsapp: "6285711223344" },
  { id: "4", nama_tamu: "Ahmad Fauzi", instansi: "Alumni Angkatan 2022 - Software Engineer", kategori: "Alumni", no_whatsapp: "6287855667788" },
  { id: "5", nama_tamu: "Dian Pratama, S.T.", instansi: "PT Astra International Tbk", kategori: "Perusahaan", no_whatsapp: "6282199001122" },
  { id: "6", nama_tamu: "Prof. Hendra Wijaya", instansi: "Universitas Bina Nusantara (BINUS)", kategori: "Universitas", no_whatsapp: "6281144556677" },
  { id: "7", nama_tamu: "Nadia Putri", instansi: "Alumni Angkatan 2023 - UI/UX Designer", kategori: "Alumni", no_whatsapp: "6289633445566" }
];

/* ---------- Helper umum ---------- */
function ambilParam(nama) {
  return new URLSearchParams(window.location.search).get(nama) || "";
}

/* Nama tamu dari ?to=... ATAU #Nama_Lengkap (gaya link undangan) */
function namaDariLink() {
  var dariQuery = ambilParam("to").trim();
  if (dariQuery) return dariQuery;
  try {
    var h = decodeURIComponent((window.location.hash || "").slice(1));
    h = h.replace(/[_~]+/g, " ").replace(/\s+/g, " ").trim();
    if (h && h.length < 60) return h;
  } catch (e) {}
  return "";
}

function isiTeks(id, teks) {
  var el = document.getElementById(id);
  if (el) el.textContent = teks;
}

/* Debu emas yang naik pelan */
function buatDebu() {
  var wadah = document.getElementById("dust");
  if (!wadah) return;
  var html = "";
  for (var i = 0; i < 24; i++) {
    var kiri = Math.random() * 100;
    var ukuran = 2 + Math.random() * 4;
    var durasi = 10 + Math.random() * 12;
    var tunda = Math.random() * 12;
    html += '<i style="left:' + kiri + '%;width:' + ukuran + 'px;height:' + ukuran +
      'px;animation-duration:' + durasi + 's;animation-delay:' + tunda + 's"></i>';
  }
  wadah.innerHTML = html;
}

/* ---------- Halaman undangan ---------- */
function jalankanUndangan() {
  var tamu = namaDariLink();
  var nama = tamu || "Bapak/Ibu/Saudara/i";
  var instansi = ambilParam("instansi");
  var kategori = ambilParam("kategori");

  isiTeks("coverNama", nama);
  isiTeks("isiNama", nama);

  var elInstansi = document.getElementById("coverInstansi");
  if (elInstansi) elInstansi.textContent = instansi;

  var elKategori = document.getElementById("coverKategori");
  if (elKategori) {
    elKategori.textContent = "Tamu " + kategori;
    elKategori.hidden = !kategori;
  }

  var elIsiInstansi = document.getElementById("isiInstansi");
  if (elIsiInstansi) elIsiInstansi.textContent = instansi ? " dari " + instansi : "";

  var elRsvpNama = document.getElementById("rsvpNama");
  if (elRsvpNama) elRsvpNama.value = tamu;

  var rundown = document.getElementById("rundown");
  if (rundown) {
    rundown.innerHTML = RUNDOWN.map(function (baris) {
      return "<li><b>" + baris[0] + "</b><span>" + baris[1] + "</span></li>";
    }).join("");
  }

  var benefit = document.getElementById("benefit");
  if (benefit) {
    benefit.innerHTML = BENEFIT.map(function (b) {
      return "<div><b>" + b[0] + "</b><span>" + b[1] + "</span></div>";
    }).join("");
  }

  buatDebu();
  hitungMundur();
  bukaSampul();
  kirimKonfirmasi(nama);
}

/* Buka sampul: naik ke atas lalu hilang */
function bukaSampul() {
  var tombol = document.getElementById("btnBuka");
  var sampul = document.getElementById("cover");
  if (!tombol || !sampul) return;
  tombol.addEventListener("click", function () {
    sampul.classList.add("keluar");
    setTimeout(function () { sampul.remove(); }, 1000);
  });
}

/* Hitung mundur ke hari H */
function hitungMundur() {
  var wadah = document.getElementById("hitung");
  if (!wadah) return;
  function gambar() {
    var sisa = Math.max(0, EVENT_DATE.getTime() - Date.now());
    var bagian = [
      [Math.floor(sisa / 86400000), "Hari"],
      [Math.floor(sisa / 3600000) % 24, "Jam"],
      [Math.floor(sisa / 60000) % 60, "Menit"],
      [Math.floor(sisa / 1000) % 60, "Detik"]
    ];
    wadah.innerHTML = bagian.map(function (b) {
      var angka = String(b[0]).padStart(2, "0");
      return "<div><b>" + angka + "</b><span>" + b[1] + "</span></div>";
    }).join("");
  }
  gambar();
  setInterval(gambar, 1000);
}

/* Form konfirmasi kehadiran (tersimpan di perangkat tamu) */
function kirimKonfirmasi(namaAwal) {
  var form = document.getElementById("formRsvp");
  var selesai = document.getElementById("rsvpSelesai");
  if (!form || !selesai) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    function nilai(id) {
      var el = document.getElementById(id);
      return el ? el.value : "";
    }
    var data = {
      nama: nilai("rsvpNama"),
      hadir: nilai("rsvpHadir"),
      jumlah: nilai("rsvpJumlah"),
      pesan: nilai("rsvpPesan"),
      at: new Date().toISOString()
    };
    var semua = JSON.parse(localStorage.getItem("rsvp") || "[]");
    semua.push(data);
    localStorage.setItem("rsvp", JSON.stringify(semua));
    form.hidden = true;
    selesai.hidden = false;
    selesai.textContent = "Terima kasih, " + (data.nama || namaAwal) +
      "! Konfirmasi Anda (" + data.hadir + ") sudah kami terima.";
  });
}

/* ---------- Halaman admin ---------- */
function jalankanAdmin() {
  var tabel = document.getElementById("tabelTamu");
  if (!tabel) return;
  tampilkanTamu(TAMU_AWAL);

  /* Tombol "Salin Link" di tiap baris (delegasi, tahan re-render) */
  var tbody = tabel.querySelector("tbody");
  if (tbody) {
    tbody.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-salin]") : null;
      if (!b) return;
      salinLink(b, b.getAttribute("data-salin"));
    });
  }

  var file = document.getElementById("inputCsv");
  if (file) {
    file.addEventListener("change", function () {
      var f = file.files && file.files[0];
      if (!f) return;
      var pembaca = new FileReader();
      pembaca.onload = function () { tampilkanTamu(bacaCSV(String(pembaca.result))); };
      pembaca.readAsText(f);
    });
  }

  /* Kalau dibuka lewat server (bukan file://), coba ambil data-tamu.csv */
  if (window.location.protocol !== "file:") {
    fetch("data-tamu.csv")
      .then(function (r) { return r.ok ? r.text() : ""; })
      .then(function (t) { if (t.trim()) tampilkanTamu(bacaCSV(t)); })
      .catch(function () { /* pakai data bawaan */ });
  }
}

function tampilkanTamu(daftar) {
  var tbody = document.querySelector("#tabelTamu tbody");
  if (!tbody) return;
  if (!daftar.length) {
    tbody.innerHTML = '<tr><td class="kosong" colspan="6">Belum ada data tamu.</td></tr>';
    return;
  }
  tbody.innerHTML = daftar.map(function (t) {
    var tautan = tautanUndangan(t);
    var hash = tautanHash(t);
    var pesan =
      "Yth. " + t.nama_tamu + "\n" + t.instansi + "\n\n" +
      "Dengan hormat, kami mengundang Bapak/Ibu sebagai tamu kategori " + t.kategori +
      " pada acara Edu Fair & Career Day 2026 — Sabtu, 12 Desember 2026, 07.30 WIB,\n" +
      "Aula SMK Negeri 6 Kota Tangerang Selatan\n" +
      "Jl. Magnolia VI No. 6, Kel. Jelupang, Kec. Serpong Utara, Kota Tangerang Selatan, Banten 15323\n\n" +
      "Detail undangan & konfirmasi kehadiran:\n" + tautan + "\n\n" +
      "Terima kasih.\nPanitia Edu Fair 2026 — SMKN 6 Kota Tangerang Selatan";
    var wa = "https://wa.me/" + String(t.no_whatsapp).trim() + "?text=" + encodeURIComponent(pesan);
    return "<tr>" +
      "<td>" + t.id + "</td>" +
      "<td>" + t.nama_tamu + "</td>" +
      "<td>" + t.instansi + "</td>" +
      "<td>" + t.kategori + "</td>" +
      "<td>" + t.no_whatsapp + "</td>" +
      '<td><div class="tombol">' +
      '<a class="btn-gold" target="_blank" rel="noreferrer" href="' + wa + '">Kirim WhatsApp</a>' +
      '<a class="btn-ghost" target="_blank" rel="noreferrer" href="' + tautan + '">Preview</a>' +
      '<button type="button" class="btn-ghost" data-salin="' + hash + '">Salin Link</button>' +
      "</div></td>" +
      "</tr>";
  }).join("");
}

/* Tautan undangan khusus satu tamu (?to=...) */
function tautanUndangan(t) {
  var dasar = new URL("index.html", window.location.href).href.split("#")[0].split("?")[0];
  var query = new URLSearchParams({
    to: t.nama_tamu,
    instansi: t.instansi,
    kategori: t.kategori
  });
  return dasar + "?" + query.toString();
}

/* Tautan gaya #Nama_Lengkap (untuk dikirim ke WA) */
function tautanHash(t) {
  var dasar = new URL("index.html", window.location.href).href.split("#")[0].split("?")[0];
  return dasar + "#" + encodeURIComponent(String(t.nama_tamu).trim().replace(/\s+/g, "_"));
}

/* Salin ke clipboard + umpan balik di tombolnya */
function salinLink(btn, teks) {
  function ok() {
    var lama = btn.textContent;
    btn.textContent = "Tersalin ✓";
    setTimeout(function () { btn.textContent = lama; }, 1600);
  }
  function fb() {
    var ta = document.createElement("textarea");
    ta.value = teks; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); ok(); } catch (e) {}
    document.body.removeChild(ta);
  }
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(teks).then(ok, fb);
  else fb();
}

/* Baca teks CSV menjadi daftar objek (mendukung tanda kutip) */
function bacaCSV(teks) {
  var baris = [];
  var barisSekarang = [];
  var huruf = "";
  var dalamKutip = false;
  for (var i = 0; i < teks.length; i++) {
    var c = teks[i];
    if (dalamKutip) {
      if (c === '"' && teks[i + 1] === '"') { huruf += '"'; i++; }
      else if (c === '"') dalamKutip = false;
      else huruf += c;
    } else if (c === '"') {
      dalamKutip = true;
    } else if (c === ",") {
      barisSekarang.push(huruf); huruf = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && teks[i + 1] === "\n") i++;
      barisSekarang.push(huruf); huruf = "";
      if (barisSekarang.some(function (v) { return v.trim(); })) baris.push(barisSekarang);
      barisSekarang = [];
    } else {
      huruf += c;
    }
  }
  barisSekarang.push(huruf);
  if (barisSekarang.some(function (v) { return v.trim(); })) baris.push(barisSekarang);
  var kepala = baris.shift();
  if (!kepala) return [];
  var kunci = kepala.map(function (k) { return k.trim(); });
  return baris.map(function (r) {
    var objek = {};
    kunci.forEach(function (k, i) { objek[k] = (r[i] || "").trim(); });
    return objek;
  });
}

/* ---------- Jalankan sesuai halaman yang dibuka ---------- */
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("tabelTamu")) jalankanAdmin();
  else jalankanUndangan();
});