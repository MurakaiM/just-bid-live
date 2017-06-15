$(function () {
  setDates();
});


function setDates() {
  $("#birthday").datepicker({
    format: 'mm.dd.yyyy',
    endDate: new Date(),
    startDate: new Date("01.01.1900")
  });
}
