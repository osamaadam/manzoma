/*
  Warnings:

  - Added the required column `marhla` to the `ReceivedTawzea` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReceivedTawzea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "marhla" INTEGER NOT NULL,
    "displayName" TEXT NOT NULL,
    "numOfPages" INTEGER NOT NULL,
    "dateReceived" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_ReceivedTawzea" ("dateReceived", "displayName", "id", "numOfPages") SELECT "dateReceived", "displayName", "id", "numOfPages" FROM "ReceivedTawzea";
DROP TABLE "ReceivedTawzea";
ALTER TABLE "new_ReceivedTawzea" RENAME TO "ReceivedTawzea";
CREATE TABLE "new_Tawzea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "militaryNo" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "pageNo" INTEGER NOT NULL,
    "receivedTawzeaId" INTEGER NOT NULL,
    "specializationId" INTEGER,
    CONSTRAINT "Tawzea_militaryNo_fkey" FOREIGN KEY ("militaryNo") REFERENCES "Soldier" ("militaryNo") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tawzea_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tawzea_receivedTawzeaId_fkey" FOREIGN KEY ("receivedTawzeaId") REFERENCES "ReceivedTawzea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tawzea_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Tawzea" ("id", "militaryNo", "pageNo", "receivedTawzeaId", "specializationId", "unitId") SELECT "id", "militaryNo", "pageNo", "receivedTawzeaId", "specializationId", "unitId" FROM "Tawzea";
DROP TABLE "Tawzea";
ALTER TABLE "new_Tawzea" RENAME TO "Tawzea";
CREATE UNIQUE INDEX "Tawzea_militaryNo_key" ON "Tawzea"("militaryNo");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
