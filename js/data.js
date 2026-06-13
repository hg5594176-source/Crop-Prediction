/* =============================================
   DATA.JS — Supabase Data Operations
   AI Crop Dashboard
   ============================================= */

const TABLE = 'farmer_data';

/* ============================================
   CRUD OPERATIONS (all async)
   ============================================ */

async function getAllData() {
  const { data, error } = await _supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getAllData error:', error.message);
    showToast('error', 'Failed to load data: ' + error.message);
    return [];
  }
  return data || [];
}

async function addRecord(record) {
  // Get current user
  const { data: { session } } = await _supabase.auth.getSession();
  const userId = session?.user?.id;

  const payload = {
    user_id:      userId,
    farmer_name:  record.farmerName  || null,
    state:        record.state       || null,
    district:     record.district    || null,
    village:      record.village     || null,
    crop_type:    record.cropType    || null,
    land_area:    record.landArea    ? parseFloat(record.landArea) : null,
    soil_type:    record.soilType    || null,
    irrigation:   record.irrigation  || null,
    season:       record.season      || null,
    sowing_date:  record.sowingDate  || null,
    harvest_date: record.harvestDate || null,
    remarks:      record.remarks     || null,
  };

  const { data, error } = await _supabase
    .from(TABLE)
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('addRecord error:', error.message);
    showToast('error', 'Failed to save record: ' + error.message);
    return null;
  }

  return data;
}

async function deleteRecord(id) {
  const { error } = await _supabase
    .from(TABLE)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('deleteRecord error:', error.message);
    showToast('error', 'Failed to delete: ' + error.message);
    return false;
  }
  return true;
}

async function getRecordsByState(state) {
  const { data, error } = await _supabase
    .from(TABLE)
    .select('*')
    .eq('state', state)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

async function getUniqueStates() {
  const { data, error } = await _supabase
    .from(TABLE)
    .select('state');

  if (error || !data) return [];
  const states = [...new Set(data.map(r => r.state).filter(Boolean))];
  return states.sort();
}

async function getStats() {
  const { data, error } = await _supabase
    .from(TABLE)
    .select('farmer_name, state, created_at');

  if (error || !data) return { total: 0, farmers: 0, states: 0, today: 0 };

  const today     = new Date().toDateString();
  const todayRows = data.filter(r => new Date(r.created_at).toDateString() === today);
  const states    = new Set(data.map(r => r.state).filter(Boolean));
  const farmers   = new Set(data.map(r => r.farmer_name).filter(Boolean));

  return {
    total:   data.length,
    farmers: farmers.size,
    states:  states.size,
    today:   todayRows.length,
  };
}

/* ============================================
   MAP DB COLUMN NAMES → App field names
   (Supabase uses snake_case; app uses camelCase)
   ============================================ */
function mapRow(r) {
  if (!r) return r;
  return {
    id:          r.id,
    farmerName:  r.farmer_name,
    state:       r.state,
    district:    r.district,
    village:     r.village,
    cropType:    r.crop_type,
    landArea:    r.land_area,
    soilType:    r.soil_type,
    irrigation:  r.irrigation,
    season:      r.season,
    sowingDate:  r.sowing_date,
    harvestDate: r.harvest_date,
    remarks:     r.remarks,
    timestamp:   r.created_at,
  };
}

/* ============================================
   CSV EXPORT
   ============================================ */
function exportCSV(data, filename) {
  if (!data || data.length === 0) {
    showToast('error', 'No data to export!');
    return;
  }

  // Normalize rows (support both camelCase from map or raw Supabase rows)
  const rows = data.map(r => {
    const m = r.farmer_name !== undefined ? mapRow(r) : r;
    return [
      m.id          || '',
      m.farmerName  || '',
      m.state       || '',
      m.district    || '',
      m.village     || '',
      m.cropType    || '',
      m.landArea    || '',
      m.soilType    || '',
      m.irrigation  || '',
      m.season      || '',
      m.sowingDate  || '',
      m.harvestDate || '',
      `"${(m.remarks || '').replace(/"/g, '""')}"`,
      m.timestamp   ? new Date(m.timestamp).toLocaleString() : '',
    ];
  });

  const headers = [
    'ID','Farmer Name','State','District','Village','Crop Type',
    'Land Area (Acres)','Soil Type','Irrigation','Season',
    'Sowing Date','Expected Harvest','Remarks','Date Submitted'
  ];

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadFile(csv, filename || 'crop_data.csv', 'text/csv');
  showToast('success', `Exported ${data.length} records! ✅`);
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ============================================
   TOAST UTILITY
   ============================================ */
function showToast(type, message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* ============================================
   LOADING SPINNER HELPER
   ============================================ */
function setLoading(id, isLoading, placeholder = 'Loading...') {
  const el = document.getElementById(id);
  if (!el) return;
  if (isLoading) {
    el.innerHTML = `<tr><td colspan="20" style="text-align:center;padding:32px;color:var(--muted)">
      <span style="animation:pulse 1.2s infinite">⏳ ${placeholder}</span>
    </td></tr>`;
  }
}
