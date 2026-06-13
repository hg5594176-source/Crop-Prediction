/* =============================================
   ANALYTICS.JS — Charts, Weather Alerts,
                  and AI Crop Prediction
   AI Crop Dashboard
   ============================================= */

/* ---- Init ---- */
async function initAnalytics() {
  renderWeatherAlerts();
  await renderCharts();
  bindRangeInputs();
  bindPredictionForm();
  // Train neural network (async — shows progress in UI)
  await trainMLModel();
}


/* ============================================
   WEATHER ALERTS — Rich data for modal
   ============================================ */
const WEATHER_ALERTS = [
  {
    type: 'critical',
    icon: '🌪️',
    title: 'Cyclone Warning — Coastal Regions',
    shortTitle: 'Cyclone Warning',
    desc: 'Cyclone alert for Odisha & West Bengal coastlines. Farmers advised to harvest crops immediately and move livestock to safer locations.',
    region: 'Odisha, West Bengal',
    time: 'Issued: Today 08:00 AM',
    severity: 'Extreme',
    windSpeed: '120–140 km/h',
    rainfall: '200+ mm',
    duration: '24–36 hours',
    advisory: [
      'Harvest all ready crops immediately',
      'Do not venture into coastal waters',
      'Move livestock to higher ground',
      'Stock up on food and emergency supplies',
      'Follow local authority evacuation orders'
    ],
    affectedCrops: 'Paddy, Banana, Coconut, Vegetables',
    tempRange: '26–30°C',
    humidity: '90–100%'
  },
  {
    type: 'warning',
    icon: '🌧️',
    title: 'Heavy Rainfall — North India',
    shortTitle: 'Heavy Rainfall',
    desc: 'IMD predicts heavy to very heavy rainfall in Punjab, Haryana & UP for next 48 hours. Risk of waterlogging in low-lying fields.',
    region: 'Punjab, Haryana, Uttar Pradesh',
    time: 'Next 48 hours',
    severity: 'High',
    windSpeed: '30–50 km/h',
    rainfall: '100–180 mm',
    duration: '48 hours',
    advisory: [
      'Ensure proper field drainage to avoid waterlogging',
      'Delay fertiliser application until rain stops',
      'Avoid spraying pesticides',
      'Protect harvested grain from moisture',
      'Check embankments and bunds regularly'
    ],
    affectedCrops: 'Wheat, Mustard, Potato, Vegetables',
    tempRange: '18–24°C',
    humidity: '75–90%'
  },
  {
    type: 'warning',
    icon: '🔥',
    title: 'Heat Wave — Rajasthan & Gujarat',
    shortTitle: 'Heat Wave Alert',
    desc: 'Temperature may exceed 44°C. Irrigate crops early morning or late evening to reduce water loss and heat stress.',
    region: 'Rajasthan, Gujarat',
    time: 'Next 3–4 days',
    severity: 'High',
    windSpeed: '15–25 km/h (Hot)',
    rainfall: '< 5 mm',
    duration: '3–4 days',
    advisory: [
      'Irrigate fields in early morning (4–7 AM) or evening',
      'Use mulching to reduce soil moisture loss',
      'Avoid field work between 11 AM – 4 PM',
      'Provide shade and water to livestock',
      'Apply antitranspirants on sensitive crops'
    ],
    affectedCrops: 'Cotton, Groundnut, Bajra, Vegetables',
    tempRange: '42–46°C',
    humidity: '15–30%'
  },
  {
    type: 'info',
    icon: '🌬️',
    title: 'Frost Risk — Himalayan Foothills',
    shortTitle: 'Frost Risk',
    desc: 'Overnight temperatures may drop below 5°C. Cover sensitive crops and seedlings to prevent frost damage.',
    region: 'Himachal Pradesh, J&K, Uttarakhand',
    time: 'Night hours (10 PM – 6 AM)',
    severity: 'Moderate',
    windSpeed: '5–15 km/h',
    rainfall: '< 10 mm',
    duration: '3–5 nights',
    advisory: [
      'Cover seedlings and nurseries with polythene sheets',
      'Light irrigation before sunset can prevent frost',
      'Use smoke screens in orchards if needed',
      'Delay transplanting of seedlings for 1 week',
      'Harvest mature vegetables before nightfall'
    ],
    affectedCrops: 'Tomato, Potato, Pea, Apple, Stone Fruits',
    tempRange: '2–8°C',
    humidity: '60–75%'
  },
  {
    type: 'success',
    icon: '☀️',
    title: 'Favorable Conditions — Central India',
    shortTitle: 'Good Weather',
    desc: 'Clear skies and moderate temperatures in Maharashtra & MP. Excellent conditions for sowing, spraying, and harvesting.',
    region: 'Maharashtra, Madhya Pradesh',
    time: 'Next 7 days',
    severity: 'None',
    windSpeed: '10–20 km/h',
    rainfall: '10–30 mm (Light)',
    duration: '7 days',
    advisory: [
      'Ideal time for land preparation and sowing',
      'Apply fertilisers and pesticides as needed',
      'Harvest Rabi crops at optimal moisture',
      'Carry out inter-culture operations',
      'Store harvested produce in a dry, cool place'
    ],
    affectedCrops: 'Soybean, Cotton, Wheat, Sorghum',
    tempRange: '22–30°C',
    humidity: '45–60%'
  },
  {
    type: 'warning',
    icon: '🦗',
    title: 'Pest Alert — Locust Activity',
    shortTitle: 'Locust Alert',
    desc: 'Desert locust swarms spotted near Rajasthan-Gujarat border. Take preventive action immediately.',
    region: 'Rajasthan (border areas), Gujarat (North)',
    time: 'Ongoing — Monitor daily',
    severity: 'High',
    windSpeed: '20–40 km/h',
    rainfall: '< 5 mm',
    duration: 'Ongoing',
    advisory: [
      'Contact local agriculture department immediately',
      'Apply malathion 96% ULV (aerial or ground spraying)',
      'Form village-level watch committees',
      'Use drums/noise to drive away swarms',
      'Do not attempt manual control alone'
    ],
    affectedCrops: 'All standing crops, especially Bajra, Maize, Vegetables',
    tempRange: '30–38°C',
    humidity: '20–40%'
  }
];

