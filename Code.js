const START_HEADER = "start";
const END_HEADER = "end";
const YOYO_WON_A_POINT_COL = "Y得分";
const OPPONENT_WON_A_POINT_COL = "O得分";
const CATEGORY_HEADER = "Category";
const SERVE_COL = 0;
const YOYO_SCORE_COL = 1;
const OPPONENT_SCORE_COL = 2;
const LAST_ROW = 40;
const YOYO = "Yueran"
const OPPONENT = "Opponent";
const START_OF_THE_DAY = new Date("Sat Dec 30 00:00:00 GMT-08:00 1899");
const END_OF_THE_DAY = new Date("Sat Dec 30 00:59:00 GMT-08:00 1899");
const SLIDES_ID = "1Pa6jWcdUNgISV_R2eVddov0qz1IkMm2zWDI7L0-DNas";

function myFunction() {
  var slide = deleteAndAppendSlide();
  display(slide, "Step 1: onEdit handler", 50, 50, 600, 50, 40);
  display(slide, "Step 2: iPad never auto-lock", 50, 100, 600, 50, 40);
  var sheet = SpreadsheetApp.getActiveSheet();
  var docName = `${SpreadsheetApp.getActiveSpreadsheet().getName()}_${sheet.getName()}`;
  var srtDocName = `${docName}_srt`;
  var srtDoc = DocumentApp.create(srtDocName);
  Logger.log(srtDoc.getName());
  var dspDocName = `${docName}_dsp`;
  var dspDoc = DocumentApp.create(dspDocName);
  Logger.log(dspDoc.getName());

  var startCol = getCol(sheet, START_HEADER);
  var endCol = getCol(sheet, END_HEADER);
  var categoryCol = getCol(sheet, CATEGORY_HEADER);

  var data = sheet.getDataRange().getValues();
  var srtCounter = 0;

  dspDoc.getBody().appendParagraph("Timecodes");
  var ball = 0;
  // skip header
  for (var i = 1; data[i][startCol] && i < data.length; i++) {
    var start = data[i][startCol];
    var end = data[i][endCol];
    var category = data[i][categoryCol];
    var yScore = data[i][YOYO_SCORE_COL];
    var oScore = data[i][OPPONENT_SCORE_COL];

    var prevYScore = data[i - 1][YOYO_SCORE_COL];
    var prevOScore = data[i - 1][OPPONENT_SCORE_COL];

    var isTheLastBall = !(data[i + 1][startCol]);
    var nexStart = isTheLastBall ? END_OF_THE_DAY : data[i + 1][startCol];

    //Description
    ball++;
    dsp(dspDoc, i == 1 ? START_OF_THE_DAY : start, `Ball${ball} ${category}`);
    //dsp(dspDoc, end, `Ball${ball} interval`);

    // subtitle
    srtGame(++srtCounter, srtDoc, start, end, prevYScore, prevOScore);
    srtInterval(++srtCounter, srtDoc, end, isTheLastBall, nexStart, yScore, oScore);

  }
}

