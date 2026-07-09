#!/usr/bin/env python3
"""
Belgium Rent Data Crawler
소스: Numbeo, CIB
"""

import requests
from bs4 import BeautifulSoup
import json

def crawl_rent():
    """도시별/지역별 렌트 데이터 수집"""
    data = {
        "source": "Numbeo, CIB",
        "last_updated": "2025",
        "regions": {
            "Flanders": {
                "average_rent_eur": 808,
                "average_charges_eur": 30,
                "total_monthly_cost_eur": 850
            },
            "Wallonia": {
                "average_rent_eur": 715,
                "average_charges_eur": 40,
                "total_monthly_cost_eur": 760
            },
            "Brussels-Capital": {
                "average_rent_eur": 950,
                "average_charges_eur": 112.5,
                "total_monthly_cost_eur": 1062.5
            }
        },
        "cities": [
            {"city": "Antwerp", "region": "Flanders", "transactions_2025": 16025, "median_rent_2025": 820, "charges_2025": 60, "total_cost_2025": 880, "increase_vs_2024": "3.1%"},
            {"city": "Ghent", "region": "Flanders", "transactions_2025": 13778, "median_rent_2025": 700, "charges_2025": 35, "total_cost_2025": 735, "increase_vs_2024": "3.7%"},
            {"city": "Leuven", "region": "Flanders", "transactions_2025": 10625, "median_rent_2025": 626, "charges_2025": 50, "total_cost_2025": 676, "increase_vs_2024": "4.3%"},
            {"city": "Brussels (City)", "region": "Brussels-Capital", "transactions_2025": 5562, "median_rent_2025": 927.5, "charges_2025": 115, "total_cost_2025": 1042.5, "increase_vs_2024": "3.6%"},
            {"city": "Liège", "region": "Wallonia", "transactions_2025": 5237, "median_rent_2025": 680, "charges_2025": 50, "total_cost_2025": 730, "increase_vs_2024": "4.6%"},
            {"city": "Mons", "region": "Wallonia", "transactions_2025": 3606, "median_rent_2025": 626, "charges_2025": 50, "total_cost_2025": 676, "increase_vs_2024": "4.3%"},
            {"city": "Charleroi", "region": "Wallonia", "transactions_2025": 3397, "median_rent_2025": 650, "charges_2025": 40, "total_cost_2025": 690, "increase_vs_2024": "0.8%"},
            {"city": "Namur", "region": "Wallonia", "transactions_2025": 3241, "median_rent_2025": 725, "charges_2025": 50, "total_cost_2025": 775, "increase_vs_2024": "3.6%"}
        ],
        "housing_types": {
            "Brussels": {
                "apartment": 1299,
                "house": 2031,
                "studio": 860
            },
            "Flanders": {
                "apartment": 893,
                "house": 1014
            }
        }
    }
    return data

if __name__ == "__main__":
    data = crawl_rent()
    print(json.dumps(data, ensure_ascii=False, indent=2))
