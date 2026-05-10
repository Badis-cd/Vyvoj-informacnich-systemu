<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['jmeno']) || !isset($data['heslo'])) {
    echo json_encode(["status" => "error", "message" => "Chybí jméno nebo heslo."]);
    exit;
}

$jmeno = trim($data['jmeno']);
$heslo = $data['heslo'];

try {
    $stmt = $pdo->prepare("SELECT * FROM uzivatele WHERE jmeno = ?");
    $stmt->execute([$jmeno]);
    $uzivatel = $stmt->fetch();

    if ($uzivatel && password_verify($heslo, $uzivatel['heslo'])) {
        echo json_encode([
            "status" => "success", 
            "message" => "Přihlášení úspěšné.",
            "user" => [
                "jmeno" => $uzivatel['jmeno'],
                "odehrane_hry" => $uzivatel['odehrane_hry'],
                "vyhry" => $uzivatel['vyhry'],
                "prohry" => $uzivatel['prohry']
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Špatné jméno nebo heslo."]);
    }
} catch (\PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Chyba databáze."]);
}
?>