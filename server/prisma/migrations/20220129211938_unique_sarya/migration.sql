/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Sarya` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Sarya_name_key" ON "Sarya"("name");
