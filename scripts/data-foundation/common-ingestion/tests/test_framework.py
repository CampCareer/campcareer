#!/usr/bin/env python3
"""10.7B Common Source Ingestion Framework v1 - module test suite.

Run from the repo root with:
    PYTHONPATH=scripts/data-foundation/common-ingestion \
        python3 -m unittest discover -s scripts/data-foundation/common-ingestion/tests

Covers: country normalization (UK->GB), checksums, source manifests,
11 validation rules, identity/duplicate queues, unknown->null, import safety,
and end-to-end candidate package builds from the fixtures.
"""

import hashlib
import json
import os
import shutil
import sys
import tempfile
import unittest

FIXTURES = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fixtures")

import checksum  # noqa: E402
import country  # noqa: E402
import identity  # noqa: E402
import manifest  # noqa: E402
import package  # noqa: E402
import schemas  # noqa: E402
import validation  # noqa: E402


class CountryCodeTests(unittest.TestCase):
    def test_canonical_codes(self):
        for code in ("AU", "CA", "IE", "GB", "US"):
            r = country.normalize_country_code(code)
            self.assertTrue(r["normalized"])
            self.assertTrue(r["canonical"])
            self.assertIsNone(r["alias_applied"])

    def test_uk_aliases_to_gb(self):
        r = country.normalize_country_code("UK")
        self.assertTrue(r["normalized"])
        self.assertEqual(r["normalized"], "GB")
        self.assertEqual(r["alias_applied"], "UK")
        self.assertFalse(r["canonical"])
        # raw input preserved for evidence
        self.assertEqual(r["input"], "UK")

    def test_lowercase_input(self):
        self.assertEqual(country.normalize_country_code("gb")["normalized"], "GB")

    def test_invalid_code(self):
        for bad in ("XXX", "1A", "G", "", None, 123):
            self.assertFalse(country.normalize_country_code(bad)["normalized"], bad)

    def test_valid_non_canonical_iso(self):
        r = country.normalize_country_code("FR")
        self.assertTrue(r["normalized"])
        self.assertFalse(r["canonical"])
        self.assertIsNone(r["alias_applied"])


class ChecksumTests(unittest.TestCase):
    def test_parse_checksum(self):
        ok = checksum.parse_checksum("sha256:" + "a" * 64)
        self.assertTrue(ok["well_formed"])
        self.assertEqual(ok["algorithm"], "sha256")
        self.assertFalse(checksum.parse_checksum("md5:abc")["well_formed"])
        self.assertFalse(checksum.parse_checksum("")["well_formed"])
        self.assertFalse(checksum.parse_checksum(None)["well_formed"])

    def test_sha256_file_roundtrip(self):
        with tempfile.NamedTemporaryFile("w", delete=False) as fh:
            fh.write("hello 10.7B\n")
            path = fh.name
        try:
            digest = checksum.sha256_file(path)
            expected = hashlib.sha256(b"hello 10.7B\n").hexdigest()
            self.assertEqual(digest, expected)
        finally:
            os.unlink(path)

    def test_write_and_verify(self):
        tmp = tempfile.mkdtemp()
        try:
            with open(os.path.join(tmp, "a.txt"), "w") as fh:
                fh.write("alpha\n")
            with open(os.path.join(tmp, "b.txt"), "w") as fh:
                fh.write("beta\n")
            count = checksum.write_checksums(tmp, "SHA256SUMS.txt")
            self.assertEqual(count, 2)
            result = checksum.verify_checksums(tmp, "SHA256SUMS.txt")
            self.assertTrue(result["ok"])
            self.assertEqual(result["checked"], 2)
            # tamper detection
            with open(os.path.join(tmp, "a.txt"), "w") as fh:
                fh.write("tampered\n")
            self.assertFalse(checksum.verify_checksums(tmp, "SHA256SUMS.txt")["ok"])
        finally:
            shutil.rmtree(tmp)


