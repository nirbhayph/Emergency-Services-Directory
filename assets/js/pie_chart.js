// pie chart module
let pieChart = (function() {
	'use strict';
	
	// formats data as required by canvas js 
	// filters data to only percentFilter amount
	function makeData(data, percentFiter){
		percentFiter = percentFiter || 3;
		let dataArr = [];
		let countyCounts = {};
		$("row", data).each(function(){
			if(!($("CountyName", this).text().includes("null"))){
				dataArr.push($("CountyName", this).text());
			}
		});
		for(let i=0; i<dataArr.length; i++){
			let county = dataArr[i];
			countyCounts[county] = countyCounts[county] ? countyCounts[county] + 1 : 1;
		}
		let pieData = [];
		let counties = Object.keys(countyCounts);
		for(let i=0; i<counties.length; i++){
			let dataPoint = new Object();
			dataPoint["label"] = counties[i];
			dataPoint["y"] = (countyCounts[counties[i]])/dataArr.length*100;
			if(dataPoint["y"] >= percentFiter){
				pieData.push(dataPoint);
			}
		}
		return pieData;
	}

	// creates and renders canvas chart in modal with data and options provided
	function createChart(titleText, subTitleText, data){
		// chart creation options
		let options = {
			title: {
				text: titleText
			},
			subtitles: [{
				text: subTitleText
			}],
			animationEnabled: true,
			data: [{
				type: "pie",
				startAngle: 40,
				toolTipContent: "<b>{label}</b>: {y}%",
				showInLegend: "true",
				legendText: "{label}",
				indexLabelFontSize: 16,
				indexLabel: "{label} - {y}%",
				dataPoints: data
			}]
		};
		
		// create chart
		let chart = new CanvasJS.Chart("pieChartContainer", options);
		
		// render on modal display
		$('#pieChartModal').on('shown.bs.modal', function () {
			chart.render();
		});
	}

	// public methods
    return {
        createChart: createChart,
        makeData: makeData
    };
}());
// pie chart module ends