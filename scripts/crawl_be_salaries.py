#!/usr/bin/env python3
"""
Crawl Indeed Belgium & Jobat.be for salary data by occupation.
Outputs: src/data/be-occupations-salary.json
"""
import json, re, sys, time, ssl
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from urllib.parse import quote

# Suppress SSL verification issues on macOS
ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

# All occupations we need salary data for
OCCUPATIONS = [
    # Shortage - Flanders
    "Nurse", "Accountant", "Industrial Technician", "Maintenance Mechanic",
    "Machine Builder", "Construction Foreman", "Home Cleaner",
    "Fruit Harvest Worker", "Hospitality Staff", "Childcare Worker",
    # Shortage - Brussels
    "Ergotherapist", "Teacher", "IT Specialist", "Baker", "Butcher",
    # Shortage - Wallonia
    "Healthcare Workers", "Construction Workers", "IT Specialists",
    "Engineers", "Logistics Workers",
    # High income
    "Management & Directors", "Lawyers", "Education & Training",
    "R&D and Quality", "Security Staff", "IT Professionals",
    "Financial Functions", "Medical & Paramedical", "Sales",
]

# Indeed.be slug mapping (occupation name → URL slug)
INDEED_SLUGS = {
    "Nurse": "verpleegkundige",
    "Accountant": "boekhouder",
    "Industrial Technician": "industrieel-technicus",
    "Maintenance Mechanic": "onderhoudsmecanicien",
    "Machine Builder": "machinebouwer",
    "Construction Foreman": "werfleider",
    "Home Cleaner": "schoonmaker",
    "Fruit Harvest Worker": "medewerker-in-de-fruitteelt",
    "Hospitality Staff": "horecamedewerker",
    "Childcare Worker": "medewerker-kinderopvang",
    "Ergotherapist": "ergotherapeut",
    "Teacher": "leerkracht",
    "IT Specialist": "ict-specialist",
    "IT Specialists": "ict-specialist",
    "IT Professionals": "ict-professional",
    "Baker": "bakker",
    "Butcher": "slager",
    "Healthcare Workers": "zorgverlener",
    "Construction Workers": "bouwvakker",
    "Engineers": "ingenieur",
    "Logistics Workers": "logistiek-medewerker",
    "Management & Directors": "manager",
    "Lawyers": "jurist",
    "Education & Training": "onderwijsgevende",
    "R&D and Quality": "onderzoeker",
    "Security Staff": "bewakingsagent",
    "Financial Functions": "financieel-medewerker",
    "Medical & Paramedical": "arts",
    "Sales": "verkoper",
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "nl-BE,nl;q=0.9,en;q=0.8",
}


def fetch_url(url: str, timeout: int = 15) -> str | None:
    try:
        req = Request(url, headers=HEADERS)
        resp = urlopen(req, timeout=timeout, context=ssl_ctx)
        return resp.read().decode("utf-8", errors="replace")
    except (HTTPError, URLError, TimeoutError) as e:
        print(f"  [WARN] {url} → {e}", file=sys.stderr)
        return None


def parse_indeed_salary(html: str) -> dict | None:
    """Extract salary info from Indeed.be career salary page."""
    result = {}

    # Try to find "€ X,XXX per maand" pattern
    m = re.search(r'€\s*([\d.,]+)\s*(?:per\s*maand|/maand|per\s*month)', html, re.IGNORECASE)
    if m:
        salary_str = m.group(1).replace(".", "").replace(",", ".")
        try:
            result["salary_eur_monthly"] = float(salary_str)
        except ValueError:
            pass

    # Also try "€X.XXX" without "per maand"
    if "salary_eur_monthly" not in result:
        m = re.search(r'€\s*([\d.]+)', html)
        if m:
            salary_str = m.group(1).replace(".", "")
            try:
                val = float(salary_str)
                if 1000 < val < 30000:  # reasonable monthly salary range
                    result["salary_eur_monthly"] = val
            except ValueError:
                pass

    # Try to find sample size
    m = re.search(r'([\d.]+)\s*(?:salarissen|salary\s*reports|lonen)', html, re.IGNORECASE)
    if m:
        result["sample_size"] = m.group(1).replace(".", "")

    return result if result.get("salary_eur_monthly") else None


def crawl_indeed(occupation: str) -> dict | None:
    """Crawl Indeed Belgium for a single occupation."""
    slug = INDEED_SLUGS.get(occupation)
    if not slug:
        return None

    url = f"https://be.indeed.com/career/{slug}/salaries"
    html = fetch_url(url)
    if not html:
        return None

    data = parse_indeed_salary(html)
    if data:
        data["source"] = "Indeed Belgium"
        data["url"] = url
    return data


