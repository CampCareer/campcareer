"""10.9A AU Geography Controlled Import Tool v1 — DB adapter.

Provides strict read-only PostgreSQL access via psql subprocess.
No write commands are permitted at any layer.
"""

import os
import subprocess
from pathlib import Path
from typing import Any

FORBIDDEN_SQL_COMMANDS = (
    "INSERT", "UPDATE", "DELETE", "MERGE", "TRUNCATE",
    "ALTER", "DROP", "CREATE", "GRANT", "REVOKE",
    "VACUUM", "ANALYZE",
)


class ReadOnlyDBAdapter:
    """Strict read-only database adapter using psql subprocess."""

    def __init__(self, database_url: str):
        if not database_url:
            raise ValueError("SUPABASE_DB_URL must be set for DB inspection")
        self.database_url = database_url
        self._query_log: list[dict[str, str]] = []
        self._read_only_active = False

    def connect(self):
        """Verify read-only transaction can be started."""
        # Test a simple read-only query to verify connection
        result = self.execute("SELECT 1 AS test;")
        if not result or result[0].get("test") != "1":
            raise RuntimeError("Read-only verification query failed")
        self._read_only_active = True

    def _validate_sql(self, sql: str):
        upper = sql.strip().upper()
        for cmd in FORBIDDEN_SQL_COMMANDS:
            if upper.startswith(cmd + " ") or upper.startswith(cmd + "\n") or upper == cmd:
                raise PermissionError(
                    f"10.9A is read-only: SQL write command '{cmd}' is forbidden"
                )

    def execute(self, sql: str, params: tuple = ()) -> list[dict[str, Any]]:
        """Execute a read-only SQL query and return rows as list of dicts."""
        self._validate_sql(sql)
        # Wrap in read-only transaction
        wrapped_sql = f"BEGIN TRANSACTION READ ONLY;\n{sql}\nCOMMIT;"
        self._query_log.append({"query": sql.strip()[:200]})
        return self._execute_subprocess(wrapped_sql)

    def _execute_subprocess(self, sql: str) -> list[dict[str, Any]]:
        # Use -A (unaligned) without -t to get column headers
        cmd = [
            "psql", self.database_url,
            "-A", "-F", "\t",
            "-c", sql,
        ]
        result = subprocess.run(
            cmd, capture_output=True, text=True, timeout=60,
        )
        if result.returncode != 0:
            error_msg = result.stderr.strip()
            if "authentication" in error_msg.lower() or "password" in error_msg.lower():
                error_msg = "DB connection/authentication error (credentials redacted)"
            raise RuntimeError(f"psql query failed: {error_msg}")
        stdout = result.stdout.strip()
        if not stdout:
            return []
        lines = stdout.split("\n")
        # Filter out transaction control noise and row count footers
        data_lines = [
            l for l in lines
            if l.strip() not in ("BEGIN", "COMMIT", "ROLLBACK")
            and not l.strip().startswith("(")
            and l.strip() != ""
        ]
        if not data_lines:
            return []
        cols = [c.strip() for c in data_lines[0].split("\t")]
        rows = []
        for line in data_lines[1:]:
            vals = line.split("\t")
            rows.append(dict(zip(cols, vals)))
        return rows

    @property
    def query_log(self) -> list[dict[str, str]]:
        return list(self._query_log)

    def close(self):
        try:
            self.execute("COMMIT;")
        except Exception:
            pass
        self._read_only_active = False
