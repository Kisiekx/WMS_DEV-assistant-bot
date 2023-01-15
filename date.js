let today = new Date()

let args = ["", "00:37"]

let startTime = new Date(args[1] + ' ' + today.getDate() + '.' + (today.getMonth()+1) + '.' + today.getFullYear());

console.log(startTime.toLocaleString())