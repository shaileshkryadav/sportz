CREATE TYPE "public"."match_status" AS ENUM('live', 'schedule', 'finished');--> statement-breakpoint
CREATE TABLE "commentary" (
	"id" serial PRIMARY KEY NOT NULL,
	"match_id" integer NOT NULL,
	"minute" integer,
	"sequence" integer NOT NULL,
	"period" text,
	"event_type" text,
	"actor" text,
	"team" text,
	"message" text NOT NULL,
	"metadata" json,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "commentary_minute_nonnegative" CHECK ("commentary"."minute" >= 0),
	CONSTRAINT "commentary_sequence_nonnegative" CHECK ("commentary"."sequence" >= 0)
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" serial PRIMARY KEY NOT NULL,
	"sport" text NOT NULL,
	"home_team" text NOT NULL,
	"away_team" text NOT NULL,
	"status" "match_status" DEFAULT 'schedule' NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone,
	"home_score" integer DEFAULT 0 NOT NULL,
	"away_score" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "matches_home_score_nonnegative" CHECK ("matches"."home_score" >= 0),
	CONSTRAINT "matches_away_score_nonnegative" CHECK ("matches"."away_score" >= 0),
	CONSTRAINT "matches_end_time_valid" CHECK ("matches"."end_time" >= "matches"."start_time")
);
--> statement-breakpoint
ALTER TABLE "commentary" ADD CONSTRAINT "commentary_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "commentary_match_id_sequence_idx" ON "commentary" USING btree ("match_id","sequence");--> statement-breakpoint
CREATE INDEX "matches_status_start_time_idx" ON "matches" USING btree ("status","start_time");