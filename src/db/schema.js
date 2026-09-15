import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const matchStatus = pgEnum('match_status', ['live', 'schedule', 'finished']);

export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  sport: text('sport').notNull(),
  homeTeam: text('home_team').notNull(),
  awayTeam: text('away_team').notNull(),
  status: matchStatus('status').default('schedule').notNull(),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }),
  homeScore: integer('home_score').default(0).notNull(),
  awayScore: integer('away_score').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('matches_status_start_time_idx').on(table.status, table.startTime),
  check('matches_home_score_nonnegative', sql`${table.homeScore} >= 0`),
  check('matches_away_score_nonnegative', sql`${table.awayScore} >= 0`),
  check('matches_end_time_valid', sql`${table.endTime} >= ${table.startTime}`),
]);

export const commentary = pgTable('commentary', {
  id: serial('id').primaryKey(),
  matchId: integer('match_id').notNull().references(() => matches.id),
  // Optional for events outside timed play, such as pre-match announcements.
  minute: integer('minute'),
  // Assigned by the event producer and unique within each match.
  sequence: integer('sequence').notNull(),
  period: text('period'),
  eventType: text('event_type'),
  actor: text('actor'),
  team: text('team'),
  message: text('message').notNull(),
  metadata: json('metadata'),
  tags: text('tags').array().default(sql`'{}'::text[]`).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('commentary_match_id_sequence_idx').on(table.matchId, table.sequence),
  check('commentary_minute_nonnegative', sql`${table.minute} >= 0`),
  check('commentary_sequence_nonnegative', sql`${table.sequence} >= 0`),
]);
