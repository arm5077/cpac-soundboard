// Requires AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in environmental variables
var express = require("express");
var app = express();
var Spreadsheet = require('edit-google-spreadsheet');
var AWS = require('aws-sdk');
var fs = require('fs');

var spreadsheet_username = process.env.SPREADSHEET_USERNAME
var spreadsheet_password = process.env.SPREADSHEET_PASSWORD

app.get("/", function(request, response){
	update();
	response.status(200).json("Updating spreadsheet now!")
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("We're live at port " + port + ".");
});


function update(){
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

							if( categoryIndex == -1 ) categoryIndex = export_array.categories.length - 1;

							// Search for day. If it's not there, add it.
							var dayIndex = export_array.categories[categoryIndex].days.map(function(day){ return day.name; }).indexOf(rows[row]['5']);
							if( dayIndex == -1 ){
								export_array.categories[categoryIndex].days.push({ "name": rows[row]['5'], "quotes": [] });
							}

							if( dayIndex == -1 ) dayIndex = export_array.categories[categoryIndex].days.length - 1;
							// Add quote
							export_array.categories[categoryIndex].days[dayIndex].quotes.push({
								"speaker": rows[row]["2"],
								"text": rows[row]["3"],
								"teaseText": rows[row]["4"],
								"img": rows[row]["8"],
								"audio": rows[row]["9"],
								"timestamp": rows[row]["6"] + " " + rows[row]["7"]
							})
						}


					}
				}
			export_string = JSON.stringify(export_array);

			var s3 = new AWS.S3({params: {Bucket: 'nationaljournal', Key: 'cpac-soundboard'}});
			s3.upload({
				Key: "cpac-soundboard/data.json",
				Body: export_string,
				ACL: "public-read",
			}, function(resp){
				console.log(arguments)

				// Update spreadsheet
				spreadsheet.add({ 1: { 10: "Updated: " + new Date()} });
				spreadsheet.send(function(err) {
					if(err) throw err; 
					console.log("Spreadsheet timestamp updated");
				});

			});


		});
	});
	
	
}