class ManifestTests(unittest.TestCase):
    def _load_fixture_sources(self, name):
        path = os.path.join(FIXTURES, name, "manifest.json")
        with open(path) as fh:
            data = json.load(fh)
        return data["sources"]

    def test_valid_manifest(self):
        src = self._load_fixture_sources("programme-ie")[0]
        r = manifest.validate_source_manifest(src)
        self.assertTrue(r["valid"])
        self.assertFalse(r["blocked"])
        self.assertEqual(r["warnings"], [])

    def test_t3_warns_but_not_blocks(self):
        src = self._load_fixture_sources("geography-gb")[1]
        r = manifest.validate_source_manifest(src)
        self.assertTrue(r["valid"])
        self.assertFalse(r["blocked"])
        self.assertTrue(any("must not be stored" in w for w in r["warnings"]))
        self.assertEqual(src["usage_restriction"], "no_redistribution_no_repackaging")

    def test_missing_required_field_fails(self):
        src = dict(self._load_fixture_sources("visa-au")[0])
        del src["official_url"]
        r = manifest.validate_source_manifest(src)
        self.assertFalse(r["valid"])
        self.assertTrue(r["blocked"])
        self.assertTrue(any("official_url" in f for f in r["failures"]))

    def test_uk_alias_country_fails(self):
        src = dict(self._load_fixture_sources("visa-au")[0])
        src["country_code"] = "UK"
        r = manifest.validate_source_manifest(src)
        self.assertFalse(r["valid"])
        self.assertTrue(any("alias" in f for f in r["failures"]))

    def test_bad_checksum_fails(self):
        src = dict(self._load_fixture_sources("visa-au")[0])
        src["checksum"] = "md5:deadbeef"
        r = manifest.validate_source_manifest(src)
        self.assertFalse(r["valid"])

    def test_non_canonical_country_warns(self):
        src = dict(self._load_fixture_sources("visa-au")[0])
        src["country_code"] = "NZ"
        r = manifest.validate_source_manifest(src)
        self.assertTrue(r["valid"])
        self.assertTrue(any("outside the five-country canonical set" in w
                            for w in r["warnings"]))

    def test_source_id_constraints(self):
        src = dict(self._load_fixture_sources("visa-au")[0])
        src["source_id"] = "bad:source:id"
        r = manifest.validate_source_manifest(src)
        self.assertFalse(r["valid"])

    def test_load_manifest_wrapper_and_single(self):
        kind, data = manifest.load_manifest(
            os.path.join(FIXTURES, "visa-au", "manifest.json"))
        self.assertEqual(kind, "sources")
        self.assertEqual(len(data["sources"]), 1)


