const fs = require("fs");
//rows
const swdayc = 6;
let employees = [
  { name: "İlknur KURBAN", swdaycount: 3, comingdays: [] },
  { name: "Gamze AKYOL", swdaycount: swdayc, comingdays: [] },
  { name: "Uğur CAN", swdaycount: swdayc, comingdays: [] },

  
];
let totalWorkDays=0;
for(let emp in employees){
    totalWorkDays +=employees[emp].swdaycount

}
//max person allowed in office

employees = employees.sort(() => Math.random() - 0.5);
//columns
let days = [
  { day: "Monday", employeeCount:1 },
  { day: "Tuesday", employeeCount: 1 },
  { day: "Wednesday", employeeCount: 1 },
  { day: "Thursday", employeeCount: 1 },
  { day: "Friday", employeeCount: 3 },
];
let totalEmpCount=0
for(let day in days){
    totalEmpCount += days[day].employeeCount
}

let date = new Date();
let daysIndex;
let findIndex = 0;

for (let i = 0; i < employees.length; i++) {
  //availabledays variable will be the variable that the remaining days for the  employee since he/she can't work twice in same day
  let availabledays = JSON.parse(JSON.stringify(days));
//if the same day count is bigger than ... after certain iteration
  for (let j = employees[i].swdaycount - 1; j >= 0; j--) {
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
   let index=0
   
  for(let k=0;k<availabledays.length;k++){
      if(availabledays[k].employeeCount>availabledays[index].employeeCount){
          index=k;
      }
  
}
    
    employees[i].comingdays.push(availabledays[index].day);
    
    employees[i].swdaycount--
    
    findIndex = days.findIndex((object) => {
        return object.day === availabledays[index].day;
    });
  
    days[findIndex].employeeCount--
   
    availabledays.splice(index,1)
   
    if (days[findIndex].employeeCount === 0) {
        days.splice(findIndex, 1);
      }
    
    
   console.log("---------")
   console.log(employees)
   console.log(availabledays)
  }
}
console.log(employees)
console.log(days)