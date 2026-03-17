// Canopy Time FFI -- Time operations for POSIX times and time zones
//
// Imported in Time.can via:
//   foreign import javascript "external/time.js" as TimeFFI


/**
 * Get the current POSIX time as a Task.
 *
 * Takes a millisToPosix conversion function and returns a scheduler binding
 * that resolves to the current time wrapped in a Posix value.
 *
 * @canopy-type (Int -> a) -> b
 * @name now
 * @param {function} millisToPosix - Converts raw milliseconds to a Posix value
 * @returns {object} A scheduler binding that resolves to the current Posix time
 */
function now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

/**
 * Repeatedly execute a task at a fixed interval.
 *
 * Sets up a JavaScript setInterval timer that spawns the given task
 * on each tick. Returns a cleanup function to clear the interval.
 *
 * @canopy-type Float -> a -> b
 * @name setInterval
 * @param {number} interval - The interval in milliseconds between task executions
 * @param {object} task - The scheduler task to spawn on each tick
 * @returns {object} A scheduler binding that never resolves (runs until killed)
 */
var setInterval_ = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

/**
 * Get the current time zone as a Task.
 *
 * Uses the browser's timezone offset to construct a Zone value. This can only
 * produce simple offset-based zones (like Etc/GMT+5), not full IANA zones.
 *
 * @canopy-type (Int -> a -> b) -> c
 * @name here
 * @param {function} customZone - Constructor that builds a Zone from offset and eras
 * @returns {object} A scheduler binding that resolves to the local Zone
 */
function here(customZone)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2(customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}

/**
 * Get the IANA time zone name as a Task.
 *
 * Attempts to use the Intl API to get the IANA time zone name (e.g.
 * "Europe/Moscow"). Falls back to the UTC offset in minutes if the
 * Intl API is not available.
 *
 * @canopy-type (String -> a) -> (Int -> a) -> b
 * @name getZoneName
 * @param {function} nameTag - The Name constructor for ZoneName
 * @param {function} offsetTag - The Offset constructor for ZoneName
 * @returns {object} A scheduler binding that resolves to a ZoneName (Name or Offset)
 */
var getZoneName = F2(function(nameTag, offsetTag)
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = nameTag(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = offsetTag(-(new Date().getTimezoneOffset()));
		}
		callback(_Scheduler_succeed(name));
	});
});
