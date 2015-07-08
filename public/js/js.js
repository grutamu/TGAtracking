/* for testing
if (typeof jQuery == 'undefined') {  
    console.log("jQuery is not loaded");  
    //or
    //alert("jQuery is loaded");  
} else {
    console.log("jQuery is not loaded");
    //alert("jQuery is not loaded"); 
}
*/


// JavaScript Document
 $(document).ready(function() {					



	  //tablesorter pagination					
	  $("#myTable").tablesorter({
				widthFixed: true, 
				widgets: ['zebra']
		});	
    	$("#myTable").tablesorterPager({
				container: $("#pager"),
				size: 50 //for default number of rows - change  'selected' in pagination drop down, if all, use 99999 or a number larger than number of table rows
		});
      //attendance table
	  $("#myTable_attendance").tablesorter({
				widthFixed: true,
				
		});	
    	$("#myTable_attendance").tablesorterPager({
				container: $("#pager"),
				size: 50 //for default number of rows - change  'selected' in pagination drop down, if all, use 99999 or a number larger than number of table rows
		});	
			
		//confirm dialog boxes
		$("#dialog-confirm").dialog({
		  autoOpen: false,
		  modal: true
		});	

/////////////////////////////////////////////////////////////////
// REPORT CARD DATA
/////////////////////////////////////////////////////////////////
	//accordian for progress report data
	$( "#accordion_reportCard" ).accordion({
      		heightStyle: "content",
      		active: false,
      		collapsible: true
    });		

/////////////////////////////////////////////////////////////////
// PROGRESS REPORT DATA
/////////////////////////////////////////////////////////////////
	//accordian for progress report data
	$( "#accordion_progressReport" ).accordion({
      		heightStyle: "content",
      		active: false,
      		collapsible: true
    });		

/////////////////////////////////////////////////////////////////
// DA COURSE ATTENDANCE BY STUDENT
/////////////////////////////////////////////////////////////////
	//accordian for district admins student course attendance
	$( "#accordion_courseAttendance" ).accordion({
      		heightStyle: "content",
      		active: false,
      		collapsible: true
    });	

/////////////////////////////////////////////////////////////////
//GRADING SCALE
/////////////////////////////////////////////////////////////////
//appendGrid initializing code is on the page
	//validation on letter change to make sure is character and not integer
	$(document).on('blur', '#grovey_gradingScaleTable .grading_scale_letter_grade', function() { //bind dynamic to rest of class elements
												  
		var val = $(this).val();
		var intRegex = /^\d+$/; //integer
		//var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/; //float
			
			if( intRegex.test(val) || val === '' ) {  //check if is numeric before blurring
				$(this).css({ backgroundColor: '#ecb5b1' });
			   alert('Letter must be a alpha character only.  Please change this value before continuing.');		   
			} else {
				$(this).css({ backgroundColor: '#ffffff' });
			}
	});
	
	//validation on begin percent -  integer
	$(document).on('blur', '#grovey_gradingScaleTable .grading_scale_begin_perc', function() { //bind dynamic to rest of class elements
												  
		var val = $(this).val();
		var intRegex = /^\d+$/; //integer
		//var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/; //float
			
			if( !intRegex.test(val) || val > 100 || val < 0 ) {  //check if is numeric before blurring
				$(this).css({ backgroundColor: '#ecb5b1' });
			   alert('Begin % must be a numeric value >= 0 and <= 100.  Please change this value before continuing.');		   
			} else {
				$(this).css({ backgroundColor: '#ffffff' });
			}
	});
	
	//validation on begin percent -  integer
	$(document).on('blur', '#grovey_gradingScaleTable .grading_scale_end_perc', function() { //bind dynamic to rest of class elements
												  
		var val = $(this).val();
		var intRegex = /^\d+$/; //integer
		//var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/; //float
			
			if( !intRegex.test(val) || val > 100 || val < 0 ) {  //check if is numeric before blurring
				$(this).css({ backgroundColor: '#ecb5b1' });
			   alert('End % must be a numeric value >= 0 and <= 100.  Please change this value before continuing.');		   
			} else {
				$(this).css({ backgroundColor: '#ffffff' });
			}
	});
    // Handle `Serialize` button click
    $('#btnSaveGradingScale').button().click(function () {
												
			var submit_form = true;
			
        	// make sure each form element is not empty
			$('#grovey_gradingScaleTable :input:not(:button)').each(function(index, element) {
				if (element.value === '') {
					//$(this).css({ backgroundColor: '#ecb5b1' });
					alert('The Grading Scale table contains empty fields.  Please fill in all values before continuing.');
					submit_form = false;
					return false;
					
				}
			});
			
			if ( submit_form ) {
				var rowCount = $('#grovey_gradingScaleTable >tbody >tr').length;
				$("#rcount_gradingScale").val(rowCount);
				$("#submit_gradingScale").val('1');
				$( "#form_gradingScale" ).submit();
			}
    });	
	
/////////////////////////////////////////////////////////////////
//GRADING WEIGHTS
/////////////////////////////////////////////////////////////////

	var submit_courseWeights = false;
	
	//validation on percent change
	//make sure is numeric and totals 100
	$(document).on('blur', '#grovey_gradingWeightsTable .grading_weights_percent', function() { //bind dynamic to rest of class elements
											  
		var val = $(this).val();
		var intRegex = /^\d+$/; //integer
		//var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/; //float
			
			if( !intRegex.test(val) || val == '0' ) {  //check if is numeric before blurring
				$(this).css({ backgroundColor: '#ecb5b1' });
			   alert('Grade % must be a numeric value greater than 0.  Please change this value before continuing.');		   
			} else {
				var total = 0;
				
				$("#grovey_gradingWeightsTable .grading_weights_percent").each(function() {  //loop through each percent for total
					$(this).css({ backgroundColor:'white' });
					
					var val = $(this).val();
								  
					if ( $.isNumeric(val) ){	//if it is blank, don't count it.. will get NaN error											   												
						total = parseInt(total) + parseInt(val);
					} 
	
				});
				 	
				$("#courseWeights_percentTotal").html(total);
				
				if (total != 100) {
					$(".courseWeights_percentTotal_text").css({ color: 'red' });
					$("#courseWeights_percentTotal_warning").show();
					//alert('Grade Weight is not equal to 100%.  Please change this value before continuing');
				} else {
					$(".courseWeights_percentTotal_text").css({ color: 'black' });
					$("#courseWeights_percentTotal_warning").hide();
					submit_courseWeights = true;
				}
				
				
			}			 
	});

	 //button
     // Handle button click
    $('#btnSaveGradingWeights').button().click(function () {
        //alert('Here is the serialized data!!\n' + $(document.forms[0]).serialize());
		var submit_form;
		var total = 0;
		//make sure percents equal 100
		$("#grovey_gradingWeightsTable .grading_weights_percent").each(function() {  //loop through each percent for total

			var val = $(this).val();
						  
			if ( $.isNumeric(val) ){	//if it is blank, don't count it.. will get NaN error											   												
				total = parseInt(total) + parseInt(val);
			} 
		});
		
		if ( total  != '100' ) {
			$(".courseWeights_percentTotal_text").css({ color: 'red' });
			$("#courseWeights_percentTotal_warning").show();
			$("#courseWeights_percentTotal").html(total);
			alert ('Total Grade % must equal 100 before continuing.');
			submit_form = false;
			return false;
			
		} else {
		
		    submit_form = true;

			//make sure only unique course types
			var values = $('select.grading_weights_assign_type').map(function(){
				return $(this).val();
			}).get();
			var uniqueValues = $.grep(values, function (v, k) {
				return $.inArray(v, values) === k;
			});
			
			if(uniqueValues.length !== values.length){
				alert('Grading Weight Assignment Types must be unique before submitting.');
				submit_form = false;
				return false;
			}
			
			// make sure each form element is not empty
			$('#grovey_gradingWeightsTable :input:not(:button)').each(function(index, element) {
				if (element.value === '') {
					//$(this).css({ backgroundColor: '#ecb5b1' });
					alert('The Grading Weights table contains empty fields.  Please fill in all values before continuing.');
					submit_form = false;
					return false;
					
				}
			});
			
			if ( submit_form ) {
				var rowCount = $('#grovey_gradingWeightsTable >tbody >tr').length;
				$("#rcount_gradingWeights").val(rowCount);
				$("#submit_gradingWeights").val('1');	
				$( "#form_gradingWeights" ).submit();
			} 
		}
    });
	
	
/////////////////////////////////////////////////////////////////
//COURSE STRUCTURE
/////////////////////////////////////////////////////////////////

//appendGrid initializing code is on the page
//validation
	$(document).on('blur', '#grovey_courseStructureTable .course_structure_max_score', function() { //bind dynamic to rest of class elements
												  
		var val = $(this).val();
		var intRegex = /^\d+$/; //integer
		//var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/; //float
			
			if( !intRegex.test(val) || val == '0' ) {  //check if is numeric before blurring
				$(this).css({ backgroundColor: '#ecb5b1' });
			   alert('Max Score must be a numeric value greater than 0.  Please change this value before continuing.');		   
			} 			 
	});




// Handle button click
    $('#btnSaveCourseStructure').button().click(function () {
		    var submit_form = true;
			var show_alert = false;
			
			// make sure each form element is not empty
			$('#grovey_courseStructureTable :input:not(:button)').each(function(index, element) {	
				 $(this).css({ backgroundColor:'white' });
				if (element.value === '') {
					$(this).css({ backgroundColor: '#ecb5b1' });
					submit_form = false;
					show_alert = true;
					
				}
			});
			if (show_alert) {
				alert('The Course Structure table contains empty fields.  Please fill in all values before continuing.');	
			}
			
			if (submit_form) {	
				$("#grovey_courseStructureTable .course_structure_assign_type").each(function() {  //loop through each max score for total
					
					$(this).css({ backgroundColor:'white' });
					var val = $(this).val();
			
					if( val == '0') {  //make sure 'Choose' is not selected
						$(this).css({ backgroundColor: '#ecb5b1' });
						submit_form = false;
						show_alert=true;
					}
				});
				if (show_alert) {
					alert('Please select an Assignment Type before continuing.');	
				}
			}			

			if (submit_form) {	
				$("#grovey_courseStructureTable .course_structure_max_score").each(function() {  //loop through each max score for total
					$(this).css({ backgroundColor:'white' });
					
					var val = $(this).val();
					var intRegex = /^\d+$/; //integer
					//var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/; //float
			
					if( !intRegex.test(val) || val == '0' ) {  //check if is numeric before blurring
						$(this).css({ backgroundColor: '#ecb5b1' });
			   			
						submit_form = false;
						show_alert = true;
					}
				});	
				if (show_alert) {
					alert('Max Score must be a numeric value greater than 0.  Please change this value before continuing.');	
				}
			}
			
			if ( submit_form ) {
				var rowCount = $('#grovey_courseStructureTable >tbody >tr').length;
				$("#rcount").val(rowCount);
				$("#submit_courseStructure").val('1');				
				$( "#form_courseStructure" ).submit();
			}														  
	});
	
	
/////////////////////////////////////////////////////////////////
// GRADEBOOK
/////////////////////////////////////////////////////////////////

//validation
	$(document).on('blur', '.rotated_scroll_table .int', function() { //bind dynamic to rest of class elements
												  
		var val = $(this).val();
		var intRegex = /^\d+$/; //integer
		//var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/; //float
		var charSpaceRegex = /^[a-z\s]*$/; //character or space
			
			if( !intRegex.test(val) && val !=='' ) {  //check if is numeric before blurring
				$(this).css({ backgroundColor: '#ecb5b1' });
				$(this).focus();
			   alert('Must be a numeric value or left blank.  Please change this value before continuing.');		   
			} else {
				$(this).css({ backgroundColor: '#ffffff' });
			}
	});
	//edited grades are optional
	$(document).on('blur', '.rotated_scroll_table .int_optional', function() { //bind dynamic to rest of class elements
												  
		var val = $(this).val();
		var intRegex = /^\d+$/; //integer
		//var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/; //float
		var charSpaceRegex = /^[a-z\s]*$/; //character or space
			
			if( !intRegex.test(val) && val !== '' ) {  //check if is numeric before blurring
				$(this).css({ backgroundColor: '#ecb5b1' });
				$(this).focus();
			   alert('Edited Grades must be a numeric value or left blank.  Please change these values before continuing.');		   
			} else {
				$(this).css({ backgroundColor: '#ffffff' });
			}
	});
	
	$(document).on('blur', '.rotated_scroll_table .char', function() { //bind dynamic to rest of class elements
												  
		var val = $(this).val();
		var intRegex = /^\d+$/; //integer
		//var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/; //float
		var charSpaceRegex = /^[a-z\s]*$/; //character or space
			
			if( intRegex.test(val) ) {  //check if is character or space before blurring
				$(this).css({ backgroundColor: '#ecb5b1' });
				$(this).focus();
			   alert('Must be a character value or left blank.  Please change this value before continuing.');		   
			} else {
				$(this).css({ backgroundColor: '#ffffff' });
			}
	});

	
// Handle button click
    $('.submit_gradebook').button().click(function () {

		    var submit_form = true;
			var show_alert = false;	
			
			if (submit_form) {	
				$(".rotated_scroll_table .int").each(function() {  //loop through each int class cell for non integers
					$(this).css({ backgroundColor:'white' });					

					var val = $(this).val();
					var intRegex = /^\d+$/; //integer
					//var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/; //float
			
					if( !intRegex.test(val) && val !== '' ) {  //check if is numeric before blurring
						$(this).css({ backgroundColor: '#ecb5b1' });
						
						event.preventDefault();//prevent form submit on button click
						submit_form = false;
						show_alert = true;
					}
				});	
				if (show_alert) {
					alert('All scores must be an numeric value.  If blank, please enter a 0.  Please change these values before continuing.');
					
				}
			}
			
			if (submit_form) {	
				$(".rotated_scroll_table .int_optional").each(function() {  //loop through each int class cell for non integers
					$(this).css({ backgroundColor:'white' });
					
					var val = $(this).val();
					var intRegex = /^\d+$/; //integer
					//var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/; //float
			
					if( !intRegex.test(val) && val !== '' ) {  //check if is numeric before blurring
						$(this).css({ backgroundColor: '#ecb5b1' });
			   			
			   			event.preventDefault();//prevent form submit on button click
						submit_form = false;
						show_alert = true;
					}
				});	
				if (show_alert) {
					alert('Edited Grades must be an numeric value or left blank.  Please change these values before continuing.');
					
				}
			}			
			
			if (submit_form) {	
				$(".rotated_scroll_table .char").each(function() {  //loop through each char class cell for non letters
					$(this).css({ backgroundColor:'white' });
					
					var val = $(this).val();

				
					var intRegex = /^\d+$/; //integer
					//var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/; //float
					//var charSpaceRegex = /^[a-z\s]*$/; //character or space
			
					if( intRegex.test(val) && val !== '' ) {  //check if is numeric before blurring
						$(this).css({ backgroundColor: '#ecb5b1' });
			   			
			   			event.preventDefault();//prevent form submit on button click
						submit_form = false;
						show_alert = true;
					}
				});	
				if (show_alert) {
					alert('One or more letter cells contain invalid characters. Please change these values before continuing.');
					
				}
			}

			if ( submit_form ) {			
				$( "#form" ).submit();
			}			
			
	});
	
	
	
	
	
/////////////////////////////////////////////////////////////////
//SAMPLE
/////////////////////////////////////////////////////////////////


	    $('#tblAppendGrid').appendGrid({
        caption: 'Grading Scale',
        initRows: 1,
        columns: [
                { name: 'Album', display: 'Album', type: 'text', ctrlAttr: { maxlength: 100 }, ctrlCss: { width: '160px' }, onChange: function (evt, rowIndex) { alert('You have changed the value of `Album` at row ' + rowIndex); } },
                { name: 'Artist', display: 'Artist', type: 'text', ctrlAttr: { maxlength: 100 }, ctrlCss: { width: '100px'} },
                { name: 'Year', display: 'Year', type: 'text', ctrlAttr: { maxlength: 4 }, ctrlCss: { width: '40px'} },
                { name: 'Origin', display: 'Origin', type: 'select', ctrlOptions: { 0: '{Choose}', 1: 'Hong Kong', 2: 'Taiwan', 3: 'Japan', 4: 'Korea', 5: 'US', 6: 'Others'} },
                { name: 'Poster', display: 'With Poster?', type: 'checkbox', onClick: function (evt, rowIndex) { alert('You have clicked on the `With Poster?` at row ' + rowIndex); } },
                { name: 'Price', display: 'Price', type: 'text', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '50px', 'text-align': 'right' }, value: 0 }
            ],
        initData: [
                { 'Album': 'Dearest', 'Artist': 'Theresa Fu', 'Year': '2009', 'Origin': 1, 'Poster': true, 'Price': 168.9 },
                { 'Album': 'To be Free', 'Artist': 'Arashi', 'Year': '2010', 'Origin': 3, 'Poster': true, 'Price': 152.6 },
                { 'Album': 'Count On Me', 'Artist': 'Show Luo', 'Year': '2012', 'Origin': 2, 'Poster': false, 'Price': 306.8 },
                { 'Album': 'Wonder Party', 'Artist': 'Wonder Girls', 'Year': '2012', 'Origin': 4, 'Poster': true, 'Price': 108.6 },
                { 'Album': 'Reflection', 'Artist': 'Kelly Chen', 'Year': '2013', 'Origin': 1, 'Poster': false, 'Price': 138.2 }
            ],
		hideRowNumColumn: true,
        rowDragging: true,
        hideButtons: { moveUp: true, moveDown: true }
    });	
		
 });

 ///////////////////////////////////////////////////////////////////////////
 // ATTENDANCE FUNCTIONS
 /////////////////////////////////////////////////////////////////////////
 	function showHideTimeTardy(sel_val, input_name) {
 		//toggle the tardy_time input box
 		if(sel_val == 'T') {
 			$( "." + input_name).show();
 		} else {
 			//$( "#" + input_name).val("");
 			$( "." + input_name).hide();
 		}
 	}
 
 ///////////////////////////////////////////////////////////////////////////
 // PROGRESS REPORT DATA TABLE
 //////////////////////////////////////////////////////////////////////////
 	
	 function printProgressReportPDF(form_id) {
	 	//prints PDF from $_POST form data submitted with the form
	 	$('#' + form_id).attr('action', 'resources/mpdf/outputs/printPDF_Progress_Report.php');
	 	$('#' + form_id).submit();
	 }


 	//change location based on selected date when viewing past progress reports
 		//change progress report location to handle selected date
	$(document).on('change', '#change_pr_location', function() { 		
		var pr = $("#change_pr_location").val();
		var arr = pr.split('_');
		var prID = arr[0];
		var pr_date = arr[1];
		//alert(pr);
		//alert(prID);

		$('#pr_id').val(prID);
		$('#edit_pr').val('0');
		$('#student_progress_report').submit();
	});

	$(document).on('change', '#multi_select_pr_date', function() {
		//on print multiple progress report page - date was selected from dropdown so submit the form
		$('#multi_pr_form_date').submit();
	});

 	//validation on target and complete % -  integer
	$(document).on('blur', '.pr_int', function() { //bind dynamic to rest of class elements
												  
		var val = $(this).val();
		var intRegex = /^\d+$/; //integer
		//var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/; //float
			
			if( !intRegex.test(val) || val > 100 || val < 0 ) {  //check if is numeric before blurring
				$(this).css({ backgroundColor: '#ecb5b1' });
			   alert('This % value must be a numeric value >= 0 and <= 100.  Please change this value before continuing.');		   
			} else {
				$(this).css({ backgroundColor: '#ffffff' });
			}
	});

 	//validation on date % -  string
	/*$(document).on('blur', '.pr_date', function() { //bind dynamic to rest of class elements
												  
		var val = $(this).val();
		
		//var intRegex = /^\d+$/; //integer
		//var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/; //float
		var dtRegex = new RegExp(/\b\d{1,2}[\/-]\d{1,2}[\/-]\d{4}\b/); //date mm/dd/yyyy	
			
			if( !dtRegex.test(val) ) { //check if is numeric before blurring
				//$(this).css({ backgroundColor: '#ecb5b1' });
			   alert('Progress Report Week Begin Date cannot be left blank and must be in mm/dd/yyyy format.  Please enter a value before continuing.');		   
			} else {
				//$(this).css({ backgroundColor: '#ffffff' });
			}
	}); */

