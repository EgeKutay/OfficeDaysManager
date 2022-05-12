const fs= require('fs')
//rows
const swdayc=3
let employees=[
    {name:"İlknur KURBAN",swdaycount:swdayc,workingdays:[]},
    {name:"Gamze AKYOL",swdaycount:swdayc,workingdays:[]},
    {name:"Uğur CAN",swdaycount:swdayc,workingdays:[]},
    {name:"Can UĞURLU",swdaycount:swdayc,workingdays:[]},
    {name:"Emre OK",swdaycount:swdayc,workingdays:[]},
    {name:"Volkan BALIKÇI",swdaycount:swdayc,workingdays:[]},
    {name:"Nilden TUTALAR",swdaycount:swdayc,workingdays:[]},
    {name:"Özgür SALGINCI",swdaycount:swdayc,workingdays:[]},
    {name:"Mengüç HALİL",swdaycount:swdayc,workingdays:[]},
    {name:"Gürkan",swdaycount:swdayc,workingdays:[]},
]
//max person allowed in office
let maxpersonCount=Math.round(employees.length*0.5);
employees=employees.sort(()=>Math.random() -0.5)
//columns
let days=[
    {day:"Monday",employeeCount:6},
    {day:"Tuesday",employeeCount:6},
    {day:"Wednesday",employeeCount:6},
    {day:"Thursday",employeeCount:6},
    {day:"Friday",employeeCount:6},
]
let date=new Date()

for(let i=0;i<employees.length;i++){
    let string1=''
    let workingdays=[...days]
    while(true){
       
        if(employees[i].swdaycount>0){
            workingdays=workingdays.sort(()=>Math.random() -0.5)
            let daysIndex= days.findIndex(i=>i.day===workingdays[workingdays.length-1].day)
            employees[i].workingdays.push(workingdays[workingdays.length-1].day)
            workingdays.pop();
            employees[i].swdaycount--;
            days[daysIndex].employeeCount--
            if(days[daysIndex].employeeCount<1){
                days.splice(daysIndex,1)
            }
        }
        else{
            break;
        }
      

    }
     
    console.log(employees[i])

}
console.log(days)



