function initSlide() {
    var slide = deleteAndAppendSlide();
    display(slide, "Step 1: onEdit handler", 50, 50, 600, 50, 40);
    display(slide, "Step 2: iPad never auto-lock", 50, 100, 600, 50, 40);
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
    var timeStampCol = getCol(sheet, TIME_STAMP_HEADER);
    var categoryCol = getCol(sheet, CATEGORY_HEADER);
    Logger.log("categoryCol:" + categoryCol);
    Logger.log("timeStampCol:" + timeStampCol);
    Logger.log("e.range.Col:" + e.range.getColumn());
    if (e.range.getColumn() == categoryCol + 1) {
        var timeStampCell = sheet.getRange(nextRow, timeStampCol + 1);
        if (timeStampCell.isBlank()) {
            timeStampCell.setValue(new Date());
        }
    }

    var yWonAPointCol = getCol(sheet, YOYO_WON_A_POINT_HEADER);
    var oWonAPointCol = getCol(sheet, OPPONENT_WON_A_POINT_HEADER);
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