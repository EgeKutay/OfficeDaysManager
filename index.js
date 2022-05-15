const fs = require("fs");

const { Parser } = require("json2csv");
//rows
const data = require("./config.json");
const swdayc = 3;
let employees = data["employees"];
let totalWorkDays = 0;
for (let emp in employees) {
  totalWorkDays += employees[emp].nwdaycount;
}
//max person allowed in office

employees = employees.sort(() => Math.random() - 0.5);
console.log(employees);
//columns
let days = data["days"];
console.log(JSON.stringify(days));
let totalEmpCount = 0;
for (let day in days) {
  totalEmpCount += days[day].employeeCount;
}
if (totalWorkDays > totalEmpCount) {
  console.log(
    "Error total work days of employees cannot be larger than Total employee count in the week"
  );
}
let date = new Date();
let daysIndex;
let findIndex = 0;
try {
  for (let i = 0; i < employees.length; i++) {
    //availabledays variable will be the variable that the remaining days for the  employee since he/she can't work twice in same day
    let availabledays = JSON.parse(JSON.stringify(days));

    let isBalanced = false;
    for (let j = employees[i].nwdaycount - 1; j >= 0; j--) {
      /*
    shuffle order of days so everytime you pop it you get work on random day
    attend a random day to the employee
    reduce the employee's working day count
    finds the day's index  that the employee attended on "days" array in order to find and reduce the max employee count allowed in the office
    reduce the max allowed employee count by one in the same day
    remove the viability of day from viable days list (FOR THAT EMPLOYEE).
    check if the day is full of employees if so, REMOVE THE founded day permanently from viabledays array  
    */
      availabledays = availabledays.sort(() => Math.random() - 0.5);
      let index = 0;

      for (let k = 0; k < availabledays.length; k++) {
        if (
          availabledays[k].employeeCount > availabledays[index].employeeCount &&
          !isBalanced
        ) {
          index = k;
          isBalanced = true;
        }
      }

      employees[i].nwdays.push(availabledays[index].day);

      employees[i].nwdaycount--;

      findIndex = days.findIndex((object) => {
        return object.day === availabledays[index].day;
      });

      days[findIndex].employeeCount--;

      availabledays.splice(index, 1);

      if (days[findIndex].employeeCount === 0) {
        days.splice(findIndex, 1);
      }
    }
  }
} catch (err) {
  console.error(err);
}
employees = employees.sort(function (a, b) {
  if (a.name[0] < b.name[0]) {
    return -1;
  }
  if (a.name[0] > b.name[0]) {
    return 1;
  }
  return 0;
});
console.log(employees);
const opts = { employees };
try {
  const parser = new Parser(opts);
  const csv = parser.parse(JSON.parse(JSON.stringify(employees)));

  fs.writeFileSync(`../${date.getTime()}.csv`, csv, "utf16le", function (err) {
    if (err) {
      console.log("An error occured while writing JSON object to File");

      return console.log(err);
    }
    console.log("JSON file has been saved.");
  });
} catch (err) {
  console.error(err);
}
