-- DropForeignKey
ALTER TABLE "Screener" DROP CONSTRAINT "Screener_userId_fkey";

-- AlterTable
ALTER TABLE "Screener" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Screener" ADD CONSTRAINT "Screener_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
