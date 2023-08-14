-- AlterTable
ALTER TABLE "Screener" ADD COLUMN     "ip" TEXT;

-- CreateIndex
CREATE INDEX "Screener_ip_idx" ON "Screener"("ip");
