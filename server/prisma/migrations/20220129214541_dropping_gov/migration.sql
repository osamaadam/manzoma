/*
  Warnings:

  - You are about to drop the column `govId` on the `Soldier` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Soldier" (
    "name" TEXT NOT NULL,
    "militaryNo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nationalNo" INTEGER NOT NULL,
    "seglNo" INTEGER NOT NULL,
    "marhla" INTEGER NOT NULL,
    "qualificationId" INTEGER NOT NULL,
    "religionId" INTEGER NOT NULL,
    "centerId" INTEGER NOT NULL,
    "tagneedFactorId" INTEGER NOT NULL,
    "faselaId" INTEGER NOT NULL,
    CONSTRAINT "Soldier_qualificationId_fkey" FOREIGN KEY ("qualificationId") REFERENCES "Qualifaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Soldier_religionId_fkey" FOREIGN KEY ("religionId") REFERENCES "Religion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Soldier_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "Center" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Soldier_tagneedFactorId_fkey" FOREIGN KEY ("tagneedFactorId") REFERENCES "TagneedFactor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Soldier_faselaId_fkey" FOREIGN KEY ("faselaId") REFERENCES "Fasela" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Soldier" ("centerId", "faselaId", "marhla", "militaryNo", "name", "nationalNo", "qualificationId", "religionId", "seglNo", "tagneedFactorId") SELECT "centerId", "faselaId", "marhla", "militaryNo", "name", "nationalNo", "qualificationId", "religionId", "seglNo", "tagneedFactorId" FROM "Soldier";
DROP TABLE "Soldier";
ALTER TABLE "new_Soldier" RENAME TO "Soldier";
CREATE UNIQUE INDEX "Soldier_militaryNo_key" ON "Soldier"("militaryNo");
CREATE UNIQUE INDEX "Soldier_nationalNo_key" ON "Soldier"("nationalNo");
CREATE UNIQUE INDEX "Soldier_seglNo_marhla_key" ON "Soldier"("seglNo", "marhla");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
