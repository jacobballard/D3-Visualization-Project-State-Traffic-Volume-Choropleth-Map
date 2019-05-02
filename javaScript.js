var customerTypeP = d3.csv("revVSconvForAllNewReturning.csv")
var customerDeviceDailyP = d3.csv("revVSconvForAllNewReturningDevices.csv")
var customerBounceP = d3.csv("revVSconvForBounce.csv")
var customerDeviceMonthlyP = d3.csv("revVSconvForMobileTabletDesktop.csv")

Promise.all([customerTypeP, customerBounceP, customerDeviceDailyP, customerDeviceMonthlyP]).then(function(values){
  var customerType = values
  var customerDeviceDaily = values
  var customerBounce = values
  var customerDeviceMonthlyP = values
})
