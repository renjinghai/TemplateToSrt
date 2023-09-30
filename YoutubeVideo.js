// generate srt and dsp files from the active sheet.
function myFunction() {
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

        //Chapter in description
        ball++;
        var chapterStr = formatChapterStr(i == 1 ? START_OF_THE_DAY : start, `Ball${ball} ${category}`);
        dspDoc.getBody().appendParagraph(chapterStr);

        // subtitle
        srtABall(++srtCounter, srtDoc, start, end, prevYScore, prevOScore);
        srtInterval(++srtCounter, srtDoc, end, isTheLastBall, nexStart, yScore, oScore);
    }
}

// subtitle for a ball in game.
// The start is the begginging timestamp of a ball.
// The end is the end timestamp of a ball.
// The score is the score before this ball.
// format
// line1: counter
// line2: timestamp
// line3: Yoyo score
// line4: Opponent score
// line5: new line
function srtABall(counter, srtDoc, start, end, yScore, oScore) {
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

// subtitle for the interval between 2 balls.
// The score is the lastest socre in this round.
// format
// line1: counter
// line2: timestamp
// line3: next ball start time or winner if it is the last ball
// line4: Yoyo score
// line5: Opponent score
// line6: new line
function srtInterval(counter, srtDoc, end, isTheLastBall, nextStart, yScore, oScore) {
    // first line: counter
    srtDoc.getBody().appendParagraph(counter.toString());

    // second line: timestamp
    var nextStartTimeString = formatDateHMS(nextStart);
    var prevEndTimeString = formatDateHMS(end);
    var timeString = `${prevEndTimeString} --> ${nextStartTimeString}`;
    srtDoc.getBody().appendParagraph(timeString);

    // third line: next ball start time or winner
    // not the last ball then show the next ball start time
    if (!isTheLastBall) {
        var nextStartString = `Next ball: ${formatDateMS(nextStart)}`;
        srtDoc.getBody().appendParagraph(nextStartString);
    }

    // the last ball then show the winner
    else {
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
// The format is "minute:second - text".

function formatChapterStr(date, text) {
    var timeString = formatDateMS(date);
    return `${timeString} - ${text}`;
}
// no padZero. It is used for srt.

function formatDateHMS(date) {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
// with padZero. Padding is required by YouTube chapter.

function formatDateMS(date) {
    var paddedMinute = padZero(date.getMinutes(), 2);
    var paddedSecond = padZero(date.getSeconds(), 2);
    return `${paddedMinute}:${paddedSecond}`;
}
// add addtional zero as the prefix

function padZero(number, totalLength) {
    return number.toString().padStart(totalLength, '0');
}

