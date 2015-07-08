$(this).ready(function(){

	// set the tabbing so it tabs vertically instead of horizontally for easy grading of an assignment - SWEET!!!
	    $('.rotated_scroll_table tr').each(function() {
        // For each row

			$(this).find('td').each(function(i) {
				// For each cell in that row (using i as a counter)
	
				$(this).find('input').attr('tabindex', i+1);
				// Set the tabindex of each input in that cell to the counter
	
			});
			// Counter gets reset for every row
    });
		
});