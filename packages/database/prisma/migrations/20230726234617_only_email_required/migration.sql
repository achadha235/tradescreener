-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "nickname" DROP NOT NULL,
ALTER COLUMN "picture" DROP NOT NULL,
ALTER COLUMN "email_verified" SET DEFAULT false,
ALTER COLUMN "sub" DROP NOT NULL;