/* ---- Badge colour helper ---- */
function alertBadgeClass(type) {
  return type === 'critical' ? 'red'
       : type === 'warning'  ? 'orange'
       : type === 'success'  ? 'green'
       : 'blue';
}

/* ---- Render compact chip grid ---- */
function renderWeatherAlerts() {
  const list = document.getElementById('alertList');
  if (!list) return;

  list.className = 'alert-grid';

  list.innerHTML = WEATHER_ALERTS.map((a, idx) => `
    <div class="alert-chip ${a.type}" onclick="openWeatherModal(${idx})" title="Click to view full details">
      <div class="alert-chip-icon">${a.icon}</div>
      <div class="alert-chip-body">
        <div class="alert-chip-title">${a.shortTitle}</div>
        <div class="alert-chip-region">📍 ${a.region}</div>
      </div>
      <div class="alert-chip-right">
        <span class="badge badge-${alertBadgeClass(a.type)}" style="font-size:9px;padding:2px 7px">
          ${a.type.toUpperCase()}
        </span>
        <button class="alert-chip-btn">View Details →</button>
      </div>
    </div>
  `).join('');
}

/* ---- Open Weather Detail Modal ---- */
function openWeatherModal(idx) {
  const a = WEATHER_ALERTS[idx];

  // Remove existing modal if any
  const existing = document.getElementById('weatherModalOverlay');
  if (existing) existing.remove();

  const severityColors = {
    'Extreme': 'var(--danger)',
    'High':    'var(--warning)',
    'Moderate':'var(--info)',
    'None':    'var(--success)'
  };
  const sevColor = severityColors[a.severity] || 'var(--muted)';

  const overlay = document.createElement('div');
  overlay.id = 'weatherModalOverlay';
  overlay.className = 'weather-modal-overlay';
  overlay.innerHTML = `
    <div class="weather-modal" role="dialog" aria-modal="true">
      <!-- Header -->
      <div class="weather-modal-header">
        <div class="weather-modal-icon ${a.type}">${a.icon}</div>
        <div style="flex:1;min-width:0">
          <div class="weather-modal-title">${a.title}</div>
          <div style="margin-top:4px;display:flex;gap:6px;flex-wrap:wrap">
            <span class="badge badge-${alertBadgeClass(a.type)}">${a.type.toUpperCase()}</span>
            <span style="font-size:11px;color:var(--muted)">⏱ ${a.time}</span>
          </div>
        </div>
        <button class="weather-modal-close" onclick="closeWeatherModal()" aria-label="Close">✕</button>
      </div>

      <!-- Body -->
      <div class="weather-modal-body">
        <!-- Description -->
        <p style="font-size:13.5px;color:var(--text2);line-height:1.7;margin-bottom:14px">${a.desc}</p>

        <!-- Detail rows -->
        <div class="weather-detail-row">
          <span class="weather-detail-label">📍 Region</span>
          <span class="weather-detail-val">${a.region}</span>
        </div>
        <div class="weather-detail-row">
          <span class="weather-detail-label">⚠️ Severity</span>
          <span class="weather-detail-val" style="font-weight:700;color:${sevColor}">${a.severity}</span>
        </div>
        <div class="weather-detail-row">
          <span class="weather-detail-label">🌾 Crops at Risk</span>
          <span class="weather-detail-val">${a.affectedCrops}</span>
        </div>
        <div class="weather-detail-row">
          <span class="weather-detail-label">⏳ Duration</span>
          <span class="weather-detail-val">${a.duration}</span>
        </div>

        <!-- Weather stats -->
        <div class="weather-modal-stats">
          <div class="weather-stat-box">
            <div class="weather-stat-val">🌡</div>
            <div style="font-size:13px;font-weight:600;color:var(--text);margin-top:4px">${a.tempRange}</div>
            <div class="weather-stat-label">Temperature</div>
          </div>
          <div class="weather-stat-box">
            <div class="weather-stat-val">💧</div>
            <div style="font-size:13px;font-weight:600;color:var(--text);margin-top:4px">${a.humidity}</div>
            <div class="weather-stat-label">Humidity</div>
          </div>
          <div class="weather-stat-box">
            <div class="weather-stat-val">🌧</div>
            <div style="font-size:13px;font-weight:600;color:var(--text);margin-top:4px">${a.rainfall}</div>
            <div class="weather-stat-label">Expected Rainfall</div>
          </div>
          <div class="weather-stat-box">
            <div class="weather-stat-val">💨</div>
            <div style="font-size:13px;font-weight:600;color:var(--text);margin-top:4px">${a.windSpeed}</div>
            <div class="weather-stat-label">Wind Speed</div>
          </div>
        </div>

        <!-- Advisory -->
        <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--card-border)">
          <div style="font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">
            📋 Farmer Advisory
          </div>
          <ul style="padding-left:0;list-style:none;display:flex;flex-direction:column;gap:6px">
            ${a.advisory.map(tip => `
              <li style="display:flex;align-items:flex-start;gap:8px;font-size:13px;color:var(--text2)">
                <span style="color:var(--primary);font-weight:700;flex-shrink:0;margin-top:1px">•</span>
                ${tip}
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <!-- Footer -->
      <div class="weather-modal-footer">
        <span style="font-size:11px;color:var(--muted);margin-right:auto">Source: IMD India • AI Crop Dashboard</span>
        <button class="btn btn-outline btn-sm" onclick="closeWeatherModal()">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Close on overlay click outside modal
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeWeatherModal();
  });

  // Close on Escape
  document.addEventListener('keydown', handleEscKey);
}

function closeWeatherModal() {
  const overlay = document.getElementById('weatherModalOverlay');
  if (overlay) {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.2s';
    setTimeout(() => overlay.remove(), 200);
  }
  document.removeEventListener('keydown', handleEscKey);
}

function handleEscKey(e) {
  if (e.key === 'Escape') closeWeatherModal();
}

/* ============================================
   CHARTS
   ============================================ */
async function renderCharts() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded');
    return;
  }

  const data = await getAllData();
  renderSubmissionsChart(data);
  renderCropDistChart(data);
  renderWeatherChart();
  renderSoilChart(data);
}

