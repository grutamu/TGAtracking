var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var database = {};

var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection('mongodb://localhost/TGAtracking');
var timestamps = require('mongoose-timestamp');

autoIncrement.initialize(connection);


var caseloadmgr_students = new Schema({
    caseloadmgr_student_id: Number,
    caseloadmgr_id: Number,
   	student_id: Number
});

database.caseloadmgr_students = mongoose.model('caseloadmgr_students', caseloadmgr_students);

var courses = new Schema({
    course_name: String,
    course_number: Number,
    school_year: String,
    course_begin_date: Date,
    course_end_date: Date,
    completed_date: Date,
    course_is_active: Boolean,
});

courses.plugin(timestamps);
courses.plugin(autoIncrement.plugin, {model: 'courses', field: 'course_id'});
database.courses = mongoose.model('courses', courses);

var course_teacher_link = new Schema({
    course: {type: Schema.Types.ObjectId, ref: 'courses'},
    teacher: {type: Schema.Types.ObjectId, ref: 'Account'}
});

course_teacher_link.plugin(timestamps);
database.course_teacher_link = mongoose.model('course_teacher_link', course_teacher_link);

var course_student_link = new Schema({
    course: {type: Schema.Types.ObjectId, ref: 'courses'},
    student: {type: Schema.Types.ObjectId, ref: 'Account'}
});

course_student_link.plugin(timestamps);
database.course_student_link = mongoose.model('course_student_link', course_student_link);

var course_attendance = new Schema({
    course_id: Number,
   	user_id: Number,
   	attendance_date: Date,
   	attendance_type: String,
   	tardy_time: String
});

course_attendance.plugin(timestamps);
courses.plugin(autoIncrement.plugin, {model: 'course_attendance', field: 'id'});
database.course_attendance = mongoose.model('course_attendance', course_attendance);


var course_gradebook = new Schema({
    gradebook_id: Number,
    course_id: Number,
   	student_id: Number,
   	assignment_type: Number,
   	assignment_number: Number,
   	assignment_score: String,
   	assignment_grade: String,
   	date_updated:{ type: Date, default: Date.now }
});

database.course_gradebook = mongoose.model('course_gradebook', course_gradebook);


var course_gradebook_finals = new Schema({
	gradebook_final_id: Number,
	course_id: Number,
	student_id: Number,
	student_completed_course: Number,
	calculated_grade_actual: String,
	calculated_grade: String,
	calculated_letter: String,
	edited_grade: String,
	edited_letter: String,
	perc_mp1: String,
	letter_mp1: String,
	perc_mp2: String,
	letter_mp2: String,
	perc_mp3: String,
	letter_mp3: String,
	perc_mp4: String,
	letter_mp4: String,
	perc_mp5: String,
	letter_mp5: String,
	date_updated: String
});

database.course_gradebook_finals = mongoose.model('course_gradebook_finals', course_gradebook_finals);


var course_grade_weights = new Schema({
  id: Number,
  row_order: Number,
  course_id: Number,
  type: String,
  percent: Number
});

database.course_grade_weights = mongoose.model('course_grade_weights', course_grade_weights);


var course_grading_scale = new Schema({
  id: Number,
  course_id: Number,
  row_order: Number,
  letter: String,
  begin_perc: Number,
  end_perc: Number
});

database.course_grading_scale = mongoose.model('course_grading_scale', course_grading_scale);


var course_structure = new Schema({
  id: Number,
  course_id: Number,
  row_order: Number,
  type: String,
  name: String,
  max_score: Number,
  hide: { type: Number, default: 0 }
});

database.course_structure = mongoose.model('course_structure', course_structure);


var course_students = new Schema({
  id: Number,
  district_id: Number,
  school_id: Number,
  course_id: Number,
  student_id: Number,
  student_completed_course: Number
});

database.course_students = mongoose.model('course_students', course_students);


var districts = new Schema({
  district_name: String,
  district_address: String,
  district_city: String,
  district_state: String,
  district_zip: String,
  is_active: { type: Boolean, default: true },
  last_updated: { type: Date, default: Date.now }
});

districts.plugin(autoIncrement.plugin, {model: 'districts', field: 'district_id'});
database.districts = mongoose.model('districts', districts);


var progress_report_data = new Schema({
  id: Number,
  progress_date: String,
  student_id: Number,
  student_name: String,
  is_student_IEP: { type: Number, default: 0 },
  teacher_id: Number,
  teacher_name: String,
  caseloadmgr_id: { type: Number, default: 0 },
  caseloadmgr_name: String,
  academic_time: Number,
  academic_prepared: Number,
  academic_engaged: Number,
  academic_assignments: Number,
  academic_homework: Number,
  behavior_rules: Number,
  behavior_redirection: Number,
  behavior_time: Number,
  behavior_attentive: Number,
  behavior_peers: Number,
  destructive: Number,
  cries: Number,
  tics: Number,
  clumsy: Number,
  sulks: Number,
  daydreams: Number,
  tense: Number,
  issensitive: Number,
  unorganized: Number,
  coordination: Number,
  request_teacher_conference: Number,
  teacher_comments: String,
  hours: String,
  activities: String,
  friday_school: Number,
  report_returned: Number,
  insert_date: Date,
  last_updated: { type: Date, default: Date.now }
});

database.progress_report_data = mongoose.model('progress_report_data', progress_report_data);


var progress_report_data_courses = new Schema({
  prdc_id: Number,
  progress_report_id: Number,
  course_id: Number,
  course_name: String,
  course_abbrev: String,
  current_perc: Number,
  target_perc: Number,
  complete_perc: Number,
  behind_perc: Number,
  last_updated: { type: Date, default: Date.now }
});

database.progress_report_data_courses = mongoose.model('progress_report_data_courses', progress_report_data_courses);


var report_card_data = new Schema({
  report_card_data_id: Number,
  student_id: Number,
  fName: String,
  mName: String,
  lName: String,
  current_grade: Number,
  student_pic: String,
  district_id: Number,
  school_year: String,
  school_id: Number,
  school_name: String,
  semester_num: Number,
  marking_period: String,
  reportCard_txt1: Number,
  reportCard_txt2: Number,
  reportCard_txt3: Number,
  reportCard_txt4: Number,
  report_card_txt: String,
  report_card_date: Date,
  insert_date: Date,
  last_updated: { type: Date, default: Date.now }
});

database.report_card_data = mongoose.model('report_card_data', report_card_data);


var report_card_data_courses = new Schema({
  rc_courses_id: Number,
  report_card_data_id: Number,
  course_name: String,
  course_abbrev: String,
  grade_letter: String,
  grade_perc: String
});

database.report_card_data_courses = mongoose.model('report_card_data_courses', report_card_data_courses);


var roles = new Schema({
  role_id: Number,
  role_name: String,
  role_order: Number
});

database.roles = mongoose.model('roles', roles);

var schools = new Schema({
  district: {type: Schema.Types.ObjectId, ref: 'districts'},
  school_name: String,
  school_address: String,
  school_city: String,
  school_state: String,
  school_zip: String,
  current_school_year: String,
  school_is_active: { type: Boolean, default: true },
  last_updated: { type: Date, default: Date.now }
});
schools.plugin(autoIncrement.plugin, {model: 'schools', field: 'school_id'});
database.schools = mongoose.model('schools', schools);


module.exports = database;