function formatDateHMS(date) {
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

function formatDateMS(date) {
  var paddedMinute = padZero(date.getMinutes(), 2);
  var paddedSecond = padZero(date.getSeconds(), 2);
  return `${paddedMinute}:${paddedSecond}`;
}

function padZero(number, totalLength) {
  return number.toString().padStart(totalLength, '0');
}

function dsp(doc, date, text) {
  var timeString = formatDateMS(date);
  var dspString = `${timeString} - ${text}`;
  doc.getBody().appendParagraph(dspString);
}

function srtGame(counter, srtDoc, start, end, yScore, oScore) {
  // first line: counter
  srtDoc.getBody().appendParagraph(counter.toString());

  // second line: timestamp
  var startTimeString = formatDateHMS(start);
  var endTimeString = formatDateHMS(end);
  var timeString = `${startTimeString} --> ${endTimeString}`;
  srtDoc.getBody().appendParagraph(timeString);

  // third line: yoyo score
  var yScoreString = `${YOYO} ${yScore}`;
  srtDoc.getBody().appendParagraph(yScoreString);

  // fourth line: opponent score
  var oScoreString = `${OPPONENT} ${oScore}`;
  srtDoc.getBody().appendParagraph(oScoreString);

  // last line: new line
  srtDoc.getBody().appendParagraph("");
}

function srtInterval(counter, srtDoc, end, isTheLastBall, nextStart, yScore, oScore) {
  // first line: counter
  srtDoc.getBody().appendParagraph(counter.toString());

  // second line: timestamp
  var nextStartTimeString = formatDateHMS(nextStart);
  var prevEndTimeString = formatDateHMS(end);
  var timeString = `${prevEndTimeString} --> ${nextStartTimeString}`;
  srtDoc.getBody().appendParagraph(timeString);

  // third line: next ball or winner
  // not the last ball
  if (!isTheLastBall) {
    var nextStartString = `Next ball: ${formatDateMS(nextStart)}`;
    srtDoc.getBody().appendParagraph(nextStartString);
  } else {
    var winner;
    if (yScore < oScore) {
      winner = OPPONENT;
    } else {
      winner = YOYO;
    }
    srtDoc.getBody().appendParagraph(`${winner} Win`);
  }

  // fourth line: yoyo score
  var yNewScoreString = `${YOYO} ${yScore}`;
  srtDoc.getBody().appendParagraph(yNewScoreString);

  // fifth line: opponent score
  var oNewScoreString = `${OPPONENT} ${oScore}`;
  srtDoc.getBody().appendParagraph(oNewScoreString);

  // last line: new line
  srtDoc.getBody().appendParagraph("");
}

function getCol(sheet, header) {
  const values = sheet.getRange(1, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  const headers = values.shift();
  return headers.indexOf(header);
}

/**
 * The event handler triggered when editing the spreadsheet.
 * @param {Event} e The onEdit event.
 * @see https://developers.google.com/apps-script/guides/triggers#onedite
 */
function onEdit(e) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var yScore = data[LAST_ROW][YOYO_SCORE_COL];
  var oScore = data[LAST_ROW][OPPONENT_SCORE_COL];
  Logger.log("yScore:" + yScore);
  Logger.log("oScore" + oScore);
  var nextRow = e.range.getRow();
  Logger.log("curRow:" + nextRow);
  var ballNumberAndServer = data[nextRow][SERVE_COL];
  var server = ballNumberAndServer.at(-1);
  var ballNumber = ballNumberAndServer.slice(0, -1);
  Logger.log(server);
  var yServe = " ";
  var oServe = " ";
  var serveNumber;
  if (isOdd(ballNumber)) {
    serveNumber = 1;
  } else {
    serveNumber = 2;
  }
  var serveStr = `#${ballNumber} Serve${serveNumber}`;
  if ("Y" == server) {
    yServe = serveStr;
  } else {
    oServe = serveStr;
  }
  Logger.log("yServe:" + yServe);
  Logger.log("oServe:" + oServe);

  var curRow = nextRow - 1;
  Logger.log(data[curRow]);
  var yWonAPointCol = getCol(sheet, YOYO_WON_A_POINT_COL);
  var oWonAPointCol = getCol(sheet, OPPONENT_WON_A_POINT_COL);
  var yWonAPoint = data[curRow][yWonAPointCol];
  var yWonAPointSymbol = toWonAPointSymbol(yWonAPoint);
  var oWonAPoint = data[curRow][oWonAPointCol];
  var oWonAPointSymbol = toWonAPointSymbol(oWonAPoint);

  try {
    //var slide = getSlide();
    var slide = deleteAndAppendSlide();
    const width = 300;
    const yLeft = 50;
    const oLeft = 375;
    const nameTop = 0;
    const nameHeight = 50;
    const scoreTop = nameTop + nameHeight;
    const scoreHeight = width;
    const serveTop = scoreTop + scoreHeight;
    const symbolWidth = nameHeight;
    display(slide, YOYO, yLeft, nameTop, width, nameHeight, 40);
    display(slide, yScore, yLeft, scoreTop, width, scoreHeight, 240);
    display(slide, yWonAPointSymbol, yLeft + width - nameHeight, nameTop + nameHeight, symbolWidth, nameHeight, 40);
    display(slide, yServe, yLeft, serveTop, width, nameHeight, 40);

    display(slide, OPPONENT, oLeft, nameTop, width, nameHeight, 40);
    display(slide, oScore, oLeft, scoreTop, width, scoreHeight, 240);
    display(slide, oWonAPointSymbol, oLeft + width - nameHeight, nameTop + nameHeight, symbolWidth, nameHeight, 40);
    display(slide, oServe, oLeft, serveTop, width, nameHeight, 40);

    presentation.saveAndClose();
  } catch (err) {
    console.log('Failed with an error %s ', err.message);
    console.log('Failed with an error %s ', err);
  }
}

function display(slide, text, left, top, width, height, fontSize) {
  var shape = slide.insertShape(SlidesApp.ShapeType.RECTANGLE);
  shape.setLeft(left).setTop(top).setWidth(width).setHeight(height).setRotation(0);
  const textRange = shape.getText();
  textRange.setText(text);
  textRange.getTextStyle().setFontSize(fontSize);
}

function getSlide() {
  const presentation = SlidesApp.openById(SLIDES_ID);
  return presentation.getSlides()[0];
}

function deleteAndAppendSlide() {
  const presentation = SlidesApp.openById(SLIDES_ID);
  presentation.getSlides().pop().remove();
  return presentation.appendSlide();
}

function toWonAPointSymbol(point) {
  if (point == 0) {
    return " ";
  } else {
    return "+";
  }
}

function isOdd(value) {
    return (value % 2)
}