export const MATCH_STATUS = Object.freeze({
    SCHEDULED: "schedule",
    LIVE: "live",
    FINISHED: "finished",
});

function toTimestamp(value, fieldName) {
    if (!(value instanceof Date) && (typeof value !== "string" || !value.trim())) {
        throw new TypeError(`${fieldName} must be a Date or a valid date string`);
    }

    const timestamp = value instanceof Date ? value.getTime() : Date.parse(value);
    if (!Number.isFinite(timestamp)) {
        throw new TypeError(`${fieldName} must be a Date or a valid date string`);
    }
    return timestamp;
}

/**
 * Derive a match's status from its time window, without changing the database.
 * This is a time-based estimate; delays and early finishes require actual event times.
 * @param {Date|string} startTime
 * @param {Date|string|null|undefined} endTime
 * @param {Date|string} [now] Optional reference time for deterministic checks.
 * @returns {"schedule"|"live"|"finished"}
 */
export function getMatchStatus(startTime, endTime, now = new Date()) {
    const startTimestamp = toTimestamp(startTime, "startTime");
    const endTimestamp = endTime == null ? null : toTimestamp(endTime, "endTime");
    const nowTimestamp = toTimestamp(now, "now");

    if (endTimestamp !== null && endTimestamp <= startTimestamp) {
        throw new RangeError("endTime must be after startTime");
    }

    if (nowTimestamp < startTimestamp) {
        return MATCH_STATUS.SCHEDULED;
    }
    if (endTimestamp !== null && nowTimestamp >= endTimestamp) {
        return MATCH_STATUS.FINISHED;
    }
    return MATCH_STATUS.LIVE;
}
