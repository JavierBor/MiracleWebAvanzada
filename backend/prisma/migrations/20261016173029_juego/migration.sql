-- CreateTable
CREATE TABLE "Vocabulario" (
    "id" TEXT NOT NULL,
    "palabra" TEXT NOT NULL,
    "fonetica" TEXT,
    "audio_url" TEXT,
    "categoria_gramatical" TEXT NOT NULL,
    "definicion" TEXT NOT NULL,
    "definicion_en" TEXT,
    "fuente" TEXT NOT NULL DEFAULT 'Datamuse API',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultima_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vocabulario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vocabulario_palabra_key" ON "Vocabulario"("palabra");
