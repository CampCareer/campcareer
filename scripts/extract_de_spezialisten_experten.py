"""Extract Spezialisten/Experten salary + shortage data from PDFs and CSV.
Updates de-occupations.json and de-region-occupations.json in-place."""
import fitz, json, re, os, csv, sys, unicodedata
from collections import defaultdict

# ── Config ──────────────────────────────────────────────────────────
PDF_DIR = "public/germany_median_salary"
CSV_PATH = "public/Germany_Shortage/engpassanalyse_rohdaten.csv"
OCC_PATH = "src/data/de-occupations.json"
REGION_PATH = "src/data/de-region-occupations.json"
TARGET_YEAR = "2025"

# PDF filename → Bundesland code
STATE_MAP = {
    "Baden": "BW", "Bayern": "BY", "Berlin": "BE", "Brandenburg": "BB",
    "Bremen": "HB", "Hamburg": "HH", "Hessen": "HE", "Mecklenburg-vorpommern": "MV",
    "Niedersachsen": "NI", "Nordrhein-west-falen": "NW", "Rheinland-pfalz": "RP",
    "Saarland": "SL", "Sachsen": "SN", "Sachsen-anhalt": "ST",
    "Schleswig-hol-stein": "SH", "Thüringen": "TH",
}
# BA region code → Bundesland code(s) (some regions combine states)
BA_TO_STATES = {
    "05000000": ["NW"], "06000000": ["HE"], "08000000": ["BW"], "09000000": ["BY"],
    "13000000": ["MV"], "14000000": ["SN"], "15000000": ["ST"], "16000000": ["TH"],
    "20000000": ["NI", "HB"], "21000000": ["BB", "BE"],
    "22000000": ["RP", "SL"], "23000000": ["SH", "HH"],
    "d": ["DE"], "d3": ["DE"],
}

def parse_pdf(filepath):
    """Parse Entgeltatlas PDF → {kldb: {fachkrafte, spezialisten, experten}}."""
    doc = fitz.open(filepath)
    results = {}
    for page in doc:
        text = page.get_text()
        lines = text.split('\n')
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            m = re.match(r'^(\d{3})\s(.+)$', line)
            if m:
                kldb = m.group(1)
                vals = []
                j = i + 1
                while j < len(lines) and len(vals) < 5:
                    v = lines[j].strip()
                    skip = {'Berufsgruppe','Insgesamt','Helfer','Fachkräfte','Spezialisten','Experten','Gesamt','Dezember','BRUTTOMONATSENTGELTE','DURCH','KLICK','SORTIEREN.','Zeitauswahl','Region','Auswahl','Die','Das','Jeder','In','Durch','werden','ist','eine','aus','der','für','im','Median','Entgeltatlas','Kurzinfo'}
                    if not v or v in skip:
                        j += 1; continue
                    if re.match(r'^\d{3}\s', v):
                        break
                    cleaned = []
                    for token in v.replace(',', '.').split():
                        t = token.strip().replace('>', '')
                        if t in ('x', '-', '7.550'):
                            cleaned.append(t if t != '7.550' else '>7.550')
                        elif re.match(r'^[\d.]{2,8}$', t):
                            cleaned.append(t)
                    if cleaned:
                        vals.extend(cleaned)
                    j += 1
                if len(vals) >= 3:
                    results[kldb] = {
                        'fachkrafte': vals[2] if len(vals) > 2 else None,
                        'spezialisten': vals[3] if len(vals) > 3 else None,
                        'experten': vals[4] if len(vals) > 4 else None,
                    }
                i = j
            else:
                i += 1
    doc.close()
    return results

def val_to_annual(v):
    if v is None or str(v) in ('x', '-', 'None'):
        return None
    v = str(v).replace('>', '').strip()
    try:
        return round(float(v.replace('.', '')) * 12)
    except:
        return None

def kldb_from_ba_schl(ba_schl):
    """Map 4-digit BA_SCHL → 3-digit KLdB code."""
    if len(ba_schl) >= 3:
        return ba_schl[:3]
    return ba_schl

# ══════════════════════════════════════════════════════════════════════
# STEP 1: Parse all PDFs → per-state Spezialisten/Experten salaries
# ══════════════════════════════════════════════════════════════════════
print("=== Step 1: Parsing PDFs ===")
pdf_salaries = {}  # {state_code: {kldb: {fachkrafte_annual, spezialisten_annual, experten_annual}}}
for fname in os.listdir(PDF_DIR):
    if not fname.endswith('.pdf') or not fname.startswith('Entgelte'):
        continue
    m = re.search(r'\(([^)]+)\)', fname)
    if m:
        state_name = m.group(1)
        state_name_norm = unicodedata.normalize('NFC', state_name)
        state_code = STATE_MAP.get(state_name) or STATE_MAP.get(state_name_norm)
        if state_code is None:
            print(f"  WARN: unknown state '{state_name}' in {fname}, skipping")
            continue
    else:
        state_code = "DE"

    fp = os.path.join(PDF_DIR, fname)
    parsed = parse_pdf(fp)
    
    converted = {}
    for kldb, v in parsed.items():
        converted[kldb] = {
            'median_salary_eur': val_to_annual(v.get('fachkrafte')),
            'median_salary_spezialist_eur': val_to_annual(v.get('spezialisten')),
            'median_salary_experte_eur': val_to_annual(v.get('experten')),
        }
    pdf_salaries[state_code] = converted
    print(f"  {state_code}: {len(converted)} occupations from PDF")

