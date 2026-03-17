# canopy/time — TODO

## Status: Production Ready (v1.0.0)

POSIX time, timezone support, civil date extraction. Effect manager for interval-based subscriptions.

---

## Features to Add

- [ ] Date formatting/parsing (ISO 8601, custom patterns) — or document that canopy/datetime is the recommended approach
- [ ] Duration type — or document that canopy/datetime handles this
- [ ] Date arithmetic (add days, diff) — or document delegation to canopy/datetime
- [ ] `toIso8601 : Zone -> Posix -> String` — ISO 8601 string output
- [ ] `fromIso8601 : String -> Maybe Posix` — ISO 8601 parsing
- [ ] `monthToInt : Month -> Int` — Month number (1-12)
- [ ] `intToMonth : Int -> Maybe Month` — Int to Month
- [ ] `weekdayToInt : Weekday -> Int` — Weekday number (1=Mon, 7=Sun)
- [ ] `intToWeekday : Int -> Maybe Weekday` — Int to Weekday

---

## Test Improvements

- [ ] Current coverage is excellent — maintain for new additions
- [ ] Add more timezone edge case tests (DST transitions, half-hour offsets)