//handle multip progress report form button click
//validates that at least one checkbox is checked before submitting to print pdf 
function multiProgressReportFormSubmit(form) {
	event.preventDefault();//prevent form submit on button click
	if (!$(form).find('.sname:checked').length) {
        alert('Select a student before printing.');
    } else {
    	form.submit();
    }
}


// Handle progress report submit button click for both teacher (new) and editing

    function progressReportSubmit(form) {
    

		    var submit_form = true;
			var show_alert = false;	
			
			//var form=$(this).parents("form");
			//var form = $(obj).closest('form');

			//loop through these input fields to make sure and integer value is entered but it can be any range, not 0 - 100
			if (submit_form) {	
				

				$("#" + form.id +" input.pr_int_any").each(function() {  //loop through each int class cell for non integers

					$(this).css({ backgroundColor:'white' });
					
					var val = $(this).val();
					var intRegex = /^\d+$/; //integer
					//var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/; //float
			
					if( !intRegex.test(val) || val > 100 || val < 0 ) {  //check if is numeric before blurring
						$(this).css({ backgroundColor: '#ecb5b1' });
			   			
			   			event.preventDefault();//prevent form submit on button click
						submit_form = false;
						show_alert = true;
					}
				});	
				if (show_alert) {
					alert('Input values must be an numeric value.  Please change these values before continuing.');
					
				}
			}
			
			if (submit_form) {	
				

				$("#" + form.id +" input.pr_int").each(function() {  //loop through each int class cell for non integers

					$(this).css({ backgroundColor:'white' });
					
					var val = $(this).val();
					var intRegex = /^\d+$/; //integer
					//var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/; //float
			
					if( !intRegex.test(val) || val > 100 || val < 0 ) {  //check if is numeric before blurring
						$(this).css({ backgroundColor: '#ecb5b1' });
			   			
			   			event.preventDefault();//prevent form submit on button click
						submit_form = false;
						show_alert = true;
					}
				});	
				if (show_alert) {
					alert('All percent values must be an numeric value >=0 or <= 100.  If blank, please enter a 0.  Please change these values before continuing.');
					
				}
			}
			//loop through the selects to make sure the do not have a 0 value
			if (submit_form) {	
				

				$("#" + form.id +"  select.pr_int").each(function() {  //loop through each int class cell for non integers

					$(this).css({ backgroundColor:'white' });
					
					var val = $(this).val();

					var intRegex = /^\d+$/; //integer
					//var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/; //float
			
					if( val === '0' ) {  //check if is numeric before blurring
						$(this).css({ backgroundColor: '#ecb5b1' });
			   			
			   			event.preventDefault();//prevent form submit on button click
						submit_form = false;
						show_alert = true;
					}
				});	
				if (show_alert) {
					alert('A Behavior and/or Academic value has not been selected.  Please check that each these have a value before continuing.');
					
				}
			}			
			
			if (submit_form) {	
				$("#" + form.id +" .pr_date").each(function() {  //loop through each int class cell for non integers
					$(this).css({ backgroundColor:'white' });
					
					var val = $(this).val();
					//var intRegex = /^\d+$/; //integer
					//var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/; //float
					var dtRegex = new RegExp(/\b\d{1,2}[\/-]\d{1,2}[\/-]\d{4}\b/); //date mm/dd/yyyy

					if( !dtRegex.test(val) && val !== '' ) {  //check if is a date and not blank
						$(this).css({ backgroundColor: '#ecb5b1' });
			   			
			   			event.preventDefault();//prevent form submit on button click
						submit_form = false;
						show_alert = true;
					}
				});	
				if (show_alert) {
					alert('Progress Report Week Begin Date cannot be left blank and must be in mm/dd/yyyy format.  Please enter a value before continuing.');
					
				}
			}			

			if ( submit_form ) {
				$("#" + form.id + " .submit_progress_report").val('1');	
				$("#" + form.id ).submit();
			}			
    }

  
