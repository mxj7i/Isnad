CREATE EXTENSION IF NOT EXISTS vector;--> statement-breakpoint
CREATE TYPE "public"."content_level" AS ENUM('A', 'B', 'C', 'D');--> statement-breakpoint
CREATE TYPE "public"."content_type" AS ENUM('quran', 'hadith', 'fiqh', 'aqeedah', 'dawa', 'terminology');--> statement-breakpoint
CREATE TYPE "public"."evidence_strength" AS ENUM('established', 'interpretive', 'disputed', 'insufficient');--> statement-breakpoint
CREATE TABLE "chunks" (
	"id" text PRIMARY KEY NOT NULL,
	"document_id" text NOT NULL,
	"original_text" text NOT NULL,
	"chunk_number" integer NOT NULL,
	CONSTRAINT "chunks_document_chunk_number_unique" UNIQUE("document_id","chunk_number"),
	CONSTRAINT "chunks_original_text_not_empty" CHECK (length(btrim("chunks"."original_text")) > 0),
	CONSTRAINT "chunks_chunk_number_nonnegative" CHECK ("chunks"."chunk_number" >= 0)
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" text PRIMARY KEY NOT NULL,
	"source_id" text NOT NULL,
	"title" text NOT NULL,
	"language" text NOT NULL,
	"content_type" "content_type" NOT NULL,
	"content_level" "content_level"
);
--> statement-breakpoint
CREATE TABLE "evidence" (
	"id" text PRIMARY KEY NOT NULL,
	"chunk_id" text NOT NULL,
	"evidence_status" "evidence_strength" NOT NULL,
	"disputed" boolean DEFAULT false NOT NULL,
	"hadith_grade" text,
	"verification_notes" text,
	"source_verified" boolean DEFAULT false NOT NULL,
	"text_verified" boolean DEFAULT false NOT NULL,
	CONSTRAINT "evidence_chunk_id_unique" UNIQUE("chunk_id")
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"institution" text,
	"author" text,
	"url" text,
	"retrieved_at" date NOT NULL,
	"verified" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chunks" ADD CONSTRAINT "chunks_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_chunk_id_chunks_id_fk" FOREIGN KEY ("chunk_id") REFERENCES "public"."chunks"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "chunks_document_id_idx" ON "chunks" USING btree ("document_id");--> statement-breakpoint
CREATE INDEX "documents_source_id_idx" ON "documents" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "evidence_chunk_id_idx" ON "evidence" USING btree ("chunk_id");