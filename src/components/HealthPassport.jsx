import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

// ── Constants ─────────────────────────────────────────────────────────────────
const VACCINE_TYPES = [
  'DHPP (5-in-1)', 'Rabies', 'Bordetella (Kennel Cough)',
  'Leptospirosis', 'Canine Influenza', 'Coronavirus', 'Other',
];

const SYMPTOM_OPTIONS = [
  'Lethargy', 'Loss of appetite', 'Vomiting', 'Diarrhoea',
  'Coughing', 'Sneezing', 'Limping', 'Scratching',
  'Discharge from eyes/nose', 'Bloating', 'Excessive thirst',
  'Difficulty breathing', 'Seizures', 'Skin rash/lesions',
];

const SG_REQUIREMENTS = [
  { key: 'avsLicenceNumber', label: 'AVS Dog Licence',        type: 'string' },
  { key: 'microchipId',      label: 'Microchip Implanted',    type: 'string' },
  { key: 'sterilised',       label: 'Sterilised',             type: 'bool'   },
  { key: 'annualBoosterUpToDate', label: 'Annual Booster Up to Date', type: 'bool' },
  { key: 'hdb-mesh',         label: 'HDB Window Mesh Fitted', type: 'hdb'    },
];

const MED_FREQUENCIES = ['daily', 'twice daily', 'weekly', 'monthly', 'as needed'];

const SECTIONS = [
  { id: 'overview',  label: 'Overview'  },
  { id: 'vaccines',  label: 'Vaccines'  },
  { id: 'visits',    label: 'Vet Visits'},
  { id: 'meds',      label: 'Meds'      },
  { id: 'weight',    label: 'Weight'    },
  { id: 'symptoms',  label: 'Symptoms'  },
];

// ── Helper Functions ──────────────────────────────────────────────────────────
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function parseDate(str) {
  if (!str) return null;
  return new Date(str + 'T00:00:00');
}

function daysFromToday(isoStr) {
  if (!isoStr) return null;
  const d = parseDate(isoStr);
  if (!d) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((d - today) / 86400000);
}

function fmtDate(isoStr) {
  if (!isoStr) return '—';
  const d = parseDate(isoStr);
  if (!d) return '—';
  return d.toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' });
}

function vaccineStatus(nextDueDate) {
  const days = daysFromToday(nextDueDate);
  if (days === null) return 'ok';
  if (days < 0) return 'overdue';
  if (days <= 30) return 'due_soon';
  return 'ok';
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

// ── Shared Primitives ─────────────────────────────────────────────────────────
function SheetWrapper({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[430px] mx-auto bg-white rounded-t-3xl max-h-[90vh] flex flex-col animate-slide-up-fade">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-white px-5 py-3 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
          <h3 className="font-display font-bold text-gray-900 text-base">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-bold">
            ✕
          </button>
        </div>
        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}

function FormField({ label, type = 'text', placeholder, value, onChange, required, options }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] resize-none"
          rows={3}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      ) : type === 'select' ? (
        <select
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] bg-white"
          value={value}
          onChange={e => onChange(e.target.value)}
        >
          <option value="">Select…</option>
          {options.map(o => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          required={required}
        />
      )}
    </div>
  );
}