/////////////////////////////////////////////////////////////////////////////////////
// REPORT CARD DATA TABLE
/////////////////////////////////////////////////////////////////////////////////////

	 function printReportCardPDF(form_id) {
	 	//prints PDF from $_POST form data submitted with the form
	 	$('#' + form_id).attr('action', 'resources/mpdf/outputs/printPDF_Report_Card.php');
	 	$('#' + form_id).submit();
	 }

 	//change location based on selected date when viewing past report cards
 	//change report card location to handle selected date
	$(document).on('change', '#change_rc_location', function() { 	
		
		//var arr = pr.split('_');
		//var prID = arr[0];
		//var pr_date = arr[1];
		//alert(pr);
		//alert(prID);
		//$('#pr_id').val(prID);

		var last_date = $("#change_rc_location").val();
		event.preventDefault();//prevent form submit on button click

		//validate at least one checkbox is checked
		var submit_form = false;
		var ckbx_checked = 0;
		$(".rc_txts").each(function() {  //loop through each checkbox
			if($(this).is(':checked')) {
				ckbx_checked++;
			}
		});

		if (ckbx_checked === 0 ) {
			
			submit_form = false;
			alert('Please select at least one Report Card Text option before submitting.');
		} else {
			submit_form = true;
		}

		if (submit_form){
			$("#last_date").val(last_date);  //change last date to match selected value as the select is not part of the form
			$('#student_report_card_edit_frm').submit();
		}
	});



