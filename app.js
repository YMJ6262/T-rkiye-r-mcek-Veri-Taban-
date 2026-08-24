let currentLang = 'en';
let spiderData = [];
let map;
let markers = [];
let diagnosticCompleted = false; // tracks whether a result is currently on screen, so we can re-render it on language switch

const diagState = { location: '', symptoms: [], visualMarking: '' };

const translations = {
  en: {
    htmlLang: "en",
    seoTitle: "World Spider Guide - Global Species Database & Diagnostic Portal",
    seoDesc: "Explore global spider species, habitat maps, venom ratings, and emergency diagnostic tools.",
    logoTitle: "World Spider Guide",
    heroSubtitle: "Global Spider Encyclopedia, Species Identification & Diagnostic Portal",
    langBtnText: "TR",
    searchPlaceholder: "Search by species or scientific name...",
    secCatalog: "Global Species Directory",
    secMap: "Interactive Habitat Map",
    btnDetail: "View Profile & First Aid",
    diagTitle: "Interactive Bite & Symptom Diagnostic Guide",

    step1Title: "Step 1: Select Location",
    step1Desc: "Where did the bite or encounter occur?",
    locNA: "North America",
    locSA: "South America",
    locAU: "Australia",
    locEU: "Europe / Asia / Africa",

    step2Title: "Step 2: Primary Physical Symptoms",
    step2Desc: "Select all symptoms currently observed:",
    symNecrotic: "Blistering / Skin Necrosis / Dark Center",
    symCramps: "Severe Muscle Cramps / Abdominal Pain",
    symSweating: "Profuse Sweating / High Pulse",
    symMild: "Mild Swelling / Local Redness (Sting-like)",
    btnBack: "Back",
    btnNext: "Next Step",

    step3Title: "Step 3: Visual Markings",
    step3Desc: "Did you notice any markings on the spider?",
    visViolin: "Violin-shaped mark on back",
    visHourglass: "Red/Orange hourglass on abdomen",
    visHairy: "Very large, hairy body",
    visUnknown: "Unseen / Unknown",

    disclaimerText: "Medical Disclaimer: This guide is for educational identification only. Seek professional emergency medical care for severe symptoms.",
    btnRestart: "Start New Diagnostic",
    leadId: "Lead Identification:",
    firstAid: "First Aid Protocol:",

    filterAllVenom: "All Venom Ratings",
    filterSafe: "🟢 Low Risk / Non-dangerous",
    filterWarn: "🟡 Mild Venom",
    filterDanger: "🔴 Medically Significant",
    filterAllContinent: "All Continents",

    emptyState: "No species match your search or filters.",

    resLowTitle: "🟢 Low Risk Reaction",
    resLowSpecies: "Garden Spider / Non-dangerous species",
    resLowSteps: ["Wash with soap and water.", "Apply cold compress to swelling."],

    resNecroticTitle: "🔴 High Risk: Necrotic / Recluse Suspected",
    resNecroticSpecies: "Loxosceles reclusa (Brown Recluse)",
    resNecroticSteps: ["Apply cold pack wrapped in cloth.", "Elevate affected limb.", "Seek emergency medical evaluation."],

    resNeuroTitle: "🔴 High Risk: Neurotoxic Bite Suspected",
    resNeuroSpecies: "Latrodectus spp. (Black Widow)",
    resNeuroSteps: ["Keep patient calm.", "Proceed to emergency room immediately for antivenom."]
  },
  tr: {
    htmlLang: "tr",
    seoTitle: "Dünya Örümcek Rehberi - Küresel Tür Veritabanı ve Teşhis Portalı",
    seoDesc: "Küresel örümcek türlerini, yaşam alanı haritalarını, zehir derecelendirmelerini ve acil teşhis araçlarını keşfedin.",
    logoTitle: "Dünya Örümcek Rehberi",
    heroSubtitle: "Küresel Örümcek Ansiklopedisi, Tür Tanımlama ve Teşhis Portalı",
    langBtnText: "EN",
    searchPlaceholder: "Tür adı veya bilimsel ad ara...",
    secCatalog: "Küresel Tür Kataloğu",
    secMap: "Canlı Yaşam Alanı Haritası",
    btnDetail: "Profili ve İlk Yardımı İncele",
    diagTitle: "Etkileşimli Isırık & Semptom Teşhis Rehberi",

    step1Title: "Adım 1: Konumu Seçin",
    step1Desc: "Isırık veya karşılaşma nerede gerçekleşti?",
    locNA: "Kuzey Amerika",
    locSA: "Güney Amerika",
    locAU: "Avustralya",
    locEU: "Avrupa / Asya / Afrika",

    step2Title: "Adım 2: Temel Fiziksel Belirtiler",
    step2Desc: "Şu anda gözlemlenen tüm belirtileri seçin:",
    symNecrotic: "Kabarma / Deride Doku Ölümü / Koyu Merkez",
    symCramps: "Şiddetli Kas Krampları / Karın Ağrısı",
    symSweating: "Aşırı Terleme / Yüksek Nabız",
    symMild: "Hafif Şişlik / Bölgesel Kızarıklık (Arı Sokması Gibi)",
    btnBack: "Geri",
    btnNext: "Sonraki Adım",

    step3Title: "Adım 3: Görsel İşaretler",
    step3Desc: "Örümcekte herhangi bir işaret fark ettiniz mi?",
    visViolin: "Sırtında keman şeklinde iz",
    visHourglass: "Karnında kırmızı/turuncu kum saati",
    visHairy: "Çok büyük, tüylü gövde",
    visUnknown: "Görülmedi / Bilinmiyor",

    disclaimerText: "Tıbbi Uyarı: Bu rehber yalnızca eğitim amaçlı tür tanımlama içindir. Ciddi belirtiler için mutlaka profesyonel acil tıbbi yardım alın.",
    btnRestart: "Yeni Teşhis Başlat",
    leadId: "Olası Tür:",
    firstAid: "İlk Yardım Protokolü:",

    filterAllVenom: "Tüm Zehir Seviyeleri",
    filterSafe: "🟢 Düşük Risk / Zararsız",
    filterWarn: "🟡 Hafif Zehirli",
    filterDanger: "🔴 Tıbbi Müdahale Gerektirir",
    filterAllContinent: "Tüm Kıtalar",

    emptyState: "Arama veya filtrelerinize uyan bir tür bulunamadı.",

    resLowTitle: "🟢 Düşük Risk Reaksiyonu",
    resLowSpecies: "Bahçe Örümceği / Zararsız tür",
    resLowSteps: ["Sabun ve suyla yıkayın.", "Şişliğe soğuk kompres uygulayın."],

    resNecroticTitle: "🔴 Yüksek Risk: Nekrotik / Keman Örümceği Şüphesi",
    resNecroticSpecies: "Loxosceles reclusa (Kahverengi Recluse)",
    resNecroticSteps: ["Beze sarılmış soğuk kompres uygulayın.", "Etkilenen uzvu yukarı kaldırın.", "Acilen tıbbi değerlendirme alın."],

    resNeuroTitle: "🔴 Yüksek Risk: Nörotoksik Isırık Şüphesi",
    resNeuroSpecies: "Latrodectus spp. (Kara Dul)",
    resNeuroSteps: ["Hastayı sakin tutun.", "Antivenom için derhal acil servise başvurun."]
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

  // Bug fix: clicking the dark overlay outside the modal box did nothing before — only the X worked.
  document.getElementById('detailModal').addEventListener('click', (e) => {
    if (e.target.id === 'detailModal') closeModal();
  });
  // Bug fix: Escape key did not close the modal.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});

function initMap() {
  // Bug fix: Leaflet's default marker icon paths resolve relative to the page URL, not the
  // leaflet.js file, so markers frequently render as broken images when leaflet.js is loaded
  // from a CDN like this one. Point the default icon explicitly at the CDN assets.
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
  });

  map = L.map('map-container').setView([20, 0], 2);

  // Fix: the standard OSM tile layer renders every place name in that region's own
  // local script — 北京市, موريتانيا, Magyarország — so a world map ends up mixing
  // dozens of languages/scripts at once. Wikimedia's "osm-intl" tiles are the same
  // OSM cartography rendered with a forced label language (?lang=en), giving a single
  // consistent language with no API key required. detectRetina serves sharp @2x tiles
  // only to high-DPI screens, so standard displays aren't paying for pixels they can't show.
  L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png?lang=en', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, style by <a href="https://wikimediafoundation.org/">Wikimedia</a>',
    maxZoom: 18,
    detectRetina: true
  }).addTo(map);
}

