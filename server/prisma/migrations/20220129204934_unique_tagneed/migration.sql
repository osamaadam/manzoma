/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Tagneed` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tagneed_name_key" ON "Tagneed"("name");
