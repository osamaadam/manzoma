-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

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
CREATE TABLE "Qualification" (
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
    "name" TEXT NOT NULL,
    "militaryNo" TEXT NOT NULL PRIMARY KEY,
    "nationalNo" TEXT NOT NULL,
    "seglNo" INTEGER NOT NULL,
    "marhla" INTEGER NOT NULL,
    "registerationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "qualificationId" INTEGER NOT NULL,
    "religionId" INTEGER NOT NULL,
    "centerId" INTEGER NOT NULL,
    "tagneedFactorId" INTEGER NOT NULL,
    "faselaId" INTEGER,
    "statusId" INTEGER,
    "rankId" INTEGER,
    "address" TEXT,
    "predefinedEtgahId" INTEGER NOT NULL,
    CONSTRAINT "Soldier_qualificationId_fkey" FOREIGN KEY ("qualificationId") REFERENCES "Qualification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Soldier_religionId_fkey" FOREIGN KEY ("religionId") REFERENCES "Religion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Soldier_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "Center" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Soldier_tagneedFactorId_fkey" FOREIGN KEY ("tagneedFactorId") REFERENCES "TagneedFactor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Soldier_faselaId_fkey" FOREIGN KEY ("faselaId") REFERENCES "Fasela" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Soldier_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Soldier_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "Rank" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Soldier_predefinedEtgahId_fkey" FOREIGN KEY ("predefinedEtgahId") REFERENCES "Etgah" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rank" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Status" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MilitaryEntity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "centerId" INTEGER,
    CONSTRAINT "MilitaryEntity_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "Center" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Weapon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Etgah" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "parentId" INTEGER,
    "militaryEntityId" INTEGER,
    "weaponId" INTEGER,
    "etgahId" INTEGER NOT NULL,
    CONSTRAINT "Unit_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Unit" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Unit_militaryEntityId_fkey" FOREIGN KEY ("militaryEntityId") REFERENCES "MilitaryEntity" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Unit_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "Weapon" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Unit_etgahId_fkey" FOREIGN KEY ("etgahId") REFERENCES "Etgah" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TawzeaHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "militaryNo" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "pageNo" INTEGER NOT NULL,
    "receivedTawzeaId" INTEGER NOT NULL,
    "specializationId" INTEGER NOT NULL,
    CONSTRAINT "TawzeaHistory_militaryNo_fkey" FOREIGN KEY ("militaryNo") REFERENCES "Soldier" ("militaryNo") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TawzeaHistory_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TawzeaHistory_receivedTawzeaId_fkey" FOREIGN KEY ("receivedTawzeaId") REFERENCES "ReceivedTawzea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TawzeaHistory_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Specialization" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ReceivedTawzea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "displayName" TEXT NOT NULL,
    "numOfPages" INTEGER NOT NULL,
    "DateReceived" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Tarheal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "militaryNo" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Tarheal_militaryNo_fkey" FOREIGN KEY ("militaryNo") REFERENCES "Soldier" ("militaryNo") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tarheal_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Tagneed_name_key" ON "Tagneed"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Sarya_name_key" ON "Sarya"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Soldier_militaryNo_key" ON "Soldier"("militaryNo");

-- CreateIndex
CREATE UNIQUE INDEX "Soldier_nationalNo_key" ON "Soldier"("nationalNo");

-- CreateIndex
CREATE UNIQUE INDEX "Soldier_seglNo_marhla_key" ON "Soldier"("seglNo", "marhla");

-- CreateIndex
CREATE UNIQUE INDEX "Rank_name_key" ON "Rank"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Status_name_key" ON "Status"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Etgah_name_key" ON "Etgah"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tarheal_militaryNo_key" ON "Tarheal"("militaryNo");
