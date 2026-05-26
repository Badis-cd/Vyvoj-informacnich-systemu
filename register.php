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

$hesloHash = password_hash($heslo, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare("INSERT INTO uzivatele (jmeno, heslo) VALUES (?, ?)");
    $stmt->execute([$jmeno, $hesloHash]);
    
    echo json_encode(["status" => "success", "message" => "Registrace úspěšná! Nyní se přihlas."]);

} catch (\PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(["status" => "error", "message" => "Toto jméno už je zabrané."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Chyba databáze: " . $e->getMessage()]);
    }
}
?>