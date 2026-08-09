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
  function field(labelText, value, onchange){
    const d = document.createElement('div');
    d.innerHTML = `<label>${labelText}</label><input value="${escapeHtml(value||'')}">`;
    const inp = d.querySelector('input');
    inp.addEventListener('input', e => onchange(e.target.value));
    return d;
  }

  // Avatar
  const avatar = siteData.avatar || {};
  const av = document.createElement('div'); av.className='project';
  av.appendChild(field('Avatar Image (path)', avatar.image, v => { siteData.avatar = siteData.avatar||{}; siteData.avatar.image = v; }));
  av.appendChild(field('Avatar Name', avatar.name, v => { siteData.avatar = siteData.avatar||{}; siteData.avatar.name = v; }));
  av.appendChild(field('Avatar Button Text', avatar.buttonText, v => { siteData.avatar = siteData.avatar||{}; siteData.avatar.buttonText = v; }));
  const upBtn = document.createElement('button'); upBtn.className='small-btn'; upBtn.textContent='Upload Image';
  upBtn.addEventListener('click', async () => {
    const fileInput = qs('#file-uploader');
    fileInput.onchange = async () => {
      const file = fileInput.files[0]; if (!file) return;
      const fd = new FormData(); fd.append('image', file);
      const res = await fetch('/upload-image', { method: 'POST', body: fd });
      const data = await res.json(); if (data.ok) { siteData.avatar.image = data.path; renderSite(); } else alert('Upload failed');
      fileInput.value = '';
    };
    fileInput.click();
  });
  av.appendChild(upBtn);
  el.appendChild(av);

  // Intro
  const intro = siteData.intro || {};
  const introCard = document.createElement('div'); introCard.className='project';
  introCard.appendChild(field('Intro Headline', intro.headline, v => { siteData.intro = siteData.intro||{}; siteData.intro.headline = v; }));
  introCard.appendChild(field('Download CV Text', intro.downloadCvText, v => { siteData.intro = siteData.intro||{}; siteData.intro.downloadCvText = v; }));
  introCard.appendChild(field('Download CV Href', intro.downloadCvHref, v => { siteData.intro = siteData.intro||{}; siteData.intro.downloadCvHref = v; }));
  el.appendChild(introCard);

  // Portfolio section
  const ps = siteData.portfolioSection || {};
  const pc = document.createElement('div'); pc.className='project';
  pc.appendChild(field('Portfolio Subtitle', ps.subtitle, v => { siteData.portfolioSection = siteData.portfolioSection||{}; siteData.portfolioSection.subtitle = v; }));
  pc.appendChild(field('Portfolio Title', ps.title, v => { siteData.portfolioSection = siteData.portfolioSection||{}; siteData.portfolioSection.title = v; }));
  el.appendChild(pc);

  // Physical section
  const ph = siteData.physicalSection || {};
  const phc = document.createElement('div'); phc.className='project';
  phc.appendChild(field('Physical Title', ph.title, v => { siteData.physicalSection = siteData.physicalSection||{}; siteData.physicalSection.title = v; }));
  const desc = document.createElement('div'); desc.innerHTML='<label>Physical Description (HTML allowed)</label><textarea></textarea>';
  desc.querySelector('textarea').value = ph.description||'';
  desc.querySelector('textarea').addEventListener('input', e => { siteData.physicalSection = siteData.physicalSection||{}; siteData.physicalSection.description = e.target.value; });
  phc.appendChild(desc);
  el.appendChild(phc);

  // About
  const about = siteData.aboutSection || {};
  const ac = document.createElement('div'); ac.className='project';
  ac.appendChild(field('About Subtitle', about.subtitle, v => { siteData.aboutSection = siteData.aboutSection||{}; siteData.aboutSection.subtitle = v; }));
  ac.appendChild(field('About Title', about.title, v => { siteData.aboutSection = siteData.aboutSection||{}; siteData.aboutSection.title = v; }));
  const aboutText = document.createElement('div'); aboutText.innerHTML='<label>About Text (HTML allowed)</label><textarea></textarea>';
  aboutText.querySelector('textarea').value = about.text||'';
  aboutText.querySelector('textarea').addEventListener('input', e => { siteData.aboutSection = siteData.aboutSection||{}; siteData.aboutSection.text = e.target.value; });
  ac.appendChild(aboutText);
  el.appendChild(ac);

  // Achievements (array)
  const ach = siteData.achievements || [];
  const achCard = document.createElement('div'); achCard.className='project'; achCard.innerHTML = '<h4>Achievements</h4>';
  ach.forEach((a, i) => {
    const row = document.createElement('div'); row.innerHTML = `<input value="${escapeHtml(a.number||'')}" class="small"> <input style="width:70%" value="${escapeHtml(a.descr||'')}"> <button class="small-btn">Remove</button>`;
    row.querySelector('input').addEventListener('input', e => siteData.achievements[i].number = e.target.value);
    row.querySelectorAll('input')[1].addEventListener('input', e => siteData.achievements[i].descr = e.target.value);
    row.querySelector('button').addEventListener('click', () => { siteData.achievements.splice(i,1); renderSite(); });
    achCard.appendChild(row);
  });
  const addAch = document.createElement('button'); addAch.className='small-btn'; addAch.textContent='Add Achievement'; addAch.addEventListener('click', () => { siteData.achievements = siteData.achievements||[]; siteData.achievements.push({number:'',descr:''}); renderSite(); });
  achCard.appendChild(addAch); el.appendChild(achCard);

  // Experiences
  const expCard = document.createElement('div'); expCard.className='project'; expCard.innerHTML = '<h4>Experiences</h4>';
  (siteData.experiences||[]).forEach((ex,i)=>{
    const r = document.createElement('div'); r.innerHTML = `<input placeholder="Title" value="${escapeHtml(ex.title||'')}"><input placeholder="Company" value="${escapeHtml(ex.company||'')}"><input placeholder="Date" value="${escapeHtml(ex.date||'')}"><textarea placeholder="Description">${escapeHtml(ex.description||'')}</textarea><button class="small-btn">Remove</button>`;
    const inputs = r.querySelectorAll('input');
    inputs[0].addEventListener('input', e=> siteData.experiences[i].title = e.target.value);
    inputs[1].addEventListener('input', e=> siteData.experiences[i].company = e.target.value);
    inputs[2].addEventListener('input', e=> siteData.experiences[i].date = e.target.value);
    r.querySelector('textarea').addEventListener('input', e=> siteData.experiences[i].description = e.target.value);
    r.querySelector('button').addEventListener('click', ()=>{ siteData.experiences.splice(i,1); renderSite(); });
    expCard.appendChild(r);
  });
  const addExp = document.createElement('button'); addExp.className='small-btn'; addExp.textContent='Add Experience'; addExp.addEventListener('click', ()=>{ siteData.experiences = siteData.experiences||[]; siteData.experiences.push({title:'',company:'',date:'',description:''}); renderSite(); });
  expCard.appendChild(addExp); el.appendChild(expCard);

  // Education
  const eduCard = document.createElement('div'); eduCard.className='project'; eduCard.innerHTML = '<h4>Education</h4>';
  (siteData.education||[]).forEach((ed,i)=>{ const r = document.createElement('div'); r.innerHTML = `<input value="${escapeHtml(ed.date||'')}" style="width:120px"> <input style="width:70%" value="${escapeHtml(ed.title||'')}"> <button class="small-btn">Remove</button>`; r.querySelectorAll('input')[0].addEventListener('input', e=> siteData.education[i].date = e.target.value); r.querySelectorAll('input')[1].addEventListener('input', e=> siteData.education[i].title = e.target.value); r.querySelector('button').addEventListener('click', ()=>{ siteData.education.splice(i,1); renderSite(); }); eduCard.appendChild(r); });
  const addEdu = document.createElement('button'); addEdu.className='small-btn'; addEdu.textContent='Add Education'; addEdu.addEventListener('click', ()=>{ siteData.education = siteData.education||[]; siteData.education.push({date:'',title:''}); renderSite(); }); eduCard.appendChild(addEdu); el.appendChild(eduCard);

  // Tools (array of {name,icon})
  const toolsCard = document.createElement('div'); toolsCard.className='project'; toolsCard.innerHTML = '<h4>Tools</h4>';
  (siteData.tools||[]).forEach((t,i)=>{ const r = document.createElement('div'); r.innerHTML = `<input value="${escapeHtml(t.name||'')}"> <input value="${escapeHtml(t.icon||'')}" style="width:50%"> <button class="small-btn">Remove</button>`; r.querySelectorAll('input')[0].addEventListener('input', e=> siteData.tools[i].name = e.target.value); r.querySelectorAll('input')[1].addEventListener('input', e=> siteData.tools[i].icon = e.target.value); r.querySelector('button').addEventListener('click', ()=>{ siteData.tools.splice(i,1); renderSite(); }); toolsCard.appendChild(r); });
  const addTool = document.createElement('button'); addTool.className='small-btn'; addTool.textContent='Add Tool'; addTool.addEventListener('click', ()=>{ siteData.tools = siteData.tools||[]; siteData.tools.push({name:'',icon:''}); renderSite(); }); toolsCard.appendChild(addTool); el.appendChild(toolsCard);

  // Contacts
  const contactsCard = document.createElement('div'); contactsCard.className='project'; contactsCard.innerHTML = '<h4>Contacts</h4>';
  (siteData.contacts||[]).forEach((c,i)=>{ const r = document.createElement('div'); r.innerHTML = `<input value="${escapeHtml(c.label||'')}" style="width:120px"> <input value="${escapeHtml(c.value||'')}" style="width:40%"> <input value="${escapeHtml(c.href||'')}" style="width:35%"> <button class="small-btn">Remove</button>`; const ins = r.querySelectorAll('input'); ins[0].addEventListener('input', e=> siteData.contacts[i].label = e.target.value); ins[1].addEventListener('input', e=> siteData.contacts[i].value = e.target.value); ins[2].addEventListener('input', e=> siteData.contacts[i].href = e.target.value); r.querySelector('button').addEventListener('click', ()=>{ siteData.contacts.splice(i,1); renderSite(); }); contactsCard.appendChild(r); });
  const addContact = document.createElement('button'); addContact.className='small-btn'; addContact.textContent='Add Contact'; addContact.addEventListener('click', ()=>{ siteData.contacts = siteData.contacts||[]; siteData.contacts.push({label:'',value:'',href:''}); renderSite(); }); contactsCard.appendChild(addContact); el.appendChild(contactsCard);
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