function SaveButton({ onClick, disabled, label = 'Save' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3.5 rounded-2xl bg-[#FF6B35] text-white font-bold text-base shadow-sm active:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
    >
      {label}
    </button>
  );
}

function EmptyState({ emoji, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="text-4xl mb-3">{emoji}</span>
      <p className="text-gray-400 text-sm font-medium">{text}</p>
    </div>
  );
}

// ── Setup Sheet ───────────────────────────────────────────────────────────────
function SetupSheet({ onClose, onSave, initialData, showToast }) {
  const [form, setForm] = useState({
    petName:              initialData?.petName              ?? '',
    petSpecies:           initialData?.petSpecies           ?? 'dog',
    petBreed:             initialData?.petBreed             ?? '',
    dateOfBirth:          initialData?.dateOfBirth          ?? '',
    gender:               initialData?.gender               ?? '',
    colour:               initialData?.colour               ?? '',
    avsLicenceNumber:     initialData?.avsLicenceNumber     ?? '',
    microchipId:          initialData?.microchipId          ?? '',
    sterilised:           initialData?.sterilised           ?? false,
    annualBoosterUpToDate: initialData?.annualBoosterUpToDate ?? false,
    avsLicenceRenewalDate: initialData?.avsLicenceRenewalDate ?? '',
    // preserve existing arrays
    vaccinations: initialData?.vaccinations ?? [],
    vetVisits:    initialData?.vetVisits    ?? [],
    medications:  initialData?.medications  ?? [],
    weights:      initialData?.weights      ?? [],
    symptoms:     initialData?.symptoms     ?? [],
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.petName.trim()) return;
    onSave(form);
    onClose();
  };

  return (
    <SheetWrapper title={initialData?.petName ? `Edit ${initialData.petName}'s Passport` : 'Create Health Passport'} onClose={onClose}>
      <FormField label="Pet Name" placeholder="e.g. Buddy" value={form.petName} onChange={v => set('petName', v)} required />
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Species</label>
        <div className="flex gap-2">
          {['dog', 'cat', 'rabbit'].map(s => (
            <button
              key={s}
              onClick={() => set('petSpecies', s)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${form.petSpecies === s ? 'bg-[#FF6B35] text-white border-[#FF6B35]' : 'bg-white text-gray-600 border-gray-200'}`}
            >
              {s === 'dog' ? '🐶' : s === 'cat' ? '🐱' : '🐰'} {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <FormField label="Breed" placeholder="e.g. Shih Tzu" value={form.petBreed} onChange={v => set('petBreed', v)} />
      <FormField label="Date of Birth" type="date" value={form.dateOfBirth} onChange={v => set('dateOfBirth', v)} />
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender</label>
        <div className="flex gap-2">
          {['Male', 'Female'].map(g => (
            <button
              key={g}
              onClick={() => set('gender', g)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${form.gender === g ? 'bg-[#FF6B35] text-white border-[#FF6B35]' : 'bg-white text-gray-600 border-gray-200'}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      <FormField label="Colour / Markings" placeholder="e.g. Brown & white" value={form.colour} onChange={v => set('colour', v)} />
      <div className="border-t border-gray-100 my-4 pt-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Singapore Compliance</p>
        <FormField label="AVS Licence Number" placeholder="e.g. D-123456" value={form.avsLicenceNumber} onChange={v => set('avsLicenceNumber', v)} />
        <FormField label="Microchip ID" placeholder="15-digit microchip number" value={form.microchipId} onChange={v => set('microchipId', v)} />
        <FormField label="AVS Licence Renewal Date" type="date" value={form.avsLicenceRenewalDate} onChange={v => set('avsLicenceRenewalDate', v)} />
        <div className="flex items-center justify-between py-2 mb-2">
          <span className="text-sm font-semibold text-gray-700">Sterilised</span>
          <button
            onClick={() => set('sterilised', !form.sterilised)}
            className={`w-12 h-6 rounded-full transition-colors ${form.sterilised ? 'bg-[#FF6B35]' : 'bg-gray-200'} relative`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.sterilised ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm font-semibold text-gray-700">Annual Booster Up to Date</span>
          <button
            onClick={() => set('annualBoosterUpToDate', !form.annualBoosterUpToDate)}
            className={`w-12 h-6 rounded-full transition-colors ${form.annualBoosterUpToDate ? 'bg-[#FF6B35]' : 'bg-gray-200'} relative`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.annualBoosterUpToDate ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>
      </div>
      {/* Photo upload placeholder */}
      <button
        onClick={() => showToast('Photo upload coming soon')}
        className="w-full py-3 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 text-sm font-semibold mb-4 flex items-center justify-center gap-2 active:bg-gray-50"
      >
        <span>📷</span> Add Pet Photo (Coming Soon)
      </button>
      <SaveButton onClick={handleSave} disabled={!form.petName.trim()} label={initialData?.petName ? 'Save Changes' : 'Create Passport'} />
    </SheetWrapper>
  );
}

// ── Vaccination Sheet ─────────────────────────────────────────────────────────
function VaccinationSheet({ onClose, onSave }) {
  const [form, setForm] = useState({
    vaccine: '', date: todayIso(), nextDueDate: '', clinic: '', notes: ''
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <SheetWrapper title="Log Vaccination" onClose={onClose}>
      <FormField label="Vaccine" type="select" options={VACCINE_TYPES} value={form.vaccine} onChange={v => set('vaccine', v)} required />
      <FormField label="Date Given" type="date" value={form.date} onChange={v => set('date', v)} required />
      <FormField label="Next Due Date" type="date" value={form.nextDueDate} onChange={v => set('nextDueDate', v)} />
      <FormField label="Clinic / Vet" placeholder="e.g. Mount Pleasant Vet" value={form.clinic} onChange={v => set('clinic', v)} />
      <FormField label="Notes" type="textarea" placeholder="Any reactions, batch numbers…" value={form.notes} onChange={v => set('notes', v)} />
      <SaveButton
        onClick={() => { if (form.vaccine && form.date) { onSave({ ...form, id: genId() }); onClose(); } }}
        disabled={!form.vaccine || !form.date}
      />
    </SheetWrapper>
  );
}

// ── Vet Visit Sheet ───────────────────────────────────────────────────────────
function VetVisitSheet({ onClose, onSave }) {
  const [form, setForm] = useState({
    date: todayIso(), clinic: '', vetName: '', diagnosis: '', treatment: '', notes: ''
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <SheetWrapper title="Log Vet Visit" onClose={onClose}>
      <FormField label="Date" type="date" value={form.date} onChange={v => set('date', v)} required />
      <FormField label="Clinic" placeholder="e.g. Jippo Vet" value={form.clinic} onChange={v => set('clinic', v)} required />
      <FormField label="Vet Name" placeholder="e.g. Dr. Wong" value={form.vetName} onChange={v => set('vetName', v)} />
      <FormField label="Diagnosis" placeholder="e.g. Upper respiratory infection" value={form.diagnosis} onChange={v => set('diagnosis', v)} />
      <FormField label="Treatment" placeholder="e.g. Prescribed antibiotics" value={form.treatment} onChange={v => set('treatment', v)} />
      <FormField label="Notes" type="textarea" placeholder="Any additional notes…" value={form.notes} onChange={v => set('notes', v)} />
      <SaveButton
        onClick={() => { if (form.clinic && form.date) { onSave({ ...form, id: genId() }); onClose(); } }}
        disabled={!form.clinic || !form.date}
      />
    </SheetWrapper>
  );
}

// ── Medication Sheet ──────────────────────────────────────────────────────────
function MedicationSheet({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: '', dosage: '', frequency: 'daily', startDate: todayIso(), endDate: '', active: true
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <SheetWrapper title="Add Medication" onClose={onClose}>
      <FormField label="Medication Name" placeholder="e.g. Simparica" value={form.name} onChange={v => set('name', v)} required />
      <FormField label="Dosage" placeholder="e.g. 1 tablet" value={form.dosage} onChange={v => set('dosage', v)} />
      <FormField label="Frequency" type="select" options={MED_FREQUENCIES} value={form.frequency} onChange={v => set('frequency', v)} />
      <FormField label="Start Date" type="date" value={form.startDate} onChange={v => set('startDate', v)} />
      <FormField label="End Date" type="date" value={form.endDate} onChange={v => set('endDate', v)} />
      <SaveButton
        onClick={() => { if (form.name) { onSave({ ...form, id: genId() }); onClose(); } }}
        disabled={!form.name}
      />
    </SheetWrapper>
  );
}

// ── Symptoms Sheet ────────────────────────────────────────────────────────────
function SymptomsSheet({ onClose, onSave, showToast, petName }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [severity, setSeverity] = useState('mild');
  const [date, setDate] = useState(todayIso());
  const [notes, setNotes] = useState('');

  const toggleSymptom = (s) => {
    setSelectedSymptoms(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const handleSave = () => {
    if (selectedSymptoms.length === 0) return;
    onSave({ id: genId(), date, symptoms: selectedSymptoms, severity, notes });
    onClose();
  };

  const handleShare = () => {
    const text = [
      `PawMatch Pet Health Log — ${petName || 'My Pet'}`,
      `Date: ${fmtDate(date)}`,
      `Symptoms: ${selectedSymptoms.join(', ')}`,
      `Severity: ${severity}`,
      notes ? `Notes: ${notes}` : null,
    ].filter(Boolean).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard!');
    }).catch(() => {
      showToast('Copy failed — please copy manually');
    });
  };

  return (
    <SheetWrapper title="Log Symptoms" onClose={onClose}>
      <FormField label="Date" type="date" value={date} onChange={setDate} required />
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Symptoms (select all that apply)</label>
        <div className="flex flex-wrap gap-2">
          {SYMPTOM_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => toggleSymptom(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                selectedSymptoms.includes(s)
                  ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Severity</label>
        <div className="flex gap-2">
          {[['mild', 'Mild', 'bg-green-100 text-green-700 border-green-200', 'bg-green-500 text-white border-green-500'],
            ['moderate', 'Moderate', 'bg-amber-100 text-amber-700 border-amber-200', 'bg-amber-500 text-white border-amber-500'],
            ['severe', 'Severe', 'bg-red-100 text-red-700 border-red-200', 'bg-red-500 text-white border-red-500']
          ].map(([val, lbl, inactiveCls, activeCls]) => (
            <button
              key={val}
              onClick={() => setSeverity(val)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${severity === val ? activeCls : inactiveCls}`}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>
      <FormField label="Notes" type="textarea" placeholder="Additional observations for your vet…" value={notes} onChange={setNotes} />
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleShare}
          className="flex-1 py-3 rounded-2xl border-2 border-[#FF6B35] text-[#FF6B35] font-bold text-sm active:bg-orange-50"
        >
          📋 Share with Vet
        </button>
        <button
          onClick={handleSave}
          disabled={selectedSymptoms.length === 0}
          className="flex-1 py-3 rounded-2xl bg-[#FF6B35] text-white font-bold text-sm disabled:opacity-40"
        >
          Save
        </button>
      </div>
    </SheetWrapper>
  );
}

// ── Overview Section ──────────────────────────────────────────────────────────
function OverviewSection({ hp, isHdb, onEdit, onPatch, showToast }) {
  const reminders = [];

  // Vaccine reminders
  (hp.vaccinations ?? []).forEach(v => {
    const status = vaccineStatus(v.nextDueDate);
    if (status === 'overdue') {
      reminders.push({ type: 'red', text: `${v.vaccine} booster overdue` });
    } else if (status === 'due_soon') {
      const days = daysFromToday(v.nextDueDate);
      reminders.push({ type: 'amber', text: `${v.vaccine} due in ${days} day${days === 1 ? '' : 's'}` });
    }
  });

  // AVS licence renewal
  if (hp.avsLicenceRenewalDate) {
    const days = daysFromToday(hp.avsLicenceRenewalDate);
    if (days !== null && days <= 60) {
      reminders.push({
        type: days < 0 ? 'red' : 'amber',
        text: days < 0
          ? `AVS Licence expired ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago`
          : `AVS Licence renewal in ${days} day${days === 1 ? '' : 's'}`,
      });
    }
  }

  // Active medications info
  const activeMeds = (hp.medications ?? []).filter(m => m.active);
  if (activeMeds.length > 0) {
    reminders.push({ type: 'blue', text: `${activeMeds.length} active medication${activeMeds.length > 1 ? 's' : ''}` });
  }

  // Species emoji
  const speciesEmoji = hp.petSpecies === 'cat' ? '🐱' : hp.petSpecies === 'rabbit' ? '🐰' : '🐶';

  // Age calculation
  let age = '';
  if (hp.dateOfBirth) {
    const dob = parseDate(hp.dateOfBirth);
    if (dob) {
      const months = Math.floor((Date.now() - dob.getTime()) / (30.44 * 24 * 3600 * 1000));
      if (months < 12) age = `${months}mo`;
      else age = `${Math.floor(months / 12)}yr ${months % 12}mo`;
    }
  }

  return (
    <div className="pb-6">
      {/* Pet hero card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl flex-shrink-0">
            {speciesEmoji}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-gray-900 text-lg leading-tight">{hp.petName}</h3>
            {hp.petBreed && <p className="text-sm text-gray-500 font-medium">{hp.petBreed}</p>}
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
              {age && <span className="text-xs text-gray-400">{age}</span>}
              {hp.gender && <span className="text-xs text-gray-400">{hp.gender}</span>}
              {hp.colour && <span className="text-xs text-gray-400">{hp.colour}</span>}
            </div>
            {hp.microchipId && (
              <p className="text-xs text-gray-400 mt-1 font-mono">#{hp.microchipId}</p>
            )}
          </div>
          <button
            onClick={onEdit}
            className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold active:bg-gray-200"
          >
            Edit
          </button>
        </div>
        {/* Photo placeholder */}
        <button
          onClick={() => showToast('Photo upload coming soon')}
          className="mt-3 w-full py-2 rounded-xl border border-dashed border-gray-200 text-gray-400 text-xs font-semibold flex items-center justify-center gap-1.5 active:bg-gray-50"
        >
          <span>📷</span> Add Photo (Coming Soon)
        </button>
      </div>

      {/* Reminders panel */}
      {reminders.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">Reminders</p>
          <div className="flex flex-col gap-2">
            {reminders.map((r, i) => (
              <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold ${
                r.type === 'red'   ? 'bg-red-50 text-red-700' :
                r.type === 'amber' ? 'bg-amber-50 text-amber-700' :
                'bg-blue-50 text-blue-700'
              }`}>
                <span>{r.type === 'red' ? '🔴' : r.type === 'amber' ? '🟡' : 'ℹ️'}</span>
                {r.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HDB window mesh alert */}
      {isHdb && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex gap-3">
          <span className="text-xl flex-shrink-0">🏠</span>
          <div>
            <p className="text-sm font-bold text-amber-800">HDB Window Mesh Required</p>
            <p className="text-xs text-amber-700 mt-0.5">Singapore law requires window grilles or mesh to be fitted to prevent pets from falling.</p>
          </div>
        </div>
      )}

      {/* Singapore compliance checklist */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">SG Compliance Checklist</p>
        <div className="flex flex-col gap-2.5">
          {SG_REQUIREMENTS.map(req => {
            if (req.type === 'hdb' && !isHdb) return null;

            const checked =
              req.type === 'string' ? Boolean(hp[req.key]) :
              req.type === 'bool'   ? Boolean(hp[req.key]) :
              req.type === 'hdb'    ? false :
              false;

            return (
              <div key={req.key} className="flex items-center gap-3">
                {req.type === 'bool' ? (
                  <button
                    onClick={() => onPatch({ [req.key]: !hp[req.key] })}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      checked ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}
                  >
                    {checked && <span className="text-white text-xs">✓</span>}
                  </button>
                ) : (
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    checked ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}>
                    {checked && <span className="text-white text-xs">✓</span>}
                  </div>
                )}
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${checked ? 'text-gray-700' : 'text-gray-400'}`}>{req.label}</p>
                  {req.type === 'string' && hp[req.key] && (
                    <p className="text-xs text-gray-400 font-mono">{hp[req.key]}</p>
                  )}
                  {req.type === 'hdb' && (
                    <p className="text-xs text-amber-600">Awareness item — confirm with HDB guidelines</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Vaccines Section ──────────────────────────────────────────────────────────
function VaccinesSection({ hp, onAdd, onDelete }) {
  const vaccines = [...(hp.vaccinations ?? [])].sort((a, b) => b.date?.localeCompare(a.date ?? '') ?? 0);

  return (
    <div className="pb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Vaccination History</p>
        <button onClick={onAdd} className="px-3 py-1.5 rounded-xl bg-[#FF6B35] text-white text-xs font-bold active:opacity-80">
          + Add
        </button>
      </div>
      {vaccines.length === 0 ? (
        <EmptyState emoji="💉" text="No vaccinations logged yet" />
      ) : (
        <div className="flex flex-col gap-3">
          {vaccines.map(v => {
            const status = vaccineStatus(v.nextDueDate);
            return (
              <div key={v.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-900 text-sm">{v.vaccine}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        status === 'overdue'  ? 'bg-red-100 text-red-700' :
                        status === 'due_soon' ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {status === 'overdue' ? '🔴 Overdue' : status === 'due_soon' ? '🟡 Due soon' : '🟢 Up to date'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Given: {fmtDate(v.date)}</p>
                    {v.nextDueDate && <p className="text-xs text-gray-400">Next due: {fmtDate(v.nextDueDate)}</p>}
                    {v.clinic && <p className="text-xs text-gray-400">{v.clinic}</p>}
                    {v.notes && <p className="text-xs text-gray-500 mt-1 italic">{v.notes}</p>}
                  </div>
                  <button onClick={() => onDelete(v.id)} className="text-gray-300 hover:text-red-400 text-lg leading-none flex-shrink-0">×</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Vet Visits Section ────────────────────────────────────────────────────────
function VisitsSection({ hp, onAdd, onDelete }) {
  const visits = [...(hp.vetVisits ?? [])].sort((a, b) => b.date?.localeCompare(a.date ?? '') ?? 0);
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="pb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Visit History</p>
        <button onClick={onAdd} className="px-3 py-1.5 rounded-xl bg-[#FF6B35] text-white text-xs font-bold active:opacity-80">
          + Log Visit
        </button>
      </div>
      {visits.length === 0 ? (
        <EmptyState emoji="🩺" text="No vet visits logged yet" />
      ) : (
        <div className="flex flex-col gap-3">
          {visits.map(v => (
            <div
              key={v.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                className="w-full p-4 flex items-start justify-between gap-2 text-left"
                onClick={() => setExpanded(expanded === v.id ? null : v.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{v.clinic || 'Vet visit'}</p>
                  <p className="text-xs text-gray-400">{fmtDate(v.date)}{v.vetName ? ` · ${v.vetName}` : ''}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-gray-400 text-sm">{expanded === v.id ? '▲' : '▼'}</span>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(v.id); }} className="text-gray-300 hover:text-red-400 text-lg leading-none">×</button>
                </div>
              </button>
              {expanded === v.id && (v.diagnosis || v.treatment || v.notes) && (
                <div className="px-4 pb-4 border-t border-gray-50 pt-3 flex flex-col gap-2">
                  {v.diagnosis && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Diagnosis</p>
                      <p className="text-sm text-gray-700">{v.diagnosis}</p>
                    </div>
                  )}
                  {v.treatment && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Treatment</p>
                      <p className="text-sm text-gray-700">{v.treatment}</p>
                    </div>
                  )}
                  {v.notes && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Notes</p>
                      <p className="text-sm text-gray-700 italic">{v.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Medications Section ───────────────────────────────────────────────────────
function MedsSection({ hp, onAdd, onToggle, onDelete }) {
  const meds = hp.medications ?? [];
  const active = meds.filter(m => m.active);
  const past   = meds.filter(m => !m.active);

  return (
    <div className="pb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Medications</p>
        <button onClick={onAdd} className="px-3 py-1.5 rounded-xl bg-[#FF6B35] text-white text-xs font-bold active:opacity-80">
          + Add Med
        </button>
      </div>
      {meds.length === 0 ? (
        <EmptyState emoji="💊" text="No medications logged yet" />
      ) : (
        <>
          {active.length > 0 && (
            <>
              <p className="text-xs font-bold text-green-600 mb-2">Active</p>
              <div className="flex flex-col gap-3 mb-4">
                {active.map(m => (
                  <MedCard key={m.id} med={m} onToggle={onToggle} onDelete={onDelete} />
                ))}
              </div>
            </>
          )}
          {past.length > 0 && (
            <>
              <p className="text-xs font-bold text-gray-400 mb-2">Past</p>
              <div className="flex flex-col gap-3">
                {past.map(m => (
                  <MedCard key={m.id} med={m} onToggle={onToggle} onDelete={onDelete} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function MedCard({ med, onToggle, onDelete }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border p-4 ${med.active ? 'border-green-100' : 'border-gray-100'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{med.name}</p>
          <p className="text-xs text-gray-400">{med.dosage && `${med.dosage} · `}{med.frequency}</p>
          {med.startDate && <p className="text-xs text-gray-400">From {fmtDate(med.startDate)}{med.endDate ? ` to ${fmtDate(med.endDate)}` : ''}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onToggle(med.id)}
            className={`px-2 py-1 rounded-lg text-xs font-bold ${med.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
          >
            {med.active ? 'Active' : 'Inactive'}
          </button>
          <button onClick={() => onDelete(med.id)} className="text-gray-300 hover:text-red-400 text-lg leading-none">×</button>
        </div>
      </div>
    </div>
  );
}

// ── Weight Section ────────────────────────────────────────────────────────────
function WeightSection({ hp, onAdd }) {
  const [showForm, setShowForm] = useState(false);
  const [weightKg, setWeightKg] = useState('');
  const [weightDate, setWeightDate] = useState(todayIso());

  const weights = [...(hp.weights ?? [])].sort((a, b) => a.date?.localeCompare(b.date ?? '') ?? 0);

  const chartData = weights.map(w => ({
    date: parseDate(w.date)?.toLocaleDateString('en-SG', { month: 'short', year: '2-digit' }) ?? w.date,
    kg: w.kg,
  }));

  const latest = weights[weights.length - 1];

  const handleAdd = () => {
    const kg = parseFloat(weightKg);
    if (!isNaN(kg) && kg > 0 && weightDate) {
      onAdd({ id: genId(), date: weightDate, kg });
      setWeightKg('');
      setShowForm(false);
    }
  };

  return (
    <div className="pb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Weight Tracker</p>
        <button
          onClick={() => setShowForm(s => !s)}
          className="px-3 py-1.5 rounded-xl bg-[#FF6B35] text-white text-xs font-bold active:opacity-80"
        >
          + Log Weight
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 4.5"
                value={weightKg}
                onChange={e => setWeightKg(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Date</label>
              <input
                type="date"
                value={weightDate}
                onChange={e => setWeightDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={!weightKg || !weightDate}
            className="w-full mt-3 py-2.5 rounded-xl bg-[#FF6B35] text-white font-bold text-sm disabled:opacity-40"
          >
            Save
          </button>
        </div>
      )}

      {weights.length === 0 ? (
        <EmptyState emoji="⚖️" text="No weight entries yet" />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          {latest && (
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-black text-[#FF6B35]">{latest.kg}</span>
              <span className="text-sm font-bold text-gray-400">kg</span>
              <span className="text-xs text-gray-400 ml-auto">{fmtDate(latest.date)}</span>
            </div>
          )}
          {weights.length >= 2 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#FF6B35" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF6B35" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} domain={['auto', 'auto']} unit=" kg" width={48} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} formatter={v => [`${v} kg`, 'Weight']} />
                <Area type="monotone" dataKey="kg" stroke="#FF6B35" strokeWidth={2.5} fill="url(#weightGradient)"
                  dot={{ fill: '#FF6B35', r: 4 }} activeDot={{ r: 6, fill: '#FF6B35', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-gray-400 text-center py-4">Add one more entry to see the weight trend chart</p>
          )}
        </div>
      )}

      {/* History list */}
      {weights.length > 0 && (
        <div className="flex flex-col gap-2">
          {[...weights].reverse().map(w => (
            <div key={w.id} className="flex items-center justify-between px-4 py-2.5 bg-white rounded-xl border border-gray-100 shadow-sm">
              <span className="text-sm font-semibold text-gray-700">{fmtDate(w.date)}</span>
              <span className="text-sm font-bold text-[#FF6B35]">{w.kg} kg</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Symptoms Section ──────────────────────────────────────────────────────────
function SymptomsSection({ hp, onAdd, onDelete, showToast }) {
  const symptoms = [...(hp.symptoms ?? [])].sort((a, b) => b.date?.localeCompare(a.date ?? '') ?? 0);

  const handleShare = (entry) => {
    const text = [
      `PawMatch Pet Health Log — ${hp.petName || 'My Pet'}`,
      `Date: ${fmtDate(entry.date)}`,
      `Symptoms: ${entry.symptoms.join(', ')}`,
      `Severity: ${entry.severity}`,
      entry.notes ? `Notes: ${entry.notes}` : null,
    ].filter(Boolean).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard!');
    }).catch(() => {
      showToast('Copy failed — please copy manually');
    });
  };

  return (
    <div className="pb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Symptom Log</p>
        <button onClick={onAdd} className="px-3 py-1.5 rounded-xl bg-[#FF6B35] text-white text-xs font-bold active:opacity-80">
          + Log
        </button>
      </div>
      {symptoms.length === 0 ? (
        <EmptyState emoji="📋" text="No symptoms logged yet" />
      ) : (
        <div className="flex flex-col gap-3">
          {symptoms.map(s => (
            <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs text-gray-400">{fmtDate(s.date)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      s.severity === 'severe'   ? 'bg-red-100 text-red-700' :
                      s.severity === 'moderate' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {s.severity}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-1.5">
                    {s.symptoms.map(sym => (
                      <span key={sym} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{sym}</span>
                    ))}
                  </div>
                  {s.notes && <p className="text-xs text-gray-500 italic">{s.notes}</p>}
                </div>
                <button onClick={() => onDelete(s.id)} className="text-gray-300 hover:text-red-400 text-lg leading-none flex-shrink-0">×</button>
              </div>
              <button
                onClick={() => handleShare(s)}
                className="mt-2 w-full py-2 rounded-xl border border-gray-200 text-gray-500 text-xs font-semibold flex items-center justify-center gap-1.5 active:bg-gray-50"
              >
                📋 Share with Vet
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Setup Prompt Card ─────────────────────────────────────────────────────────
function SetupPromptCard({ onSetup }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <span className="text-6xl mb-4">🏥</span>
      <h3 className="font-display font-bold text-gray-900 text-xl mb-2">Health Passport</h3>
      <p className="text-gray-500 text-sm mb-6 leading-relaxed">
        Create a digital health record for your pet. Track vaccinations, vet visits, medications, weight, and more — with Singapore compliance checks built in.
      </p>
      <button
        onClick={onSetup}
        className="px-8 py-3.5 rounded-2xl bg-[#FF6B35] text-white font-bold text-base shadow-sm active:opacity-80"
      >
        Create Health Passport
      </button>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function HealthPassport({ userProfile, healthPassport, onUpdate }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [activeSheet, setActiveSheet] = useState(null); // null | 'setup' | 'vaccine' | 'visit' | 'medication' | 'symptoms'
  const [toast, setToast] = useState('');

  const hp = healthPassport;
  const isHdb = userProfile?.livingSpace === 'hdb';

  const showToast = (msg) => setToast(msg);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  // Functional updater helper
  const patchHP = (patch) => {
    onUpdate(prev => ({ ...(prev ?? {}), ...patch }));
  };

  // Array helpers
  const addToArray = (key, item) => {
    patchHP({ [key]: [...(hp?.[key] ?? []), item] });
  };

  const removeFromArray = (key, id) => {
    patchHP({ [key]: (hp?.[key] ?? []).filter(x => x.id !== id) });
  };

  // If no passport created yet
  if (!hp?.petName) {
    return (
      <div className="flex-1 overflow-y-auto">
        <SetupPromptCard onSetup={() => setActiveSheet('setup')} />
        {activeSheet === 'setup' && (
          <SetupSheet
            onClose={() => setActiveSheet(null)}
            onSave={(data) => onUpdate(data)}
            initialData={null}
            showToast={showToast}
          />
        )}
        {toast && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] bg-gray-900 text-white rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-xl animate-fade-scale-in">
            {toast}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Section chips */}
      <div className="px-5 pb-3 pt-1">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                activeSection === s.id
                  ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                  : 'bg-white text-gray-500 border-gray-200 active:bg-gray-50'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active section */}
      <div className="px-5">
        {activeSection === 'overview' && (
          <OverviewSection
            hp={hp}
            isHdb={isHdb}
            onEdit={() => setActiveSheet('setup')}
            onPatch={patchHP}
            showToast={showToast}
          />
        )}
        {activeSection === 'vaccines' && (
          <VaccinesSection
            hp={hp}
            onAdd={() => setActiveSheet('vaccine')}
            onDelete={id => removeFromArray('vaccinations', id)}
          />
        )}
        {activeSection === 'visits' && (
          <VisitsSection
            hp={hp}
            onAdd={() => setActiveSheet('visit')}
            onDelete={id => removeFromArray('vetVisits', id)}
          />
        )}
        {activeSection === 'meds' && (
          <MedsSection
            hp={hp}
            onAdd={() => setActiveSheet('medication')}
            onToggle={id => patchHP({
              medications: hp.medications.map(m => m.id === id ? { ...m, active: !m.active } : m)
            })}
            onDelete={id => removeFromArray('medications', id)}
          />
        )}
        {activeSection === 'weight' && (
          <WeightSection
            hp={hp}
            onAdd={entry => addToArray('weights', entry)}
          />
        )}
        {activeSection === 'symptoms' && (
          <SymptomsSection
            hp={hp}
            onAdd={() => setActiveSheet('symptoms')}
            onDelete={id => removeFromArray('symptoms', id)}
            showToast={showToast}
          />
        )}
      </div>

      {/* Sheets */}
      {activeSheet === 'setup' && (
        <SetupSheet
          onClose={() => setActiveSheet(null)}
          onSave={(data) => onUpdate(prev => ({ ...(prev ?? {}), ...data }))}
          initialData={hp}
          showToast={showToast}
        />
      )}
      {activeSheet === 'vaccine' && (
        <VaccinationSheet
          onClose={() => setActiveSheet(null)}
          onSave={item => addToArray('vaccinations', item)}
        />
      )}
      {activeSheet === 'visit' && (
        <VetVisitSheet
          onClose={() => setActiveSheet(null)}
          onSave={item => addToArray('vetVisits', item)}
        />
      )}
      {activeSheet === 'medication' && (
        <MedicationSheet
          onClose={() => setActiveSheet(null)}
          onSave={item => addToArray('medications', item)}
        />
      )}
      {activeSheet === 'symptoms' && (
        <SymptomsSheet
          onClose={() => setActiveSheet(null)}
          onSave={item => addToArray('symptoms', item)}
          showToast={showToast}
          petName={hp.petName}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] bg-gray-900 text-white rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-xl animate-fade-scale-in">
          {toast}
        </div>
      )}
    </div>
  );
}
