<?php
// ============================================================
//  Vidyaloka School Management — Backend API  v2.0
//  Place this file in: C:/xampp/htdocs/vidyaloka/api.php
//  FIRST RUN: http://localhost/vidyaloka/api.php?action=setup
// ============================================================

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

// ─── DB CONFIG ────────────────────────────────────────────────
define('DB_HOST', 'localhost');
define('DB_PORT', 3306);
define('DB_NAME', 'vidyaloka_sms');
define('DB_USER', 'root');
define('DB_PASS', '');

function getPDO() {
    try {
        return new PDO("mysql:host=".DB_HOST.";port=".DB_PORT.";dbname=".DB_NAME.";charset=utf8mb4",
            DB_USER, DB_PASS,
            [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success"=>false,"message"=>"DB error: ".$e->getMessage()]);
        exit();
    }
}
function ok($d=[])         { echo json_encode(array_merge(["success"=>true],$d)); exit(); }
function fail($m,$c=400)   { http_response_code($c); echo json_encode(["success"=>false,"message"=>$m]); exit(); }
function body()            { return json_decode(file_get_contents("php://input"),true)??[]; }
function av($n)            { $w=explode(" ",trim($n)); return strtoupper(substr($w[0],0,1).(isset($w[1])?substr($w[1],0,1):'')); }
function grade($p)         { if($p>=75)return'A'; if($p>=65)return'B'; if($p>=55)return'C'; if($p>=40)return'D'; return'F'; }

$action = $_GET['action'] ?? '';
switch ($action) {
    case 'login':              doLogin();            break;
    case 'register':           doRegister();         break;
    case 'reset_password':     doResetPw();          break;
    case 'update_profile':     doUpdateProfile();    break;
    case 'change_password':    doChangePw();         break;
    case 'users':              doGetUsers();         break;
    case 'delete_user':        doDeleteUser();       break;
    case 'user_stats':         doUserStats();        break;
    case 'subjects':           doGetSubjects();      break;
    case 'add_subject':        doAddSubject();       break;
    case 'delete_subject':     doDeleteSubject();    break;
    case 'grades':             doGetGrades();        break;
    case 'save_grade':         doSaveGrade();        break;
    case 'delete_grade':       doDeleteGrade();      break;
    case 'grade_report':       doGradeReport();      break;
    case 'student_grade_card': doStudentGradeCard(); break;
    case 'attendance':         doGetAttendance();    break;
    case 'mark_attendance':    doMarkAttendance();   break;
    case 'attendance_summary': doAttSummary();       break;
    case 'my_attendance':      doMyAttendance();     break;
    case 'setup':              doSetup();            break;
    default: fail("Unknown action: $action", 404);
}

// ── AUTH ──────────────────────────────────────────────────────
function doLogin() {
    $b=body(); $pdo=getPDO();
    $email=trim($b['email']??''); $pw=$b['password']??'';
    if(!$email||!$pw) fail("Email and password required.");
    $s=$pdo->prepare("SELECT * FROM users WHERE email=? LIMIT 1"); $s->execute([$email]);
    $u=$s->fetch();
    if(!$u||!password_verify($pw,$u['password_hash'])) fail("Invalid email or password.");
    ok(["user"=>safe($u)]);
}
function doRegister() {
    $b=body(); $pdo=getPDO();
    $name=trim($b['name']??''); $email=trim($b['email']??''); $pw=$b['password']??'';
    $role=$b['role']??'Student'; $dept=trim($b['department']??''); $phone=trim($b['phone']??'');
    if(!$name||!$email||!$pw) fail("Name, email and password required.");
    if(!filter_var($email,FILTER_VALIDATE_EMAIL)) fail("Invalid email.");
    $c=$pdo->prepare("SELECT id FROM users WHERE email=? LIMIT 1"); $c->execute([$email]);
    if($c->fetch()) fail("Email already registered.");
    $hash=password_hash($pw,PASSWORD_BCRYPT); $today=date('Y-m-d'); $avatar=av($name);
    $s=$pdo->prepare("INSERT INTO users (name,email,password_hash,role,avatar,department,phone,joined) VALUES(?,?,?,?,?,?,?,?)");
    $s->execute([$name,$email,$hash,$role,$avatar,$dept,$phone,$today]);
    $id=(int)$pdo->lastInsertId();
    ok(["user"=>["id"=>$id,"name"=>$name,"email"=>$email,"role"=>$role,"avatar"=>$avatar,"department"=>$dept,"phone"=>$phone,"joined"=>$today]]);
}
function doResetPw() {
    $b=body(); $pdo=getPDO(); $email=trim($b['email']??'');
    $s=$pdo->prepare("SELECT id FROM users WHERE email=? LIMIT 1"); $s->execute([$email]);
    if($s->fetch()) ok(["message"=>"Password reset link sent to your email."]);
    else fail("No account found with that email.");
}
function doUpdateProfile() {
    $b=body(); $pdo=getPDO();
    $id=(int)($b['id']??0); $name=trim($b['name']??''); $phone=$b['phone']??''; $dept=$b['department']??'';
    if(!$id||!$name) fail("ID and name required.");
    $avatar=av($name);
    $pdo->prepare("UPDATE users SET name=?,phone=?,department=?,avatar=? WHERE id=?")->execute([$name,$phone,$dept,$avatar,$id]);
    ok(["avatar"=>$avatar]);
}
function doChangePw() {
    $b=body(); $pdo=getPDO();
    $id=(int)($b['id']??0); $cur=$b['current']??''; $new=$b['new']??'';
    if(!$id||!$cur||!$new) fail("All fields required.");
    $s=$pdo->prepare("SELECT password_hash FROM users WHERE id=? LIMIT 1"); $s->execute([$id]);
    $u=$s->fetch();
    if(!$u||!password_verify($cur,$u['password_hash'])) fail("Current password is incorrect.");
    if(strlen($new)<6) fail("New password must be at least 6 characters.");
    $pdo->prepare("UPDATE users SET password_hash=? WHERE id=?")->execute([password_hash($new,PASSWORD_BCRYPT),$id]);
    ok(["message"=>"Password changed successfully."]);
}
function safe($u) { return["id"=>(int)$u['id'],"name"=>$u['name'],"email"=>$u['email'],"role"=>$u['role'],"avatar"=>$u['avatar'],"department"=>$u['department'],"phone"=>$u['phone'],"joined"=>$u['joined']]; }

// ── USERS / OVERVIEW ─────────────────────────────────────────
function doGetUsers() {
    $pdo=getPDO(); $role=$_GET['role']??''; $search=$_GET['search']??'';
    $sql="SELECT id,name,email,role,avatar,department,phone,joined FROM users WHERE 1=1";
    $p=[];
    if($role)  { $sql.=" AND role=?"; $p[]=$role; }
    if($search){ $sql.=" AND (name LIKE ? OR email LIKE ? OR department LIKE ?)"; $p[]="%$search%"; $p[]="%$search%"; $p[]="%$search%"; }
    $sql.=" ORDER BY joined DESC, name ASC";
    $s=$pdo->prepare($sql); $s->execute($p);
    $rows=$s->fetchAll(); foreach($rows as &$r) $r['id']=(int)$r['id'];
    ok(["users"=>$rows]);
}
function doDeleteUser() {
    $b=body(); $pdo=getPDO(); $id=(int)($b['id']??0);
    if(!$id) fail("User ID required.");
    $pdo->prepare("DELETE FROM users WHERE id=?")->execute([$id]);
    ok(["message"=>"User deleted."]);
}
function doUserStats() {
    $pdo=getPDO();
    $s=$pdo->query("SELECT role,COUNT(*) as c FROM users GROUP BY role"); $byRole=[];
    while($r=$s->fetch()) $byRole[$r['role']]=(int)$r['c'];
    $total=array_sum($byRole);
    $s2=$pdo->query("SELECT COUNT(*) as c FROM users WHERE DATE_FORMAT(joined,'%Y-%m')=DATE_FORMAT(NOW(),'%Y-%m')");
    $newMonth=(int)$s2->fetch()['c'];
    $s3=$pdo->query("SELECT id,name,role,avatar,department,joined FROM users ORDER BY joined DESC LIMIT 5");
    $recent=$s3->fetchAll(); foreach($recent as &$r) $r['id']=(int)$r['id'];
    $s4=$pdo->query("SELECT DATE_FORMAT(joined,'%Y-%m') as m,COUNT(*) as c FROM users WHERE joined>=DATE_SUB(NOW(),INTERVAL 6 MONTH) GROUP BY m ORDER BY m");
    $monthly=$s4->fetchAll();
    ok(["total"=>$total,"by_role"=>$byRole,"new_this_month"=>$newMonth,"recent"=>$recent,"monthly"=>$monthly]);
}

// ── SUBJECTS ─────────────────────────────────────────────────
function doGetSubjects() {
    $pdo=getPDO(); $s=$pdo->query("SELECT * FROM subjects ORDER BY name");
    $rows=$s->fetchAll(); foreach($rows as &$r){ $r['id']=(int)$r['id']; $r['max_marks']=(int)$r['max_marks']; }
    ok(["subjects"=>$rows]);
}
function doAddSubject() {
    $b=body(); $pdo=getPDO();
    $name=trim($b['name']??''); $code=trim($b['code']??''); $max=(int)($b['max_marks']??100);
    if(!$name) fail("Subject name required.");
    $c=$pdo->prepare("SELECT id FROM subjects WHERE name=? LIMIT 1"); $c->execute([$name]);
    if($c->fetch()) fail("Subject already exists.");
    $pdo->prepare("INSERT INTO subjects (name,code,max_marks) VALUES(?,?,?)")->execute([$name,$code,$max]);
    ok(["subject"=>["id"=>(int)$pdo->lastInsertId(),"name"=>$name,"code"=>$code,"max_marks"=>$max]]);
}
function doDeleteSubject() {
    $b=body(); $pdo=getPDO(); $id=(int)($b['id']??0);
    if(!$id) fail("Subject ID required.");
    $pdo->prepare("DELETE FROM subjects WHERE id=?")->execute([$id]);
    ok(["message"=>"Subject deleted."]);
}

// ── GRADES ───────────────────────────────────────────────────
function doGetGrades() {
    $pdo=getPDO(); $sid=(int)($_GET['student_id']??0); $subid=(int)($_GET['subject_id']??0);
    $term=$_GET['term']??''; $cls=$_GET['class']??'';
    $sql="SELECT g.id,g.student_id,g.subject_id,g.marks,g.term,g.remarks,
                 u.name AS student_name,u.department AS class,
                 s.name AS subject_name,s.max_marks,s.code AS subject_code
          FROM grades g JOIN users u ON g.student_id=u.id JOIN subjects s ON g.subject_id=s.id WHERE 1=1";
    $p=[];
    if($sid)  { $sql.=" AND g.student_id=?";  $p[]=$sid; }
    if($subid){ $sql.=" AND g.subject_id=?";  $p[]=$subid; }
    if($term) { $sql.=" AND g.term=?";         $p[]=$term; }
    if($cls)  { $sql.=" AND u.department=?";   $p[]=$cls; }
    $sql.=" ORDER BY u.name,s.name,g.term";
    $s=$pdo->prepare($sql); $s->execute($p); $rows=$s->fetchAll();
    foreach($rows as &$r){ $r['id']=(int)$r['id']; $r['marks']=(float)$r['marks']; $r['max_marks']=(int)$r['max_marks']; $pct=$r['max_marks']>0?round($r['marks']/$r['max_marks']*100,1):0; $r['percentage']=$pct; $r['grade_letter']=grade($pct); }
    ok(["grades"=>$rows]);
}
function doSaveGrade() {
    $b=body(); $pdo=getPDO();
    $sid=(int)($b['student_id']??0); $subid=(int)($b['subject_id']??0);
    $marks=(float)($b['marks']??0); $term=$b['term']??'Term 1'; $remarks=trim($b['remarks']??'');
    if(!$sid||!$subid) fail("Student and subject required.");
    $pdo->prepare("INSERT INTO grades (student_id,subject_id,marks,term,remarks) VALUES(?,?,?,?,?)
                   ON DUPLICATE KEY UPDATE marks=VALUES(marks),remarks=VALUES(remarks)")->execute([$sid,$subid,$marks,$term,$remarks]);
    ok(["message"=>"Grade saved."]);
}
function doDeleteGrade() {
    $b=body(); $pdo=getPDO(); $id=(int)($b['id']??0);
    if(!$id) fail("Grade ID required.");
    $pdo->prepare("DELETE FROM grades WHERE id=?")->execute([$id]);
    ok(["message"=>"Grade deleted."]);
}
function doGradeReport() {
    $pdo=getPDO(); $cls=$_GET['class']??''; $term=$_GET['term']??'';
    $wU=$cls?"AND u.department=?":''; $wG=$term?"AND g.term=?":'';
    $p=[]; $p2=[];
    if($cls){ $p[]=$cls; $p2[]=$cls; } if($term){ $p[]=$term; $p2[]=$term; }

    $s=$pdo->prepare("SELECT s.id,s.name AS subject,s.max_marks,
                             ROUND(AVG(g.marks),1) AS avg_marks,
                             ROUND(AVG(g.marks/s.max_marks*100),1) AS avg_pct,
                             MAX(g.marks) AS max_scored,MIN(g.marks) AS min_scored,COUNT(g.id) AS entries
                      FROM grades g JOIN subjects s ON g.subject_id=s.id JOIN users u ON g.student_id=u.id
                      WHERE u.role='Student' $wU $wG GROUP BY s.id ORDER BY s.name");
    $s->execute($p); $subjects=$s->fetchAll();
    foreach($subjects as &$r){ $r['id']=(int)$r['id']; $r['max_marks']=(int)$r['max_marks']; $r['avg_marks']=(float)$r['avg_marks']; $r['avg_pct']=(float)$r['avg_pct']; $r['entries']=(int)$r['entries']; }

    $s2=$pdo->prepare("SELECT
        SUM(CASE WHEN g.marks/s.max_marks*100>=75 THEN 1 ELSE 0 END) AS A,
        SUM(CASE WHEN g.marks/s.max_marks*100>=65 AND g.marks/s.max_marks*100<75 THEN 1 ELSE 0 END) AS B,
        SUM(CASE WHEN g.marks/s.max_marks*100>=55 AND g.marks/s.max_marks*100<65 THEN 1 ELSE 0 END) AS C,
        SUM(CASE WHEN g.marks/s.max_marks*100>=40 AND g.marks/s.max_marks*100<55 THEN 1 ELSE 0 END) AS D,
        SUM(CASE WHEN g.marks/s.max_marks*100<40 THEN 1 ELSE 0 END) AS F
        FROM grades g JOIN subjects s ON g.subject_id=s.id JOIN users u ON g.student_id=u.id
        WHERE u.role='Student' $wU $wG");
    $s2->execute($p); $dist=$s2->fetch(); foreach($dist as &$v) $v=(int)$v;

    $s3=$pdo->prepare("SELECT u.id,u.name,u.department AS class,u.avatar,
                              ROUND(AVG(g.marks/s.max_marks*100),1) AS avg_pct
                       FROM grades g JOIN users u ON g.student_id=u.id JOIN subjects s ON g.subject_id=s.id
                       WHERE u.role='Student' $wU $wG GROUP BY u.id ORDER BY avg_pct DESC LIMIT 5");
    $s3->execute($p2); $top=$s3->fetchAll(); foreach($top as &$t){ $t['id']=(int)$t['id']; $t['avg_pct']=(float)$t['avg_pct']; }

    $p3=$term?[$term]:[];
    $s4=$pdo->prepare("SELECT u.department AS class,ROUND(AVG(g.marks/s.max_marks*100),1) AS avg_pct,COUNT(DISTINCT u.id) AS students
                       FROM grades g JOIN users u ON g.student_id=u.id JOIN subjects s ON g.subject_id=s.id
                       WHERE u.role='Student' $wG GROUP BY u.department ORDER BY avg_pct DESC");
    $s4->execute($p3); $classes=$s4->fetchAll(); foreach($classes as &$c){ $c['avg_pct']=(float)$c['avg_pct']; $c['students']=(int)$c['students']; }

    ok(["subjects"=>$subjects,"distribution"=>$dist,"top_students"=>$top,"classes"=>$classes]);
}
function doStudentGradeCard() {
    $pdo=getPDO(); $sid=(int)($_GET['student_id']??0);
    if(!$sid) fail("Student ID required.");
    $s=$pdo->prepare("SELECT id,name,department,avatar FROM users WHERE id=? LIMIT 1"); $s->execute([$sid]); $student=$s->fetch();
    if(!$student) fail("Student not found.");
    $s2=$pdo->prepare("SELECT g.id,g.marks,g.term,g.remarks,s.name AS subject,s.max_marks,s.code,
                              ROUND(g.marks/s.max_marks*100,1) AS percentage
                       FROM grades g JOIN subjects s ON g.subject_id=s.id
                       WHERE g.student_id=? ORDER BY g.term,s.name");
    $s2->execute([$sid]); $grades=$s2->fetchAll();
    foreach($grades as &$g){ $g['id']=(int)$g['id']; $g['marks']=(float)$g['marks']; $g['max_marks']=(int)$g['max_marks']; $g['percentage']=(float)$g['percentage']; $g['grade_letter']=grade($g['percentage']); }
    ok(["student"=>$student,"grades"=>$grades]);
}

// ── ATTENDANCE ───────────────────────────────────────────────
function doGetAttendance() {
    $pdo=getPDO(); $date=$_GET['date']??''; $cls=$_GET['class']??'';
    if(!$date) fail("Date is required.");
    $sql="SELECT u.id,u.name,u.department,u.avatar,a.id AS att_id,a.status,a.note
          FROM users u LEFT JOIN attendance a ON u.id=a.student_id AND a.date=?
          WHERE u.role='Student'";
    $p=[$date];
    if($cls){ $sql.=" AND u.department=?"; $p[]=$cls; }
    $sql.=" ORDER BY u.name";
    $s=$pdo->prepare($sql); $s->execute($p); $rows=$s->fetchAll();
    foreach($rows as &$r){ $r['id']=(int)$r['id']; if($r['att_id']) $r['att_id']=(int)$r['att_id']; }
    ok(["attendance"=>$rows,"date"=>$date]);
}
function doMarkAttendance() {
    $b=body(); $pdo=getPDO();
    $records=$b['records']??[]; $date=$b['date']??date('Y-m-d');
    if(empty($records)) fail("No records provided.");
    $s=$pdo->prepare("INSERT INTO attendance (student_id,date,status,note) VALUES(?,?,?,?)
                      ON DUPLICATE KEY UPDATE status=VALUES(status),note=VALUES(note)");
    foreach($records as $rec){ $sid=(int)($rec['student_id']??0); if($sid) $s->execute([$sid,$date,$rec['status']??'Present',trim($rec['note']??'')]); }
    ok(["message"=>"Attendance saved for $date."]);
}
function doAttSummary() {
    $pdo=getPDO(); $month=$_GET['month']??date('Y-m'); $cls=$_GET['class']??'';
    $wU=$cls?"AND u.department=?":''; $p=[$month]; $p2=[]; if($cls){ $p[]=$cls; $p2[]=$cls; } $p2[]=$month;

    $s=$pdo->prepare("SELECT u.id,u.name,u.department AS class,u.avatar,
                             COUNT(a.id) AS total_days,
                             SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END) AS present,
                             SUM(CASE WHEN a.status='Absent'  THEN 1 ELSE 0 END) AS absent,
                             SUM(CASE WHEN a.status='Late'    THEN 1 ELSE 0 END) AS late,
                             SUM(CASE WHEN a.status='Excused' THEN 1 ELSE 0 END) AS excused,
                             ROUND(SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END)/NULLIF(COUNT(a.id),0)*100,1) AS pct
                      FROM users u LEFT JOIN attendance a ON u.id=a.student_id AND DATE_FORMAT(a.date,'%Y-%m')=?
                      WHERE u.role='Student' $wU GROUP BY u.id ORDER BY u.name");
    $s->execute($p); $students=$s->fetchAll();
    foreach($students as &$r){ $r['id']=(int)$r['id']; $r['total_days']=(int)$r['total_days']; $r['present']=(int)$r['present']; $r['absent']=(int)$r['absent']; $r['late']=(int)$r['late']; $r['excused']=(int)$r['excused']; $r['pct']=(float)$r['pct']; }

    $s2=$pdo->prepare("SELECT a.date,
                              SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END) AS present,
                              SUM(CASE WHEN a.status='Absent'  THEN 1 ELSE 0 END) AS absent,
                              SUM(CASE WHEN a.status='Late'    THEN 1 ELSE 0 END) AS late,
                              COUNT(a.id) AS total
                       FROM attendance a JOIN users u ON a.student_id=u.id
                       WHERE u.role='Student' $wU AND DATE_FORMAT(a.date,'%Y-%m')=?
                       GROUP BY a.date ORDER BY a.date");
    $s2->execute($p2); $daily=$s2->fetchAll();
    foreach($daily as &$d){ $d['present']=(int)$d['present']; $d['absent']=(int)$d['absent']; $d['late']=(int)$d['late']; $d['total']=(int)$d['total']; }

    $tP=array_sum(array_column($students,'present')); $tA=array_sum(array_column($students,'absent'));
    $tL=array_sum(array_column($students,'late'));    $tD=array_sum(array_column($students,'total_days'));
    ok(["students"=>$students,"daily"=>$daily,"totals"=>["present"=>$tP,"absent"=>$tA,"late"=>$tL,"total_days"=>$tD]]);
}
function doMyAttendance() {
    $pdo=getPDO(); $sid=(int)($_GET['student_id']??0);
    if(!$sid) fail("Student ID required.");
    $months=[];
    for($i=5;$i>=0;$i--){
        $m=date('Y-m',strtotime("-$i months"));
        $s=$pdo->prepare("SELECT SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) AS present,
                                 SUM(CASE WHEN status='Absent'  THEN 1 ELSE 0 END) AS absent,
                                 SUM(CASE WHEN status='Late'    THEN 1 ELSE 0 END) AS late,
                                 COUNT(*) AS total FROM attendance WHERE student_id=? AND DATE_FORMAT(date,'%Y-%m')=?");
        $s->execute([$sid,$m]); $r=$s->fetch();
        $months[]=["month"=>$m,"present"=>(int)$r['present'],"absent"=>(int)$r['absent'],"late"=>(int)$r['late'],"total"=>(int)$r['total']];
    }
    $s2=$pdo->prepare("SELECT date,status,note FROM attendance WHERE student_id=? ORDER BY date DESC LIMIT 30");
    $s2->execute([$sid]); $recent=$s2->fetchAll();
    $s3=$pdo->prepare("SELECT SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) AS present,
                              SUM(CASE WHEN status='Absent'  THEN 1 ELSE 0 END) AS absent,
                              SUM(CASE WHEN status='Late'    THEN 1 ELSE 0 END) AS late,
                              COUNT(*) AS total FROM attendance WHERE student_id=?");
    $s3->execute([$sid]); $totals=$s3->fetch(); foreach($totals as &$v) $v=(int)$v;
    ok(["monthly"=>$months,"recent"=>$recent,"totals"=>$totals]);
}

// ── SETUP ─────────────────────────────────────────────────────
function doSetup() {
    try {
        $pdo=new PDO("mysql:host=".DB_HOST.";port=".DB_PORT.";charset=utf8mb4",DB_USER,DB_PASS,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `".DB_NAME."` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $pdo->exec("USE `".DB_NAME."`");
    } catch(PDOException $e){ fail("Setup failed: ".$e->getMessage()); }

    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL, email VARCHAR(120) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('Admin','Principal','Teacher','Student','Parent','Accountant') NOT NULL DEFAULT 'Student',
        avatar VARCHAR(5) NOT NULL DEFAULT '', department VARCHAR(100) NOT NULL DEFAULT '',
        phone VARCHAR(30) NOT NULL DEFAULT '', joined DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS subjects (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE, code VARCHAR(20) NOT NULL DEFAULT '',
        max_marks INT NOT NULL DEFAULT 100, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS grades (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        student_id INT UNSIGNED NOT NULL, subject_id INT UNSIGNED NOT NULL,
        marks DECIMAL(6,2) NOT NULL DEFAULT 0,
        term ENUM('Term 1','Term 2','Term 3','Final') NOT NULL DEFAULT 'Term 1',
        remarks VARCHAR(255) NOT NULL DEFAULT '', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_grade (student_id,subject_id,term),
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS attendance (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        student_id INT UNSIGNED NOT NULL, date DATE NOT NULL,
        status ENUM('Present','Absent','Late','Excused') NOT NULL DEFAULT 'Present',
        note VARCHAR(200) NOT NULL DEFAULT '', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_att (student_id,date),
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Seed users
    $users=[
        ["Dr. Anura Perera","admin@school.lk","admin123","Admin","Administration","+94 77 111 0001","2019-01-15"],
        ["Mrs. Kumari Silva","principal@school.lk","principal123","Principal","Leadership","+94 71 111 0002","2018-03-10"],
        ["Mr. Roshan Fernando","teacher@school.lk","teacher123","Teacher","Mathematics","+94 76 111 0003","2020-08-01"],
        ["Ms. Dilani Rathnayake","teacher2@school.lk","teacher123","Teacher","Science","+94 76 111 0004","2020-08-01"],
        ["Mr. Asanka Perera","teacher3@school.lk","teacher123","Teacher","English","+94 76 111 0005","2021-01-10"],
        ["Kasun Jayawardena","student@school.lk","student123","Student","Grade 10 - A","+94 70 111 0006","2022-01-05"],
        ["Nimasha Wijesinghe","student2@school.lk","student123","Student","Grade 10 - A","+94 70 111 0007","2022-01-05"],
        ["Tharindu Bandara","student3@school.lk","student123","Student","Grade 10 - B","+94 70 111 0008","2022-01-05"],
        ["Sachini Perera","student4@school.lk","student123","Student","Grade 10 - B","+94 70 111 0009","2022-01-05"],
        ["Dulara Gunasekara","student5@school.lk","student123","Student","Grade 11 - A","+94 70 111 0010","2021-01-05"],
        ["Ravindu Mendis","student6@school.lk","student123","Student","Grade 11 - A","+94 70 111 0011","2021-01-05"],
        ["Sithmi Amarasinghe","student7@school.lk","student123","Student","Grade 11 - B","+94 70 111 0012","2021-01-05"],
        ["Pasan Weerasinghe","student8@school.lk","student123","Student","Grade 11 - B","+94 70 111 0013","2021-01-05"],
        ["Mrs. Nilmini Bandara","parent@school.lk","parent123","Parent","Parent of Kasun","+94 75 111 0014","2022-01-05"],
        ["Mr. Pradeep Guna","accountant@school.lk","acc123","Accountant","Finance","+94 78 111 0015","2021-06-01"],
    ];
    $ins=$pdo->prepare("INSERT IGNORE INTO users (name,email,password_hash,role,avatar,department,phone,joined) VALUES(?,?,?,?,?,?,?,?)");
    foreach($users as $u) $ins->execute([$u[0],$u[1],password_hash($u[2],PASSWORD_BCRYPT),$u[3],av($u[0]),$u[4],$u[5],$u[6]]);

    // Seed subjects
    $subs=[["Mathematics","MATH",100],["Science","SCI",100],["English","ENG",100],["History","HIS",100],["Geography","GEO",100],["ICT","ICT",100]];
    $ins2=$pdo->prepare("INSERT IGNORE INTO subjects (name,code,max_marks) VALUES(?,?,?)");
    foreach($subs as $s) $ins2->execute($s);

    // Seed grades
    $sids=$pdo->query("SELECT id FROM users WHERE role='Student'")->fetchAll(PDO::FETCH_COLUMN);
    $subids=$pdo->query("SELECT id FROM subjects")->fetchAll(PDO::FETCH_COLUMN);
    $ins3=$pdo->prepare("INSERT IGNORE INTO grades (student_id,subject_id,marks,term) VALUES(?,?,?,?)");
    $terms=['Term 1','Term 2','Term 3']; srand(42);
    foreach($sids as $sid) foreach($subids as $subid) foreach($terms as $t) $ins3->execute([$sid,$subid,rand(42,98),$t]);

    // Seed attendance (last 45 weekdays)
    $ins4=$pdo->prepare("INSERT IGNORE INTO attendance (student_id,date,status) VALUES(?,?,?)");
    $pool=['Present','Present','Present','Present','Present','Present','Present','Absent','Absent','Late'];
    foreach($sids as $sid) for($i=44;$i>=0;$i--){ $d=date('Y-m-d',strtotime("-$i days")); if(date('N',strtotime($d))>=6) continue; $ins4->execute([$sid,$d,$pool[array_rand($pool)]]); }

    ok(["message"=>"Database setup complete! Tables created and seeded.","db"=>DB_NAME]);
}
?>