def crawl_jobat(occupation: str) -> dict | None:
    """Crawl Jobat.be Salariskompas for a single occupation."""
    # Jobat uses Dutch job titles in URLs
    slug_map = {
        "Nurse": "verpleegkundige",
        "Accountant": "boekhouder",
        "Industrial Technician": "industrieel-technicus",
        "Maintenance Mechanic": "onderhoudsmecanicien",
        "Machine Builder": "machinebouwer",
        "Construction Foreman": "werfleider",
        "Home Cleaner": "schoonmaker",
        "Fruit Harvest Worker": "fruitplukker",
        "Hospitality Staff": "horecamedewerker",
        "Childcare Worker": "medewerker-kinderopvang",
        "Ergotherapist": "ergotherapeut",
        "Teacher": "leerkracht",
        "IT Specialist": "ict-specialist",
        "IT Specialists": "ict-specialist",
        "IT Professionals": "ict-professional",
        "Baker": "bakker",
        "Butcher": "slager",
        "Healthcare Workers": "zorgverlener",
        "Construction Workers": "bouwvakker",
        "Engineers": "ingenieur",
        "Logistics Workers": "logistiek-medewerker",
        "Management & Directors": "manager",
        "Lawyers": "jurist",
        "Education & Training": "onderwijsgevende",
        "R&D and Quality": "onderzoeker",
        "Security Staff": "bewakingsagent",
        "Financial Functions": "financieel-medewerker",
        "Medical & Paramedical": "arts",
        "Sales": "verkoper",
    }
    slug = slug_map.get(occupation)
    if not slug:
        return None

    # Jobat salary article URL pattern
    url = f"https://www.jobat.be/nl/art/loon/het-loon-van-{slug}"
    html = fetch_url(url)
    if not html:
        return None

    result = {}
    # Look for "€ X.XXX" salary figures
    salaries = re.findall(r'€\s*([\d.]+)', html)
    for s in salaries:
        try:
            val = float(s.replace(".", ""))
            if 1500 < val < 15000:
                if "salary_eur_monthly" not in result:
                    result["salary_eur_monthly"] = val
                elif val > result["salary_eur_monthly"]:
                    result["salary_range_max"] = val
        except ValueError:
            continue

    if result.get("salary_eur_monthly"):
        result["source"] = "Jobat.be"
        result["url"] = url
        return result

    return None


def main():
    results = {}
    for i, occ in enumerate(OCCUPATIONS):
        print(f"[{i+1}/{len(OCCUPATIONS)}] {occ}...", end=" ", flush=True)

        # Try Indeed first
        indeed = crawl_indeed(occ)
        time.sleep(1.5)  # rate limit

        # Try Jobat
        jobat = crawl_jobat(occ)
        time.sleep(1.5)

        # Pick best data
        entry = {"occupation_en": occ}
        if indeed:
            entry["salary_eur_monthly"] = indeed["salary_eur_monthly"]
            entry["source"] = "Indeed Belgium"
            entry["url"] = indeed.get("url", "")
            if indeed.get("sample_size"):
                entry["sample_size"] = indeed["sample_size"]
        elif jobat:
            entry["salary_eur_monthly"] = jobat["salary_eur_monthly"]
            entry["source"] = "Jobat.be"
            entry["url"] = jobat.get("url", "")
        else:
            entry["salary_eur_monthly"] = None
            entry["source"] = "Not found"

        # Merge Jobat range if available
        if jobat and jobat.get("range_max"):
            entry["salary_range_max_eur"] = jobat["range_max"]

        code = occ.lower().replace("&", "and").replace(" ", "-")
        code = re.sub(r'[^a-z0-9-]', '', code)
        entry["occupation_code"] = code

        results[code] = entry
        status = "✓" if entry.get("salary_eur_monthly") else "✗"
        print(f"{status} {entry.get('salary_eur_monthly', 'N/A')}")

    # Save
    output = {
        "source": "Indeed Belgium, Jobat.be",
        "last_updated": "2025",
        "occupations": results,
    }
    out_path = "src/data/be-occupations-salary.json"
    with open(out_path, "w") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    found = sum(1 for v in results.values() if v.get("salary_eur_monthly"))
    print(f"\nDone: {found}/{len(OCCUPATIONS)} occupations with salary data → {out_path}")


if __name__ == "__main__":
    main()
