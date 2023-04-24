-- CreateTable
CREATE TABLE "Nugget" (
    "id" SERIAL NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT,
    "istypeof" "NuggetCategory" NOT NULL DEFAULT 'CONTENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "processingTime" TEXT NOT NULL DEFAULT '',
    "presenter" TEXT NOT NULL DEFAULT '',
    "mediatype" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Nugget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningUnit" (
    "id" SERIAL NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "processingTime" TEXT NOT NULL DEFAULT '',
    "Rating" TEXT NOT NULL DEFAULT '',
    "ContentCreator" TEXT NOT NULL DEFAULT '',
    "ContentProvider" TEXT NOT NULL DEFAULT '',
    "TargetAudience" TEXT NOT NULL DEFAULT '',
    "SemanticDensity" TEXT NOT NULL DEFAULT '',
    "SemanticGravity" TEXT NOT NULL DEFAULT '',
    "ContentTags" TEXT[],
    "ContextTags" TEXT[],
    "LinkToHelpMaterial" TEXT NOT NULL,

    CONSTRAINT "LearningUnit_pkey" PRIMARY KEY ("id")
);
