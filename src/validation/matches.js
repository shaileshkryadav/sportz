import { z } from "zod";

export { MATCH_STATUS } from "../utils/match-status.js";

export const listMatchesQuerySchema = z.object({
    limit: z.coerce.number().int().positive().max(100).optional(),
});

// Require ISO timestamps with UTC (Z) or an explicit timezone offset.
function isValidIsoDate(value) {
    return z.iso.datetime({ offset: true }).safeParse(value).success
        && Number.isFinite(Date.parse(value));
}

export const createMatchSchema = z.object({
    sport: z.string().trim().min(1),
    homeTeam: z.string().trim().min(1),
    awayTeam: z.string().trim().min(1),
    startTime: z.string().refine(isValidIsoDate, {
        message: "startTime must be a valid ISO date string",
    }),
    endTime: z.string().refine(isValidIsoDate, {
        message: "endTime must be a valid ISO date string",
    }),
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
}).refine((match) => {
    // Field refinements report invalid dates separately.
    if (!isValidIsoDate(match.startTime) || !isValidIsoDate(match.endTime)) {
        return true;
    }
    return Date.parse(match.endTime) > Date.parse(match.startTime);
}, {
    message: "endTime must be after startTime",
    path: ["endTime"],
});

export const updateScoreSchema = z.object({
    homeScore: z.coerce.number().int().nonnegative(),
    awayScore: z.coerce.number().int().nonnegative(),
});