class ValidationTests(unittest.TestCase):
    def _base_record(self, **overrides):
        rec = {
            "candidate_schema_version": "1.0.0",
            "data_domain": "geography",
            "source_id": "ons-countries-geography-v1",
            "source_record_key": "GB:country:001",
            "country_code": "GB",
            "observed_at": "2026-08-04T00:00:00Z",
            "retrieved_at": "2026-08-04T00:00:00Z",
            "reviewed_at": "2026-08-04T00:00:00Z",
            "parser_version": "1.0.0",
            "payload": {"capital": "London"},
            "evidence": {},
        }
        rec.update(overrides)
        return rec

    def _validate(self, rec, manifest_sources=None, dup_keys=()):
        return validation.validate_record(rec, manifest_sources, set(dup_keys), 0)

    def test_valid_record(self):
        _, res = self._validate(self._base_record())
        self.assertEqual(res["status"], "valid")
        self.assertEqual(res["failures"], {})

    def test_schema_missing_envelope_field(self):
        rec = self._base_record()
        del rec["retrieved_at"]
        _, res = self._validate(rec)
        self.assertEqual(res["status"], "invalid")
        self.assertIn("schema_valid", res["failures"])

    def test_required_fields_empty(self):
        rec = self._base_record(country_code="")
        _, res = self._validate(rec)
        self.assertIn("required_fields", res["failures"])

    def test_schema_version_mismatch(self):
        rec = self._base_record(candidate_schema_version="0.9.0")
        _, res = self._validate(rec)
        self.assertIn("required_fields", res["failures"])

    def test_uk_alias_on_raw_input_fails(self):
        rec = self._base_record(country_code="UK")
        _, res = self._validate(rec)
        self.assertIn("country_code_normalization", res["failures"])
        self.assertIn("must be normalized to canonical", res["failures"]
                      ["country_code_normalization"][0])

    def test_non_canonical_country_warns(self):
        rec = self._base_record(country_code="FR")
        _, res = self._validate(rec)
        self.assertEqual(res["status"], "valid_with_warnings")
        self.assertIn("country_code_normalization", res["warnings"])

    def test_invalid_date(self):
        rec = self._base_record(observed_at="04/08/2026")
        _, res = self._validate(rec)
        self.assertIn("date_valid", res["failures"])

    def test_source_lineage_undeclared(self):
        rec = self._base_record(source_id="nope")
        sources = {"ons-countries-geography-v1": {}}
        _, res = self._validate(rec, manifest_sources=sources)
        self.assertIn("source_lineage", res["failures"])

    def test_duplicate_source_key_fails(self):
        rec = self._base_record()
        _, res = self._validate(rec, dup_keys=[("ons-countries-geography-v1",
                                                "GB:country:001")])
        self.assertIn("duplicate_source_key", res["failures"])

    def test_arbitrary_uuid_candidate_id_fails(self):
        import uuid
        rec = self._base_record(candidate_id=str(uuid.uuid4()))
        _, res = self._validate(rec)
        self.assertIn("candidate_identity", res["failures"])

    def test_candidate_id_must_match_source_key(self):
        rec = self._base_record(candidate_id="something:else")
        _, res = self._validate(rec)
        self.assertIn("candidate_identity", res["failures"])

    def test_unknown_sentinel_fails(self):
        rec = self._base_record()
        rec["payload"]["area_km2"] = "not available"
        _, res = self._validate(rec)
        self.assertIn("null_unknown", res["failures"])

    def test_empty_string_payload_value_fails(self):
        rec = self._base_record()
        rec["payload"]["capital"] = ""
        _, res = self._validate(rec)
        self.assertIn("null_unknown", res["failures"])

    def test_import_status_not_candidate_only_blocks(self):
        rec = self._base_record(import_status="production_imported")
        _, res = self._validate(rec)
        self.assertEqual(res["status"], "blocked")
        self.assertIn("import_safety", res["failures"])

    def test_payload_claims_production_import_blocks(self):
        rec = self._base_record()
        rec["payload"]["production_imported"] = True
        _, res = self._validate(rec)
        self.assertEqual(res["status"], "blocked")

    def test_absent_import_status_is_allowed_pre_build(self):
        rec = self._base_record()
        rec.pop("import_status", None)
        _, res = self._validate(rec)
        self.assertEqual(res["status"], "valid")

    def test_aggregate_status_worst_wins(self):
        self.assertEqual(validation.aggregate_status(
            [{"status": "valid"}, {"status": "valid_with_warnings"}]),
            "valid_with_warnings")
        self.assertEqual(validation.aggregate_status(
            [{"status": "valid"}, {"status": "invalid"}]),
            "invalid")
        self.assertEqual(validation.aggregate_status(
            [{"status": "invalid"}, {"status": "blocked"}]),
            "blocked")

    def test_is_arbitrary_uuid(self):
        import uuid
        self.assertTrue(validation.is_arbitrary_uuid(str(uuid.uuid4())))
        self.assertFalse(validation.is_arbitrary_uuid(
            "ons-countries-geography-v1:GB:country:001"))


