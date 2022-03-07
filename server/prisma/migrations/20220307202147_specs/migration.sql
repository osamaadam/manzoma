-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Specialization" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "weaponId" INTEGER,
    CONSTRAINT "Specialization_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "Weapon" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Specialization" ("id", "name") SELECT "id", "name" FROM "Specialization";
DROP TABLE "Specialization";
ALTER TABLE "new_Specialization" RENAME TO "Specialization";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
