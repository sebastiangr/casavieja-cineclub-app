/*
  Warnings:

  - Added the required column `tmdb_id` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "tmdb_id" TEXT NOT NULL;