class NormalizeTests(unittest.TestCase):
    def test_uk_normalized_to_gb_with_evidence(self):
        rec = {
            "source_id": "ons-countries-geography-v1",
            "source_record_key": "UK:country:002",
            "country_code": "UK",
            "payload": {"capital": "London"},
            "evidence": {"raw_country_value": "UK"},
        }
        out = validation.normalize_record(rec, None)
        self.assertEqual(out["country_code"], "GB")
        self.assertEqual(out["candidate_id"], "ons-countries-geography-v1:UK:country:002")
        ev = out["evidence"]
        self.assertEqual(ev["raw_country_code"], "UK")
        self.assertEqual(ev["country_code_alias_applied"], "UK")
        self.assertTrue(ev["country_code_alias_normalized"])

    def test_unknown_sentinels_to_null(self):
        rec = {
            "source_id": "s1", "source_record_key": "k1", "country_code": "GB",
            "payload": {"a": "not available", "b": "unknown", "c": "",
                        "d": "London", "e": None},
        }
        out = validation.normalize_record(rec, None)
        self.assertIsNone(out["payload"]["a"])
        self.assertIsNone(out["payload"]["b"])
        self.assertIsNone(out["payload"]["c"])
        self.assertEqual(out["payload"]["d"], "London")
        self.assertIsNone(out["payload"]["e"])
        self.assertEqual(sorted(out["evidence"]["normalized_unknown_to_null"]),
                         ["a", "b", "c"])

    def test_no_zero_substitution(self):
        rec = {
            "source_id": "s1", "source_record_key": "k1", "country_code": "GB",
            "payload": {"area_km2": 0, "cap_population": 0},
        }
        out = validation.normalize_record(rec, None)
        self.assertEqual(out["payload"]["area_km2"], 0)

    def test_does_not_touch_dates(self):
        rec = {
            "source_id": "s1", "source_record_key": "k1", "country_code": "GB",
            "payload": {"established_at": "not available"},
        }
        out = validation.normalize_record(rec, None)
        self.assertIsNone(out["payload"]["established_at"])


class IdentityTests(unittest.TestCase):
    def _rec(self, source_key, source_id="s1"):
        return {"candidate_id": "%s:%s" % (source_id, source_key),
                "source_id": source_id, "source_record_key": source_key,
                "country_code": "GB", "data_domain": "geography",
                "payload": {"name": source_key}, "evidence": {}}

    def test_detect_duplicate_source_keys(self):
        records = [self._rec("k1"), self._rec("k2"), self._rec("k1")]
        groups, keys = identity.detect_duplicate_source_keys(records)
        self.assertEqual(len(groups), 1)
        self.assertEqual(sorted(groups[("s1", "k1")]), ["s1:k1", "s1:k1"])
        self.assertEqual(keys, {("s1", "k1")})

    def test_duplicate_review_queue_render(self):
        records = [self._rec("k1"), self._rec("k1")]
        groups, _ = identity.detect_duplicate_source_keys(records)
        csv_text = identity.render_duplicate_review_queue(records, groups)
        lines = csv_text.strip().splitlines()
        self.assertEqual(len(lines), 3)  # header + 2 members
        self.assertIn("pending_review", csv_text)
        self.assertIn("automatic deduplication is forbidden", csv_text)

    def test_unresolved_queue_render(self):
        records = [self._rec("k9", source_id="ghost")]
        sources = {"s1": {}}
        csv_text = identity.render_unresolved_identity_queue(records, sources)
        self.assertIn("ghost", csv_text)
        self.assertIn("pending_resolution", csv_text)


