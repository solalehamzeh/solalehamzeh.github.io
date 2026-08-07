const API = '';
const qs = (s) => document.querySelector(s);

let galleryData = null;
let siteData = null;

async function fetchJson(file) {
  const res = await fetch(`/data/${file}`);
  if (!res.ok) throw new Error('Fetch failed');
  return res.json();
}

function show(section) {
  document.querySelectorAll('.editor').forEach(e => e.classList.add('hidden'));
  document.getElementById(section).classList.remove('hidden');
}

async function loadGallery() {
  try {
    galleryData = await fetchJson('gallery-data.json');
    renderGallery();
    show('visual-gallery');
  } catch (err) { alert(err.message); }
}

function renderGallery() {
  const el = qs('#portfolio-list');
  el.innerHTML = '';
  const list = galleryData.portfolio || [];
  list.forEach((p, idx) => {
    const div = document.createElement('div');
    div.className = 'project';
    div.innerHTML = `
      <label>Title</label>
      <input data-idx="${idx}" name="title" value="${escapeHtml(p.title||'')}">
      <label>ID</label>
      <input data-idx="${idx}" name="id" value="${escapeHtml(p.id||'')}">
      <label>Description</label>
      <textarea data-idx="${idx}" name="description">${escapeHtml(p.description||'')}</textarea>
      <div class="images-list"></div>
      <div>
        <button class="small-btn upload" data-idx="${idx}">Upload Image</button>
        <button class="small-btn remove" data-idx="${idx}">Remove Project</button>
      </div>
    `;
    const imagesList = div.querySelector('.images-list');
    const imgs = p.images||[];
    imgs.forEach(im => {
      const r = document.createElement('div');
      r.innerHTML = `<input value="${escapeHtml(im.src||'')}" class="img-src"><button class="small-btn remove-img">Remove</button>`;
      imagesList.appendChild(r);
    });

    // attach listeners
    div.querySelectorAll('input,textarea').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const i = Number(e.target.dataset.idx);
        const name = e.target.name;
        galleryData.portfolio[i][name] = e.target.value;
      });
    });

    div.querySelector('.upload').addEventListener('click', () => uploadImageFor(idx, imagesList));
    div.querySelector('.remove').addEventListener('click', () => { galleryData.portfolio.splice(idx,1); renderGallery(); });

    el.appendChild(div);
  });
}

async function uploadImageFor(idx, imagesListEl) {
  const fileInput = qs('#file-uploader');
  fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch('/upload-image', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.ok) {
      // add to images
      galleryData.portfolio[idx].images = galleryData.portfolio[idx].images || [];
      galleryData.portfolio[idx].images.push({ src: data.path });
      renderGallery();
    } else alert('Upload failed');
    fileInput.value = '';
  };
  fileInput.click();
}

function escapeHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }

async function saveGallery() {
  try {
    const res = await fetch('/save/gallery-data.json', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(galleryData) });
    const j = await res.json();
    if (j.ok) alert('Saved');
  } catch (err) { alert(err.message); }
}

async function loadSite() {
  try {
    siteData = await fetchJson('site-data.json');
    renderSite();
    show('visual-site');
  } catch (err) { alert(err.message); }
}

function renderSite() {
  const el = qs('#site-forms');
  el.innerHTML = '';
  const avatar = siteData.avatar || {};
  const div = document.createElement('div');
  div.className = 'project';
  div.innerHTML = `
    <label>Avatar Image (path)</label>
    <input id="avatar-image" value="${escapeHtml(avatar.image||'')}">
    <label>Avatar Name</label>
    <input id="avatar-name" value="${escapeHtml(avatar.name||'')}">
    <label>Avatar Button Text</label>
    <input id="avatar-button-text" value="${escapeHtml(avatar.buttonText||'')}">
    <div><button id="upload-avatar" class="small-btn">Upload Image</button></div>
  `;
  el.appendChild(div);

  qs('#avatar-image').addEventListener('input', e => siteData.avatar.image = e.target.value);
  qs('#avatar-name').addEventListener('input', e => siteData.avatar.name = e.target.value);
  qs('#avatar-button-text').addEventListener('input', e => siteData.avatar.buttonText = e.target.value);
  qs('#upload-avatar').addEventListener('click', async () => {
    const fileInput = qs('#file-uploader');
    fileInput.onchange = async () => {
      const file = fileInput.files[0];
      if (!file) return;
      const fd = new FormData(); fd.append('image', file);
      const res = await fetch('/upload-image', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.ok) { siteData.avatar.image = data.path; renderSite(); } else alert('Upload failed');
      fileInput.value = '';
    };
    fileInput.click();
  });
}

async function saveSite() {
  try {
    const res = await fetch('/save/site-data.json', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(siteData) });
    const j = await res.json(); if (j.ok) alert('Saved');
  } catch (err) { alert(err.message); }
}

async function openRaw() {
  show('raw-editor');
  const sel = qs('#raw-file-select');
  const ta = qs('#raw-text');
  async function load(){ const d = await fetchJson(sel.value); ta.value = JSON.stringify(d, null, 2); }
  sel.onchange = load; load();
  qs('#save-raw').onclick = async () => {
    try {
      const parsed = JSON.parse(ta.value);
      const res = await fetch(`/save/${sel.value}`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(parsed) });
      const j = await res.json(); if (j.ok) alert('Saved');
    } catch (e) { alert('Invalid JSON'); }
  };
}

document.getElementById('load-gallery').addEventListener('click', loadGallery);
document.getElementById('load-site').addEventListener('click', loadSite);
document.getElementById('open-raw').addEventListener('click', openRaw);
document.getElementById('add-portfolio').addEventListener('click', () => { galleryData.portfolio = galleryData.portfolio || []; galleryData.portfolio.push({ id: 'new-'+Date.now(), title:'New Project', images:[] }); renderGallery(); });
document.getElementById('save-gallery').addEventListener('click', saveGallery);
document.getElementById('save-site').addEventListener('click', saveSite);

// file uploader exists