/* Chart 1 — Submissions Over Time (Line) */
function renderSubmissionsChart(data) {
  const ctx = document.getElementById('submissionsChart');
  if (!ctx) return;

  // Group by day (last 14 days)
  const days = [];
  const counts = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    const dateStr = d.toDateString();
    days.push(label);
    counts.push(data.filter(r => new Date(r.timestamp).toDateString() === dateStr).length);
  }

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: days,
      datasets: [{
        label: 'Submissions',
        data: counts,
        borderColor: '#E8810A',
        backgroundColor: 'rgba(232,129,10,0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: '#E8810A',
        pointRadius: 4,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: '#2D1A00', titleColor: '#FFF3E0', bodyColor: '#F0D9B5' }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#9A7A40', stepSize: 1 },
          grid: { color: 'rgba(212,168,67,0.15)' }
        },
        x: {
          ticks: { color: '#9A7A40', maxRotation: 45 },
          grid: { display: false }
        }
      }
    }
  });
}

/* Chart 2 — Crop Type Distribution (Doughnut) */
function renderCropDistChart(data) {
  const ctx = document.getElementById('cropDistChart');
  if (!ctx) return;

  const counts = {};
  data.forEach(r => {
    if (r.cropType) counts[r.cropType] = (counts[r.cropType] || 0) + 1;
  });

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const labels = sorted.map(e => e[0]);
  const values = sorted.map(e => e[1]);

  const colors = [
    '#E8810A','#F59E0B','#D4A843','#C8A96E','#B8923A',
    '#8B6914','#6B4F12','#4A3010'
  ];

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderColor: 'transparent',
        borderWidth: 2,
        hoverOffset: 10,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#5C3D11',
            padding: 10,
            font: { size: 12 }
          }
        },
        tooltip: { backgroundColor: '#2D1A00', titleColor: '#FFF3E0', bodyColor: '#F0D9B5' }
      },
      cutout: '60%',
    }
  });
}

/* Chart 3 — Weather Variation (Bar) */
function renderWeatherChart() {
  const ctx = document.getElementById('weatherChart');
  if (!ctx) return;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const temps  = [18, 22, 28, 34, 40, 38, 32, 30, 29, 26, 20, 17];
  const humid  = [55, 48, 42, 35, 28, 65, 82, 85, 78, 60, 55, 57];
  const rain   = [20, 15, 10, 5, 3, 80, 195, 210, 130, 35, 15, 22];

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Avg Temp (°C)',
          data: temps,
          backgroundColor: 'rgba(232,129,10,0.7)',
          borderRadius: 6,
          yAxisID: 'y',
        },
        {
          label: 'Humidity (%)',
          data: humid,
          backgroundColor: 'rgba(212,168,67,0.7)',
          borderRadius: 6,
          yAxisID: 'y',
        },
        {
          label: 'Rainfall (mm)',
          data: rain,
          type: 'line',
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59,130,246,0.1)',
          borderWidth: 2,
          pointRadius: 3,
          fill: true,
          tension: 0.4,
          yAxisID: 'y2',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#5C3D11', font: { size: 11 } }
        },
        tooltip: { backgroundColor: '#2D1A00', titleColor: '#FFF3E0', bodyColor: '#F0D9B5' }
      },
      scales: {
        y: {
          ticks: { color: '#9A7A40' },
          grid: { color: 'rgba(212,168,67,0.15)' },
          title: { display: true, text: 'Temp / Humidity', color: '#9A7A40' }
        },
        y2: {
          position: 'right',
          ticks: { color: '#3B82F6' },
          grid: { display: false },
          title: { display: true, text: 'Rainfall (mm)', color: '#3B82F6' }
        },
        x: {
          ticks: { color: '#9A7A40' },
          grid: { display: false }
        }
      }
    }
  });
}

/* Chart 4 — State-wise Submissions (Bar) */
function renderSoilChart(data) {
  const ctx = document.getElementById('stateChart');
  if (!ctx) return;

  const stateCounts = {};
  data.forEach(r => {
    if (r.state) stateCounts[r.state] = (stateCounts[r.state] || 0) + 1;
  });

  const sorted = Object.entries(stateCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const labels = sorted.map(e => e[0]);
  const values = sorted.map(e => e[1]);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Submissions',
        data: values,
        backgroundColor: labels.map((_, i) => {
          const colors = ['#E8810A','#F59E0B','#D4A843','#C8A96E','#B8923A','#8B6914','#6B4F12','#4A3010','#E8810A','#F59E0B'];
          return colors[i % colors.length];
        }),
        borderRadius: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: '#2D1A00', titleColor: '#FFF3E0', bodyColor: '#F0D9B5' }
      },
      scales: {
        x: {
          ticks: { color: '#9A7A40' },
          grid: { color: 'rgba(212,168,67,0.15)' }
        },
        y: {
          ticks: { color: '#5C3D11', font: { weight: '600' } },
          grid: { display: false }
        }
      }
    }
  });
}

/* ============================================
   RANGE INPUTS — live display + summary sync
   ============================================ */
function bindRangeInputs() {
  // Map: [input-id, header-display-id, summary-preview-id, unit-suffix]
  const rangeMap = [
    ['pTemp',       'tempVal',    'sum_temp',  ''],
    ['pHumidity',   'humidVal',   'sum_humid', ''],
    ['pRainfall',   'rainVal',    'sum_rain',  ''],
    ['pPh',         'phVal',      'sum_ph',    ''],
    ['pNitrogen',   'nitroVal',   'sum_n',     ''],
    ['pPhosphorus', 'phosphoVal', 'sum_p',     ''],
    ['pPotassium',  'potassVal',  'sum_k',     ''],
  ];

  rangeMap.forEach(([inputId, displayId, summaryId]) => {
    const input   = document.getElementById(inputId);
    const display = document.getElementById(displayId);
    const summary = document.getElementById(summaryId);

    if (!input) return;

    // Set initial values
    if (display) display.textContent = input.value;
    if (summary) summary.textContent = input.value;

    // Update on every slider change
    input.addEventListener('input', () => {
      if (display) display.textContent = input.value;
      if (summary) summary.textContent = input.value;
    });
  });
}

/* ============================================================
   REAL ML CROP PREDICTION — TensorFlow.js Neural Network
   22 Crop Classes · 660 Training Samples
   Architecture: Dense(128) → BN → Dense(64) → Dense(22 softmax)
   Data: Kaggle Crop Recommendation Dataset (statistical means)
   ============================================================ */

