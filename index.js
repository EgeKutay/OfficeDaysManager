const fs = require("fs");
const ExcelJS = require('exceljs');
const {
  Parser,
  transforms: { unwind, flatten },
} = require("json2csv");
//rows
const data = require("./config.json");
const officeDayArr=require("./lib/core")
let currentdate = new Date();
let oneJan = new Date(currentdate.getFullYear(),0,1);
let numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));

let result = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
function dates(current) {
  var week= new Array(); 
  // Starting Monday not Sunday
  current.setDate((current.getDate() - current.getDay() +8));
  for (var i = 0; i < 7; i++) {
      week.push(
          new Date(current)
      ); 
      current.setDate(current.getDate() +1);
  }
  return week; 
}
let weekDays=dates(currentdate)


const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('My Sheet');
worksheet.columns=[
    {header: "Id",key: "Id"},
    {header:"Name",key:"Name"},
    {header:`${weekDays[0].getDate()} Monday`,key:"Monday"},
    {header:`${weekDays[1].getDate()} Tuesday`,key:"Tuesday"},
    {header:`${weekDays[2].getDate()} Wednesday`,key:"Wednesday"},
    {header:`${weekDays[3].getDate()} Thursday`,key:"Thursday"},
    {header:`${weekDays[4].getDate()} Friday`,key:"Friday"},
    {header:`Office Days Count`,key:"none"},
]
let row;
for(let i=0;i<officeDayArr.length;i++){
   row=worksheet.addRow(officeDayArr[i]);
   row.eachCell(function(cell,colNumber){
    
    if(worksheet.getCell(cell.address).value=='NW'){
      worksheet.getCell(cell.address).border = {
        top: {style:'thin'},
        left: {style:'thin'},
        bottom: {style:'thin'},
        right: {style:'thin'}
      };
        worksheet.getCell(cell.address).fill = {
            type: 'pattern',
  pattern:'solid',
  fgColor:{argb:'FFF0F0'},
            
          };
    }
    else if(worksheet.getCell(cell.address).value=='SW'){
      worksheet.getCell(cell.address).border = {
        top: {style:'thin'},
        left: {style:'thin'},
        bottom: {style:'thin'},
        right: {style:'thin'}
      };
      worksheet.getCell(cell.address).fill = {
          type: 'pattern',
pattern:'solid',
fgColor:{argb:'F0F0FF'},
          
        };
  }
    });
    worksheet.getCell(`H${i+2}`).value={ formula: `=COUNTIF(C${i+2}:G${i+2},"NW")` };
    worksheet.getCell(`H${i+2}`).border = {
      top: {style:'thin'},
      left: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'}
    };;
    worksheet.getCell(`H${i+2}`).fill= {
      type: 'pattern',
  pattern:'solid',
  fgColor:{argb:'FFEECC'},
      
    };;

}

worksheet.getCell(`A${officeDayArr.length+2}`).value="Normal Working Count:"

for(let i=67;i<72;i++){
  let letter=String.fromCharCode(i);
  worksheet.getCell(`${letter}${officeDayArr.length+2}`).value={ formula: `=COUNTIF(${letter}${2}:${letter}${officeDayArr.length+1},"NW")` };
  worksheet.getCell(`${letter}${officeDayArr.length+2}`).fill= {
    type: 'pattern',
pattern:'solid',
fgColor:{argb:'FFFF66'},
    
  };
  worksheet.getCell(`${letter}${officeDayArr.length+2}`).border = {
    top: {style:'thin'},
    left: {style:'thin'},
    bottom: {style:'thin'},
    right: {style:'thin'}
  };
}
worksheet.getCell(`H${officeDayArr.length+2}`).value={formula:`=SUM(C${officeDayArr.length+2}:G${officeDayArr.length+2})`}
worksheet.getCell(`H${officeDayArr.length+2}`).fill= {
  type: 'pattern',
pattern:'solid',
fgColor:{argb:'FFCF00'},
  
};
worksheet.getCell(`H${officeDayArr.length+2}`).border = {
  top: {style:'thin'},
  left: {style:'thin'},
  bottom: {style:'thin'},
  right: {style:'thin'}
};



workbook.xlsx.writeFile(`SF_Working_Plan${result}_Plan.xlsx`);