<?php
if (!isset($_GET['criteria'])) die('No criteria specified');

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, "https://www.tripdatabase.com/search/json?criteria=" . urlencode($_GET['criteria']));
curl_setopt($curl, CURLOPT_HEADER, 0);
curl_setopt($curl, CURLOPT_RETURNTRANSFER , 1);

echo curl_exec($curl);
?>
