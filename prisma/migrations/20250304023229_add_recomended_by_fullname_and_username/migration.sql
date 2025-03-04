/*
  Warnings:

  - Added the required column `recommendedByFullName` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendedByUsername` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "recommendedByFullName" TEXT NOT NULL,
ADD COLUMN     "recommendedByUsername" TEXT NOT NULL;
