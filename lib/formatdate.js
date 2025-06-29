const formatDate = (dateString) => { // Format the date in ddmmyy format for consistency
  try {
    if (dateString === "Unknown") return "??????";
    
    const date = new Date(dateString); // Create date object - works for ISO format "YYYY-MM-DD"
    
    // Check if date is valid
    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${day}${month}${year}`;
    }
    
    // If we get here, the date was invalid
    console.warn(`Could not parse date: ${dateString}`);
    return "??????";  // Fallback for unparseable dates
  } catch (error) {
    console.error(`Error formatting date: ${dateString}`, error);
    return "??????";  // Fallback for any errors
  }
};

export default formatDate;