class PackageBuildTests(unittest.TestCase):
    def _build(self, fixture, domain, country, date="2026-08-03"):
        base = os.path.join(FIXTURES, fixture)
        out = tempfile.mkdtemp()
        pkg_dir = os.path.join(out, "pkg")
        result = package.build_package(
            os.path.join(base, "manifest.json"),
            os.path.join(base, "records.jsonl"),
            domain, country, date, pkg_dir)
        return pkg_dir, result

    def _files(self, pkg_dir):
        return set(os.listdir(pkg_dir))

    def test_programme_package_clean(self):
        pkg_dir, result = self._build("programme-ie", "programme", "IE")
        expected = {"source_manifest.json", "candidate_records.jsonl",
                    "validation_report.json", "duplicate_review_queue.csv",
                    "unresolved_identity_queue.csv", "package_manifest.json",
                    "SHA256SUMS.txt", "README.md"}
        self.assertEqual(self._files(pkg_dir), expected)
        self.assertEqual(result["overall_status"], "valid")
        self.assertEqual(result["candidate_count"], 3)
        report = json.load(open(os.path.join(pkg_dir, "validation_report.json")))
        self.assertEqual(report["record_counts"], {"valid": 3})
        self.assertEqual(report["fuzzy_match_count"], 0)
        self.assertEqual(report["arbitrary_uuid_count"], 0)
        self.assertEqual(report["production_database_writes"], 0)
        for rec in self._read_jsonl(os.path.join(pkg_dir, "candidate_records.jsonl")):
            self.assertEqual(rec["import_status"], "candidate_only")
            self.assertEqual(rec["validation_status"], "valid")
            self.assertIn("identity_status", rec)

    def test_geography_package_uk_unknown_duplicates(self):
        pkg_dir, result = self._build("geography-gb", "geography", "GB")
        self.assertEqual(result["overall_status"], "invalid")
        report = json.load(open(os.path.join(pkg_dir, "validation_report.json")))
        self.assertEqual(report["record_counts"], {"valid": 3, "invalid": 3})
        self.assertEqual(report["uk_input_count"], 1)
        self.assertEqual(report["uk_output_canonical_count"], 1)
        self.assertEqual(report["duplicate_review_count"], 2)
        self.assertEqual(report["unresolved_identity_count"], 1)
        self.assertEqual(report["uk_new_canonical_code_count"], 0)
        self.assertEqual(report["null_to_zero_conversion_count"], 0)

        records = self._read_jsonl(os.path.join(pkg_dir, "candidate_records.jsonl"))
        by_key = {r["source_record_key"]: r for r in records}
        # UK input became canonical GB, raw preserved
        uk_rec = by_key["UK:country:GB-002"]
        self.assertEqual(uk_rec["country_code"], "GB")
        self.assertEqual(uk_rec["evidence"]["raw_country_code"], "UK")
        self.assertEqual(uk_rec["evidence"]["country_code_alias_applied"], "UK")
        # unknown sentinels -> null
        scot = by_key["GB:country:002"]
        self.assertIsNone(scot["payload"]["area_km2"])
        self.assertIsNone(scot["payload"]["capital"])
        self.assertIsNone(scot["payload"]["unknown_marker"])
        self.assertIn("normalized_unknown_to_null", scot["evidence"])
        # no canonical 'UK' code anywhere
        self.assertFalse(any(r["country_code"] == "UK" for r in records))

        pm = json.load(open(os.path.join(pkg_dir, "package_manifest.json")))
        self.assertEqual(pm["import_status"], "candidate_only")
        self.assertEqual(pm["duplicate_group_count"], 1)
        self.assertEqual(pm["duplicate_review_count"], 2)
        self.assertEqual(pm["uk_input_records"], 1)
        self.assertEqual(pm["production_database_writes"], 0)

    def test_package_refuses_overwrite_without_force(self):
        base = os.path.join(FIXTURES, "visa-au")
        out = tempfile.mkdtemp()
        pkg_dir = os.path.join(out, "pkg")
        package.build_package(os.path.join(base, "manifest.json"),
                              os.path.join(base, "records.jsonl"),
                              "visa", "AU", "2026-08-03", pkg_dir)
        with self.assertRaises(FileExistsError):
            package.build_package(os.path.join(base, "manifest.json"),
                                  os.path.join(base, "records.jsonl"),
                                  "visa", "AU", "2026-08-03", pkg_dir)
        package.build_package(os.path.join(base, "manifest.json"),
                              os.path.join(base, "records.jsonl"),
                              "visa", "AU", "2026-08-03", pkg_dir, force=True)

    def test_visa_package_duplicate_flagged(self):
        pkg_dir, result = self._build("visa-au", "visa", "AU")
        report = json.load(open(os.path.join(pkg_dir, "validation_report.json")))
        self.assertEqual(report["duplicate_review_count"], 2)
        self.assertEqual(report["overall_status"], "invalid")
        records = self._read_jsonl(os.path.join(pkg_dir, "candidate_records.jsonl"))
        self.assertEqual(len(records), 4)

    def test_bad_checksum_blocks_package(self):
        base = os.path.join(FIXTURES, "programme-ie")
        manifest_path = os.path.join(base, "manifest.json")
        with open(manifest_path) as fh:
            data = json.load(fh)
        data["sources"][0]["checksum"] = "not-a-checksum"
        out = tempfile.mkdtemp()
        bad_manifest = os.path.join(out, "bad-manifest.json")
        with open(bad_manifest, "w") as fh:
            json.dump(data, fh)
        pkg_dir = os.path.join(out, "pkg")
        result = package.build_package(bad_manifest, os.path.join(base, "records.jsonl"),
                                       "programme", "IE", "2026-08-03", pkg_dir)
        self.assertEqual(result["overall_status"], "blocked")
        records = self._read_jsonl(os.path.join(pkg_dir, "candidate_records.jsonl"))
        self.assertTrue(all(r["validation_status"] == "blocked" for r in records))

    def test_checksum_file_integrity(self):
        pkg_dir, _ = self._build("programme-ie", "programme", "IE")
        result = checksum.verify_checksums(pkg_dir, "SHA256SUMS.txt")
        self.assertTrue(result["ok"])

    def test_sha256sums_parseable(self):
        pkg_dir, _ = self._build("programme-ie", "programme", "IE")
        with open(os.path.join(pkg_dir, "SHA256SUMS.txt")) as fh:
            for line in fh:
                parts = line.split()
                self.assertEqual(len(parts), 2, line)
                self.assertRegex(parts[0], r"^[0-9a-f]{64}$")

    def test_jsonl_and_csv_parseable(self):
        pkg_dir, _ = self._build("geography-gb", "geography", "GB")
        for rec in self._read_jsonl(os.path.join(pkg_dir, "candidate_records.jsonl")):
            self.assertIsInstance(rec, dict)
        import csv
        for name in ("duplicate_review_queue.csv", "unresolved_identity_queue.csv"):
            with open(os.path.join(pkg_dir, name)) as fh:
                rows = list(csv.DictReader(fh))
            self.assertTrue(rows)

    def _read_jsonl(self, path):
        with open(path) as fh:
            return [json.loads(line) for line in fh if line.strip()]


class PackageManifestNoForbiddenTests(unittest.TestCase):
    def test_no_forbidden_keys_in_built_records(self):
        base = os.path.join(FIXTURES, "geography-gb")
        out = tempfile.mkdtemp()
        package.build_package(os.path.join(base, "manifest.json"),
                              os.path.join(base, "records.jsonl"),
                              "geography", "GB", "2026-08-03",
                              os.path.join(out, "pkg"))
        with open(os.path.join(out, "pkg", "candidate_records.jsonl")) as fh:
            blob = fh.read()
        self.assertNotIn("canonical_uuid", blob)
        self.assertNotIn("production_imported", blob)
        self.assertNotIn("auto_merged", blob)
        self.assertNotIn("random", blob.lower())


if __name__ == "__main__":
    unittest.main()
