function formatDateString(dateString) {
    const date = new Date(dateString);

    // Array of day names and month names
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Get the day name, month name, and year
    const dayName = days[date.getUTCDay()];
    const monthName = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    // Get the day of the month and add the correct suffix
    const day = date.getUTCDate();
    let daySuffix;

    if (day % 10 === 1 && day !== 11) {
        daySuffix = 'st';
    } else if (day % 10 === 2 && day !== 12) {
        daySuffix = 'nd';
    } else if (day % 10 === 3 && day !== 13) {
        daySuffix = 'rd';
    } else {
        daySuffix = 'th';
    }

    return `${dayName} ${monthName} ${day}${daySuffix} ${year}`;
}

export default formatDateString;