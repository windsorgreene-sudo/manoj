-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "contentHinglish" TEXT,
ADD COLUMN     "excerptHinglish" TEXT;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "descriptionHinglish" TEXT,
ADD COLUMN     "outcomesHinglish" TEXT[],
ADD COLUMN     "subtitleHinglish" TEXT;

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "constraintsHinglish" TEXT,
ADD COLUMN     "editorialHinglish" TEXT,
ADD COLUMN     "hintsHinglish" TEXT[],
ADD COLUMN     "inputFormatHinglish" TEXT,
ADD COLUMN     "outputFormatHinglish" TEXT,
ADD COLUMN     "statementHinglish" TEXT;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "explanationHinglish" TEXT,
ADD COLUMN     "optionsHinglish" TEXT[],
ADD COLUMN     "promptHinglish" TEXT;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "descriptionHinglish" TEXT;

-- AlterTable
ALTER TABLE "TestCase" ADD COLUMN     "explanationHinglish" TEXT;

