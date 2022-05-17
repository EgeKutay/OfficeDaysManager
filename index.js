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

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('My Sheet');

worksheet.columns=[
    {header: "Id",key: "Id"},
    {header:"Name",key:"Name"},
    {header: "Monday",key:"Monday"},
    {header: "Tuesday",key:"Tuesday"},
    {header: "Wednesday",key:"Wednesday"},
    {header: "Thursday",key:"Thursday"},
    {header: "Friday",key:"Friday"},
  
]
let row;
for(let i=0;i<officeDayArr.length;i++){
   row=worksheet.addRow(officeDayArr[i]);
   row.eachCell(function(cell,colNumber){
    console.log(cell.address)
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

}


workbook.xlsx.writeFile(`./SF_Working_Plans/SF_Working_Plan${result}_Plan.xlsx`);
console.log("Successfully created the xlsx file!")