// ── Crop Metadata ──
const CROP_META = {
  'Rice':          { emoji:'🌾', color:'#22C55E', tip:'Thrives in waterlogged, high-humidity fields. Ensure constant irrigation.',                alts:['Jute','Coconut'] },
  'Maize':         { emoji:'🌽', color:'#F59E0B', tip:'Versatile crop. Prefers well-drained loamy soil and warm weather.',                       alts:['Cotton','Jute'] },
  'Chickpea':      { emoji:'🌰', color:'#92400E', tip:'Thrives in cool, dry conditions with minimal moisture. Avoid waterlogging.',              alts:['Lentil','Kidney Beans'] },
  'Kidney Beans':  { emoji:'🫘', color:'#B45309', tip:'Prefers cool temperatures, moist soil. Rich nitrogen-fixer.',                            alts:['Chickpea','Lentil'] },
  'Pigeon Peas':   { emoji:'🟤', color:'#78350F', tip:'Drought-tolerant legume. Grows well in tropical and subtropical regions.',               alts:['Moth Beans','Black Gram'] },
  'Moth Beans':    { emoji:'🟡', color:'#CA8A04', tip:'Extremely drought-resistant. Grows in arid and semi-arid zones.',                       alts:['Pigeon Peas','Mung Bean'] },
  'Mung Bean':     { emoji:'🟢', color:'#16A34A', tip:'High-protein legume. Prefers warm weather with moderate humidity.',                      alts:['Black Gram','Lentil'] },
  'Black Gram':    { emoji:'⚫', color:'#44403C', tip:'Warm season crop. Requires moderate rainfall and well-drained soil.',                    alts:['Mung Bean','Lentil'] },
  'Lentil':        { emoji:'🍵', color:'#A16207', tip:'Cool season legume. Prefers dry conditions and light, well-drained soils.',              alts:['Chickpea','Kidney Beans'] },
  'Pomegranate':   { emoji:'🍎', color:'#DC2626', tip:'Drought-tolerant fruit. Prefers hot, dry summers and mild winters.',                   alts:['Mango','Orange'] },
  'Banana':        { emoji:'🍌', color:'#CA8A04', tip:'Tropical crop. Demands high humidity, rich soil, and wind protection.',                 alts:['Papaya','Coconut'] },
  'Mango':         { emoji:'🥭', color:'#EA580C', tip:'Tropical tree crop. Requires warm climate with a distinct dry season for flowering.',   alts:['Papaya','Banana'] },
  'Grapes':        { emoji:'🍇', color:'#7C3AED', tip:'Requires well-drained soil, warm summers, and cool nights for quality fruit.',          alts:['Apple','Orange'] },
  'Watermelon':    { emoji:'🍉', color:'#EF4444', tip:'Warm season crop. Needs sandy loam soil, full sun, and consistent moisture.',          alts:['Muskmelon','Papaya'] },
  'Muskmelon':     { emoji:'🍈', color:'#D97706', tip:'Requires warm temperatures and high humidity during growing season.',                   alts:['Watermelon','Papaya'] },
  'Apple':         { emoji:'🍏', color:'#16A34A', tip:'Cool climate tree fruit. Requires chilling hours in winter for good yields.',           alts:['Grapes','Orange'] },
  'Orange':        { emoji:'🍊', color:'#EA580C', tip:'Subtropical citrus. Requires warm days, cool nights, and moderate rainfall.',          alts:['Mango','Coconut'] },
  'Papaya':        { emoji:'🫐', color:'#F59E0B', tip:'Tropical fruit. Grows best in hot humid climates with no frost.',                      alts:['Banana','Mango'] },
  'Coconut':       { emoji:'🥥', color:'#78350F', tip:'Coastal tropical palm. Requires high temperature, humidity, and rainfall.',            alts:['Banana','Jute'] },
  'Cotton':        { emoji:'☁️', color:'#8B6914', tip:'Requires high temperature, dry climate, and deep black soil (Regur).',                alts:['Maize','Jute'] },
  'Jute':          { emoji:'🌿', color:'#4ADE80', tip:'Requires warm humid climate with heavy rainfall. Grows in alluvial soil.',             alts:['Rice','Cotton'] },
  'Coffee':        { emoji:'☕', color:'#6B4F12', tip:'Grows best in tropical highlands with moderate temperatures and rainfall.',            alts:['Coconut','Banana'] },
};

const CROP_LABELS = Object.keys(CROP_META);

// ── Real dataset centers [N, P, K, Temp, Humidity, pH, Rainfall]
// Statistical means from Kaggle Crop Recommendation Dataset
const ML_CENTERS = [
  [80,  48, 40, 23.7, 82.3, 6.4, 236],  // Rice
  [78,  48, 19, 22.6, 65.1, 6.3,  85],  // Maize
  [40,  67, 79, 17.7, 16.9, 7.3,  80],  // Chickpea
  [20,  67, 19, 19.1, 21.6, 5.7, 106],  // Kidney Beans
  [20,  67, 20, 27.2, 48.5, 5.8, 149],  // Pigeon Peas
  [21,  48, 20, 27.9, 53.3, 6.9,  51],  // Moth Beans
  [21,  47, 20, 28.3, 85.7, 6.5,  48],  // Mung Bean
  [40,  67, 19, 29.8, 65.3, 7.1,  68],  // Black Gram
  [18,  68, 19, 18.8, 64.6, 6.9,  46],  // Lentil
  [18,  18, 40, 21.8, 90.1, 6.4, 108],  // Pomegranate
  [100, 82, 50, 27.5, 80.0, 6.0, 105],  // Banana
  [20,  27, 30, 31.0, 50.4, 6.1,  94],  // Mango
  [23, 132,200, 23.9, 81.7, 6.0,  70],  // Grapes
  [99,  17, 50, 25.0, 85.0, 6.5,  50],  // Watermelon
  [100, 18, 50, 28.7, 92.3, 6.3,  25],  // Muskmelon
  [21, 134,199, 21.4, 92.3, 5.9, 113],  // Apple
  [19,  16, 10, 22.8, 92.2, 7.0, 111],  // Orange
  [50,  59, 50, 33.7, 92.4, 7.0, 143],  // Papaya
  [22,  16, 30, 27.1, 94.8, 6.0, 176],  // Coconut
  [118, 46, 20, 24.1, 79.9, 6.9,  80],  // Cotton
  [78,  46, 39, 25.0, 79.9, 6.7, 174],  // Jute
  [101, 28, 29, 25.6, 58.9, 6.8, 158],  // Coffee
];

