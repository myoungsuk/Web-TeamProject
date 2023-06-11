const now = new Date();

const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2,"0");
const date = String(now.getDate()).padStart(2,"0");

currentDate = document.querySelector(".date");
currentDate.innerHTML = year + ". " + month + ". " + date + ". ";

const hours = String(now.getHours()).padStart(2,"0");
const minutes = String(now.getMinutes()).padStart(2,"0");

currentTime = document.querySelector(".time");
currentTime.innerHTML = hours + ":" + minutes;
