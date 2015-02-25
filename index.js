// Requires AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in environmental variables

var Spreadsheet = require('edit-google-spreadsheet');
var AWS = require('aws-sdk');
var fs = require('fs');

var spreadsheet_username = process.env.SPREADSHEET_USERNAME
var spreadsheet_password = process.env.SPREADSHEET_PASSWORD



Spreadsheet.load({
	debug: true,
	spreadsheetName: "CPAC quote database",
	worksheetName: "Sheet1",
	username: spreadsheet_username,
	password: spreadsheet_password
}, function(err, spreadsheet){
	if( err ) throw err;
	spreadsheet.receive(function(err, rows, info) {
		if( err ) throw err;
	
		var export_array = {};
		export_array.categories = [];
	
			for( var row in rows ){
				if( rows.hasOwnProperty(row) ){
					// Skip the first row
					if( rows[row]['1'] != "Category") {
						// Search for category. If it's not there, add it.
						var categoryIndex = export_array.categories.map(function(category){ return category.name; }).indexOf(rows[row]['1']);
						
						if( export_array.categories.map(function(category){ return category.name; }).indexOf(rows[row]['1']) == -1 ){
							export_array.categories.push({ "name": rows[row]['1'], "days": [] });
						}
						
						if( categoryIndex == -1 ) categoryIndex = 0;
						
						if( export_array.categories[categoryIndex].days.map(function(day){ return day.name; }).indexOf(rows[row]['5']) == -1 ){
							export_array.categories[categoryIndex].days.push({ "name": rows[row]['5'], "quotes": [] });
						}
						
					}
					
				
				}
			}
		console.log(export_array);
	});
});



fs.readFile('template/data.json', function(err, data){
	if( err ) throw err;
	
	var data = new Buffer(data, 'binary');
	
	var s3 = new AWS.S3({params: {Bucket: 'nationaljournal', Key: 'cpac-soundboard'}});
	s3.upload({
		Key: "cpac-soundboard/data.json",
		Body: data,
		ACL: "public-read",
	}, function(resp){
		console.log(arguments)
	});
	
});