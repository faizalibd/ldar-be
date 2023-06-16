const exceljs = require("exceljs");
const e = require("express");

exports.createWorkbook = async (creator) => {
  let workbook = new exceljs.Workbook();
  workbook.creator = creator;
  workbook.created = new Date();
  return workbook;
};

exports.createSheet = async (workbook, name) => {
  let sheet = await workbook.addWorksheet(name);
  return sheet;
};

exports.removeSheet = async (workbook, sheet) => {
  await workbook.removeWorksheet(sheet.id);
};

exports.loadFile = async (type, file) => {
  switch (type) {
    case "xlsx":
      let workbook = await this.createWorkbook("");
      await workbook.xlsx.load(file.buffer);
      return workbook;
    case "xls":
      break;
    case "csv":
      break;
    default:
      return false;
  }
};