# ══════════════════════════════════════════════════════════════════════
# STEP 2: Parse CSV → per-state Spezialisten/Experten shortage ratings
# ══════════════════════════════════════════════════════════════════════
print("\n=== Step 2: Parsing CSV shortage ratings ===")
csv_shortage = defaultdict(lambda: defaultdict(dict))  # {state_code: {kldb: {level: rating}}}

# Level code mapping
LEVEL_CODES = {"2": "fachkrafte", "3": "spezialisten", "4": "experten"}
LEVEL_SUFFIX = {"fachkrafte": "", "spezialisten": "_spezialist", "experten": "_experte"}

with open(CSV_PATH, encoding='utf-8-sig') as f:
    reader = csv.DictReader(f, delimiter=';')
    for row in reader:
        if row.get('Jahr.DESC') != TARGET_YEAR:
            continue
        lvl_code = row.get('Anforderungsniveau.BA_SCHL', '')
        lvl_name = LEVEL_CODES.get(lvl_code)
        if not lvl_name:
            continue
        
        ba_region = row.get('Bundesland RZ.BA_SCHL', '')
        states = BA_TO_STATES.get(ba_region, [])
        
        ba_schl = row.get('Beruf.BA_SCHL', '')
        kldb = kldb_from_ba_schl(ba_schl)
        
        rating_raw = row.get('Gesamtbewertung', 'X')
        try:
            rating = float(rating_raw.replace(',', '.'))
        except:
            rating = None
        
        for state in states:
            csv_shortage[state][kldb][lvl_name] = rating

for state in sorted(csv_shortage):
    f_cnt = sum(1 for v in csv_shortage[state].values() if 'fachkrafte' in v)
    s_cnt = sum(1 for v in csv_shortage[state].values() if 'spezialisten' in v)
    e_cnt = sum(1 for v in csv_shortage[state].values() if 'experten' in v)
    print(f"  {state}: F={f_cnt} S={s_cnt} E={e_cnt}")

# ══════════════════════════════════════════════════════════════════════
# STEP 3: Update de-occupations.json (national level)
# ══════════════════════════════════════════════════════════════════════
print("\n=== Step 3: Updating de-occupations.json ===")
with open(OCC_PATH, encoding='utf-8') as f:
    occ_data = json.load(f)

de_nat_sal = pdf_salaries.get("DE", {})
de_nat_short = csv_shortage.get("DE", {})

updated_occ = 0
for kldb, entry in occ_data.items():
    # Add Spezialisten/Experten salary from national PDF
    sal = de_nat_sal.get(kldb, {})
    changed = False
    for field in ['median_salary_spezialist_eur', 'median_salary_experte_eur']:
        if sal.get(field) is not None and entry.get(field) is None:
            entry[field] = sal[field]
            changed = True
    # Add Spezialisten/Experten shortage from national CSV
    short = de_nat_short.get(kldb, {})
    for level, suffix in [('spezialisten', '_spezialist'), ('experten', '_experte')]:
        if level in short:
            fname = f'shortage_rating{suffix}'
            if entry.get(fname) is None:
                entry[fname] = short[level]
                changed = True
    if changed:
        updated_occ += 1

print(f"  Updated {updated_occ} occupation entries")

with open(OCC_PATH, 'w', encoding='utf-8') as f:
    json.dump(occ_data, f, ensure_ascii=False, indent=2)
print(f"  Written to {OCC_PATH}")

# ══════════════════════════════════════════════════════════════════════
# STEP 4: Update de-region-occupations.json (per-state level)
# ══════════════════════════════════════════════════════════════════════
print("\n=== Step 4: Updating de-region-occupations.json ===")
with open(REGION_PATH, encoding='utf-8') as f:
    region_data = json.load(f)

updated_region = 0
for state_code, entries in region_data.items():
    state_sal = pdf_salaries.get(state_code, {})
    state_short = csv_shortage.get(state_code, {})
    for entry in entries:
        kldb = entry['kldb_code']
        changed = False
        
        # Add Spezialisten/Experten salary from state PDF
        sal = state_sal.get(kldb, {})
        for field in ['median_salary_spezialist_eur', 'median_salary_experte_eur']:
            if sal.get(field) is not None and entry.get(field) is None:
                entry[field] = sal[field]
                changed = True
        
        # Add Spezialisten/Experten shortage from state CSV
        short = state_short.get(kldb, {})
        for level, suffix in [('spezialisten', '_spezialist'), ('experten', '_experte')]:
            if level in short:
                fname = f'shortage_rating{suffix}'
                if entry.get(fname) is None:
                    entry[fname] = short[level]
                    changed = True
        
        if changed:
            updated_region += 1

print(f"  Updated {updated_region} region entries across {len(region_data)} states")

with open(REGION_PATH, 'w', encoding='utf-8') as f:
    json.dump(region_data, f, ensure_ascii=False, indent=2)
print(f"  Written to {REGION_PATH}")

print("\n=== Done ===")
