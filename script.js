const tabs = ['home', 'programs', 'charter', 'news', 'community', 'relief', 'contact'];

// ---------- Dialect / Language translations ----------
const translations = {
  en: {
    reportTitle: "One-Touch Report a Need",
    reportDesc: "Report a need in 3 simple steps. Works even offline — your report is saved and submitted automatically when you reconnect.",
    step1: "Who is reporting?",
    step2: "Where is the need?",
    step3: "What do you need?",
    anonymous: "Report Anonymously",
    name: "Name",
    namePh: "Your name (optional)",
    barangay: "Barangay / Location",
    barangayPh: "e.g. San Isidro",
    municipality: "Municipality / City",
    needCategory: "Need Category",
    food: "Food",
    water: "Water",
    sanitation: "Sanitation",
    emergency: "Emergency",
    submit: "Submit Report",
    saved: "Report saved offline. It will auto-submit when you reconnect.",
    connected: "Report submitted successfully! DSWD has been notified."
  },
  fil: {
    reportTitle: "Mag-ulat ng Pangangailangan",
    reportDesc: "Mag-ulat sa 3 simpleng hakbang. Gumagana kahit offline — nai-save ang ulat at awtomatikong isusumite kapag konektado ka na.",
    step1: "Sino ang nag-uulat?",
    step2: "Saan ang pangangailangan?",
    step3: "Ano ang kailangan mo?",
    anonymous: "Mag-ulat nang Hindi Nagpapakilala",
    name: "Pangalan",
    namePh: "Iyong pangalan (opsyonal)",
    barangay: "Barangay / Lugar",
    barangayPh: "hal. San Isidro",
    municipality: "Bayan / Lungsod",
    needCategory: "Kategorya ng Pangangailangan",
    food: "Pagkain",
    water: "Tubig",
    sanitation: "Kalinisan",
    emergency: "Emerhensiya",
    submit: "Isumite ang Ulat",
    saved: "Nai-save ang ulat offline. Awtomatikong isusumite kapag konektado na.",
    connected: "Matagumpay na naisumite ang ulat! Naabisuhan na ang DSWD."
  }
};

// ---------- Relief Tracker data ----------
const reliefSchedule = [
  { municipality: "Maramag", service: "Relief Goods Distribution", time: "Mon & Thu · 8:00 AM", status: "Active" },
  { municipality: "Quezon", service: "Water Truck Delivery", time: "Tue & Fri · 9:00 AM", status: "Scheduled" },
  { municipality: "Don Carlos", service: "Mobile Health Unit", time: "Wed & Sat · 7:30 AM", status: "Active" },
  { municipality: "Kitaotao", service: "Relief Goods Distribution", time: "Wed · 10:00 AM", status: "Pending" },
  { municipality: "Kadingilan", service: "Water Truck Delivery", time: "Sat · 8:00 AM", status: "Scheduled" }
];

// ---------- Offline-First Light Mode ----------
function toggleLightMode() {
  document.body.classList.toggle('light-mode');
  const active = document.body.classList.contains('light-mode');
  const btn = document.getElementById('light-mode-btn');
  btn.innerHTML = active ? '<i class="fa-solid fa-bolt"></i> Standard Mode' : '<i class="fa-solid fa-leaf"></i> Light Mode';
  btn.classList.toggle('bg-dswdYellow', !active);
  btn.classList.toggle('text-gray-900', !active);
  btn.classList.toggle('bg-green-600', active);
  btn.classList.toggle('text-white', active);
}

// ---------- Voice & Dialect Support ----------
let speechEnabled = false;
function toggleVoice() {
  speechEnabled = !speechEnabled;
  const btn = document.getElementById('voice-btn');
  btn.innerHTML = speechEnabled ? '<i class="fa-solid fa-volume-high"></i> Voice On' : '<i class="fa-solid fa-volume-off"></i> Voice Off';
  const status = document.getElementById('voice-status');
  status.textContent = speechEnabled ? 'Audio guidance enabled' : 'Audio guidance disabled';
  if (speechEnabled && 'speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance('Welcome to DSWD Connect. Kami po ay handang tumulong sa inyo.');
    msg.lang = 'fil-PH';
    window.speechSynthesis.speak(msg);
  }
}