async function loadSpeciesData() {
  try {
    const res = await fetch('data/species.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    spiderData = await res.json();
    renderApp();
  } catch (err) {
    console.error("Data loading error:", err);
    const grid = document.getElementById('spiderGrid');
    if (grid) {
      grid.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i>Species data could not be loaded.</div>`;
    }
  }
}

function renderApp() {
  const t = translations[currentLang];

  document.documentElement.lang = t.htmlLang;
  document.getElementById('seoTitle').innerText = t.seoTitle;
  document.getElementById('seoDesc').setAttribute('content', t.seoDesc);

  document.getElementById('logoTitle').innerText = t.logoTitle;
  document.getElementById('heroSubtitle').innerText = t.heroSubtitle;
  document.getElementById('langBtnText').innerText = t.langBtnText;
  document.getElementById('searchInput').placeholder = t.searchPlaceholder;
  document.getElementById('secCatalog').innerText = t.secCatalog;
  document.getElementById('secMap').innerText = t.secMap;
  document.getElementById('diagTitle').innerText = t.diagTitle;

  // Diagnostic wizard — step 1
  document.getElementById('step1Title').innerText = t.step1Title;
  document.getElementById('step1Desc').innerText = t.step1Desc;
  document.getElementById('locNA').lastChild.textContent = ' ' + t.locNA;
  document.getElementById('locSA').lastChild.textContent = ' ' + t.locSA;
  document.getElementById('locAU').lastChild.textContent = ' ' + t.locAU;
  document.getElementById('locEU').lastChild.textContent = ' ' + t.locEU;

  // Step 2
  document.getElementById('step2Title').innerText = t.step2Title;
  document.getElementById('step2Desc').innerText = t.step2Desc;
  document.getElementById('symNecrotic').innerText = t.symNecrotic;
  document.getElementById('symCramps').innerText = t.symCramps;
  document.getElementById('symSweating').innerText = t.symSweating;
  document.getElementById('symMild').innerText = t.symMild;
  document.getElementById('btnBack2').lastChild.textContent = ' ' + t.btnBack;
  document.getElementById('btnNext2').firstChild.textContent = t.btnNext + ' ';

  // Step 3
  document.getElementById('step3Title').innerText = t.step3Title;
  document.getElementById('step3Desc').innerText = t.step3Desc;
  document.getElementById('visViolin').innerText = t.visViolin;
  document.getElementById('visHourglass').innerText = t.visHourglass;
  document.getElementById('visHairy').innerText = t.visHairy;
  document.getElementById('visUnknown').innerText = t.visUnknown;
  document.getElementById('btnBack3').lastChild.textContent = ' ' + t.btnBack;

  // Disclaimer & restart
  document.getElementById('disclaimerText').innerText = ' ' + t.disclaimerText;
  document.getElementById('btnRestart').lastChild.textContent = ' ' + t.btnRestart;

  // Filters
  const venomFilter = document.getElementById('venomFilter');
  venomFilter.options[0].text = t.filterAllVenom;
  venomFilter.options[1].text = t.filterSafe;
  venomFilter.options[2].text = t.filterWarn;
  venomFilter.options[3].text = t.filterDanger;
  document.getElementById('continentFilter').options[0].text = t.filterAllContinent;

  // If a diagnosis result is already showing, re-render it in the new language
  if (diagnosticCompleted) evaluateDiagnosis();

  filterAndRender();
}

function renderSpiders(data) {
  const grid = document.getElementById('spiderGrid');
  const t = translations[currentLang];

  // Bug fix: an empty filtered result used to just leave a blank grid with no feedback.
  if (data.length === 0) {
    grid.innerHTML = `<div class="empty-state"><i class="fa-solid fa-spider"></i>${t.emptyState}</div>`;
    return;
  }

  grid.innerHTML = data.map(s => `
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
    `).join('');
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
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const v = document.getElementById('venomFilter').value;
  const c = document.getElementById('continentFilter').value;

  const filtered = spiderData.filter(s => {
    // Bug fix: search now checks both language names, not just the currently active one,
    // so a Turkish name typed while viewing the English UI (or vice versa) still matches.
    const matchQ = !q ||
      s.name.en.toLowerCase().includes(q) ||
      s.name.tr.toLowerCase().includes(q) ||
      s.scientificName.toLowerCase().includes(q);
    const matchV = v === 'all' || s.venomLevel === v;
    const matchC = c === 'all' || s.continent === c;
    return matchQ && matchV && matchC;
  });

  renderSpiders(filtered);
  updateMap(filtered);
}

// ---- Diagnostic Wizard ----
function selectLocation(region) { diagState.location = region; goToStep(2); }

function processSymptoms() {
  const checked = document.querySelectorAll('.symptom-checkboxes input:checked');
  diagState.symptoms = Array.from(checked).map(c => c.value);
  goToStep(3);
}

function selectVisual(marking) {
  diagState.visualMarking = marking;
  diagnosticCompleted = true;
  evaluateDiagnosis();
  goToStep('Result');
}

function goToStep(stepNum) {
  document.querySelectorAll('.diag-step').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.step-dot').forEach(d => d.classList.remove('active'));

  const target = document.getElementById('step' + stepNum);
  if (target) target.classList.add('active');

  if (stepNum === 'Result') {
    document.getElementById('dotResult').classList.add('active');
    // Result is the end of the flow, so every prior dot lights up too.
    for (let i = 1; i <= 3; i++) document.getElementById('dot' + i).classList.add('active');
  } else {
    for (let i = 1; i <= stepNum; i++) document.getElementById('dot' + i).classList.add('active');
  }
}

function evaluateDiagnosis() {
  const t = translations[currentLang];
  const resContainer = document.getElementById('resultContent');

  let title = t.resLowTitle;
  let riskClass = "venom-safe";
  let species = t.resLowSpecies;
  let steps = t.resLowSteps;

  // Bug fix: these result strings were hardcoded in English before, so switching to Turkish
  // never translated the diagnosis itself, only the surrounding page chrome.
  if (diagState.symptoms.includes('necrotic') || diagState.visualMarking === 'violin') {
    riskClass = "venom-danger";
    title = t.resNecroticTitle;
    species = t.resNecroticSpecies;
    steps = t.resNecroticSteps;
  } else if (diagState.symptoms.includes('cramps') || diagState.visualMarking === 'hourglass') {
    riskClass = "venom-danger";
    title = t.resNeuroTitle;
    species = t.resNeuroSpecies;
    steps = t.resNeuroSteps;
  }

  resContainer.innerHTML = `
    <div style="background: rgba(15,23,42,0.6); border: 1px solid var(--border-color); padding: 15px; border-radius: 8px;">
      <h3 class="${riskClass}">${title}</h3>
      <p style="margin-top: 6px;"><strong>${t.leadId}</strong> ${species}</p>
    </div>
    <h4 style="margin-top: 15px;">${t.firstAid}</h4>
    <ul style="padding-left: 20px; font-size: 0.9rem; margin-top: 5px;">
      ${steps.map(st => `<li>${st}</li>`).join('')}
    </ul>
  `;
}

function resetDiagnostic() {
  diagState.location = ''; diagState.symptoms = []; diagState.visualMarking = '';
  diagnosticCompleted = false;
  document.querySelectorAll('.symptom-checkboxes input').forEach(c => c.checked = false);
  goToStep(1);
}

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'tr' : 'en';
  renderApp();
}

function openModal(id) {
  const s = spiderData.find(item => item.id === id);
  if (!s) return;
  document.getElementById('modalTitle').innerText = s.name[currentLang];
  document.getElementById('modalLatin').innerText = s.scientificName;
  document.getElementById('modalBody').innerHTML = `
    <p><strong>Venom Risk:</strong> ${s.venomText[currentLang]}</p>
    <p><strong>Habitat:</strong> ${s.habitat}</p>
    <p><strong>Size:</strong> ${s.size}</p>
    <hr style="border-color: var(--border-color); margin: 12px 0;">
    <p>${s.desc[currentLang]}</p>
  `;
  document.getElementById('detailModal').classList.add('active');
  document.getElementById('detailModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('detailModal').classList.remove('active');
  document.getElementById('detailModal').style.display = 'none';
}
