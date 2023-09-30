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

  Qunit.test("formatDateHMS", function (assert) {
    assert.equal(formatDateHMS(new Date("Sat Dec 30 00:00:00 GMT-08:00 1899")), "0:0:0", "all zeros");
    assert.equal(formatDateHMS(new Date("Sat Dec 30 01:02:03 GMT-08:00 1899")), "1:2:3", "single digits");
    assert.equal(formatDateHMS(new Date("Sat Dec 30 12:34:56 GMT-08:00 1899")), "12:34:56", "two digits");
  });

  Qunit.test("formatDateMS", function (assert) {
    assert.equal(formatDateMS(new Date("Sat Dec 30 00:00:00 GMT-08:00 1899")), "00:00", "all zeros");
    assert.equal(formatDateMS(new Date("Sat Dec 30 01:02:03 GMT-08:00 1899")), "02:03", "single digits");
    assert.equal(formatDateMS(new Date("Sat Dec 30 12:34:56 GMT-08:00 1899")), "34:56", "two digits");
  });

  Qunit.start();
  return QUnitGS2.getHtml();
}

// Retrieve test results when ready.
function getResultsFromServer() {
  return QUnitGS2.getResultsFromServer();
}