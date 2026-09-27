/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ESTUDIANTE', 'ADMIN');

-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('ACTIVO', 'ADVERTIDO', 'RESTRINGIDO');

-- CreateEnum
CREATE TYPE "NivelJuego" AS ENUM ('ING_I', 'ING_II', 'ING_III', 'ING_IV');

-- CreateEnum
CREATE TYPE "EstadoPublicacion" AS ENUM ('ACTIVA', 'REPORTADA', 'OCULTA');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena_hash" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL DEFAULT 'ESTUDIANTE',
    "estado" "EstadoUsuario" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restriccion" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "nota_admin" TEXT,

    CONSTRAINT "Restriccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Juego" (
    "id" TEXT NOT NULL,
    "nivel" "NivelJuego" NOT NULL,
    "categoria" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Juego_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InteraccionEstudiante" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "juegoId" TEXT NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "errores_comunes" JSONB,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InteraccionEstudiante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicacionForo" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "estado" "EstadoPublicacion" NOT NULL DEFAULT 'ACTIVA',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicacionForo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- AddForeignKey
ALTER TABLE "Restriccion" ADD CONSTRAINT "Restriccion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteraccionEstudiante" ADD CONSTRAINT "InteraccionEstudiante_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteraccionEstudiante" ADD CONSTRAINT "InteraccionEstudiante_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicacionForo" ADD CONSTRAINT "PublicacionForo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
