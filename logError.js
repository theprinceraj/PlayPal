const path = require('path');
/**
 * Logs an error message to the error log file.
 * 
 * @param {string} error - The error message to be logged.
 */
function logError(error) {
    // Define the path to the error log file
    const errorLogPath = path.join(__dirname, 'error.log');

    // Get the current date and time in IST
    const currentTimeIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Construct the error message to be logged
    const errorMessage = `${currentTimeIST} - ${error}\n`;

    // Append the error message to the error log file
    fs.appendFile(errorLogPath, errorMessage, (err) => {
        if (err) {
            console.error('Failed to write error to error.log:', err);
        }
    });
}
