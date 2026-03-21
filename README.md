# canopy/time

Work with POSIX timestamps, time zones, and human-readable date and time components.

## Installation

```
canopy install canopy/time
```

## Core Concept

All time values are represented as `Posix` — milliseconds since the Unix epoch, independent of any time zone. A `Zone` is required to decompose a `Posix` value into human-readable components such as year, month, day, and hour. Two zones ship with the package: `Time.utc` is a constant, while `Time.here` is a `Task` that resolves the user's local zone from the browser.

## Quick Start

```canopy
import Task
import Time


type Msg
    = GotTimeAndZone Time.Zone Time.Posix


init : ( Model, Cmd Msg )
init =
    ( initialModel
    , Task.map2 GotTimeAndZone Time.here Time.now
        |> Task.perform identity
    )


view : Time.Zone -> Time.Posix -> Html Msg
view zone now =
    let
        year  = Time.toYear  zone now
        month = Time.toMonth zone now
        day   = Time.toDay   zone now
    in
    text (String.fromInt year ++ "-" ++ formatMonth month ++ "-" ++ String.fromInt day)


subscriptions : Model -> Sub Msg
subscriptions _ =
    Time.every 1000 Tick
```

## API Summary

### Tasks and Subscriptions

| Name | Type | Description |
|------|------|-------------|
| `Time.now` | `Task x Posix` | Capture the current time as a POSIX value |
| `Time.here` | `Task x Zone` | Resolve the user's local time zone |
| `Time.every` | `Float -> (Posix -> msg) -> Sub msg` | Emit a message on a repeating interval (milliseconds) |

### Zones

| Name | Type | Description |
|------|------|-------------|
| `Time.utc` | `Zone` | The UTC time zone |
| `Time.customZone` | `Int -> List { start : Int, offset : Int } -> Zone` | Construct a zone with a fixed offset and DST rules |

### Decomposing a Posix Value

All of these functions take a `Zone` and a `Posix` and return a component of the corresponding local time.

| Name | Return Type | Description |
|------|-------------|-------------|
| `Time.toYear` | `Int` | Full calendar year (e.g. 2025) |
| `Time.toMonth` | `Month` | Month as a union type value |
| `Time.toDay` | `Int` | Day of the month (1–31) |
| `Time.toWeekday` | `Weekday` | Day of the week as a union type value |
| `Time.toHour` | `Int` | Hour in 24-hour format (0–23) |
| `Time.toMinute` | `Int` | Minute (0–59) |
| `Time.toSecond` | `Int` | Second (0–59) |
| `Time.toMillis` | `Int` | Millisecond (0–999) |

### Conversion

| Name | Type | Description |
|------|------|-------------|
| `Time.millisToPosix` | `Int -> Posix` | Construct a Posix from an integer millisecond count |
| `Time.posixToMillis` | `Posix -> Int` | Extract the underlying millisecond integer |

### Types

**`Posix`** — An opaque value representing a point in time as milliseconds since the Unix epoch (1970-01-01T00:00:00Z). Time zone independent.

**`Zone`** — An opaque value encoding a time zone's UTC offset and DST transition rules. Obtain one from `Time.utc`, `Time.here`, or `Time.customZone`.

**`Month`** — `Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | Nov | Dec`

**`Weekday`** — `Mon | Tue | Wed | Thu | Fri | Sat | Sun`

**`ZoneName`** — `Name String | Offset Int`. Returned by browser APIs that expose a zone name; treat as a display hint only.

## Gotchas

**`Time.now` gives you milliseconds, not a readable date.** You must pair it with a `Zone` before you can display year, month, day, or clock components. The typical pattern is `Task.map2 GotTimeAndZone Time.here Time.now`.

**`Time.here` is a Task, not a constant.** Unlike `Time.utc`, the local zone must be resolved asynchronously from the browser. Do not assume UTC as a fallback — the user's local time may differ by many hours.

**`Time.every` is not a precise timer.** The browser may throttle background tabs, and the interval is measured in wall-clock milliseconds, not guaranteed delivery intervals. Do not use it for scheduling that requires strict periodicity.

## License

BSD-3-Clause
