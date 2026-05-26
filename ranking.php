<?php

header('Content-Type: application/json');
require 'db.php';

try {
    $sql = "
        SELECT 
            u.jmeno,
            u.celkove_body,
            u.odehrane_hry,
            u.vyhry,
            (SELECT prvni_slovo FROM historie_her h WHERE h.uzivatel_id = u.id GROUP BY prvni_slovo ORDER BY COUNT(*) DESC LIMIT 1) AS oblibene_slovo,
            (SELECT AVG(pocet_pokusu) FROM historie_her h WHERE h.uzivatel_id = u.id AND h.vysledek = 'vyhra') AS prumer_pokusu
        FROM uzivatele u
        ORDER BY u.celkove_body DESC, u.vyhry DESC
    ";
    
    $stmt = $pdo->query($sql);
    $ranking = $stmt->fetchAll();

    echo json_encode(["status" => "success", "data" => $ranking]);

} catch (\PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Chyba DB: " . $e->getMessage()]);
}
?>