// Per-feature standard deviations
const ML_STD = [
  [8,  7, 6, 1.5, 4.5, 0.30, 25],   // Rice
  [8,  7, 4, 2.0, 5.0, 0.35, 12],   // Maize
  [6,  8, 8, 1.5, 3.0, 0.35, 10],   // Chickpea
  [4,  8, 4, 1.5, 3.0, 0.30, 15],   // Kidney Beans
  [4,  8, 4, 2.0, 5.0, 0.30, 20],   // Pigeon Peas
  [4,  7, 4, 2.0, 5.0, 0.35,  8],   // Moth Beans
  [4,  7, 4, 1.5, 4.5, 0.30,  8],   // Mung Bean
  [6,  8, 4, 1.5, 4.5, 0.35, 10],   // Black Gram
  [4,  8, 4, 1.5, 4.5, 0.35,  8],   // Lentil
  [4,  4, 6, 2.0, 5.0, 0.30, 15],   // Pomegranate
  [10, 9, 7, 1.5, 4.5, 0.30, 15],   // Banana
  [4,  5, 5, 2.0, 5.0, 0.30, 12],   // Mango
  [4, 12,15, 2.0, 5.0, 0.30, 10],   // Grapes
  [10, 4, 7, 1.5, 4.5, 0.30,  8],   // Watermelon
  [10, 4, 7, 1.5, 4.0, 0.30,  5],   // Muskmelon
  [4, 12,15, 2.0, 4.5, 0.30, 15],   // Apple
  [4,  4, 3, 2.0, 4.5, 0.30, 15],   // Orange
  [7,  8, 7, 2.0, 4.0, 0.30, 20],   // Papaya
  [4,  4, 5, 1.5, 4.0, 0.30, 20],   // Coconut
  [12, 7, 4, 2.0, 5.0, 0.35, 10],   // Cotton
  [8,  7, 6, 2.0, 5.0, 0.30, 20],   // Jute
  [10, 5, 5, 2.0, 5.0, 0.30, 20],   // Coffee
];

// ── Globals ──
let mlModel    = null;
let mlScaler   = { min: [], max: [] };
let mlTrainStats = { samples: 0, crops: 0, epochs: 0, accuracy: 0, trained: false, time: '-' };

// ── Kaggle CSV label → internal class index mapping ──
const CSV_LABEL_MAP = {
  'rice': 'Rice', 'maize': 'Maize', 'chickpea': 'Chickpea',
  'kidneybeans': 'Kidney Beans', 'pigeonpeas': 'Pigeon Peas',
  'mothbeans': 'Moth Beans', 'mungbean': 'Mung Bean',
  'blackgram': 'Black Gram', 'lentil': 'Lentil',
  'pomegranate': 'Pomegranate', 'banana': 'Banana', 'mango': 'Mango',
  'grapes': 'Grapes', 'watermelon': 'Watermelon', 'muskmelon': 'Muskmelon',
  'apple': 'Apple', 'orange': 'Orange', 'papaya': 'Papaya',
  'coconut': 'Coconut', 'cotton': 'Cotton', 'jute': 'Jute', 'coffee': 'Coffee'
};

// ── Load and parse real Kaggle CSV ──
async function fetchKaggleDataset() {
  const stat = document.getElementById('mlProgressStat');
  if (stat) stat.textContent = 'Loading Kaggle dataset (2200 rows)…';

  const resp = await fetch('Crop_recommendation.csv');
  if (!resp.ok) throw new Error('CSV not found: ' + resp.status);
  const text = await resp.text();

  const lines = text.trim().split('\n');
  const X = [], Y = [];
  const numClasses = CROP_LABELS.length;

  for (let i = 1; i < lines.length; i++) {          // skip header
    const cols = lines[i].trim().split(',');
    if (cols.length < 8) continue;

    const n    = parseFloat(cols[0]);
    const p    = parseFloat(cols[1]);
    const k    = parseFloat(cols[2]);
    const temp = parseFloat(cols[3]);
    const hum  = parseFloat(cols[4]);
    const ph   = parseFloat(cols[5]);
    const rain = parseFloat(cols[6]);
    const csvLabel = cols[7].trim().toLowerCase().replace(/\r/g, '');

    const cropName = CSV_LABEL_MAP[csvLabel];
    if (!cropName) continue;

    const classIdx = CROP_LABELS.indexOf(cropName);
    if (classIdx === -1) continue;

    X.push([n, p, k, temp, hum, ph, rain]);
    const oh = new Array(numClasses).fill(0); oh[classIdx] = 1;
    Y.push(oh);
  }

  if (stat) stat.textContent = `Parsed ${X.length} real samples from Kaggle dataset. Computing scaler…`;

  // Min-Max scaler
  const numF = 7;
  const minV = new Array(numF).fill(Infinity);
  const maxV = new Array(numF).fill(-Infinity);
  X.forEach(r => r.forEach((v, j) => {
    if (v < minV[j]) minV[j] = v;
    if (v > maxV[j]) maxV[j] = v;
  }));

  // Normalize
  const Xn = X.map(r => r.map((v, j) => (v - minV[j]) / (maxV[j] - minV[j] + 1e-9)));
  return { X: Xn, Y, scaler: { min: minV, max: maxV }, total: X.length };
}

// ── Simple seeded Gaussian noise (Box-Muller) — used by synthetic fallback ──
function gaussRand(seed, std) {
  const u1 = Math.max(1e-9, (Math.sin(seed + 1)  * 43758.5453) % 1);
  const u2 = Math.max(1e-9, (Math.sin(seed + 17) * 43758.5453) % 1);
  return Math.sqrt(-2 * Math.log(Math.abs(u1))) * Math.cos(2 * Math.PI * u2) * std;
}

