BEGIN;

DROP TABLE IF EXISTS "card_has_label", "card", "list", "label";

CREATE TABLE "list" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" TEXT NOT NULL,
  "position" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP
);

CREATE TABLE "card" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "text" TEXT NOT NULL,
  "position" INTEGER NOT NULL DEFAULT 0,
  "color" TEXT,
  "list_id" INTEGER NOT NULL REFERENCES "list"("id"),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP
);

CREATE TABLE "label" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "color" TEXT NOT NULL DEFAULT '#CCC',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP
);

CREATE TABLE "card_has_label" (
  "card_id" INTEGER NOT NULL REFERENCES "card"("id") ON DELETE CASCADE,
  "label_id" INTEGER NOT NULL REFERENCES "label"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP,
  PRIMARY KEY ("card_id", "label_id")
);

-- SEEDING

INSERT INTO "list" ("name") VALUES 
    ('À faire'),
    ('En cours'),
    ('Terminé');

INSERT INTO "card" ("text", "color", "list_id") VALUES
    ('Coder le front', NULL , 1 ),
    ('Choisir sa spé', '#ff0000' , 1 ),
    ('Coder l''api', '#bada55' , 1 ),
    ('Conception et MCD', '#000000' , 3 );

INSERT INTO "label" ("name", "color") VALUES
    ('Urgent', '#f00'),
    ('sprint 1', '#07c58f');

INSERT INTO "card_has_label" ("card_id", "label_id") VALUES
    (3,1),
    (4,2),
    (3,2);

COMMIT;