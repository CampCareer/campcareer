-- The CRICOS source sync is complete. Keep outbound HTTP disabled in the database;
-- future refreshes should be executed by the repository ingestion tooling.
drop extension if exists http;
