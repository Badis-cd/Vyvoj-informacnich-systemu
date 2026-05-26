<?php
$host = 'sql6.webzdarma.cz';
$db   = 'wordleborecc1532';
$user = 'wordleborecc1532';
$pass = '%CM(68hwr_d_$55)N$i6';

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, $options);
} catch (\PDOException $e) {
    die(json_encode(["error" => "Chyba připojení k DB: " . $e->getMessage()]));
}
?>