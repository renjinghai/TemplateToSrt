// generate srt and dsp files from the active sheet.
function myFunction() {
    var sheet = SpreadsheetApp.getActiveSheet();
    var docNamePrefix = `${SpreadsheetApp.getActiveSpreadsheet().getName()}_${sheet.getName()}`;
    var srtDoc = generateSrtDoc(docNamePrefix);
    var dspDoc = generateDspDoc(docNamePrefix);

    var startCol = getCol(sheet, START_HEADER);
    var endCol = getCol(sheet, END_HEADER);
    var categoryCol = getCol(sheet, CATEGORY_HEADER);
    var durationCol = getCol(sheet, DURATION_HEADER);

    var data = sheet.getDataRange().getValues();
    var srtCounter = 0;

    dspDoc.getBody().appendParagraph("Timecodes");
    var round = 0;
    var prevRoundYScores = [];
    var prevRoundOScores = [];
    // skip header
    for (var i = 1; i < data.length && data[i][startCol]; i++) {
        var ballNumberAndServer = data[i][SERVE_COL];
        var ball = ballNumberAndServer.slice(0, -1);
        if (ball == 1) {
          round++;
        }

        var isTheFirstBall = (i == 1);
        var isTheLastBall = (i == data.length-1);

        var start = data[i][startCol];
        var category = data[i][categoryCol];

        var yScore = data[i][YOYO_SCORE_COL];
        var oScore = data[i][OPPONENT_SCORE_COL];
        var prevYScore = data[i - 1][YOYO_SCORE_COL];
        var prevOScore = data[i - 1][OPPONENT_SCORE_COL];
        var prevEnd = (isTheFirstBall ? START_OF_THE_DAY : data[i - 1][endCol]);
        var end = data[i][endCol];

        
        //Chapter in description
        var duration = data[i][durationCol];
        var missing = (0 == duration);
        var chapterStr = formatChapterStr(isTheFirstBall ? START_OF_THE_DAY : start, `R${round}B${ball} ${category}`,missing);
        dspDoc.getBody().appendParagraph(chapterStr);

        // subtitle
        subtitle(++srtCounter, srtDoc, prevEnd, end, prevYScore, prevOScore, prevRoundYScores, prevRoundOScores);
        if (isTheLastBall) {
            subtitle(++srtCounter, srtDoc, end, END_OF_THE_DAY, yScore, oScore, prevRoundYScores, prevRoundOScores);
        }

        if (ball == 1) {
          // not the first round
          if (i != 1) {
            // push the scores
            prevRoundYScores.push(prevYScore);
            prevRoundOScores.push(prevOScore);
          }
        }
    }

    function generateDspDoc() {
        var dspDocName = `${docNamePrefix}_dsp`;
        var dspDoc = DocumentApp.create(dspDocName);
        Logger.log(dspDoc.getName());
        return dspDoc;
    }

    function generateSrtDoc() {
        var srtDocName = `${docNamePrefix}_srt`;
        var srtDoc = DocumentApp.create(srtDocName);
        Logger.log(srtDoc.getName());
        return srtDoc;
    }
}

// format
// line1: counter
// line2: timestamp
// line3: Yoyo score
// line4: Opponent score
// line5: new line
function subtitle(counter, srtDoc, start, end, yScore, oScore, prevRoundYScores, prevRoundOScores) {
    // first line: counter
    srtDoc.getBody().appendParagraph(counter.toString());

    // second line: timestamp
    var startTimeString = formatDateHMS(start);
    var endTimeString = formatDateHMS(end);
    var timeString = `${startTimeString} --> ${endTimeString}`;
    srtDoc.getBody().appendParagraph(timeString);

    // third line: yoyo score
    var yPaddedScore = padZero(yScore, 2);
    var yPrevScores = formatPreviousScores(prevRoundYScores);
    var yScoreString = `${YOYO} ${yPrevScores}${yPaddedScore}`;
    srtDoc.getBody().appendParagraph(yScoreString);

    // fourth line: opponent score
    var oPaddedScore = padZero(oScore, 2);
    var oPrevScores = formatPreviousScores(prevRoundOScores);
    var oScoreString = `${OPPONENT} ${oPrevScores}${oPaddedScore}`;
    srtDoc.getBody().appendParagraph(oScoreString);

    // last line: new line
    srtDoc.getBody().appendParagraph("");
}

// e.g. 11 09 11 13
function formatPreviousScores(scores) {
  let text = "";
  for (let i = 0; i < scores.length; i++) {
    let score = scores[i];
    let paddedScore = padZero(score, 2);
    text += paddedScore;
    text += ' ';
  }
  return text;
}


// The format is "minute:second - text".
// If missing, "text".
function formatChapterStr(date, text, missing) {
    var timeString = formatDateMS(date);
    if (missing) {
      return text;
    } else {
      return `${timeString} - ${text}`;
    }
}

// no padZero. It is used for srt.
function formatDateHMS(date) {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

// with padZero. Padding is required by YouTube chapter.
function formatDateMS(date) {
    var paddedMinute = padZero(date.getMinutes(), 1);
    var paddedSecond = padZero(date.getSeconds(), 2);
    return `${paddedMinute}:${paddedSecond}`;
}

// add addtional zero as the prefix
function padZero(number, totalLength) {
    return number.toString().padStart(totalLength, '0');
}

//