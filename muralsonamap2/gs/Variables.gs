// ID of the folder where the files will be saved
// name can be found as the end part after https://drive.google.com/drive/folders/ when you open the folder
var folder_id = "1zm0hrVckWv9AuwdJXe-M8acLA3ME7sXQ";

// ID of the workbook where the script works, to read/write stuff from/to sheets
// name can be found as the end part after https://docs.google.com/spreadsheets/d/
var wb_id = "1qIiy3nOha_m1qNAGsQ_uby8JHvY1hGnJoeohriRw97E";
var sheet_name = "BASE";
var max_downloads = 30;
var current_downloads = 0;

//Run this function to test the folder & spreadsheet
//The function will ask for rights, accept those
//After that, the OK folder & OK workbook should be returned
function RunTests() {
  Logger.log(TestFolder());
  Logger.log(TestWorkbook());
  Logger.log(TestSheet());
}

function TestFolder() {
  try {
    var drive_folder = DriveApp.getFolderById(folder_id);
    return "OK folder";    
  } catch(e) {
    return "ERROR, " + e;
  }
}

function TestWorkbook() {
  try {
    var wb = SpreadsheetApp.openById(wb_id);
    return "OK workbook";    
  } catch(e) {
    return "ERROR, " + e;
  }
}

function TestSheet() {
  try {
    var wb = SpreadsheetApp.openById(wb_id);
    var sht = wb.getSheetByName(sheet_name);
    return "OK sheet";    
  } catch(e) {
    return "ERROR, " + e;
  }
}