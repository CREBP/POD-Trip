<?php
/**
* This script acts as a simple backend proxy for the Trip Database REST API
* It is used to bypass the CORS restrictions for the Angular frontend used by the search engine interface
*/

if (!isset($_GET['criteria'])) die('No criteria specified');

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, "https://www.tripdatabase.com/search/json?criteria=" . curl_escape($curl, $_GET['criteria']));
curl_setopt($curl, CURLOPT_HEADER, 0);
curl_setopt($curl, CURLOPT_RETURNTRANSFER , 1);

echo curl_exec($curl);
?>
