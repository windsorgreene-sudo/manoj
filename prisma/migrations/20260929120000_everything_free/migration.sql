-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_couponId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_planId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "isPro",
DROP COLUMN "priceInr";

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "isPremium";

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "isPro";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "isPro";

-- DropTable
DROP TABLE "Coupon";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "Plan";

-- DropTable
DROP TABLE "Subscription";

-- DropEnum
DROP TYPE "BillingInterval";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "SubscriptionStatus";

