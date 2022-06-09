const data = {...require("../config.json")};

let employees = data["employees"];
let balanceFactor=data["balanceFactor"];

employees = employees.sort(() => Math.random() - 0.5);
let days = data["days"];
let replicateDays=JSON.parse(JSON.stringify(days))
let totalEmpCount = 0;
function findDayIndex(target,base){
 let result= target.findIndex((object) => {

    return object === base;
  });
  return result
} 
for (let day in days) {
  totalEmpCount += days[day].employeeCount;
}
let totalWorkDays = 0;
for (let emp in employees) {
  totalWorkDays += employees[emp].nwdaycount;
}
if (totalWorkDays > totalEmpCount) {
  console.error(
    "-----ERROR!!!!! Sum of weekly employee office day count cannot be larger than sum of office day capacity"
)}

let findIndex = 0;
let offDaysList=["aldays","hrdays","mldays","swdays","uldays"]
console.log("Inserting fixed office days of employees...");
try {
  for(emp of employees) {
    emp.availableNWdays=[]
  for(weekday of days){
    emp.availableNWdays.push(JSON.parse(JSON.stringify(weekday.day)));
  }


    for (let nwday in emp.offdays.nwdays) {
      
      findViableday=findDayIndex(emp.availableNWdays,emp.offdays.nwdays[nwday])

      let findday = days.findIndex((object) => {
        return object.day == emp.offdays.nwdays[nwday];
      });
      emp.nwdaycount--;
      if(emp.nwdaycount<1){
        emp.availableNWdays=[]
      }
      days[findday].employeeCount--;
      if (days[findViableday].employeeCount < 1) {
        days.splice(findday, 1);
      }
    emp.availableNWdays.splice(findViableday, 1);
    }
    for (let ofday in emp.offdays.aldays) {
      let findoffdayIndex =findDayIndex(emp.availableNWdays,emp.offdays.aldays[ofday]);
    emp.availableNWdays.splice(findoffdayIndex, 1);
    }
    for (let ofday in emp.offdays.hrdays) {
      let findoffdayIndex =findDayIndex(emp.availableNWdays,emp.offdays.hrdays[ofday]);
    emp.availableNWdays.splice(findoffdayIndex, 1);
    }
    for (let ofday in emp.offdays.mldays) {
      let findoffdayIndex =findDayIndex(emp.availableNWdays,emp.offdays.mldays[ofday]);
    emp.availableNWdays.splice(findoffdayIndex, 1);
    }
    for (let ofday in emp.offdays.swdays) {
      let findoffdayIndex =findDayIndex(emp.availableNWdays,emp.offdays.swdays[ofday]);
    emp.availableNWdays.splice(findoffdayIndex, 1);
    }
    for (let ofday in emp.offdays.uldays) {
      let findoffdayIndex =findDayIndex(emp.availableNWdays,emp.offdays.uldays[ofday]);
    emp.availableNWdays.splice(findoffdayIndex, 1);
    }
    for (let ofday in emp.offdays.phdays) {
      let findoffdayIndex =findDayIndex(emp.availableNWdays,emp.offdays.phdays[ofday]);
    emp.availableNWdays.splice(findoffdayIndex, 1);
    }
    if(emp.availableNWdays<emp.nwdaycount){
      emp.nwdaycount=emp.availableNWdays
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
//checking if available nwdays matches with days array if not remove the elements on both arrays
for (let i = 0; i < days.length; i++) {
 
  if (days[i].employeeCount < 1) {
    days.splice(i, 1);
  }
  
}
for(emp of employees){
  if(emp.nwdaycount>=days.length){
    emp.nwdaycount=days.length
  }
  let result=days.map(dayName=>(dayName.day))

  let filteredNWDays=emp.availableNWdays.filter((object)=>{
    return result.includes(object)
  })
  emp.availableNWdays=filteredNWDays
}
console.log("##################################################")

//insert random nw days
try {
  for(emp of employees) {
    //employees iteration
    let isBalanced = false;
    emp.availableNWdays =emp.availableNWdays.sort(() => Math.random() - 0.5);
    let balanceFactor=0;
    while(emp.nwdaycount>0){
        let avalabledayindex =0
        if(balanceFactor <data["balanceFactor"]&&emp.availableNWdays.length>1){
          avalabledayindex = getMostViableDay(emp.availableNWdays,days)
          balanceFactor++
        }
        emp.offdays.nwdays.push(emp.availableNWdays[avalabledayindex])
        emp.nwdaycount--
      let findIndex = findDayIndex(days.map(dayName=>(dayName.day)),emp.availableNWdays[avalabledayindex])
      if(findIndex==-1){
        throw new Error("Error at finding index in two day arrays")
      }
        emp.availableNWdays.splice(avalabledayindex,1)
        days[findIndex].employeeCount--
        if(days[findIndex].employeeCount<1){
          days.splice(findIndex,1)
        }
    }
  }
} catch (err) {
  console.error(
    "An error occured when try to generate random work days for the employee. Please try again.");
  console.error(err);
  throw new Error("Something went  wrong!");
}
function getMostViableDay(availableDaysList,days){
  let index=0;
  let mostViableDayCount=0
  let mostViableDayIndex=0
  let result=0
  let dayArray=0
  

  dayArray=days.map(dayName=>(dayName.day))
 for(availableDay in availableDaysList){
   let indexInDayArray=findDayIndex(dayArray,availableDaysList[availableDay])
 
   if(days[indexInDayArray].employeeCount>mostViableDayCount){
     mostViableDayCount=days[indexInDayArray].employeeCount
     mostViableDayIndex=indexInDayArray
   }

 }

  
result =findDayIndex(availableDaysList,dayArray[mostViableDayIndex])
  return result

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
  for(emp of employees) {
    let employeeObj = {
      Id: "error",
      Name: "Name",
      days:{
      Monday: "emp",
      Tuesday: "emp",
      Wednesday: "emp",
      Thursday: "emp",
      Friday: "emp",
      }
    };
    employeeObj["Id"] = emp.id;
    employeeObj["Name"] = emp.name;
    employeeObj["Officedays"] = emp.nwdaycount;
    for (let j = 0; j < emp.offdays.nwdays.length; j++) {
      for (let k = 0; k < Object.keys(employeeObj["days"]).length; k++) {
        if (
          Object.keys(employeeObj["days"])[k].toLowerCase() ===emp.offdays.nwdays[j].toLowerCase()
        ) {
       
          employeeObj[`${Object.keys(employeeObj["days"])[k]}`] = "NW";
        } else if (employeeObj[`${Object.keys(employeeObj["days"])[k]}`] == "emp") {
          employeeObj[`${Object.keys(employeeObj["days"])[k]}`] = "SW";
         
        }
      }
    }
    for (let l = 0; l < emp.offdays.aldays.length; l++) {
      for (let k = 0; k < Object.keys(employeeObj["days"]).length; k++) {
        if (Object.keys(employeeObj["days"])[k].toLowerCase() ===emp.offdays.aldays[l].toLowerCase()){
          employeeObj[`${Object.keys(employeeObj["days"])[k]}`] = "AL";
        }
      }
    }
    for (let l = 0; l < emp.offdays.hrdays.length; l++) {
      for (let k = 0; k < Object.keys(employeeObj["days"]).length; k++) {
        if (Object.keys(employeeObj["days"])[k].toLowerCase() ===emp.offdays.hrdays[l].toLowerCase()){
          employeeObj[`${Object.keys(employeeObj["days"])[k]}`] = "HR";
        }
      }
    }
    for (let l = 0; l < emp.offdays.mldays.length; l++) {
      for (let k = 0; k < Object.keys(employeeObj["days"]).length; k++) {
        if (Object.keys(employeeObj["days"])[k].toLowerCase() ===emp.offdays.mldays[l].toLowerCase()){
          employeeObj[`${Object.keys(employeeObj["days"])[k]}`] = "ML";
        }
      }
    }
    for (let l = 0; l < emp.offdays.swdays.length; l++) {
      for (let k = 0; k < Object.keys(employeeObj["days"]).length; k++) {
        if (Object.keys(employeeObj["days"])[k].toLowerCase() ===emp.offdays.swdays[l].toLowerCase()){
          employeeObj[`${Object.keys(employeeObj["days"])[k]}`] = "SW";
        }
      }
    }
    for (let l = 0; l < emp.offdays.uldays.length; l++) {
      for (let k = 0; k < Object.keys(employeeObj["days"]).length; k++) {
        if (Object.keys(employeeObj["days"])[k].toLowerCase() ===emp.offdays.uldays[l].toLowerCase()){
          employeeObj[`${Object.keys(employeeObj["days"])[k]}`] = "UL";
        }
      }
    }
    for (let l = 0; l < emp.offdays.phdays.length; l++) {
      for (let k = 0; k < Object.keys(employeeObj["days"]).length; k++) {
        if (Object.keys(employeeObj["days"])[k].toLowerCase() ===emp.offdays.phdays[l].toLowerCase()){
          employeeObj[`${Object.keys(employeeObj["days"])[k]}`] = "PH";
        }
      }
    }
    for(let m=0;m<replicateDays.length;m++){
      if(replicateDays[m].employeeCount===0){
        for (let k = 0; k < Object.keys(employeeObj["days"]).length; k++) {
          if (Object.keys(employeeObj["days"])[k].toLowerCase() ===replicateDays[m].day.toLowerCase()){
            employeeObj[`${Object.keys(employeeObj["days"])[k]}`] = "PH";
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