function setDialect(lang) {
  const t = translations[lang];
  document.getElementById('report-title').textContent = t.reportTitle;
  document.getElementById('report-desc').textContent = t.reportDesc;
  document.getElementById('step1').textContent = t.step1;
  document.getElementById('step2').textContent = t.step2;
  document.getElementById('step3').textContent = t.step3;
  document.getElementById('anonymous-label').textContent = t.anonymous;
  document.getElementById('name-label').textContent = t.name;
  document.getElementById('name-input').placeholder = t.namePh;
  document.getElementById('barangay-label').textContent = t.barangay;
  document.getElementById('barangay-input').placeholder = t.barangayPh;
  document.getElementById('municipality-label').textContent = t.municipality;
  document.getElementById('need-label').textContent = t.needCategory;
  document.getElementById('need-food').textContent = t.food;
  document.getElementById('need-water').textContent = t.water;
  document.getElementById('need-sanitation').textContent = t.sanitation;
  document.getElementById('need-emergency').textContent = t.emergency;
  document.getElementById('report-submit').textContent = t.submit;
  document.getElementById('report-saved-msg').textContent = t.saved;
  document.getElementById('report-connected-msg').textContent = t.connected;
  // Update active dialect button
  document.querySelectorAll('.dialect-btn').forEach(b => {
    b.classList.remove('bg-dswdBlue', 'text-white');
    b.classList.add('bg-gray-100', 'text-gray-600');
  });
  const active = document.getElementById('dialect-' + lang);
  if (active) {
    active.classList.add('bg-dswdBlue', 'text-white');
    active.classList.remove('bg-gray-100', 'text-gray-600');
  }
}

// ---------- One-Touch Report a Need ----------
function nextNeedStep() {
  const current = parseInt(document.getElementById('report-current').value);
  const next = current + 1;
  if (next <= 3) {
    document.getElementById('report-current').value = next;
    updateNeedStepDisplay();
  }
}

function prevNeedStep() {
  const current = parseInt(document.getElementById('report-current').value);
  if (current > 1) {
    document.getElementById('report-current').value = current - 1;
    updateNeedStepDisplay();
  }
}

