<?php
include("../../../init.php");

if (isset($_POST['last_date'])) {
	//don't print anything if there are no checkboxes selected
	//will get an error msg if try to do so!

		//pass pr_last_date in the form of pr_id _ progress_date
		if (!is_array($_POST['last_date'])) {  //only 1 student progress report passes
			$pr_date_arr = array($_POST['last_date']);
		} else {
			$pr_date_arr = $_POST['last_date'];

		}

		$num_pages = count($pr_date_arr);

		$count_pages = 1;
		$html = '';
		foreach ($pr_date_arr as $post) {

			if ($count_pages < $num_pages) {
				$show_pagebreak = '<pagebreak>';
			} else {
				$show_pagebreak = '';
			}
			$count_pages++;

				//last date comes in as progress_report_id _ date
				//so separate them!
				$pr_last_date = explode("_", $post);
				$progress_report_id = $pr_last_date[0]; // piece1
				$last_date = $pr_last_date[1]; // piece2

				//main data
				$data = $Report->getProgressReportData ($progress_report_id);

				//progress report name
				if (!is_array($_POST['last_date'])) { //only 1 student progress report passes
					$progress_report_name = str_replace(' ', '_', $data['student_name']);
					$progress_report_name = str_replace(',', '', $progress_report_name);
					$progress_report_name = 'Progress_Report_'.$progress_report_name.'_'.$data['progress_date'];
				} else {
					$progress_report_name = 'Progress_Report_'.$data['progress_date'];
				}


				//courses
				$courses = $Report->getProgressReportCourses ($progress_report_id);

				//subjects and subject table
				$subjects = '';
				$subject_table = '<table width="100%"  cellspacing="10" cellpadding="0" class="med_txt">';
				foreach($courses as $course) {

					$subjects .=  $course['course_abbrev'] .', ';

					$subject_table .= '<tr>
										<td width="50">Subject:</td><td style="border_bottom: 1px solid #000;"><u>'.$course['course_name'].' '.$course['course_abbrev'].'</u></td>
										<td width="100">Current Grade:</td><td width="20" style="border_bottom: 1px solid #000;"><u>'.$course['current_perc'].'</u></td>
										<td width="70">Target %:</td><td width="20" style="border_bottom: 1px solid #000;"><u>'.$course['target_perc'].'</u></td>
										<td width="85">Complete %:</td><td width="20" style="border_bottom: 1px solid #000;"><u>'.$course['complete_perc'].'</u></td>
										<td width="75">% Behind:</td><td width="20" style="border_bottom: 1px solid #000;"><u>'.$course['behind_perc'].'</u></td>
									 </tr>';

				}
				$subjects = rtrim($subjects, ', ');
				$subject_table .= '</table><br />';

					$checked_cries =  $data['cries'] == 1 ? '&#9745;' : '&#9744;'; //checked and unchecked box
					$checked_tics =  $data['tics'] == 1   ? '&#9745;' : '&#9744;';
					$checked_clumsy = $data['clumsy'] == 1   ? '&#9745;' : '&#9744;';
					$checked_sulks =  $data['sulks'] == 1  ? '&#9745;' : '&#9744;';
					$checked_daydreams =  $data['daydreams'] == 1  ? '&#9745;' : '&#9744;';
					$checked_tense =  $data['tense'] == 1 ? '&#9745;' : '&#9744;';
					$checked_sensitive =  $data['issensitive'] == 1 ? '&#9745;' : '&#9744;';
					$checked_unorganized =  $data['unorganized'] == 1 ? '&#9745;' : '&#9744;';
					$checked_coordination =  $data['coordination'] == 1 ? '&#9745;' : '&#9744;';
					$checked_destructive =  $data['destructive'] == 1 ? '&#9745;' : '&#9744;';

					//friday_school checked yes or no
					$friday_school = $data['friday_school'] == 1 ? 'Yes &#9745;   No &#9744;' : 'Yes &#9744;  No &#9745;';

					$disabled = ' disable="disabled" ';				

				//request conference
				if($data['request_teacher_conference'] == '0'){
					$request_teacher_conference_txt = '
					Yes <input type="radio" disabled> &nbsp; or &nbsp; No
					<input type="radio" checked="checked" disabled>';
				} else {
					$request_teacher_conference_txt = '
					Yes <input type="radio" checked="checked" disabled> &nbsp; or &nbsp; No
					<input type="radio" disabled>';
				}

				if ($data['teacher_comments'] == '') {
					$teacher_comments = '<br /><br /><br />';
				}
				$teacher_comments = '<br /><br />';

				//if student is IEP, then show SEAMS header img and text, if not checked, show SATTELITES header image and text
				if ($data['is_student_IEP'] == 0) {
					$header_img = '<img src="images/SATELLITES.JPG">
								  <h5>Student Assistance Team\'s Evaluation of Learning and Linkage<br />to Interventions Towards Educational Success</h5>';
				} else if ($data['is_student_IEP'] == 1){
					$header_img = '<img src="images/SEAMS.JPG">
								  <h3>Special Education Accountability & Management System</h3>';
				}
				

				$html .= '
				<style>
				html,body{height:100%;}
				body{
				    background:url("ga_armor.png") no-repeat fixed center center;
				    font-family: sans;
				}
				h1 {
					font-family: sans;
					font-weight: normal;
					margin: 0;
					padding: .25em;
				   }
				h2 {
					font-family: sans;
					font-weight:normal;
					font-size: 1.75em;
					margin: .25em 0 0 0;
					padding: 0;
				}
				h3 {
					font-family: sans;
					font-weight: bold;
					margin: 0;
					padding: 0;
				}
				h4 {
					font-family: sans;
					font-weight: normal;
					font-size: 1.25em;
				}
				h5 {
					font-family: sans;
					font-weight: normal;
					font-size: .60em;
					margin: 0;
					padding: 0;	
				}
				.sm_txt {
					margin-top: .5em;
					font-size: .60em;
				}
				.med_txt {
					margin-top: .5em;
					font-size: .93em;
				}
				.grey {
					color: #b5b4b4;
				}
				.red {
					color: #AC1F30;
				}
				.strong {
					font-weight: bold;
				}
				.center {
					text-align: center;
				}

				td.border_bottom  {
				  border:1pt solid black;
				}

				table.gridtable {
					border: 1px solid black;
					border-collapse: collapse;
					margin-top: 3px;
				}
				table.gridtable th {
					border-top: 1px solid black;
					background-color: #dedede;
					text-align: left;
					font-weight: normal;
					padding: 3px 8px;
				}
				table.gridtable td {
					border-top: 1px solid black;
					border-left: 1px solid black;
					padding: 5px 8px;
					
				}

				.tbl_bg{
				    background-color : #d6d4d4;
				}

				.rounded {
					border:0.1mm solid #220044; 
					background-color: #f0f2ff;
					background-gradient: linear #c7cdde #f0f2ff 0 1 0 0.5;
					border-radius: 2mm;
					background-clip: border-box;
				}

				.example pre {
					background-color: #d5d5d5; 
					margin: 1em 1cm;
					padding: 0 0.3cm;
				}

				pre { text-align:left }
				pre.code { font-family: monospace }

				</style>

				<body>
				<div class="center">'.
					$header_img
				.'<h1>Weekly Progress Report</h1>
				</div>

				<table width="100%">
					<tr>
						<td width="50%"><h4>Student: '.$data['student_name'].' </h4></td>
						<td><h4>Week of: '.$last_date.'</h4></td>
					</tr>
					<tr>
						<td width="50%"><h4>Case Manager: '.$data['teacher_name'].'</h4></td>
						<td><h4>Subjects: '.$subjects.'</h4></td>
					</tr>	
				</table>

				<div class="center">
					<h2>Academic</h2>
					<div class="sm_txt">
						1 - Rarely &nbsp;&nbsp;
						2 - Sometimes &nbsp;&nbsp;
						3 - Most Of The Time &nbsp;&nbsp;
						4 - Always &nbsp;&nbsp;
					</div>
				</div>

				<table width="100%" class="gridtable">
					<tr>
						<td width="80%">1.  On Time</td><td width="20%" align="center">'.$data['academic_time'].'</td>
					</tr>
					<tr class="tbl_bg">
						<td>2.  Prepared For Class</td><td align="center">'.$data['academic_prepared'].'</td>
					</tr>
					<tr>
						<td>3.  Engaged In the Lesson</td><td align="center">'.$data['academic_engaged'].'</td>
					</tr>
					<tr class="tbl_bg">
						<td>4.  Completes Classroom Assignments</td><td align="center">'.$data['academic_assignments'].'</td>
					</tr>
					<tr>
						<td>5.  Completed Homework Assignments</td><td align="center">'.$data['academic_homework'].'</td>
					</tr>
				</table>

				<div class="center">
					<h2>Behavior</h2>
					<div class="sm_txt">
						1 - Rarely &nbsp;&nbsp;
						2 - Sometimes &nbsp;&nbsp;
						3 - Most Of The Time &nbsp;&nbsp;
						4 - Always &nbsp;&nbsp;
					</div>
				</div>

				<table width="100%" class="gridtable">
					<tr>
						<td width="80%">1.  Follows Classroom Rules</td><td width="20%" align="center">'.$data['behavior_rules'].'</td>
					</tr>
					<tr class="tbl_bg">
						<td>2.  Accepts Redirection</td><td align="center">'.$data['behavior_redirection'].'</td>
					</tr>
					<tr>
						<td>3.  Manages Time Well - On Task</td><td align="center">'.$data['behavior_time'].'</td>
					</tr>
					<tr class="tbl_bg">
						<td>4.  Attentive</td><td align="center">'.$data['behavior_attentive'].'</td>
					</tr>
					<tr>
						<td>5.  Works Well With Peers</td><td align="center">'.$data['behavior_peers'].'</td>
					</tr>
				</table>
				<br />
				<table width="100%" class="gridtable">
					<tr>
						<th>OTHER BEHAVIORS <i>Circle Those Which Apply</i></th>
					</tr>
					<tr>
						<td class="med_txt">
							Cries '. $checked_cries .' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							Tics '.$checked_tics.'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							Poorly Organized '.$checked_unorganized.'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							Sulks/Pouts '.$checked_sulks.'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							Daydreams '.$checked_daydreams.'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							Tense '.$checked_tense.' 
							<br />
							Overly Sensitive '.$checked_sensitive.' &nbsp;&nbsp;&nbsp;
							Clumsy '.$checked_clumsy.'&nbsp;&nbsp;&nbsp;
							Poor Fine Motor Coordination '.$checked_coordination.' &nbsp;&nbsp;&nbsp;
							Destructive to Self and/or Property '.$checked_destructive.' 
						</td>
					</tr>
					<tr>
						<th>ADDITIONAL TEACHER COMMENTS - Request A Conference &nbsp;' . $request_teacher_conference_txt.'</th>
					</tr>
					<tr>
						<td>'.$teacher_comments.'</td>
					</tr>

				</table>
				
				<table width="100%" class="red strong">
					<tr>
						<td width="38%"><h4>Activities Completed: '.$data['activities'].'</h4></td>
						<td width="28%"><h4>Hours Spent: '.$data['hours'].'</h4></td>
						<td width="33%"><h4>Friday School: '.$friday_school.'</h4></td>

					</tr>
				</table>
				
				'.$subject_table.'
				<br />
				'.$show_pagebreak;
				;
		}
} else {
	$html = 'No students were selected';
	$progress_report_name = "Progress Report";
}
		//==============================================================
		//==============================================================
		//==============================================================
		include("../mpdf.php");

		$mpdf=new mPDF(); 

		$mpdf->SetDisplayMode('fullpage');

		$mpdf->SetHTMLFooter('<table width="100%" class="sm_txt" cellspacing="10" cellpadding="0">
			<tr>
				<td width="31%" valign="bottom" style="border-bottom: 1px solid black;"></td>
				<td width="31%" valign="bottom" style="border-bottom: 1px solid black;"></td>
				<td width="31%" valign="bottom" style="border-bottom: 1px solid black;"></td>
			</tr>
			<tr>
				<td valign="bottom">Student Signature</td>
				<td  valign="bottom">Case Manager</td>
				<td  valign="bottom">Parent/Guardian</td>
			</tr>
			<tr>
				<td colspan="3"><hr></td>
			</tr>
			<tr>
				<td valign="bottom"></td>
				<td  valign="bottom"></td>
				<td  valign="top" align="right" class="med_txt grey">Copyright © 2012 by Educate America Now Foundation</td>
			</tr>
		</table>');

		//$mpdf->showWatermarkImage = true;
		//$mpdf->SetWatermarkImage('ga_armor.jpg', 0.15, 'F');

		//$mpdf->SetWatermarkImage('ga_armor.png', 0.95, 'D'); //D- actual image size
		$mpdf->WriteHTML($html);

		//$mpdf->Output($progress_report_name, "I"); //prints pdf to screen
		$mpdf->Output($progress_report_name, "D"); //make download

		exit;

		//==============================================================
		//==============================================================
		//==============================================================


?>