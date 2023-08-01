-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL,
    "sub" TEXT NOT NULL,
    "data" JSONB,
    "stripeAccountId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Screener" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "screenerData" JSONB NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Screener_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_sub_key" ON "User"("sub");

-- AddForeignKey
ALTER TABLE "Screener" ADD CONSTRAINT "Screener_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
