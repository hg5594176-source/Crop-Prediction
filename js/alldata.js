/* =============================================
   ALLDATA.JS — All Data Page (Supabase)
   AI Crop Dashboard
   ============================================= */

let currentFilter = 'all';
let searchQuery   = '';
let _cachedData   = [];   // local cache of fetched rows

async function initAllData() {
  showLoadingState();
  _cachedData = (await getAllData()).map(mapRow);
  renderAllTable();
  await renderStateSection();
  bindAllDataControls();
}

function showLoadingState() {
  const tbody = document.getElementById('allTbody');
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:32px;color:var(--muted)">
      <span style="animation:pulse 1.2s infinite">⏳ Loading data from Supabase...</span>
    </td></tr>`;
  }
  const count = document.getElementById('recordCount');
  if (count) count.textContent = 'Loading...';
}

/* ---- Main Data Table ---- */
function renderAllTable() {
  const tbody = document.getElementById('allTbody');
  const count = document.getElementById('recordCount');

  let filtered = _cachedData;

  if (currentFilter !== 'all') {
    filtered = filtered.filter(r => r.state === currentFilter);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(r =>
      (r.farmerName || '').toLowerCase().includes(q) ||
      (r.state      || '').toLowerCase().includes(q) ||
      (r.cropType   || '').toLowerCase().includes(q) ||
      (r.district   || '').toLowerCase().includes(q) ||
      (r.village    || '').toLowerCase().includes(q)
    );
  }

  if (count) count.textContent = `${filtered.length} records`;

  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10">
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <p>No records found. Try a different search or add data from the Dashboard.</p>
      </div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((r, i) => `
    <tr style="animation:fadeUp 0.3s ease ${Math.min(i,15)*0.03}s both">
      <td style="font-weight:600;color:var(--primary);font-size:12px">#${(r.id||'').slice(-5)||i+1}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--secondary));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:12px;flex-shrink:0">
            ${(r.farmerName||'F').charAt(0).toUpperCase()}
          </div>
          <span style="font-weight:500">${r.farmerName||'—'}</span>
        </div>
      </td>
      <td><span class="badge badge-orange">${r.state||'—'}</span></td>
      <td>${r.district||'—'}</td>
      <td>${r.village||'—'}</td>
      <td><b>${r.cropType||'—'}</b></td>
      <td>${r.landArea ? r.landArea+' ac' : '—'}</td>
      <td><span class="badge badge-wheat">${r.soilType||'—'}</span></td>
      <td><span class="badge badge-blue">${r.season||'—'}</span></td>
      <td>
        <div style="font-size:11.5px;color:var(--muted)">${formatDate(r.timestamp)}</div>
        <button class="btn btn-danger btn-sm" style="margin-top:4px"
          onclick="deleteRow('${r.id}')">🗑 Delete</button>
      </td>
    </tr>
  `).join('');
}

async function deleteRow(id) {
  if (!confirm('Delete this record from Supabase? This cannot be undone.')) return;
  const ok = await deleteRecord(id);
  if (ok) {
    _cachedData = _cachedData.filter(r => r.id !== id);
    renderAllTable();
    await renderStateSection();
    showToast('success', 'Record deleted from Supabase.');
  }
}

/* ---- State Section ---- */
async function renderStateSection() {
  const wrapper = document.getElementById('stateSectionList');
  if (!wrapper) return;

  const stateEmojis = {
    'Punjab':'🌾','Haryana':'🌻','Uttar Pradesh':'🌿','Maharashtra':'🍊',
    'Karnataka':'☕','Rajasthan':'🏜️','Gujarat':'🫘','Madhya Pradesh':'🌲',
    'Bihar':'🌱','West Bengal':'🐯','Tamil Nadu':'🌴','Andhra Pradesh':'🌶️',
    'Telangana':'🏵️','Odisha':'🌊','Kerala':'🥥',
  };

  const stateCounts = {};
  _cachedData.forEach(r => {
    if (r.state) stateCounts[r.state] = (stateCounts[r.state] || 0) + 1;
  });

  const sorted = Object.entries(stateCounts).sort((a,b) => b[1]-a[1]);

  if (sorted.length === 0) {
    wrapper.innerHTML = `<div class="empty-state"><div class="empty-icon">🗺️</div><p>No state data yet.</p></div>`;
    return;
  }

  wrapper.innerHTML = sorted.map(([state, count]) => `
    <div class="state-row">
      <div class="state-info">
        <span class="state-flag">${stateEmojis[state]||'📍'}</span>
        <div>
          <div class="state-name">${state}</div>
          <div class="state-count">${count} farmer${count>1?'s':''} registered</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="text-align:right">
          <span style="font-weight:700;color:var(--primary);font-size:20px">${count}</span>
          <div style="font-size:10px;color:var(--muted)">records</div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="exportStateData('${state}')">
          ⬇ Export
        </button>
      </div>
    </div>
  `).join('');
}

async function exportStateData(state) {
  const stateRows = await getRecordsByState(state);
  exportCSV(stateRows, `crop_data_${state.replace(/\s+/g,'_').toLowerCase()}.csv`);
}

/* ---- Controls ---- */
function bindAllDataControls() {
  const exportAllBtn = document.getElementById('exportAllBtn');
  if (exportAllBtn) {
    exportAllBtn.addEventListener('click', async () => {
      const all = await getAllData();
      exportCSV(all, 'all_crop_data.csv');
    });
  }

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      searchQuery = e.target.value.trim();
      renderAllTable();
    });
  }

  const stateFilter = document.getElementById('stateFilterSelect');
  if (stateFilter) {
    populateStateFilter(stateFilter);
    stateFilter.addEventListener('change', e => {
      currentFilter = e.target.value;
      renderAllTable();
    });
  }

  // Refresh button
  const refreshBtn = document.querySelector('[onclick="renderAllTable()"]');
  if (refreshBtn) {
    refreshBtn.onclick = async () => {
      showLoadingState();
      _cachedData = (await getAllData()).map(mapRow);
      renderAllTable();
      await renderStateSection();
      populateStateFilter(document.getElementById('stateFilterSelect'));
      showToast('info', 'Data refreshed from Supabase.');
    };
  }
}

function populateStateFilter(select) {
  if (!select) return;
  const states = [...new Set(_cachedData.map(r => r.state).filter(Boolean))].sort();
  select.innerHTML = `<option value="all">All States</option>` +
    states.map(s => `<option value="${s}">${s}</option>`).join('');
}

function formatDate(isoStr) {
  if (!isoStr) return '—';
  try {
    return new Date(isoStr).toLocaleDateString('en-IN', {
      day:'2-digit', month:'short', year:'numeric'
    });
  } catch { return isoStr; }
}
