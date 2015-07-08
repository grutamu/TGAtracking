<?php



//ajax functions
//echo "<script type='text/javascript'>alert('".print_r($_REQUEST)."');</script>";

if( function_exists($_REQUEST['func'])) { 
	// get function name and parameter 
	//call the function
	$_REQUEST['func']($_REQUEST["parms"]); 

} else { 
	echo 'Method Not Exist'; 
} 

function create_multiple_report_card_date_options($parms){

	list($year_vars, $school_vars) = explode(',', $parms);
	list($var, $school_year ) = explode(':', $year_vars); 
	list($var, $school_id ) = explode(':', $school_vars);

	//echo $parms . ' '.$school_year. ' '.$school_id;

	$options = '';
	$dates = array();

	if ( is_numeric($school_year) && $school_year > 0 && is_numeric($school_id) ) {
		//echo 'test';
		include("../../init.php");  //include so classes can be accessed

		//if school_id = 0, get all school_id based on All schools criteria
		$and_school_id = $school_id != '0' ? ' AND school_id = ? ' : '';

		$query = "SELECT * FROM report_card_data
		WHERE  district_id = ? AND school_year = ? 
		" . $and_school_id . "
		ORDER BY report_card_date DESC
		";

		//echo $query;
		if ($stmt = $Database->prepare("$query") ) {
				
				if ($school_id != '0') {
					$stmt->bind_param("isi", $_SESSION['district_id'], $school_year, $school_id);
				} else {
					$stmt->bind_param("is", $_SESSION['district_id'], $school_year );
				}

				$stmt->execute();
				$stmt->store_result();

				if ($stmt->num_rows > 0 ) {
					
					$meta = $stmt->result_metadata();
					
					while ($field = $meta->fetch_field()) {
					  $parameters[] = &$row[$field->name];
					}
					
					call_user_func_array(array($stmt, 'bind_result'), $parameters);

					while ($stmt->fetch()) {
					  foreach($row as $key=>$val) {
					  		if ($key == 'report_card_date') {
					  	 		$dates[] = $val;
					  	 	}
					  	}
					  }	  
				}

				$stmt->close();

				$dates = array_unique($dates);

				if (count($dates)>0) {
					foreach($dates as $date) {
						$options .= '<option value="'.$date.'">'.date('m-d-Y', strtotime($date)).'</option>';
					}
				} else {
					$options = '<option value="">No Dates Available</option>';
				}

		} 

	} 

	echo $options;
}

function delete_row($parms){ 
	//pass in parms table and id of table to be deleted
	//parms passed 'table:'+db_table+',id:'+id+',field:'+field
	
	list($table_vars, $id_vars, $field_vars) = explode(',', $parms);
	list($var, $db_table ) = explode(':', $table_vars); 
	list($var, $db_id ) = explode(':', $id_vars);
	list($var, $db_field ) = explode(':', $field_vars);
	
	//$db_id is in a format of id + group of 3 chars + random numbers - need to pull first set of numbers out for actual id
	preg_match('/\d+/', $db_id, $match);
	$id = $match[0];

	if ( is_numeric($id) && $id > 0 ) {
		
		include("../../init.php");  //include so classes can be accessed
		
		if ( $stmt = $Database->prepare("DELETE FROM $db_table WHERE $db_field = ?") ) {
			$stmt->bind_param('i', $id);
			$stmt->execute(); 
			$stmt->close();	

			//if deleting a user, must delete user permissions, user_roles and user_address too
			if ($db_table == 'users') {
            	//delete user permissions
				if ( $stmt = $Database->prepare("DELETE FROM user_permissions WHERE user_id = ?") ) {
					$stmt->bind_param('i', $id);
					$stmt->execute(); 
					$stmt->close();	
				}
                //delete user roles
                if ( $stmt = $Database->prepare("DELETE FROM user_roles WHERE user_id = ?") ) {
					$stmt->bind_param('i', $id);
					$stmt->execute(); 
					$stmt->close();	
				}
                //delete user address
                if ( $stmt = $Database->prepare("DELETE FROM user_address WHERE user_id = ?") ) {
					$stmt->bind_param('i', $id);
					$stmt->execute(); 
					$stmt->close();	
				}                
			}
			//if deleting a course, must delete course_students too
			if ($db_table == 'courses') {
                //delete course_students
                if ( $stmt = $Database->prepare("DELETE FROM course_students WHERE course_id = ?") ) {
					$stmt->bind_param('i', $id);
					$stmt->execute(); 
					$stmt->close();	
				}
			}			
			$Template->setAlert('Delete Successful.');
						
			return TRUE;
		}
		else
		{
			return FALSE;
		}
	}
 
 } 
 
function getSchoolTeacherOptions($parms) {
	
	//echo $parms;

	include("../../init.php");  //include so classes can be accessed

	 //parms passed 'school_id:'+school_id
	 list($post_name, $school_id) = explode(':', $parms);
	 
	 $data2 = '';
	 
	 if ( $stmt = $Database->prepare("SELECT * FROM users
												  WHERE usertype = 'teacher' 
												  AND school_id = ?
												  ORDER BY users.lName ") ) {
				
				$stmt->bind_param("i", $school_id);
				
				$stmt->execute();
				$stmt->store_result();
				
				if ($stmt->num_rows > 0 ) {
					
					$meta = $stmt->result_metadata();
					
					while ($field = $meta->fetch_field()) {
					  $parameters[] = &$row[$field->name];
					}
					
					call_user_func_array(array($stmt, 'bind_result'), $parameters);
					
                    while ($stmt->fetch()) {
					  foreach($row as $key => $val) {
						$x[$key] = $val;
					  }
					  $data[] = $x;
					}
				}
				
				$stmt->close();
		}
        
        if ( count($data) > 0 ) {
        	$data2 .= "<option value=''>Course Teacher Unknown at This Time</option>";
            foreach ($data as $row) {
                $data2 .= "<option value='" . $row['id'] . "'>".$row['lName']. ", ". $row['fName'] . " ". $row['mName'] . "</option>";
            }
            
        
        } else {
        	$data2 .= '<option value="">No Teachers Created For Selected School</option>';
        }
            
    echo $data2;
}

		
	 
