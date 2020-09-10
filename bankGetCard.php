<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

//啟動Session
session_start();
if (!isset($_SESSION['cards'])) {

    $cards = initCards();
    shuffle($cards);
    $total = 0;
    $totalB = 0;
    $log = '432';
    $ace = 0;
    $aceB = 0;
} else {
    $cards =  $_SESSION['cards'];
    $total = $_SESSION['total'];
    $totalB = $_SESSION['totalB'];
    $ace = $_SESSION['ace'];
    $aceB = $_SESSION['aceB'];
    $log = '123';
}

$card = '000';
$log = $log . '';

$content = trim(file_get_contents("php://input"));
$decoded = json_decode($content, true);
$method = $decoded['method'];
//dispatch a card to player
if ($method == 1) {

    $ace = $_SESSION['ace'];
    $card = array_pop($cards);
    if ($card['point'] == 1)
        $ace += 1;
    $total = calcTotal($total, calcPoint($card['point']), $ace);
    $_SESSION['cards'] = $cards; //設置Session變數
    $_SESSION['total'] = $total; //設置Session變數
    $_SESSION['ace'] = $ace;
}

//reset all
if ($method == 2) {
    $ace = 0;
    $aceB = 0;
    $cards = initCards();
    shuffle($cards);
    $card = [];
    $card[] = array_pop($cards);
    $aceB = $card[0]['point'] == 1 ? $aceB + 1  : $aceB;
    $card[] = array_pop($cards);
    $ace =  $card[1]['point'] == 1 ? $ace + 1 : $ace;
    $card[] = array_pop($cards);
    $aceB = $card[2]['point'] == 1 ? $aceB + 1 : $aceB;
    $card[] = array_pop($cards);
    $ace = $card[3]['point'] == 1 ? $ace + 1 : $ace;
    $total = calcTotalB(calcPoint($card[1]['point']), calcPoint($card[3]['point']), $ace);
    $totalB = calcTotalB(calcPoint($card[0]['point']), calcPoint($card[2]['point']), $aceB);

    $_SESSION['ace'] = $ace;
    $_SESSION['aceB'] = $aceB;
    $_SESSION['total'] = $total;
    $_SESSION['totalB'] = $totalB;
    $_SESSION['cards'] = $cards;
}

//dispatch to banker
if ($method == 3 && ($total > $totalB || $totalB <= 17)) {

    $aceB = $_SESSION['aceB'];
    $card = array_pop($cards);
    if ($card['point'] == 1)
        $aceB += 1;
    $totalB = calcTotalB($totalB, calcPoint($card['point']), $aceB);
    $_SESSION['cards'] = $cards; //設置Session變數
    $_SESSION['totalB'] = $totalB; //設置Session變數
    $_SESSION['aceB'] = $aceB;
}

$output = [
    'total' => $total,
    'totalB' => $totalB,
    'card' => $card,
    // 'log' => $log,
    // 'method' => $method,
    'ace' => $ace,
    'aceB' => $aceB
];
echo json_encode($output, JSON_UNESCAPED_UNICODE);




function createCard($suit, $point)
{
    return ['suit' => $suit, 'point' => $point];
}

function initCards()
{
    $cards = [];
    $suits = ['h', 'd', 's', 'c'];
    $points = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    // $points = [1, 12];
    for ($i = 0; $i < count($suits); $i++) {
        for ($j = 0; $j < count($points); $j++) {
            $cards[] = (createCard($suits[$i], $points[$j]));
        }
    }

    return $cards;
}

function calcPoint($point)
{
    if ($point == 1)
        return 11;
    else if ($point > 10)
        return 10;
    else
        return $point;
}

function calcTotal($p1, $p2, &$aceCnt)
{
    if ($p1 + $p2 >= 21 && $aceCnt >= 1) {
        $aceCnt -= 1;
        return $p1 + $p2 - 10;
    } else if ($p1 + $p2 > 21 && $aceCnt == 0) {
        return 100;
    } else
        return $p1 + $p2;
}
function calcTotalB($p1, $p2, &$aceCnt)
{
    if ($p1 + $p2 > 21 && $aceCnt >= 1) {
        $aceCnt -= 1;
        return $p1 + $p2 - 10;
    } else if ($p1 + $p2 > 21 && $aceCnt == 0) {
        return 100;
    } else
        return $p1 + $p2;
}
