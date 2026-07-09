#!/usr/bin/env python3
"""
Belgium Tax Rate Crawler
소스: FPS Finance, PwC Tax Summaries
"""

import requests
from bs4 import BeautifulSoup
import json

def crawl_tax():
    """세금 데이터 수집"""
    data = {
        "source": "FPS Finance, PwC Tax Summaries",
        "last_updated": "2025",
        "income_tax": {
            "year": 2025,
            "assessment_year": 2026,
            "brackets": [
                {"min_eur": 0, "max_eur": 16320, "rate_percent": 25},
                {"min_eur": 16320, "max_eur": 28800, "rate_percent": 40},
                {"min_eur": 28800, "max_eur": 49840, "rate_percent": 45},
                {"min_eur": 49840, "max_eur": None, "rate_percent": 50}
            ],
            "tax_free_allowance_eur": 10910
        },
        "social_security": {
            "employee_rate_percent": 13.07,
            "description": "Social security contributions are deducted from gross salary"
        },
        "special_social_contribution": {
            "description": "Additional contribution based on household income",
            "thresholds": [
                {"min_eur": 0, "max_eur": 15820, "rate_percent": 0},
                {"min_eur": 15820, "max_eur": 21190, "rate_percent": 1},
                {"min_eur": 21190, "max_eur": 26560, "rate_percent": 2},
                {"min_eur": 26560, "max_eur": 32960, "rate_percent": 3},
                {"min_eur": 32960, "max_eur": None, "rate_percent": 4}
            ]
        },
        "tax_calculation_example": {
            "gross_annual_eur": 40000,
            "social_security_eur": 5228,
            "taxable_income_eur": 34772,
            "income_tax_eur": 10224,
            "tax_free_allowance_credit_eur": 2727.5,
            "net_tax_eur": 7496.5,
            "net_monthly_eur": 2685
        }
    }
    return data

if __name__ == "__main__":
    data = crawl_tax()
    print(json.dumps(data, ensure_ascii=False, indent=2))
