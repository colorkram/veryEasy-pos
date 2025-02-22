function toThaiTimeZone(dateString) {
  const today = new Date(dateString);
  const thailandTimezone = "Asia/Bangkok";
  
  const options = {
    timeZone: thailandTimezone,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,  // ใช้เวลารูปแบบ 24 ชั่วโมง
  };
  
  const thaiDateString = today.toLocaleString("en-GB", options);

  // แยกวันที่และเวลาออกจากกัน
  const [datePart, timePart] = thaiDateString.split(", ");
  const [day, month, year] = datePart.split("/");
  const formattedDate = `${day} ${month} ${year} ${timePart}`;

  return formattedDate;
}

module.exports = toThaiTimeZone;