// Handle report card submit button click for both teacher (new) and editing
    function reportCardSubmit(form) {

		    var submit_form = true;
			var show_alert = false;	

			//rc_date

			//loop through these input fields to make sure and integer value is entered but it can be any range, not 0 - 100
			if (submit_form) {	
				
				var ckbx_checked = 0;
				$("#" + form.id +" .rc_txts").each(function() {  //loop through each checkbox
					if($(this).is(':checked')) {
						ckbx_checked++;
					}
				});

				if (ckbx_checked === 0 ) {
					event.preventDefault();//prevent form submit on button click
					submit_form = false;
					show_alert = true;
					alert('Please select at least one Report Card Text option before submitting.');
				}
			}
			
			if (submit_form) {	
				

				$("#" + form.id +" input.rc_date").each(function() {  //loop through each int class cell for non integers

					$(this).css({ backgroundColor:'white' });

					var val = $(this).val();

					var dateRegex = /\b\d{1,2}[\/-]\d{1,2}[\/-]\d{4}\b/; //tests mm/dd/yyyy - doesn't check to make sure its a valid date of the year
					//var intRegex = /^\d+$/; //integer
					//var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/; //float
			
					if( !dateRegex.test(val) || val === '' ) {  //check if is correct date format before blurring
						$(this).css({ backgroundColor: '#ecb5b1' });
			   			
			   			event.preventDefault();//prevent form submit on button click
						submit_form = false;
						show_alert = true;

					} 
				
				});	

				if (show_alert) {
					alert('Please enter a valid Report Card date (mm/dd/YYYY)');
					
				}
			}			

			if ( submit_form ) {
				$("#" + form.id + " .submit_report_card").val('1');	
				$("#" + form.id ).submit();
			}			
    }

