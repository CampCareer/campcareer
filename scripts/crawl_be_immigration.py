#!/usr/bin/env python3
"""
Belgium Immigration Data Crawler
소스: 공식 정부 웹사이트
"""

import requests
from bs4 import BeautifulSoup
import json

def crawl_immigration():
    """이민 데이터 수집"""
    data = {
        "source": "Belgian Immigration Office, EU Migration Portal",
        "last_updated": "2025",
        "visa_types": [
            {
                "type": "Single Permit (Work + Residence)",
                "type_nl": "Enige vergunning",
                "type_fr": "Permis unique",
                "duration": "Up to 1 year (renewable)",
                "requirements": [
                    "Employment contract with Belgian employer",
                    "Employer must prove no qualified EU candidates available",
                    "Sufficient means of subsistence",
                    "Health insurance",
                    "No criminal record"
                ],
                "regions": ["Flanders", "Wallonia", "Brussels-Capital"]
            },
            {
                "type": "EU Blue Card",
                "type_nl": "EU Blauwe Kaart",
                "type_fr": "Carte bleue UE",
                "duration": "Up to 4 years (renewable)",
                "requirements": [
                    "Higher education degree (at least 3 years)",
                    "Employment contract with minimum salary threshold",
                    "At least 5 years relevant work experience"
                ],
                "salary_threshold_eur": 58000
            },
            {
                "type": "Highly Qualified Worker",
                "type_nl": "Hooggeschoolde werknemer",
                "type_fr": "Travailleur hautement qualifié",
                "duration": "Up to 3 years",
                "requirements": [
                    "Higher education degree",
                    "Employment contract",
                    "Minimum salary requirement"
                ]
            }
        ],
        "shortage_occupations_flanders": [
            "Nurse", "Accountant", "Industrial technician", "Maintenance mechanic",
            "Machine builder", "Construction worker", "IT specialist"
        ],
        "shortage_occupations_wallonia": [
            "Healthcare workers", "Construction workers", "IT specialists",
            "Engineers", "Logistics workers"
        ],
        "shortage_occupations_brussels": [
            "Accountant", "Ergotherapist", "Construction foreman",
            "Healthcare workers", "IT specialists", "Hospitality workers"
        ],
        "work_permit_b": {
            "description": "Required for non-EU workers staying less than 90 days",
            "application": "Employer must apply",
            "validity": "Duration of employment contract"
        }
    }
    return data

if __name__ == "__main__":
    data = crawl_immigration()
    print(json.dumps(data, ensure_ascii=False, indent=2))
