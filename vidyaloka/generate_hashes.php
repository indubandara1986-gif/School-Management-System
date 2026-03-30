<?php
// ============================================================
//  generate_hashes.php — Run ONCE to seed the database
//  Place in: C:/xampp/htdocs/vidyaloka/generate_hashes.php
//  Then visit: http://localhost/vidyaloka/generate_hashes.php
//  DELETE this file after use!
// ============================================================

$host = "localhost";
$db   = "vidyaloka_sms";
$user = "root";
$pass = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
} catch (PDOException $e) {
    die("DB Error: " . $e->getMessage());
}

// Clear and re-seed with correct hashes
$pdo->exec("DELETE FROM users");

$users = [
    ["Dr. Anura Perera",     "admin@school.lk",       "admin123",      "Admin",      "AP", "Administration",  "+94 77 123 4567", "2019-01-15"],
    ["Mrs. Kumari Silva",    "principal@school.lk",   "principal123",  "Principal",  "KS", "Leadership",      "+94 71 234 5678", "2018-03-10"],
    ["Mr. Roshan Fernando",  "teacher@school.lk",     "teacher123",    "Teacher",    "RF", "Mathematics",     "+94 76 345 6789", "2020-08-22"],
    ["Kasun Jayawardena",    "student@school.lk",     "student123",    "Student",    "KJ", "Grade 10 - A",    "+94 70 456 7890", "2022-01-05"],
    ["Mrs. Nilmini Bandara", "parent@school.lk",      "parent123",     "Parent",     "NB", "Parent of Kasun", "+94 75 567 8901", "2022-01-05"],
    ["Mr. Pradeep Guna",     "accountant@school.lk",  "acc123",        "Accountant", "PG", "Finance",         "+94 78 678 9012", "2021-06-01"],
];

$stmt = $pdo->prepare(
    "INSERT INTO users (name, email, password_hash, role, avatar, department, phone, joined)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
);

foreach ($users as $u) {
    $hash = password_hash($u[2], PASSWORD_BCRYPT);
    $stmt->execute([$u[0], $u[1], $hash, $u[3], $u[4], $u[5], $u[6], $u[7]]);
    echo "✓ Inserted: {$u[0]} ({$u[3]}) — password: <code>{$u[2]}</code><br>";
}

echo "<br><strong style='color:green'>✅ All demo users seeded successfully!</strong>";
echo "<br><br><strong style='color:red'>⚠ DELETE this file now: C:/xampp/htdocs/vidyaloka/generate_hashes.php</strong>";
?>