/////////////////////////////////////////////////////////
//functions for - multiple report card select students
/////////////////////////////////////////////////////////

    $(document).on('change', '#school_year_id', function() { 

    	var year_selectvalue = $(this).val();
	    var school_selectvalue = $('#school_id').val();

    	if ( year_selectvalue !== '' && school_selectvalue !== '') {
    		$('#rc_date_id').html('<option value="">Loading...</option>');

    		var parm_vals = 'year:'+year_selectvalue+',school_id:'+school_selectvalue;
			var datastring = 'func=create_multiple_report_card_date_options&parms='+parm_vals;
					
    		//Make AJAX request, using the selected value as the GET
      		$.ajax({
      			type: 'POST',
				url : 'resources/ajax/ajax.php',	
				data: datastring,
	            success: function(output) {
	                //alert(output);
	                $('#rc_date_id').html(output);
	            },
	          	  error: function (xhr, ajaxOptions, thrownError) {
	              alert(xhr.status + " "+ thrownError);
	            }
	        });
        
	    }

    });

    $(document).on('change', '#school_id', function() { 

    	var school_selectvalue = $(this).val();
    	var year_selectvalue = $('#school_year_id').val();

    	if ( year_selectvalue !== '' && school_selectvalue !== '') {
    		$('#rc_date_id').html('<option value="">Loading...</option>');
    		
    		var parm_vals = 'year:'+year_selectvalue+',school_id:'+school_selectvalue;
			var datastring = 'func=create_multiple_report_card_date_options&parms='+parm_vals;
			//alert(datastring);		
    		//Make AJAX request, using the selected value as the GET
      		$.ajax({
      			type: 'POST',
				url : 'resources/ajax/ajax.php',	
				data: datastring,
	            success: function(output) {
	                //alert(output);
	                $('#rc_date_id').html(output);
	            },
	          	  error: function (xhr, ajaxOptions, thrownError) {
	              alert(xhr.status + " "+ thrownError);
	            }
	        });
        
	    }

    	//alert(year_selectvalue + school_selectvalue);

    });

    function multipleReportCardSubmitCriteria(form) {

    	event.preventDefault();//prevent form submit on button click
    	var year_selectvalue = $('#school_year_id').val();
    	var school_selectvalue = $('#school_id').val();
    	var date_selectvalue = $('#rc_date_id').val();
    	var submit_form = false;

    	if ( year_selectvalue === '' || school_selectvalue === '') {
			submit_form = false;
			alert('School Year and School Name must be selected before continuing.');			
	    } else if (date_selectvalue === ''){
			submit_form = false;
			alert('Report Card Date must be selected before continuing.');			
	    } else {
	    	submit_form = true;
	    }

	    if (submit_form) {
	    	//alert(form.id);	
	    	//$("#rc_print_multi_frm").submit();
	    	$("#" + form.id ).submit();
	    }
    }
	


	//////////////////////////////

  
 /////////////////////////////////////////////////////////////////////////// 
	function delete_row (db_table, id, field) {

		
		/*
		if (confirm("Are you sure you want to delete this district?")) {
		
			   $.ajax({
				 type: 'POST',
				 url : 'resources/ajax/ajax.php',	
				 data: datastring,
				 success : function(){
					location.reload();
				 }
			  });
			   
		}
		*/
		
		$( "#dialog-confirm" ).dialog({
									  
			  resizable: false,
			  height:220,
			  width: 450,
			  modal: true,
			  buttons: {
				"Delete": function() {

						var parm_vals = 'table:'+db_table+',id:'+id+',field:'+field;
						var datastring = 'func=delete_row&parms='+parm_vals;
					
				 		/*call to ajax to delete the row*/
					   $.ajax({
						 type: 'POST',
						 url : 'resources/ajax/ajax.php',	
						 data: datastring,
						 success : function(){
							location.reload();
							return false;
						 }
					  });				 

				},
				Cancel: function() {
				  $( this ).dialog( "close" );
				}
			  }
		});
		
		$("#dialog-confirm").dialog("open");
		
	}
	
	
	//////////////////////////////////////////////////////////////
	// select stmt with urls as values
	// on select change, open url
	//db_assign_casloadmgr_students_school    -  select school 
	////////////////////////////////////////////////////////////

	$(document).on('change', '.dynamic_change_url_select', function() { 
          var url = $(this).val(); // get selected value
          if (url) { // require a URL
              window.location = url; // redirect
          }
          return false;
	});
	

	/////////////////////////////////////////////////////////////
	// check or uncheck all checkboxes
	// create a check box for toggling with an id="chkAll"
	// give each checkbox to check a class of 'chk'
	//<input type="checkbox" id="chkAll" /> Check/Uncheck All</p>
	//<input type="checkbox" class="chk" /> Checkbox  1
	////////////////////////////////////////////////////////////
	$(document).on('click', '#chkAll', function() { 
        $(".chk").prop("checked",$("#chkAll").prop("checked"));
    });

