-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "image" TEXT,
ALTER COLUMN "text" DROP NOT NULL;
