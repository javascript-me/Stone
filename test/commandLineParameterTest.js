
//In command line
//node commandLineParameterTest.js abc ddd
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});

console.log(process.argv.splice(2)[0]);