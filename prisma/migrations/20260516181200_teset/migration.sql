-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Form" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '[]',
    "visits" INTEGER NOT NULL DEFAULT 0,
    "submissions" INTEGER NOT NULL DEFAULT 0,
    "shareURL" TEXT NOT NULL
);
INSERT INTO "new_Form" ("content", "createdAt", "description", "id", "name", "published", "shareURL", "submissions", "userId", "visits") SELECT "content", "createdAt", "description", "id", "name", "published", "shareURL", "submissions", "userId", "visits" FROM "Form";
DROP TABLE "Form";
ALTER TABLE "new_Form" RENAME TO "Form";
CREATE UNIQUE INDEX "Form_shareURL_key" ON "Form"("shareURL");
CREATE INDEX "Form_userId_idx" ON "Form"("userId");
CREATE UNIQUE INDEX "Form_name_userId_key" ON "Form"("name", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
