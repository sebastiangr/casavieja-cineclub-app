-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "poster_path" TEXT NOT NULL,
    "release_date" TEXT NOT NULL,
    "director" TEXT NOT NULL,
    "recommendedAt" TIMESTAMP(3) NOT NULL,
    "recommendedBy" TEXT NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,
    "hasVoted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_recommendedBy_fkey" FOREIGN KEY ("recommendedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
