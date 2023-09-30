// Optional for easier use.
var Qunit = QUnitGS2.QUnit;

// HTML get function
function doGet() {
  QUnitGS2.init();

  /**
  * Add your test functions here.
  */
  Qunit.module("Basic tests");

  Qunit.test("padZero", function (assert) {
    assert.equal(padZero(10, 2), "10", "2 digits no prefix zero");
    assert.equal(padZero(8, 2), "08", "1 digit one prefix zero");
  });

  Qunit.start();
  return QUnitGS2.getHtml();
}

// Retrieve test results when ready.
function getResultsFromServer() {
  return QUnitGS2.getResultsFromServer();
}