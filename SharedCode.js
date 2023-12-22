// headers
const START_HEADER = "start";
const END_HEADER = "end";
const YOYO_WON_A_POINT_HEADER = "Y得分";
const OPPONENT_WON_A_POINT_HEADER = "O得分";
const CATEGORY_HEADER = "Category";
const TIME_STAMP_HEADER = "time stamp";

// columns
const SERVE_COL = 0;
const YOYO_SCORE_COL = 1;
const OPPONENT_SCORE_COL = 2;

const LAST_ROW = 40;
const YOYO = "悠悠"
const OPPONENT = "对手";
const START_OF_THE_DAY = new Date("Sat Dec 30 00:00:00 GMT-08:00 1899");
const END_OF_THE_DAY = new Date("Sat Dec 30 00:59:00 GMT-08:00 1899");
const SLIDES_ID = "1Pa6jWcdUNgISV_R2eVddov0qz1IkMm2zWDI7L0-DNas";

function getCol(sheet, header) {
  const values = sheet.getRange(1, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  const headers = values.shift();
  return headers.indexOf(header);
}

function isOdd(value) {
  return (value % 2)
}