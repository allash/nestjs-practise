CREATE TABLE "user" (
  "id"                      UUID                  NOT NULL,
  "email"                   TEXT                  NOT NULL,
  "first_name"              TEXT                  NOT NULL,
  "last_name"               TEXT                  NOT NULL,
  "password"                TEXT                  NOT NULL,
  "created_at"              TIMESTAMP             NOT NULL,
  "updated_at"              TIMESTAMP
);

ALTER TABLE "user"
  ADD CONSTRAINT "uq_email" UNIQUE ("email");

INSERT INTO "user" ("id", "email", "first_name", "last_name", "password", "created_at") VALUES 
  ('2625860e-aed1-11e9-a2a3-2a2ae2dbcce4', 'demo@mail.com', 'demo', 'demo', '12345', now());