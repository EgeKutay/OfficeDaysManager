const fs = require("fs");
const ExcelJS = require("exceljs");
const data = {...require("../config.json")};

let employees = data["employees"];
let totalWorkDays = 0;
for (let emp in employees) {
  totalWorkDays += employees[emp].nwdaycount;
}
employees = employees.sort(() => Math.random() - 0.5);
let days = data["days"];
let replicateDays=JSON.parse(JSON.stringify(days))
let totalEmpCount = 0;
for (let day in days) {
  totalEmpCount += days[day].employeeCount;
}
if (totalWorkDays > totalEmpCount) {
  console.error(
    "Error!!! The total count of office days of employees array cannot be larger than the sum of employee count in days array"
  );
}
let daysIndex;
let findIndex = 0;

console.log("Inserting fixed office days of employees...");
try {
  for (let i = 0; i < employees.length; i++) {
    let availabledays = JSON.parse(JSON.stringify(days));
    for (let nwday in employees[i].nwdays) {
      let findViableday = availabledays.findIndex((object) => {
        return object.day == employees[i].nwdays[nwday];
      });
      let findday = days.findIndex((object) => {
        return object.day == employees[i].nwdays[nwday];
      });
      employees[i].nwdaycount--;
      days[findday].employeeCount--;
      if (days[findViableday].employeeCount < 1) {
        days.splice(findday, 1);
      }
      availabledays.splice(findViableday, 1);
    }
  }
} catch (err) {
  console.error(
    "Error at inserting office days of employees... Please make sure the sum of fixed day count of employees matches with the employee count that defined in 'days' array"
  );
  console.error(err);
  throw new Error("Something went wrong!");
}
console.log("Successfully inserted the fixed office days of employees!");
console.log("----------------");
console.log("Generating random office days of employees...");
for (let i = 0; i < days.length; i++) {
  if (days[i].employeeCount < 1) {
    days.splice(i, 1);
  }
}

try {
  for (let i = 0; i < employees.length; i++) {
    //employees iteration
    let availabledays = JSON.parse(JSON.stringify(days));
    for (let ofday in employees[i].offdays) {
      let findoffdayIndex = availabledays.findIndex((object) => {
        return object.day === employees[i].offdays[ofday];
      });
      availabledays.splice(findoffdayIndex, 1);
    }
    let isBalanced = false;
    for (let j = employees[i].nwdaycount - 1; j >= 0; j--) {
      //employee's nwday count times iteration
      availabledays = availabledays.sort(() => Math.random() - 0.5);
      let index = 0;
      if (!isBalanced) {
        for (let k = 0; k < availabledays.length; k++) {
          if (
            availabledays[k].employeeCount > availabledays[index].employeeCount
          ) {
            index = k;
            isBalanced = true;
          }
        }
      }
      if (!employees[i].nwdays.includes(availabledays[index].day)) {
        employees[i].nwdays.push(availabledays[index].day);
      }
      findIndex = days.findIndex((object) => {
        return object.day === availabledays[index].day;
      });
      employees[i].nwdaycount--;
      days[findIndex].employeeCount--;
      availabledays.splice(index, 1);
      if (days[findIndex].employeeCount === 0) {
        days.splice(findIndex, 1);
      }
    }
  }
} catch (err) {
  console.error(
    "An error occured when try to generate random work days for the employee. Please try again."
  );
  console.error(err);
  throw new Error("Something went  wrong!");
}

//Sort the employee array in id order
employees = employees.sort(function (a, b) {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
});
let officeDayArr = [];


try {
  for (let i = 0; i < employees.length; i++) {
    let employeeObj = {
      Id: "error",
      Name: "Name",
      Monday: "emp",
      Tuesday: "emp",
      Wednesday: "emp",
      Thursday: "emp",
      Friday: "emp",
    };
    for (let j = 0; j < employees[i].nwdays.length; j++) {
      //USE FOR LOOP FOR employeOBJ TO FILL EVERYTHING!!!!
      employeeObj["Id"] = employees[i].id;
      employeeObj["Name"] = employees[i].name;
      employeeObj["Officedays"] = employees[i].nwdaycount;
      for (let k = 0; k < Object.keys(employeeObj).length; k++) {
        if (
          Object.keys(employeeObj)[k].toLowerCase() ===employees[i].nwdays[j].toLowerCase()
        ) {
          employeeObj[`${Object.keys(employeeObj)[k]}`] = "NW";
        } else if (employeeObj[`${Object.keys(employeeObj)[k]}`] == "emp") {
          employeeObj[`${Object.keys(employeeObj)[k]}`] = "SW";
        }
      }
    }
    for (let l = 0; l < employees[i].offdays.length; l++) {
      
      for (let k = 0; k < Object.keys(employeeObj).length; k++) {
        if (Object.keys(employeeObj)[k].toLowerCase() ===employees[i].offdays[l].toLowerCase()){
          employeeObj[`${Object.keys(employeeObj)[k]}`] = "DO";
        }
        
      }
    }
    for(let m=0;m<replicateDays.length;m++){
      
      if(replicateDays[m].employeeCount===0){
        for (let k = 0; k < Object.keys(employeeObj).length; k++) {
          if (Object.keys(employeeObj)[k].toLowerCase() ===replicateDays[m].day.toLowerCase()){
            employeeObj[`${Object.keys(employeeObj)[k]}`] = "PH";
          }
          
        }
      }
    }
    officeDayArr.push(employeeObj);
  }
} catch (err) {
  console.error(
    "Error at preparing json format for exporting data to csv file! "
  );
  console.log("------------------");
  console.error(err);
  throw new Error("Something went wrong!");
}
module.exports = officeDayArr;