function updateNeedStepDisplay() {
  const current = parseInt(document.getElementById('report-current').value);
  for (let i = 1; i <= 3; i++) {
    document.getElementById('need-step-' + i).classList.toggle('hidden', i !== current);
  }
  document.getElementById('report-progress').textContent = 'Step ' + current + ' of 3';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function submitNeedReport(event) {
  if (event) event.preventDefault();
  const name = document.getElementById('name-input').value;
  const barangay = document.getElementById('barangay-input').value;
  const municipality = document.getElementById('municipality-input').value;
  const need = document.getElementById('need-select').value;
  const anonymous = document.getElementById('anonymous-check').checked;

  const report = { name: anonymous ? 'Anonymous' : name, barangay, municipality, need, ts: new Date().toISOString() };

  // Save locally (offline-first)
  let reports = JSON.parse(localStorage.getItem('dswd_reports') || '[]');
  reports.push(report);
  localStorage.setItem('dswd_reports', JSON.stringify(reports));

  document.getElementById('report-connected-msg').classList.remove('hidden');

  // Reset form
  document.getElementById('name-input').value = '';
  document.getElementById('barangay-input').value = '';
  document.getElementById('municipality-input').value = '';
  document.getElementById('report-current').value = 1;
  updateNeedStepDisplay();
}

// ---------- Interactive Relief Distribution Map (Leaflet + OpenStreetMap) ----------
let reliefMap = null;
let reliefMapInitialized = false;

function initReliefMap() {
  const mapEl = document.getElementById('relief-map');
  // Only initialize once, and only when the container is actually visible
  // (hidden containers have zero dimensions which breaks Leaflet).
  if (!mapEl || typeof L === 'undefined' || reliefMapInitialized) return;
  if (mapEl.offsetWidth === 0 || mapEl.offsetHeight === 0) return;
  reliefMapInitialized = true;

  // Bukidnon municipalities with their relief status
  const sites = [
    { name: 'Maramag', lat: 7.7633, lng: 125.0347, service: 'Relief Goods Distribution', status: 'Active', color: '#16a34a' },
    { name: 'Quezon', lat: 7.7300, lng: 125.0990, service: 'Water Truck Delivery', status: 'Scheduled', color: '#2563eb' },
    { name: 'Don Carlos', lat: 7.6767, lng: 124.9990, service: 'Mobile Health Unit', status: 'Active', color: '#16a34a' },
    { name: 'Kitaotao', lat: 7.6433, lng: 125.0890, service: 'Relief Goods Distribution', status: 'Pending', color: '#eab308' },
    { name: 'Kadingilan', lat: 7.6011, lng: 124.9092, service: 'Water Truck Delivery', status: 'Scheduled', color: '#2563eb' }
  ];

  reliefMap = L.map(mapEl).setView([7.685, 125.0], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(reliefMap);

  sites.forEach(site => {
    const icon = L.divIcon({
      className: '',
      html: `<div style="width:18px;height:18px;border-radius:50%;background:${site.color};border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4);"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });
    L.marker([site.lat, site.lng], { icon })
      .addTo(reliefMap)
      .bindPopup(`<strong>${site.name}</strong><br>${site.service}<br><span style="color:${site.color};font-weight:bold;">${site.status}</span>`);
  });
}

// ---------- Interactive Relief Tracker ----------
function renderReliefTracker() {
  const container = document.getElementById('relief-list');
  if (!container) return;
  container.innerHTML = reliefSchedule.map(item => `
    <div class="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
      <div class="w-10 h-10 rounded-full flex items-center justify-center text-white ${item.service.includes('Water') ? 'bg-blue-600' : item.service.includes('Health') ? 'bg-green-600' : 'bg-dswdRed'} shrink-0">
        <i class="fa-solid ${item.service.includes('Water') ? 'fa-droplet' : item.service.includes('Health') ? 'fa-heart-pulse' : 'fa-boxes-stacked'}"></i>
      </div>
      <div class="flex-1">
        <div class="flex justify-between items-center">
          <span class="font-bold text-sm text-gray-900">${item.municipality}</span>
          <span class="text-xs font-bold px-2 py-0.5 rounded ${item.status === 'Active' ? 'bg-green-100 text-green-700' : item.status === 'Scheduled' ? 'bg-blue-100 text-dswdBlue' : 'bg-yellow-100 text-yellow-700'}">${item.status}</span>
        </div>
        <p class="text-xs text-gray-600">${item.service}</p>
        <p class="text-xs text-gray-500"><i class="fa-regular fa-clock mr-1"></i>${item.time}</p>
      </div>
    </div>
  `).join('');
}

// ---------- SMS & Social Media ----------
function sendSMS() {
  const phone = document.getElementById('sms-phone').value.replace(/[^0-9]/g, '');
  if (!phone || phone.length < 10) {
    alert('Please enter a valid mobile number.');
    return;
  }
  const msg = encodeURIComponent('DSWD HELP: Reporting a community need. Please contact me.');
  window.open(`sms:+63${phone}?body=${msg}`);
}

function openMessenger() {
  window.open('https://m.me/dswd.gov.ph', '_blank');
}

function openViber() {
  window.open('https://vb.me/DSWD', '_blank');
}

function disableTransitions() {
  document.body.classList.toggle('no-anim');
}

function updatePST() {
  const now = new Date();
  const options = { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
  document.getElementById('pst-clock').innerText = now.toLocaleTimeString('en-US', options) + ' PHT';
}

function switchTab(tabId) {
  document.querySelectorAll('.view-content').forEach(view => view.classList.add('hidden'));
  document.getElementById(`view-${tabId}`).classList.remove('hidden');

  const index = tabs.indexOf(tabId);
  document.querySelectorAll('.nav-link').forEach((link, idx) => {
    if (idx === index) {
      link.classList.add('border-dswdYellow');
      link.classList.remove('border-transparent');
    } else {
      link.classList.remove('border-dswdYellow');
      link.classList.add('border-transparent');
    }
  });

document.getElementById('mobile-menu').classList.add('hidden');

// Initialize / refresh the relief map when its tab is opened
  if (tabId === 'relief') {
    initReliefMap();
    setTimeout(() => {
      if (reliefMap) reliefMap.invalidateSize();
    }, 200);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function filterPrograms(category, event) {
  document.querySelectorAll('.prog-card').forEach(card => {
    if (category === 'all' || card.classList.contains(category)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });

  document.querySelectorAll('.prog-filter-btn').forEach(btn => {
    btn.classList.remove('border-dswdBlue', 'text-dswdBlue');
    btn.classList.add('border-transparent', 'text-gray-500');
  });
  event.target.classList.add('border-dswdBlue', 'text-dswdBlue');
  event.target.classList.remove('border-transparent', 'text-gray-500');
}

function handleFormSubmit(event) {
  event.preventDefault();
  document.getElementById('form-alert').classList.remove('hidden');
  event.target.reset();
}

function handleNewsletter(event) {
  event.preventDefault();
  document.getElementById('newsletter-alert').classList.remove('hidden');
  event.target.querySelector('input').value = '';
}

function toggleAccessibility() {
  document.body.classList.toggle('contrast-125');
}

function initMenuToggle() {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMenuToggle();
  updatePST();
  setInterval(updatePST, 1000);
renderReliefTracker();
  initReliefMap();
  setDialect('en');
});