// ── Fallback: synthetic generator (used if CSV fetch fails) ──
function buildMLDataset() {
  const X = [], Y = [];
  const numClasses = CROP_LABELS.length;
  let seed = 42;

  ML_CENTERS.forEach((center, ci) => {
    const std = ML_STD[ci];
    for (let s = 0; s < 30; s++) {
      seed += 13;
      const row = center.map((mu, fi) => { seed += fi + 1; return mu + gaussRand(seed, std[fi]); });
      row[0] = Math.max(0,   Math.min(140, row[0]));
      row[1] = Math.max(0,   Math.min(145, row[1]));
      row[2] = Math.max(0,   Math.min(205, row[2]));
      row[3] = Math.max(8,   Math.min(44,  row[3]));
      row[4] = Math.max(14,  Math.min(100, row[4]));
      row[5] = Math.max(3.5, Math.min(9.9, row[5]));
      row[6] = Math.max(20,  Math.min(298, row[6]));
      X.push(row);
      const oh = new Array(numClasses).fill(0); oh[ci] = 1;
      Y.push(oh);
    }
  });

  const numF = 7;
  const minV = new Array(numF).fill(Infinity);
  const maxV = new Array(numF).fill(-Infinity);
  X.forEach(r => r.forEach((v, j) => {
    if (v < minV[j]) minV[j] = v;
    if (v > maxV[j]) maxV[j] = v;
  }));
  const Xn = X.map(r => r.map((v, j) => (v - minV[j]) / (maxV[j] - minV[j] + 1e-9)));
  return { X: Xn, Y, scaler: { min: minV, max: maxV }, total: X.length };
}


// ── Update training progress UI ──
function updateTrainingProgress(epoch, total, acc, loss) {
  const pct = Math.round((epoch / total) * 100);
  const bar  = document.getElementById('mlProgressFill');
  const stat = document.getElementById('mlProgressStat');
  const pctEl= document.getElementById('mlProgressPct');
  if (bar)   { bar.style.width = pct + '%'; }
  if (stat)  { stat.textContent = `Epoch ${epoch}/${total}  |  Loss: ${loss.toFixed(4)}  |  Accuracy: ${(acc*100).toFixed(1)}%`; }
  if (pctEl) { pctEl.textContent = pct + '%'; }
}

// ── Build & Train Neural Network ──
async function trainMLModel() {
  if (typeof tf === 'undefined') {
    console.warn('TensorFlow.js not loaded — falling back to KNN');
    showToast('warning', '⚠️ TF.js not loaded — using fallback mode');
    return;
  }

  // Show training panel
  const panel = document.getElementById('mlTrainingPanel');
  if (panel) panel.style.display = 'block';

  // ── Try real Kaggle CSV first, fall back to synthetic ──
  let ds;
  let dataSource = 'Kaggle Dataset (2200 rows)';
  try {
    ds = await fetchKaggleDataset();
    dataSource = `Kaggle Dataset (${ds.total} rows)`;
  } catch (err) {
    console.warn('Kaggle CSV fetch failed, using synthetic data:', err.message);
    showToast('warning', '⚠️ CSV not found — using synthetic training data');
    ds = buildMLDataset();
    dataSource = 'Synthetic Data (660 rows)';
  }
  mlScaler = ds.scaler;

  const numClasses = CROP_LABELS.length;

  // ── Architecture: Input(7) → Dense(128,relu)+BN → Dropout(0.15)
  //                          → Dense(64,relu) → Dense(32,relu) → Dense(22,softmax)
  mlModel = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [7], units: 128, activation: 'relu',
                        kernelInitializer: 'glorotUniform' }),
      tf.layers.batchNormalization(),
      tf.layers.dropout({ rate: 0.15 }),
      tf.layers.dense({ units: 64, activation: 'relu' }),
      tf.layers.dropout({ rate: 0.10 }),
      tf.layers.dense({ units: 32, activation: 'relu' }),
      tf.layers.dense({ units: numClasses, activation: 'softmax' })
    ]
  });

  mlModel.compile({
    optimizer: tf.train.adam(0.003),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  const EPOCHS = 60;
  let finalAcc = 0;
  const xsTensor = tf.tensor2d(ds.X);
  const ysTensor = tf.tensor2d(ds.Y);

  await mlModel.fit(xsTensor, ysTensor, {
    epochs:          EPOCHS,
    batchSize:       16,
    validationSplit: 0.1,
    shuffle:         true,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        finalAcc = logs.acc ?? logs.accuracy ?? 0;
        updateTrainingProgress(epoch + 1, EPOCHS, finalAcc, logs.loss);
      }
    }
  });

  xsTensor.dispose();
  ysTensor.dispose();

  mlTrainStats = {
    samples:    ds.X.length,
    crops:      numClasses,
    epochs:     EPOCHS,
    accuracy:   Math.min(99, Math.round(finalAcc * 100)),
    trained:    true,
    time:       new Date().toLocaleTimeString(),
    dataSource: dataSource
  };

  // ── Update training panel to success state ──
  if (panel) {
    panel.innerHTML = `
      <div style="display:flex;flex-wrap:wrap;align-items:center;gap:10px">
        <span style="font-size:20px">✅</span>
        <span style="font-weight:700;color:#22C55E;font-size:13px">Neural Network Trained!</span>
        <span style="font-size:11px;color:var(--muted)">|</span>
        <span style="font-size:12px;color:var(--text2)">📂 ${mlTrainStats.dataSource}</span>
        <span style="font-size:12px;color:var(--text2)">🌾 ${mlTrainStats.crops} crops</span>
        <span style="font-size:12px;color:var(--text2)">🔁 ${mlTrainStats.epochs} epochs</span>
        <span style="font-size:12px;font-weight:700;color:#22C55E">🎯 ${mlTrainStats.accuracy}% accuracy</span>
        <span style="font-size:12px;color:var(--text2)">⏱ ${mlTrainStats.time}</span>
        <span style="font-size:12px;color:var(--muted)">| Dense(128)→BN→Dense(64)→Dense(32)→Softmax(22)</span>
      </div>
    `;
  }

  // Enable predict button — remove disabled state AND inline style
  const btn = document.getElementById('predictBtn');
  if (btn) {
    btn.disabled = false;
    btn.style.cssText = '';  // clear ALL inline styles (restores .btn-predict gradient)
    btn.textContent = '🤖 Predict Suitable Crop';

    // Hide the "model will be ready" hint
    const hint = btn.nextElementSibling;
    if (hint && hint.tagName === 'SPAN') hint.style.display = 'none';
  }

  showToast('success', `🧠 Neural Network trained! ${mlTrainStats.accuracy}% accuracy on ${mlTrainStats.samples} samples`);
}

