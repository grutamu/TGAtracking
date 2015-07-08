 $(document).ready(function(){

//////////////////////////////////////////////////////////////////////
//PATTY'S GROVEY TABLE
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
//COURSE STRUCTURE
//////////////////////////////////////////////////////////////////////



//replace #table_id with the table's actual id
$("button#button_add_row_groveyCourseStructure").on('click', function(event) {	
	event.preventDefault();//prevent page reload on button click
	//copy Template that is hidden
  $("table#grovey_courseStructureTableTemplate tbody tr:last").clone().appendTo("table#grovey_courseStructureTable"); 
  //renumber('grovey_courseStructureTable'); 
  renumberAddOnRow('grovey_courseStructureTable'); //renumbers last row only
  emptyInputsOnNewRow('grovey_courseStructureTable');
});

/////////////////////////////////////////////////////////////////////
//GRADING WEIGHTS TABLE
////////////////////////////////////////////////////////////////////

$("button#button_add_row_groveyGradingWeights").on('click', function() {
  event.preventDefault();//prevent page reload on button click
  $("table#grovey_gradingWeightsTable tbody tr:first").clone().appendTo("table#grovey_gradingWeightsTable");
  renumber('grovey_gradingWeightsTable'); 
  //renumberAddOnRow('grovey_gradingWeightsTable'); //renumbers last row only
  emptyInputsOnNewRow('grovey_gradingWeightsTable');
});


/////////////////////////////////////////////////////////////////////
//GRADING SCALE TABLE
////////////////////////////////////////////////////////////////////
$("button#button_add_row_groveyGradingScale").on('click', function() {
  event.preventDefault();//prevent page reload on button click
  $("table#grovey_gradingScaleTable tbody tr:first").clone().appendTo("table#grovey_gradingScaleTable");
  renumber('grovey_gradingScaleTable');
  //renumberAddOnRow('grovey_gradingScaleTable');//renumbers last row only
  emptyInputsOnNewRow('grovey_gradingScaleTable');
});

/////////////////////////////////////////////////////////////////////
//SAMPLE TABLE
////////////////////////////////////////////////////////////////////
//replace #table_id2 with the table2's actual id
//replace #button_id with add row button id
$("button#button_id").on('click', function() {
  event.preventDefault();//prevent page reload on button click
  $("table#table_id2 tbody tr:first").clone().appendTo("table#table_id2");
  renumber('table_id2'); 
  emptyInputsOnNewRow('table_id2');
});


///////////////////////////////////////////////////////////////////////
// PATTY'S GROVEY TABLE FUNCTIONS
// No need to update as everything is passed from above initialization
////////////////////////////////////////////////////////////////////////

// must leave the class names the same for the buttons
         //<button class='groveyTbl_move_up'>up</button>
         //<button class='groveyTbl_move_down'>down</button>
     	 //<button class='groveyTbl_delete'>x</button>

//table must use tbody and if using header, use thead so can define first rows

//hide first set of buttons with table class set to grovey_table so they can't be deleted on page load
$("table.grovey_table tbody tr:first").find('button.groveyTbl_move_up').hide();
//$("table.grovey_table tbody tr:first").find('button.groveyTbl_move_down').hide();
$("table.grovey_table tbody tr:last").find('button.groveyTbl_move_down').hide();
$("table.grovey_table tbody tr:first").find('button.groveyTbl_delete').hide();

//delete
$("table").on("click", ".groveyTbl_delete", function (event) {
	event.preventDefault(); //prevent page reload
	var table_id = $(this).closest('table').attr('id');	
    $(this).closest("tr").remove();
	
	//don't renumber courseStructure table	
	if (table_id != 'grovey_courseStructureTable') {
    	renumber(table_id);
	}
});
//move up
$("table").on("click", ".groveyTbl_move_up", function (event) {
	event.preventDefault(); //prevent page reload												   
	var table_id = $(this).closest('table').attr('id');												  
	var row = $(this).parents("tbody tr:first");
	row.insertBefore(row.prev());
	renumber(table_id);
});
//move down
$("table").on("click", ".groveyTbl_move_down", function (event) {
	event.preventDefault(); //prevent page reload													 
	var table_id = $(this).closest('table').attr('id');
	var row = $(this).parents("tbody tr:first");
	row.insertAfter(row.next());
	renumber(table_id);
});

function renumberAddOnRow(table_id) {
	var rowCount = $("table#"+table_id+" > tbody > tr ").length;
	
	$("table#"+table_id+" > tbody > tr:last").each(function(){
			$(this).find('input').attr({
			  'id': function(_, id) { return id.replace(/\d+$/, '') + rowCount },
			  'name': function(_, name) { return name.replace(/\d+$/, '') + rowCount }               
			});
			$(this).find('select').attr({
			  'id': function(_, id) { return id.replace(/\d+$/, '') + rowCount },
			  'name': function(_, name) { return name.replace(/\d+$/, '') + rowCount }               
			});
			
		});
}


function renumber(table_id) {
		//renumber the id and name of each input in a table row  - txtTitle1, txtTitle2, etc
		var i = 1;
		
		$("table#"+table_id+" > tbody > tr ").each(function(){
			$(this).find('input').attr({
			  'id': function(_, id) { return id.replace(/\d+$/, '') + i },
			  'name': function(_, name) { return name.replace(/\d+$/, '') + i }               
			});
			$(this).find('select').attr({
			  'id': function(_, id) { return id.replace(/\d+$/, '') + i },
			  'name': function(_, name) { return name.replace(/\d+$/, '') + i }               
			});
			i++;
		});
		
		reset_updown(table_id);
}

function reset_updown(table_id) 
{ 	//disable the visibility of some button on certain rows
	// for example, on move up button on first or last row
	$("table#"+table_id+" tbody tr").find('button.groveyTbl_move_up').show();
	$("table#"+table_id+" tbody tr:first").find('button.groveyTbl_move_up').hide();
	$("table#"+table_id+" tbody  tr").find('button.groveyTbl_move_down').show();
	$("table#"+table_id+" tbody tr:last").find('button.groveyTbl_move_down').hide();
	$("table#"+table_id+" tbody tr").find('button.groveyTbl_delete').show();
	$("table#"+table_id+" tbody tr:first").find('button.groveyTbl_delete').hide();
	
}

  //empty text vals in last row
 function emptyInputsOnNewRow(table_id) {
  		$("table#"+table_id+" tbody tr:last td input ").each(function(){
			var el = $(this);
			//var type = el.attr('type'); //will either be 'text', 'radio', or 'checkbox
			if(el.is('input:text')) { //text box
				el.val('');
			} 
			/* //will make both hidden checkbox and displayed checkbox both set to 0 - displayed checkbox should be kept at 1
			else if(el.is('input:checkbox')) { // checkbox
				el.val('0');
			} 
			*/
		});
	//set select to 0 in last row
		$("table#"+table_id+" tbody tr:last td select ").each(function(){
			var el = $(this);
			el.val('0');
		});
 }

	//style buttons
	$( "button.groveyTbl_move_up" ).button({							   
		  icons: {
			primary: "ui-icon-triangle-1-n"
		  },
		  text: false
	});
	$( "button.groveyTbl_move_down" ).button({
		  icons: {
			primary: "ui-icon-triangle-1-s"
		  },
		  text: false
	});
	$( "button.groveyTbl_delete" ).button({
		  icons: {
			primary: "ui-icon-trash"
		  },
		  text: false
	});
	//only works if button out of table
	$( "table tr td button.groveyTbl_addRow").button({
		  icons: {
			primary: "ui-icon-plus"
		  }
	});

});
/////////////////////////////////////////////////////////////////////////
// END GROVEY TABLE
/////////////////////////////////////////////////////////////////////////