/* =============================================
   DASHBOARD.JS — Main Dashboard Logic (Supabase)
   AI Crop Dashboard
   ============================================= */

async function initDashboard() {
  await renderStats();
  await renderRecentTable();
  bindFarmerForm();
}

/* ---- Stats Cards ---- */
async function renderStats() {
  const s = await getStats();
  animateCount(document.getElementById('statTotal'),   0, s.total,   800);
  animateCount(document.getElementById('statFarmers'), 0, s.farmers, 800);
  animateCount(document.getElementById('statStates'),  0, s.states,  800);
  animateCount(document.getElementById('statToday'),   0, s.today,   800);
}

function animateCount(el, from, to, duration) {
  if (!el) return;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ---- Recent Submissions Table ---- */
async function renderRecentTable() {
  const tbody = document.getElementById('recentTbody');
  if (!tbody) return;

  setLoading('recentTbody', true, 'Fetching latest records from Supabase...');

  const raw  = await getAllData();
  const data = raw.slice(0, 10).map(mapRow);

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--muted)">
      No records yet. Add your first farmer data above! 🌱
    </td></tr>`;
    return;
  }

  tbody.innerHTML = data.map((r, i) => `
    <tr style="animation:fadeUp 0.3s ease ${i * 0.05}s both">
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--secondary));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:13px;flex-shrink:0">
            ${(r.farmerName || 'F').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style="font-weight:600;font-size:13.5px">${r.farmerName || '—'}</div>
            <div style="font-size:11px;color:var(--muted)">${r.village || '—'}</div>
          </div>
        </div>
      </td>
      <td><span class="badge badge-orange">${r.state || '—'}</span></td>
      <td>${r.cropType || '—'}</td>
      <td>${r.landArea ? r.landArea + ' acres' : '—'}</td>
      <td><span class="badge badge-wheat">${r.soilType || '—'}</span></td>
      <td><span class="badge badge-blue">${r.season || '—'}</span></td>
      <td><div style="font-size:12px;color:var(--muted)">${formatDate(r.timestamp)}</div></td>
    </tr>
  `).join('');
}

/* ---- Farmer Data Form ---- */
function bindFarmerForm() {
  const form = document.getElementById('farmerForm');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.textContent = '⏳ Saving...';
    btn.disabled = true;

    const record = {
      farmerName:  getValue('ffName'),
      state:       getValue('ffState'),
      district:    getValue('ffDistrict'),
      village:     getValue('ffVillage'),
      cropType:    getValue('ffCrop'),
      landArea:    getValue('ffArea'),
      soilType:    getValue('ffSoil'),
      irrigation:  getValue('ffIrrigation'),
      season:      getValue('ffSeason'),
      sowingDate:  getValue('ffSowing'),
      harvestDate: getValue('ffHarvest'),
      remarks:     getValue('ffRemarks'),
    };

    if (!record.farmerName || !record.state || !record.cropType) {
      showToast('error', 'Please fill Farmer Name, State, and Crop Type.');
      btn.textContent = '💾 Save Farmer Record';
      btn.disabled = false;
      return;
    }

    const saved = await addRecord(record);

    btn.textContent = '💾 Save Farmer Record';
    btn.disabled = false;

    if (saved) {
      showToast('success', `Record for ${record.farmerName} saved to Supabase! 🌾`);
      form.reset();
      await renderStats();
      await renderRecentTable();
    }
  });
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function formatDate(isoStr) {
  if (!isoStr) return '—';
  try {
    return new Date(isoStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  } catch { return isoStr; }
}
