#!/usr/bin/env python3
"""
Belgium Data Crawler - 벨기에 데이터 수집 스크립트
수집 항목: 연봉, 렌트, 세금, 이민, 예산, 부족직종, 고소득직종
"""

import json
import os
from pathlib import Path
from datetime import datetime

# 출력 디렉토리
OUTPUT_DIR = Path(__file__).parent.parent / "src" / "data"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def save_json(data: dict, filename: str):
    """JSON 파일 저장"""
    filepath = OUTPUT_DIR / filename
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Saved: {filepath}")

def crawl_all():
    """모든 크롤링 실행"""
    print("=== Belgium Data Crawler Start ===")
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Start time: {datetime.now()}")
    print()

    # 1. 연봉 데이터
    print("1. Crawling graduate salary data...")
    from crawl_be_salary import crawl_salary
    salary_data = crawl_salary()
    save_json(salary_data, "be-graduate-salary.json")
    print()

    # 2. 렌트 데이터
    print("2. Crawling rent data by city...")
    from crawl_be_rent import crawl_rent
    rent_data = crawl_rent()
    save_json(rent_data, "be-rent-by-city.json")
    print()

    # 3. 세금 데이터
    print("3. Crawling tax rate data...")
    from crawl_be_tax import crawl_tax
    tax_data = crawl_tax()
    save_json(tax_data, "be-tax-rates.json")
    print()

    # 4. 이민 데이터
    print("4. Crawling immigration data...")
    from crawl_be_immigration import crawl_immigration
    immigration_data = crawl_immigration()
    save_json(immigration_data, "be-immigration.json")
    print()

    # 5. 예산 데이터
    print("5. Crawling cost of living data...")
    from crawl_be_budget import crawl_budget
    budget_data = crawl_budget()
    save_json(budget_data, "be-cost-of-living.json")
    print()

    # 6. 부족 직종
    print("6. Crawling shortage occupations...")
    from crawl_be_shortage import crawl_shortage
    shortage_data = crawl_shortage()
    save_json(shortage_data, "be-shortage-occupations.json")
    print()

    # 7. 고소득 직종
    print("7. Crawling high income occupations...")
    from crawl_be_high_income import crawl_high_income
    high_income_data = crawl_high_income()
    save_json(high_income_data, "be-high-income-occupations.json")
    print()

    print("=== Belgium Data Crawler Complete ===")
    print(f"End time: {datetime.now()}")

if __name__ == "__main__":
    crawl_all()
