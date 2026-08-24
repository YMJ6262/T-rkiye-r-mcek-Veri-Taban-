let currentLang = 'en';
let spiderData = [];
let map;
let markers = [];

const diagState = { location: '', symptoms: [], visualMarking: '' };

const translations = {
  en: {
    logoTitle: "World Spider Guide",
    heroSubtitle: "Global Spider Encyclopedia, Species Identification & Diagnostic Portal",
    searchPlaceholder: "Search by species or scientific name...",
    secCatalog: "Global Species Directory",
    secMap: "Interactive Habitat Map",
    btnDetail: "View Profile & First Aid",
    diagTitle: "Interactive Bite & Symptom Diagnostic Guide"
  },
  tr: {
    logoTitle: "Dünya Örümcek Rehberi",
    heroSubtitle: "Küresel Örümcek Ansiklopedisi, Tür Tanımlama ve Teşhis Portalı",
    searchPlaceholder: "Tür adı veya bilimsel ad ara...",
    secCatalog: "Küresel Tür Kataloğu",
    secMap: "Canlı Yaşam Alanı Haritası",
    btnDetail: "Profili ve İlk Yardımı İncele",
    diagTitle: "Etkileşimli Isırık & Semptom Teşhis Rehberi"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  loadSpeciesData();

  document.getElementById('searchInput').addEventListener('input', filterAndRender);
  document.getElementById('venomFilter').addEventListener('change', filterAndRender);
  document.getElementById('continentFilter').addEventListener('change', filterAndRender);
  document.getElementById('langToggleBtn').addEventListener('click', toggleLanguage);
  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
});

function initMap() {
  map = L.map('map-container').setView([20, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
}

async function loadSpeciesData() {
  try {
    const res = await fetch('data/species.json');
    spiderData = await res.json();
    renderApp();
  } catch (err) {
    console.error("Data loading error:", err);
  }
}

function renderApp() {
  const t = translations[currentLang];
  document.getElementById('logoTitle').innerText = t.logoTitle;
  document.getElementById('heroSubtitle').innerText = t.heroSubtitle;
  document.getElementById('searchInput').placeholder = t.searchPlaceholder;
  document.getElementById('secCatalog').innerText = t.secCatalog;
  document.getElementById('secMap').innerText = t.secMap;
  document.getElementById('diagTitle').innerText = t.diagTitle;

  filterAndRender();
}

function renderSpiders(data) {
  const grid = document.getElementById('spiderGrid');
  grid.innerHTML = '';
  data.forEach(s => {
    const t = translations[currentLang];
    grid.innerHTML += `
      <div class="spider-card">
        <div class="card-img-holder">
          <i class="fa-solid fa-spider"></i>
          <span class="badge-venom venom-${s.venomLevel}">${s.venomText[currentLang]}</span>
        </div>
        <div class="card-body">
          <div class="spider-title">${s.name[currentLang]}</div>
          <div class="spider-latin">${s.scientificName}</div>
          <div class="spider-meta">
            <span><i class="fa-solid fa-globe"></i> ${s.continent}</span>
            <span><i class="fa-solid fa-ruler"></i> ${s.size}</span>
          </div>
          <button class="btn-detail" onclick="openModal(${s.id})">${t.btnDetail}</button>
        </div>
      </div>
    `;
  });
}

function updateMap(data) {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
  data.forEach(s => {
    const m = L.marker([s.lat, s.lng]).addTo(map);
    m.bindPopup(`<b>${s.name[currentLang]}</b><br><i>${s.scientificName}</i>`);
    markers.push(m);
  });
}

function filterAndRender() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const v = document.getElementById('venomFilter').value;
  const c = document.getElementById('continentFilter').value;

  const filtered = spiderData.filter(s => {
    const matchQ = s.name[currentLang].toLowerCase().includes(q) || s.scientificName.toLowerCase().includes(q);
    const matchV = v === 'all' || s.venomLevel === v;
    const matchC = c === 'all' || s.continent === c;
    return matchQ && matchV && matchC;
  });

  renderSpiders(filtered);
  updateMap(filtered);
}

// Diagnostic Wizard
function selectLocation(region) { diagState.location = region; goToStep(2); }
function processSymptoms() {
  const checked = document.querySelectorAll('.symptom-checkboxes input:checked');
  diagState.symptoms = Array.from(checked).map(c => c.value);
  goToStep(3);
}
function selectVisual(marking) {
  diagState.visualMarking = marking;
  evaluateDiagnosis();
  goToStep('Result');
}
function goToStep(stepNum) {
  document.querySelectorAll('.diag-step').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.step-dot').forEach(d => d.classList.remove('active'));
  const target = document.getElementById('step' + stepNum);
  if(target) target.classList.add('active');
  if (stepNum === 'Result') {
    document.getElementById('dotResult').classList.add('active');
  } else {
    for(let i = 1; i <= stepNum; i++) document.getElementById('dot' + i).classList.add('active');
  }
}
function evaluateDiagnosis() {
  const resContainer = document.getElementById('resultContent');
  let title = "🟢 Low Risk Reaction";
  let riskClass = "venom-safe";
  let species = "Garden Spider / Non-dangerous species";
  let steps = ["Wash with soap and water.", "Apply cold compress to swelling."];

  if (diagState.symptoms.includes('necrotic') || diagState.visualMarking === 'violin') {
    riskClass = "venom-danger";
    title = "🔴 High Risk: Necrotic / Recluse Suspected";
    species = "Loxosceles reclusa (Brown Recluse)";
    steps = ["Apply cold pack wrapped in cloth.", "Elevate affected limb.", "Seek emergency medical evaluation."];
  } else if (diagState.symptoms.includes('cramps') || diagState.visualMarking === 'hourglass') {
    riskClass = "venom-danger";
    title = "🔴 High Risk: Neurotoxic Bite Suspected";
    species = "Latrodectus spp. (Black Widow)";
    steps = ["Keep patient calm.", "Proceed to emergency room immediately for antivenom."];
  }

  resContainer.innerHTML = `
    <div style="background: rgba(15,23,42,0.6); border: 1px solid var(--border-color); padding: 15px; border-radius: 8px;">
      <h3 class="${riskClass}">${title}</h3>
      <p style="margin-top: 6px;"><strong>Lead Identification:</strong> ${species}</p>
    </div>
    <h4 style="margin-top: 15px;">First Aid Protocol:</h4>
    <ul style="padding-left: 20px; font-size: 0.9rem; margin-top: 5px;">
      ${steps.map(st => `<li>${st}</li>`).join('')}
    </ul>
  `;
}
function resetDiagnostic() {
  diagState.location = ''; diagState.symptoms = []; diagState.visualMarking = '';
  document.querySelectorAll('.symptom-checkboxes input').forEach(c => c.checked = false);
  goToStep(1);
}

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'tr' : 'en';
  renderApp();
}

function openModal(id) {
  const s = spiderData.find(item => item.id === id);
  if(!s) return;
  document.getElementById('modalTitle').innerText = s.name[currentLang];
  document.getElementById('modalLatin').innerText = s.scientificName;
  document.getElementById('modalBody').innerHTML = `
    <p><strong>Venom Risk:</strong> ${s.venomText[currentLang]}</p>
    <p><strong>Habitat:</strong> ${s.habitat}</p>
    <p><strong>Size:</strong> ${s.size}</p>
    <hr style="border-color: var(--border-color); margin: 12px 0;">
    <p>${s.desc[currentLang]}</p>
  `;
  document.getElementById('detailModal').style.display = 'flex';
}
function closeModal() { document.getElementById('detailModal').style.display = 'none'; }