const fs = require("fs");
const ExcelJS = require('exceljs');
const {
  Parser,
  transforms: { unwind, flatten },
} = require("json2csv");


//rows
const data = require("../config.json");
const swdayc = 3;
let employees = data["employees"];
let totalWorkDays = 0;
for (let emp in employees) {
  totalWorkDays += employees[emp].nwdaycount;
}
//max person allowed in office

employees = employees.sort(() => Math.random() - 0.5);

//columns
let days = data["days"];

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
/*
    shuffle order of days so everytime you remove a day from array you get to work on random day
    attend a random day to the employee
    reduce the employee's working day count
    find the day's index  that the employee attended on "days" array to find and then reduce the max employee count allowed in the office
    reduce the max allowed employee count by one in the same day
    remove the viability of day from viable days list (FOR THAT EMPLOYEE).
    check if the day is full of employees if so, REMOVE THE founded day permanently from viable days array  
    */
   console.log("Inserting fixed office days of employees...")
   try{
    for (let i = 0; i < employees.length; i++) {
      //employees iteration
      let availabledays = JSON.parse(JSON.stringify(days));
      
      for(let nwday in employees[i].nwdays){
        let findViableday=availabledays.findIndex((object)=>{
          return object.day==employees[i].nwdays[nwday]})
          let findday=days.findIndex((object)=>{
            return object.day==employees[i].nwdays[nwday]})
       
          employees[i].nwdaycount--
          days[findday].employeeCount--
          if (days[findViableday].employeeCount <1) {
            days.splice(findday, 1);
          }
          availabledays.splice(findViableday,1)
      }
    }
   
  }

  catch(err){
    console.error("Error at inserting office days of employees... Please make sure the sum of fixed day count of employees matches with the employee count that defined in 'days' array")
    console.error(err)
  }
  console.log("Successfully inserted the fixed office days of employees!")
  console.log("----------------")
  console.log("Generating random office days of employees...")
for(let i=0;i<days.length;i++){
  if (days[i].employeeCount <1) {
    days.splice(i, 1);
  }
}

try {
  for (let i = 0; i < employees.length; i++) {
    //employees iteration
    let availabledays = JSON.parse(JSON.stringify(days));
    let isBalanced = false;
    for (let j = employees[i].nwdaycount- 1; j >= 0; j--) {
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
      if(!employees[i].nwdays.includes(availabledays[index].day)){
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
  console.error("An error occured when try to generate random work days for the employee. Please try again.");
  console.error(err)
}



   
//Sort the employee array in alphabetical order.
employees = employees.sort(function (a, b) {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id  > b.id) {
    return 1;
  }
  return 0;
});
let officeDayArr=[];


try{
for(let i=0;i<employees.length;i++){
  let employeeObj={Id:'error',Name:'PH',Monday:'PH',Tuesday:'PH',Wednesday:'PH',Thursday:'PH',Friday:'PH',}
  for(let j=0;j<employees[i].nwdays.length;j++){
  
      //USE FOR LOOP FOR employeOBJ TO FILL EVERYTHING!!!!
      employeeObj['Id']=employees[i].id
      employeeObj['Name']=employees[i].name
      employeeObj['Officedays']=employees[i].nwdaycount
    for(let k=0;k<Object.keys(employeeObj).length;k++){
        if(Object.keys(employeeObj)[k].toLowerCase()===employees[i].nwdays[j].toLowerCase()){
          employeeObj[`${Object.keys(employeeObj)[k]}`]='NW'
        }
        else if( employeeObj[`${Object.keys(employeeObj)[k]}`]=='PH'){
          employeeObj[`${Object.keys(employeeObj)[k]}`]='SW'
        }
    }
  }
officeDayArr.push(employeeObj)
}
}
catch(err){
  console.error("Error at preparing json format for exporting data to csv file! ")
  console.log("------------------")
  console.error(err)
}
module.exports=officeDayArr