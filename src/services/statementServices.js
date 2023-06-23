async function effdateToStr(date) {
  return new Promise((resolve, reject) => {
    let timestamp = new Date(date).toLocaleTimeString("en-GB");
    
    const dateTime = new Date(date);
    const year = dateTime.getFullYear().toString();
    const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
    const day = dateTime.getDate().toLocaleString("en-GB").padStart(2, "0");

    const time = dateTime.toLocaleTimeString("en-GB");

    resolve(month + "/" + day + "/" + year + " " + time);
  });
}
async function transdateToStr(date) {
  return new Promise((resolve, reject) => {

    let timestamp = new Date(date).toLocaleTimeString("en-GB");
    const dateTime = new Date(date);
    const year = dateTime.getFullYear().toString();
    const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
    const day = dateTime.getDate().toLocaleString("en-GB").padStart(2, "0");

    const time = dateTime.toLocaleTimeString("en-GB");
    
    resolve(month + "/" + day + "/" + year + " " + time);
  });
}
async function getYearMonth(date) {
  return new Promise((resolve, reject) => {
    const year = new Date(date).getFullYear().toString();
    const month = (new Date(date).getMonth() + 1).toString().padStart(2, "0");
    resolve(year + month);
  });
}
async function setString(oldtext,addtext) {
  return new Promise((resolve, reject) => {
    resolve(oldtext + addtext);
  });
}

module.exports = {
  effdateToStr,
  transdateToStr,
  getYearMonth,
  setString,
};
