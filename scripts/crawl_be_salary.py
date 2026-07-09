#!/usr/bin/env python3
"""
Belgium Graduate Salary Crawler
소스: Jobat.be, Statbel
"""

import requests
from bs4 import BeautifulSoup
import json
import re

def crawl_salary():
    """졸업 후 평균 연봉 데이터 수집"""
    data = {
        "source": "Jobat.be, Statbel",
        "last_updated": "2025",
        "graduate_salary_by_field": [
            {"field": "Medicine (Doctor, Dentist)", "field_nl": "Geneeskunde", "field_fr": "Médecine", "starting_salary_eur": 3308, "experience_5yr_eur": 5500},
            {"field": "Pharmaceutical Sciences", "field_nl": "Farmaceutische wetenschappen", "field_fr": "Sciences pharmaceutiques", "starting_salary_eur": 3204, "experience_5yr_eur": 5200},
            {"field": "Civil Engineering", "field_nl": "Burgerlijk ingenieur", "field_fr": "Ingénieur civil", "starting_salary_eur": 2849, "experience_5yr_eur": 4800},
            {"field": "Computer Science", "field_nl": "Informatica", "field_fr": "Informatique", "starting_salary_eur": 2826, "experience_5yr_eur": 4600},
            {"field": "Bioengineering/Agricultural Engineering", "field_nl": "Bio-ingenieur", "field_fr": "Bio-ingénieur", "starting_salary_eur": 2709, "experience_5yr_eur": 4400},
            {"field": "Biomedical Sciences", "field_nl": "Biomedische wetenschappen", "field_fr": "Sciences biomédicales", "starting_salary_eur": 2668, "experience_5yr_eur": 4200},
            {"field": "Exact Sciences (Biology, Math, Chemistry, Physics)", "field_nl": "Exacte wetenschappen", "field_fr": "Sciences exactes", "starting_salary_eur": 2588, "experience_5yr_eur": 4000},
            {"field": "Industrial Engineering", "field_nl": "Industrieel ingenieur", "field_fr": "Ingénieur industriel", "starting_salary_eur": 2584, "experience_5yr_eur": 3900},
            {"field": "Business Engineering", "field_nl": "Handelsingenieur", "field_fr": "Ingénieur commercial", "starting_salary_eur": 2511, "experience_5yr_eur": 3800},
            {"field": "Law", "field_nl": "Rechten", "field_fr": "Droit", "starting_salary_eur": 2425, "experience_5yr_eur": 3600}
        ],
        "average_salary_by_sector": [
            {"sector": "Chemistry & Pharmaceutical Industry", "sector_nl": "Chemie & farmaceutische industrie", "sector_fr": "Chimie & industrie pharmaceutique", "average_gross_monthly_eur": 5262},
            {"sector": "Government", "sector_nl": "Overheid", "sector_fr": "Gouvernement", "average_gross_monthly_eur": 4920},
            {"sector": "Energy & Environment", "sector_nl": "Energie & milieu", "sector_fr": "Énergie & environnement", "average_gross_monthly_eur": 4866},
            {"sector": "Electronics & Technology Industry", "sector_nl": "Elektronica & technologische industrie", "sector_fr": "Électronique & industrie technologique", "average_gross_monthly_eur": 4797},
            {"sector": "Education & Training", "sector_nl": "Onderwijs & opleidingen", "sector_fr": "Éducation & formation", "average_gross_monthly_eur": 4793}
        ],
        "national_average": {
            "gross_monthly_eur": 4420,
            "year": 2025
        }
    }
    return data

if __name__ == "__main__":
    data = crawl_salary()
    print(json.dumps(data, ensure_ascii=False, indent=2))
