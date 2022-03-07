/*
  Warnings:

  - You are about to drop the `TawzeaHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `DateReceived` on the `ReceivedTawzea` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TawzeaHistory";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Tawzea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "militaryNo" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "pageNo" INTEGER NOT NULL,
    "receivedTawzeaId" INTEGER NOT NULL,
    "specializationId" INTEGER NOT NULL,
    CONSTRAINT "Tawzea_militaryNo_fkey" FOREIGN KEY ("militaryNo") REFERENCES "Soldier" ("militaryNo") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tawzea_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tawzea_receivedTawzeaId_fkey" FOREIGN KEY ("receivedTawzeaId") REFERENCES "ReceivedTawzea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tawzea_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReceivedTawzea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "displayName" TEXT NOT NULL,
    "numOfPages" INTEGER NOT NULL,
    "dateReceived" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_ReceivedTawzea" ("displayName", "id", "numOfPages") SELECT "displayName", "id", "numOfPages" FROM "ReceivedTawzea";
DROP TABLE "ReceivedTawzea";
ALTER TABLE "new_ReceivedTawzea" RENAME TO "ReceivedTawzea";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Tawzea_militaryNo_key" ON "Tawzea"("militaryNo");
