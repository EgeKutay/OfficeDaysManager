const fs = require("fs");

const {
  Parser,
  transforms: { unwind, flatten },
} = require("json2csv");


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

//columns
let days = data["days"];

let totalEmpCount = 0;
for (let day in days) {
  totalEmpCount += days[day].employeeCount;
}
if (totalWorkDays > totalEmpCount) {
  console.log(
    "Error total work days of employees cannot be larger than Total employee count in the week"
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
   
try {
  for (let i = 0; i < employees.length; i++) {
    let availabledays = JSON.parse(JSON.stringify(days));

    let isBalanced = false;
    for (let j = employees[i].nwdaycount - 1; j >= 0; j--) {
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

      employees[i].nwdays.push(availabledays[index].day);

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
  console.error(err);
}

   
//Sort the employee array in alphabetical order.
employees = employees.sort(function (a, b) {
  if (a.name[0] + a.name[1] < b.name[0] + b.name[1]) {
    return -1;
  }
  if (a.name[0] + a.name[1] > b.name[0] + b.name[1]) {
    return 1;
  }
  return 0;
});
let officeDayArr=[];


for(let i=0;i<employees.length;i++){
  let employeeObj={Name:'',Monday:'',Tuesday:'',Wednesday:'',Thursday:'',Friday:''}
for(let j=0;j<employees[i].nwdays.length;j++){
 
    //USE FOR LOOP FOR employeOBJ TO FILL EVERYTHING!!!!
    employeeObj['Name']=employees[i].name
for(let k=1;k<Object.keys(employeeObj).length;k++){
if(Object.keys(employeeObj)[k].toLowerCase()===employees[i].nwdays[j].toLowerCase()){
  employeeObj[`${Object.keys(employeeObj)[k]}`]='NW'
}
else if( employeeObj[`${Object.keys(employeeObj)[k]}`]==''){

  employeeObj[`${Object.keys(employeeObj)[k]}`]='SW'
}

}
  
}
officeDayArr.push(employeeObj)
}
console.log(officeDayArr)
/*
for(let i=1;i<Object.keys(employeeObj).length;i++){
 console.log("----")
  for(let j=0;j<employees[0].nwdays.length;j++){
    let findIndex = employees[0].nwdays.findIndex((object) => {
      return object.toLocaleLowerCase() === Object.keys(employeeObj)[i].toLocaleLowerCase()
    });
console.log(findIndex)
   
 if(Object.keys(employeeObj)[i].toLocaleLowerCase()==employees[0].nwdays[findIndex].toLocaleLowerCase()){
employeeObj['Name']=employees[0].name
employeeObj[`${Object.keys(employeeObj)[i]}`]='NW'
 }
 else{
  employeeObj[`${Object.keys(employeeObj)[i]}`]='SW'
 }
  }
}
*/
//console.log(employeeObj)



currentdate = new Date();
var oneJan = new Date(currentdate.getFullYear(),0,1);
var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
var result = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);


try {
  const parser = new Parser({
    transforms: [unwind({officeDayArr, blankOut: true }), flatten("__")],
  });
  const csv = parser.parse(JSON.parse(JSON.stringify(officeDayArr)));

  fs.writeFileSync(`SF_Working_Plan${result}_Plan.csv`, csv, "utf16le", function (err) {
    if (err) {
      console.log("An error occured while writing JSON object to File");

      return console.log(err);
    }
    console.log("JSON file has been saved.");
  });
} catch (err) {
  console.error(err);
}
