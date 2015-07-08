<?php
include("../../../init.php");

if (isset($_POST['last_date'])) {
	//don't print anything if there are no checkboxes selected
	//will get an error msg if try to do so!

		//pass pr_last_date in the form of pr_id _ progress_date
		if (!is_array($_POST['last_date'])) {  //only 1 student progress report passes
			$rc_date_arr = array($_POST['last_date']);
		} else {
			$rc_date_arr = $_POST['last_date'];

		}

		$num_pages = count($rc_date_arr);

		$count_pages = 1;
		$html = '';
		foreach ($rc_date_arr as $post) {

			if ($count_pages < $num_pages) {
				$show_pagebreak = '<pagebreak>';
			} else {
				$show_pagebreak = '';
			}
			$count_pages++;

				//last date comes in as report_card_data_id _ date
				//so separate them!
				$rc_last_date = explode("_", $post);
				$report_card_data_id = $rc_last_date[0]; // piece1
				$last_date = $rc_last_date[1]; // piece2

				//main data
				$data = $Report->getReportCardDataByID($report_card_data_id, 'report_card_data');
				foreach($data as $row) {
					$current_grade = $row['current_grade'];
					$student_pic = $row['student_pic'];
					$student_name = $row['fName']. ' '.$row['lName'];
					$report_card_txt = $row['report_card_txt'];
					$semester_num = $row['semester_num'];
					$marking_period = $row['marking_period'];
				}
				//progress report name
				if (!is_array($_POST['last_date'])) { //only 1 student progress report passes
					$progress_report_name = $data['fName'].'_'.$data['lName'];
					$progress_report_name = 'Report_Card_'.$progress_report_name.'_'.$data['report_card_date'];
				} else {
					$progress_report_name = 'Report_Card_'.date('m-d-Y', strtotime($last_date));
				}


				//courses
				$courses = $Report->getReportCardDataByID($report_card_data_id, 'report_card_data_courses');

				$subject_table = '<table width="100%" class="med_txt">';
				foreach ($courses as $course) {
					$subject_table .= '<tr>
											<td>'.$course['course_name'].' '.$course['course_abbrev'].'</td>
											<td width="120" align="center">'.$course['grade_letter'].'</td>
											<td width="120" align="center">'.$course['grade_perc'].'</td>
										</tr>
									  ';
				}
				$subject_table .= '</table>';
				

				//@page needs to first selector in css or it will be ignored
				//@page sets margins and other page values
				$html .= '
				<style>
				@page{
				    margin-top: .5cm;
				    margin-bottom: .5cm;
				    margin-left: .5cm;
				    margin-right: .1cm;
				}

				html,body{height:100%;}
				body{
				    /*background:url("ga_armor.png") no-repeat fixed center center;*/
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

				.main_bg {
					background-color: #ac1f30;
					height: 93mm;
					width: 96%;
					padding: 3mm 2mm;
				}
				.report_card_txt_bg {
					background-color: #fff;
					height: 11em;
					width: 90mm;
					float: right;
					padding: 2mm;
					font-size: 11px;
				}

				.report_card_courses_table {
					width: 100%;
					height: 76mm;
					background-color: #ffffff;
					padding: 0;
				}

				.report_card_courses_table_header {
					width: 100%;
					height: 5mm;
					background-color: #dedede;
					padding: 0 2mm 1mm 2mm;
					font-size: 14px;
				}
				.report_card_courses_table_body {
					width: 100%;
					padding: 1mm 2mm;
					font-size: 14px;
				}

				.rounded10_top {
					-webkit-border-radius: 10px 10px 0 0;
					-moz-border-radius: 10px 10px 0 0;
					border-radius: 10px 10px 0 0;
				}	
				.rounded10 {
					-webkit-border-radius: 10px;
					-moz-border-radius: 10px;
					border-radius: 10px;
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

	


				</style>

				<body>
				';

				for ($i=1; $i<=2; $i++) {

					$html .='
					<div class="main_bg rounded10">
						

						<div style="width: 750px;">
							 <div style="float: left; width: 125px; height:175px;">
								<img src="reportCard_school_seal.png" width="120" height="120">
							 </div>

							 <div style="float: left; width: 230px; height:175px; font-size: 14px;">
							 	The GREAT Academy<br />
								6001-A San Mateo BLVD NE<br />
								Albuquerque, NM  87109<br />
								Phone:  505-792-9306
								<br /><br />
								Date: '.$last_date.'<br />
								Student: '.$student_name.'<br />
								Grade: '.$current_grade.'<br />
								SID: '.$student_pic.'
							 </div>

							 <div class="report_card_txt_bg rounded10">
							 	'.$report_card_txt .'
							 </div>
							 <br style="clear: all;"/>
						</div>

						<div  class="report_card_courses_table rounded10">
							<div class="report_card_courses_table_header rounded10_top">
								<table width="100%" class="med_txt">
									<tr>
										<td width="200">Course Name</td>
										<td align="center"> Semester '.$semester_num.'</td>
										<td width="120" align="center">Quarter '.$marking_period.'<br />Grade</td>
										<td width="120" align="center">Quarter '.$marking_period.'<br />% Grade</td>
									</tr>
								</table>
							</div>
							<div class="report_card_courses_table_body">
							'.$subject_table.'
							</div>
						</div>

					</div>
					';

					if ($i == 1) {
						$html .= '<br /><br />';
					}

				}
	


				$html .= $show_pagebreak;
				
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

		/*$mpdf->SetHTMLFooter('<table width="100%" class="sm_txt" cellspacing="10" cellpadding="0">
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
		*/

		//$mpdf->showWatermarkImage = true;
		//$mpdf->SetWatermarkImage('ga_armor.jpg', 0.15, 'F');

		//$mpdf->SetWatermarkImage('ga_armor.png', 0.95, 'D'); //D- actual image size
		$mpdf->WriteHTML($html);

		//$mpdf->Output($progress_report_name, "I"); //prints pdf to screen for testing
		$mpdf->Output($progress_report_name, "D"); //make download

		exit;

		//==============================================================
		//==============================================================
		//==============================================================


?>