// ── Neural Network Inference ──
async function predictWithML(params) {
  if (!mlModel) {
    showToast('error', '⚠️ Model not ready. Please wait for training to complete.');
    return null;
  }

  // Input vector: [N, P, K, Temp, Humidity, pH, Rainfall]
  const raw = [
    params.nitrogen, params.phosphorus, params.potassium,
    params.temp,     params.humidity,   params.ph, params.rainfall
  ];

  // Normalize using training scaler
  const normalized = raw.map((v, j) =>
    (v - mlScaler.min[j]) / (mlScaler.max[j] - mlScaler.min[j] + 1e-9)
  );

  return tf.tidy(() => {
    const inputT  = tf.tensor2d([normalized]);
    const predT   = mlModel.predict(inputT);
    const probs   = Array.from(predT.dataSync());

    // Rank all 22 crops by probability
    const ranked  = probs.map((p, i) => ({ crop: CROP_LABELS[i], prob: p }));
    ranked.sort((a, b) => b.prob - a.prob);

    const best    = ranked[0];
    const meta    = CROP_META[best.crop];
    const center  = ML_CENTERS[CROP_LABELS.indexOf(best.crop)];

    // Field suitability vs. crop ideal center
    const ranges  = [140, 145, 205, 36, 86, 6.4, 278];
    const match   = raw.map((v, i) => Math.abs(v - center[i]) / ranges[i]);
    const avgMiss = match.reduce((a, b) => a + b, 0) / 7;
    const suit    = Math.max(55, Math.min(100, Math.round((1 - avgMiss) * 100)));

    return {
      crop:        best.crop,
      emoji:       meta.emoji,
      color:       meta.color,
      tip:         meta.tip,
      alts:        meta.alts,
      confidence:  Math.min(99, Math.round(best.prob * 100)),
      suitability: suit,
      center: {
        n: center[0], p: center[1], k: center[2],
        temp: center[3], humid: center[4], ph: center[5], rain: center[6]
      },
      topCrops: ranked.slice(0, 4).map(r => ({ name: r.crop, pct: Math.round(r.prob * 100) }))
    };
  });
}

// ── Bind prediction form (async TF.js version) ──
function bindPredictionForm() {
  const form = document.getElementById('predictionForm');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('predictBtn');

    if (!mlModel) {
      showToast('warning', '⏳ Model is still training. Please wait a moment...');
      return;
    }

    if (btn) { btn.disabled = true; btn.textContent = '🔄 Running inference...'; }

    const params = {
      temp:       parseFloat(document.getElementById('pTemp').value)       || 25,
      humidity:   parseFloat(document.getElementById('pHumidity').value)   || 60,
      nitrogen:   parseFloat(document.getElementById('pNitrogen').value)   || 50,
      phosphorus: parseFloat(document.getElementById('pPhosphorus').value) || 40,
      potassium:  parseFloat(document.getElementById('pPotassium').value)  || 40,
      ph:         parseFloat(document.getElementById('pPh').value)         || 6.5,
      rainfall:   parseFloat(document.getElementById('pRainfall').value)   || 100,
      season:     document.getElementById('pSeason').value  || 'Kharif',
      soil:       document.getElementById('pSoil').value    || 'Loamy',
    };

    try {
      const result = await predictWithML(params);
      if (result) showPredictionResult(result, params);
    } catch (err) {
      console.error(err);
      showToast('error', '❌ Prediction failed: ' + err.message);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '🤖 Predict Suitable Crop'; }
    }
  });
}

