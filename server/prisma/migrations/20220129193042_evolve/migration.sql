-- CreateTable
CREATE TABLE "Tagneed" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Gov" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "tagneedId" INTEGER NOT NULL,
    CONSTRAINT "Gov_tagneedId_fkey" FOREIGN KEY ("tagneedId") REFERENCES "Tagneed" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Qualifaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Religion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Center" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "govId" INTEGER NOT NULL,
    CONSTRAINT "Center_govId_fkey" FOREIGN KEY ("govId") REFERENCES "Gov" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TagneedFactor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Sarya" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Fasela" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "saryaId" INTEGER NOT NULL,
    CONSTRAINT "Fasela_saryaId_fkey" FOREIGN KEY ("saryaId") REFERENCES "Sarya" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Soldier" (
    "militaryNo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nationalNo" INTEGER NOT NULL,
    "seglNo" INTEGER NOT NULL,
    "marhla" INTEGER NOT NULL,
    "govId" INTEGER NOT NULL,
    "qualificationId" INTEGER NOT NULL,
    "religionId" INTEGER NOT NULL,
    "centerId" INTEGER NOT NULL,
    "tagneedFactorId" INTEGER NOT NULL,
    "faselaId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Soldier_govId_fkey" FOREIGN KEY ("govId") REFERENCES "Gov" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Soldier_qualificationId_fkey" FOREIGN KEY ("qualificationId") REFERENCES "Qualifaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Soldier_religionId_fkey" FOREIGN KEY ("religionId") REFERENCES "Religion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Soldier_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "Center" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Soldier_tagneedFactorId_fkey" FOREIGN KEY ("tagneedFactorId") REFERENCES "TagneedFactor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Soldier_faselaId_fkey" FOREIGN KEY ("faselaId") REFERENCES "Fasela" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Soldier_militaryNo_key" ON "Soldier"("militaryNo");

-- CreateIndex
CREATE UNIQUE INDEX "Soldier_nationalNo_key" ON "Soldier"("nationalNo");

-- CreateIndex
CREATE UNIQUE INDEX "Soldier_seglNo_marhla_key" ON "Soldier"("seglNo", "marhla");
