
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

let findIndex = 0;
let offDaysList=["aldays","hrdays","mldays","swdays","uldays"]
console.log("Inserting fixed office days of employees...");
try {
  for(emp of employees) {
  emp.availabledays = JSON.parse(JSON.stringify(days));
  
    for (let nwday in emp.nwdays) {
      
      let findViableday =emp.availabledays.findIndex((object) => {
        return object.day == emp.nwdays[nwday];
      });
      let findday = days.findIndex((object) => {
        return object.day == emp.nwdays[nwday];
      });
      emp.nwdaycount--;
      days[findday].employeeCount--;
      if (days[findViableday].employeeCount < 1) {
        days.splice(findday, 1);
      }
    emp.availabledays.splice(findViableday, 1);
    }
    for (let ofday in emp.offdays.aldays) {
      let findoffdayIndex =emp.availabledays.findIndex((object) => {
        return object.day === emp.offdays.aldays[ofday];
      });
    emp.availabledays.splice(findoffdayIndex, 1);
    }
    for (let ofday in emp.offdays.hrdays) {
      let findoffdayIndex =emp.availabledays.findIndex((object) => {
        return object.day === emp.offdays.hrdays[ofday];
      });
    emp.availabledays.splice(findoffdayIndex, 1);
    }
    for (let ofday in emp.offdays.mldays) {
      let findoffdayIndex =emp.availabledays.findIndex((object) => {
        return object.day === emp.offdays.mldays[ofday];
      });
    emp.availabledays.splice(findoffdayIndex, 1);
    }
    for (let ofday in emp.offdays.swdays) {
      let findoffdayIndex =emp.availabledays.findIndex((object) => {
        return object.day === emp.offdays.swdays[ofday];
      });
    emp.availabledays.splice(findoffdayIndex, 1);
    }
    for (let ofday in emp.offdays.uldays) {
      let findoffdayIndex =emp.availabledays.findIndex((object) => {
        return object.day === emp.offdays.uldays[ofday];
      });
    emp.availabledays.splice(findoffdayIndex, 1);
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
console.log(employees)

//insert random nw days
try {
  for(emp of employees) {
    //employees iteration
    
   if(emp.nwdaycount<1){
     continue
   }
    let isBalanced = false;
  emp.availabledays =emp.availabledays.sort(() => Math.random() - 0.5);
    for (let j = emp.nwdaycount - 1; j >= 0; j--) {
      //employee's nwday count times iteration
     
      let index = 0;
      if (!isBalanced) {
        for (let k = 0; k <emp.availabledays.length; k++) {
          if (
          emp.availabledays[k].employeeCount >emp.availabledays[index].employeeCount
          ) {
            index = k;
            isBalanced = true;
          }
        }
      }
      if (!emp.nwdays.includes(emp.availabledays[index].day)) {
        emp.nwdays.push(emp.availabledays[index].day);
      }
      findIndex = days.findIndex((object) => {
        return object.day ===emp.availabledays[index].day;
      });
      emp.nwdaycount--;
      days[findIndex].employeeCount--;
    emp.availabledays.splice(index, 1);
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
/*
employees = employees.sort(function (a, b) {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
});
*/
let officeDayArr = [];


try {
  for(emp of employees) {
    let employeeObj = {
      Id: "error",
      Name: "Name",
      Monday: "emp",
      Tuesday: "emp",
      Wednesday: "emp",
      Thursday: "emp",
      Friday: "emp",
    };
    for (let j = 0; j < emp.nwdays.length; j++) {
      employeeObj["Id"] = emp.id;
      employeeObj["Name"] = emp.name;
      employeeObj["Officedays"] = emp.nwdaycount;
      for (let k = 0; k < Object.keys(employeeObj).length; k++) {
        if (
          Object.keys(employeeObj)[k].toLowerCase() ===emp.nwdays[j].toLowerCase()
        ) {
          employeeObj[`${Object.keys(employeeObj)[k]}`] = "NW";
        } else if (employeeObj[`${Object.keys(employeeObj)[k]}`] == "emp") {
          employeeObj[`${Object.keys(employeeObj)[k]}`] = "SW";
        }
      }
    }
    for (let l = 0; l < emp.offdays.aldays.length; l++) {
      for (let k = 0; k < Object.keys(employeeObj).length; k++) {
        if (Object.keys(employeeObj)[k].toLowerCase() ===emp.offdays.aldays[l].toLowerCase()){
          employeeObj[`${Object.keys(employeeObj)[k]}`] = "AL";
        }
      }
    }
    for (let l = 0; l < emp.offdays.hrdays.length; l++) {
      for (let k = 0; k < Object.keys(employeeObj).length; k++) {
        if (Object.keys(employeeObj)[k].toLowerCase() ===emp.offdays.hrdays[l].toLowerCase()){
          employeeObj[`${Object.keys(employeeObj)[k]}`] = "HR";
        }
      }
    }
    for (let l = 0; l < emp.offdays.mldays.length; l++) {
      for (let k = 0; k < Object.keys(employeeObj).length; k++) {
        if (Object.keys(employeeObj)[k].toLowerCase() ===emp.offdays.mldays[l].toLowerCase()){
          employeeObj[`${Object.keys(employeeObj)[k]}`] = "ML";
        }
      }
    }
    for (let l = 0; l < emp.offdays.swdays.length; l++) {
      for (let k = 0; k < Object.keys(employeeObj).length; k++) {
        if (Object.keys(employeeObj)[k].toLowerCase() ===emp.offdays.swdays[l].toLowerCase()){
          employeeObj[`${Object.keys(employeeObj)[k]}`] = "SW";
        }
      }
    }
    for (let l = 0; l < emp.offdays.uldays.length; l++) {
      for (let k = 0; k < Object.keys(employeeObj).length; k++) {
        if (Object.keys(employeeObj)[k].toLowerCase() ===emp.offdays.uldays[l].toLowerCase()){
          employeeObj[`${Object.keys(employeeObj)[k]}`] = "UL";
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