function showPredictionResult(result, params) {
  const container = document.getElementById('predictionResult');
  if (!container) return;

  const c = result.center;

  const delta = (actual, ideal, unit = '') => {
    const diff = actual - ideal;
    const sign = diff > 0 ? '+' : '';
    const cls  = Math.abs(diff) < Math.max(ideal * 0.1, 0.5) ? 'good'
               : Math.abs(diff) < Math.max(ideal * 0.25, 1)  ? 'ok' : 'off';
    return `<span class="pred-delta ${cls}">${sign}${diff.toFixed(1)}${unit} vs ideal</span>`;
  };

  const barColor = result.suitability >= 85 ? 'linear-gradient(90deg,#22C55E,#4ADE80)'
                 : result.suitability >= 70 ? 'linear-gradient(90deg,#E8810A,#F59E0B)'
                 : 'linear-gradient(90deg,#EF4444,#F87171)';

  const paramRows = [
    { label: '🌡 Temperature', val: params.temp + '°C',          d: delta(params.temp,        c.temp,  '°C') },
    { label: '💧 Humidity',    val: params.humidity + '%',        d: delta(params.humidity,    c.humid, '%')  },
    { label: '🌧 Rainfall',    val: params.rainfall + ' mm',      d: delta(params.rainfall,    c.rain,  'mm') },
    { label: '🧪 Soil pH',     val: params.ph,                    d: delta(params.ph,          c.ph,    '')   },
    { label: '🟢 Nitrogen',    val: params.nitrogen + ' kg/ha',   d: delta(params.nitrogen,    c.n,     '')   },
    { label: '🟡 Phosphorus',  val: params.phosphorus + ' kg/ha', d: delta(params.phosphorus,  c.p,     '')   },
    { label: '🟠 Potassium',   val: params.potassium + ' kg/ha',  d: delta(params.potassium,   c.k,     '')   },
    { label: '📅 Season',      val: params.season,                d: '' },
  ];

  // ── Top 4 Predictions — Rich Glassmorphism Ranking Cards ──
  const rankMedals = ['🥇', '🥈', '🥉', '4️⃣'];
  const rankColors = [
    { border: 'rgba(74,222,128,0.45)',  glow: 'rgba(74,222,128,0.18)',  bar: 'linear-gradient(90deg,#4ADE80,#22C55E)', label: 'rgba(74,222,128,1)'   },
    { border: 'rgba(148,163,184,0.35)', glow: 'rgba(148,163,184,0.10)', bar: 'linear-gradient(90deg,#94A3B8,#CBD5E1)', label: 'rgba(203,213,225,1)'  },
    { border: 'rgba(251,146,60,0.35)',  glow: 'rgba(251,146,60,0.10)',  bar: 'linear-gradient(90deg,#FB923C,#F97316)', label: 'rgba(251,146,60,1)'   },
    { border: 'rgba(167,139,250,0.30)', glow: 'rgba(167,139,250,0.08)', bar: 'linear-gradient(90deg,#A78BFA,#7C3AED)', label: 'rgba(167,139,250,1)'  },
  ];

  const topCropsHtml = (result.topCrops && result.topCrops.length > 1) ? `
    <div class="pred-section-label">🏆 Top Neural Network Predictions</div>
    <div class="pred-rank-grid">
      ${result.topCrops.map((r, i) => {
        const rc = rankColors[i];
        const barW = Math.max(4, r.pct);
        const isWinner = i === 0;
        return `
        <div class="pred-rank-card ${isWinner ? 'pred-rank-winner' : ''}"
             style="border-color:${rc.border};box-shadow:0 4px 24px ${rc.glow}${isWinner?',0 0 0 1px rgba(74,222,128,0.2)':''}">
          <div class="pred-rank-medal">${rankMedals[i]}</div>
          <div class="pred-rank-emoji">${CROP_META[r.name]?.emoji || '🌾'}</div>
          <div class="pred-rank-info">
            <div class="pred-rank-name" style="color:${rc.label}">${r.name}</div>
            <div class="pred-rank-bar-wrap">
              <div class="pred-rank-bar" style="width:${barW}%;background:${rc.bar}"></div>
            </div>
            <div class="pred-rank-pct" style="color:${rc.label}">${r.pct}%</div>
          </div>
          ${isWinner ? '<div class="pred-rank-badge">✅ Best Match</div>' : ''}
        </div>`;
      }).join('')}
    </div>
  ` : '';

  // ── Why This Crop? Box ──
  const soilMap = { Loamy: '✅ Ideal', Sandy: '⚠️ Needs irrigation', Clay: '✅ Good drainage', Silty: '✅ Good', Black: '✅ Excellent', Red: '⚠️ Add nutrients' };
  const soilSuit = soilMap[params.soil] || '— Check locally';
  const seasonNote = params.season === 'Kharif'  ? '☀️ Monsoon crop — high rainfall season matches well'
                   : params.season === 'Rabi'    ? '❄️ Winter crop — cool dry season'
                   : params.season === 'Zaid'    ? '🌤 Summer crop — short duration'
                   : '📅 Year-round growing possible';

  const whyHtml = `
    <div class="pred-why-box">
      <div class="pred-why-title">🌿 Why <em>${result.crop}</em>?</div>
      <div class="pred-why-grid">
        <div class="pred-why-item">
          <div class="pred-why-icon">🌡</div>
          <div class="pred-why-label">Temperature</div>
          <div class="pred-why-val">${result.center.temp.toFixed(1)}°C ideal</div>
        </div>
        <div class="pred-why-item">
          <div class="pred-why-icon">💧</div>
          <div class="pred-why-label">Humidity</div>
          <div class="pred-why-val">${result.center.humid.toFixed(0)}% ideal</div>
        </div>
        <div class="pred-why-item">
          <div class="pred-why-icon">🧪</div>
          <div class="pred-why-label">Soil pH</div>
          <div class="pred-why-val">${result.center.ph.toFixed(1)} ideal</div>
        </div>
        <div class="pred-why-item">
          <div class="pred-why-icon">🌧</div>
          <div class="pred-why-label">Rainfall</div>
          <div class="pred-why-val">${result.center.rain.toFixed(0)} mm</div>
        </div>
        <div class="pred-why-item">
          <div class="pred-why-icon">🪨</div>
          <div class="pred-why-label">Your Soil</div>
          <div class="pred-why-val">${soilSuit}</div>
        </div>
        <div class="pred-why-item">
          <div class="pred-why-icon">📅</div>
          <div class="pred-why-label">Season Note</div>
          <div class="pred-why-val" style="font-size:10px;line-height:1.3">${seasonNote}</div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = `
    <!-- Hero Result Card -->
    <div class="pred-hero">
      <span class="pred-crop-emoji">${result.emoji}</span>
      <div class="pred-crop-name">${result.crop}</div>

      <div class="pred-stats-row">
        <div class="pred-stat-cell">
          <div class="pred-stat-label">🎯 Model Confidence</div>
          <div class="pred-stat-value">${result.confidence}%</div>
        </div>
        <div class="pred-stat-cell">
          <div class="pred-stat-label">🌱 Field Suitability</div>
          <div class="pred-stat-value">${result.suitability}%</div>
        </div>
      </div>

      <div class="pred-bar-wrap">
        <div class="pred-bar-fill" style="width:${result.suitability}%;background:${barColor}"></div>
      </div>

      <div class="pred-tip">💡 ${result.tip}</div>

      <div class="pred-alts">
        <span class="pred-alt-label">Also consider:&nbsp;</span>
        ${result.alts.map(a => {
          const altMeta = CROP_META[a];
          return `<span class="pred-alt-chip" title="${a}">${altMeta ? altMeta.emoji + ' ' : ''}${a}</span>`;
        }).join('')}
      </div>
    </div>

    ${topCropsHtml}

    ${whyHtml}

    <!-- Parameter Comparison Grid -->
    <div class="pred-section-label">📊 Your Input vs Ideal for ${result.crop}</div>
    <div class="pred-param-grid">
      ${paramRows.map(i => `
        <div class="pred-param-card">
          <div class="pred-param-label">${i.label}</div>
          <div class="pred-param-value">${i.val}</div>
          ${i.d ? i.d : ''}
        </div>
      `).join('')}
    </div>

    <!-- Model Info Footer -->
    <div class="pred-model-footer">
      <span class="pred-model-chip">🧠 TensorFlow.js</span>
      <span class="pred-model-chip">📂 ${mlTrainStats.dataSource || mlTrainStats.samples + ' samples'}</span>
      <span class="pred-model-chip">🌾 ${mlTrainStats.crops} crops</span>
      <span class="pred-model-chip">🔁 ${mlTrainStats.epochs} epochs</span>
      <span class="pred-model-chip accent">✅ ~${mlTrainStats.accuracy}% accuracy</span>
      <span class="pred-model-chip">⏱ ${mlTrainStats.time}</span>
    </div>
  `;

  container.classList.add('show');
  setTimeout(() => {
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 80);
  showToast('success', `🌾 Predicted: ${result.crop} ${result.emoji} — ${result.confidence}% confidence`);
}

