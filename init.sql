-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');

-- CreateEnum
CREATE TYPE "public"."LiveUpdatePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."ChatRole" AS ENUM ('USER', 'ASSISTANT');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'TEACHER',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."news" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "imageUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contentEn" TEXT,
    "excerptEn" TEXT,
    "titleEn" TEXT,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."live_updates" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "priority" "public"."LiveUpdatePriority" NOT NULL DEFAULT 'MEDIUM',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contentEn" TEXT,
    "titleEn" TEXT,

    CONSTRAINT "live_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."featured_resources" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "linkUrl" TEXT,
    "category" TEXT NOT NULL,
    "bgColor" TEXT NOT NULL DEFAULT 'bg-gradient-to-br from-blue-500 to-purple-600',
    "order" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryEn" TEXT,
    "descriptionEn" TEXT,
    "titleEn" TEXT,

    CONSTRAINT "featured_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."alumni" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "achievements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "achievementsEn" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "descriptionEn" TEXT,
    "nameEn" TEXT,
    "positionEn" TEXT,

    CONSTRAINT "alumni_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."hero_content" (
    "id" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "titlePrefix" TEXT NOT NULL DEFAULT 'YZU',
    "titleMain" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "backgroundImage" TEXT,
    "gradientFrom" TEXT NOT NULL DEFAULT 'amber-600',
    "gradientTo" TEXT NOT NULL DEFAULT 'white',
    "glassEffect" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."annual_reports" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "annual_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."rankings" (
    "id" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "logoUrl" TEXT,
    "logoAlt" TEXT,
    "organization" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryEn" TEXT,
    "descriptionEn" TEXT,
    "organizationEn" TEXT,
    "subtitleEn" TEXT,

    CONSTRAINT "rankings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."worldmap_stats" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "schools" INTEGER NOT NULL DEFAULT 10,
    "students" INTEGER NOT NULL DEFAULT 925,
    "countries" INTEGER NOT NULL DEFAULT 8,
    "continents" INTEGER NOT NULL DEFAULT 4,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "worldmap_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."partner_schools" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "students" INTEGER NOT NULL DEFAULT 0,
    "flag" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nameEn" TEXT,

    CONSTRAINT "partner_schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat_conversations" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT,
    "userId" TEXT,
    "title" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat_messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "public"."ChatRole" NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."teacher_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "category" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."teacher_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bio" TEXT,
    "avatar" TEXT,
    "coverImage" TEXT,
    "socialLinks" JSONB,
    "showContact" BOOLEAN NOT NULL DEFAULT true,
    "showResearch" BOOLEAN NOT NULL DEFAULT true,
    "showPosts" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT,
    "phone" TEXT,
    "office" TEXT,
    "researchAreas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stats_content" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "descriptionPart1En" TEXT NOT NULL DEFAULT 'To help students connect with the international workplace, we actively build an international environment with over 10% international students and growing.',
    "descriptionPart1Zh" TEXT NOT NULL DEFAULT '為幫助學生銜接國際職場，我們積極建構國際化環境，國際學生比例超過10%，並持續成長。',
    "descriptionPart2En" TEXT NOT NULL DEFAULT 'We actively establish partnerships with overseas schools in Europe, America, Asia, and mainland China, expanding dual degrees, bridging degrees, and exchange student programs.',
    "descriptionPart2Zh" TEXT NOT NULL DEFAULT '與歐美、亞洲及大陸地區的海外學校積極建立合作關係，擴展雙聯學位、銜接學位及交換學生等，',
    "descriptionPart3En" TEXT NOT NULL DEFAULT 'Currently we have partnerships with over 100 international schools, including prestigious institutions like University of Michigan, University of Minnesota, University of Essex, Nottingham Trent University, ESC Rennes Business School, Pforzheim University, and University of Queensland.',
    "descriptionPart3Zh" TEXT NOT NULL DEFAULT '目前已擁有超過100所以上的國外合作學校，知名學校包含:美國密西根大學、美國明尼蘇達大學、英國艾賽克斯大學、英國諾丁漢特倫特大學、法國雷恩商學院、德國佛茨海姆大學及澳洲昆士蘭大學等，',
    "descriptionPart4En" TEXT NOT NULL DEFAULT 'Spanning nearly 30 countries worldwide, with over a thousand students having international exchange experience.',
    "descriptionPart4Zh" TEXT NOT NULL DEFAULT '遍佈全球近30個國家，多達千位以上學生具備國外交流經驗。',
    "stat1En" TEXT NOT NULL DEFAULT 'Only English Benchmark College in Northern Taiwan',
    "stat1Zh" TEXT NOT NULL DEFAULT '北台灣唯一英語標竿學院',
    "stat2En" TEXT NOT NULL DEFAULT 'Most Popular EMBA by Enterprises',
    "stat2Zh" TEXT NOT NULL DEFAULT '企業最愛EMBA',
    "stat3En" TEXT NOT NULL DEFAULT 'Featured Highlight',
    "stat3Zh" TEXT NOT NULL DEFAULT '隨意highlight',
    "stat4En" TEXT NOT NULL DEFAULT 'Featured Highlight',
    "stat4Zh" TEXT NOT NULL DEFAULT '隨意highlight',
    "titleEn" TEXT NOT NULL DEFAULT 'Global Business Education Leader',
    "titleZh" TEXT NOT NULL DEFAULT '國際化商管教育領航者',

    CONSTRAINT "stats_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."youtube_videos" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT,
    "videoId" TEXT,
    "thumbnail" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "descriptionEn" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "youtube_videos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "hero_content_locale_key" ON "public"."hero_content"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "annual_reports_year_key" ON "public"."annual_reports"("year");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_posts_slug_key" ON "public"."teacher_posts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_profiles_userId_key" ON "public"."teacher_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_profiles_slug_key" ON "public"."teacher_profiles"("slug");

-- AddForeignKey
ALTER TABLE "public"."news" ADD CONSTRAINT "news_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."live_updates" ADD CONSTRAINT "live_updates_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."alumni" ADD CONSTRAINT "alumni_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."annual_reports" ADD CONSTRAINT "annual_reports_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rankings" ADD CONSTRAINT "rankings_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."partner_schools" ADD CONSTRAINT "partner_schools_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat_conversations" ADD CONSTRAINT "chat_conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat_messages" ADD CONSTRAINT "chat_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."chat_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teacher_posts" ADD CONSTRAINT "teacher_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teacher_profiles" ADD CONSTRAINT "teacher_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."youtube_videos" ADD CONSTRAINT "youtube_videos_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

