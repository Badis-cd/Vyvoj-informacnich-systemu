<?php

header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);


if (!isset($data['jmeno']) || !isset($data['vysledek']) || !isset($data['prvni_slovo']) || !isset($data['pocet_pokusu'])) {
    exit(json_encode(["status" => "error", "message" => "Chybí data ze hry."]));
}

$jmeno = $data['jmeno'];
$vysledek = $data['vysledek'];
$prvni_slovo = $data['prvni_slovo'];
$pocet_pokusu = (int)$data['pocet_pokusu'];


$body = 0;
if ($vysledek === 'vyhra') {
    $body = 7 - $pocet_pokusu;
}

try {

    $stmt = $pdo->prepare("SELECT id FROM uzivatele WHERE jmeno = ?");
    $stmt->execute([$jmeno]);
    $uzivatel = $stmt->fetch();

    if (!$uzivatel) {
        exit(json_encode(["status" => "error", "message" => "Uživatel neexistuje."]));
    }
    
    $uzivatel_id = $uzivatel['id'];

    $stmt_hist = $pdo->prepare("INSERT INTO historie_her (uzivatel_id, prvni_slovo, pocet_pokusu, vysledek, body) VALUES (?, ?, ?, ?, ?)");
    $stmt_hist->execute([$uzivatel_id, $prvni_slovo, $pocet_pokusu, $vysledek, $body]);

    if ($vysledek === 'vyhra') {
        $stmt_upd = $pdo->prepare("UPDATE uzivatele SET odehrane_hry = odehrane_hry + 1, vyhry = vyhry + 1, celkove_body = celkove_body + ? WHERE id = ?");
    } else {
        $stmt_upd = $pdo->prepare("UPDATE uzivatele SET odehrane_hry = odehrane_hry + 1, prohry = prohry + 1, celkove_body = celkove_body + ? WHERE id = ?");
    }
    $stmt_upd->execute([$body, $uzivatel_id]);

    $stmt_stats = $pdo->prepare("SELECT odehrane_hry, vyhry, prohry, celkove_body FROM uzivatele WHERE id = ?");
    $stmt_stats->execute([$uzivatel_id]);
    $noveStatistiky = $stmt_stats->fetch();

    echo json_encode(["status" => "success", "stats" => $noveStatistiky]);

} catch (\PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Chyba databáze: " . $e->getMessage()]);
}
?>