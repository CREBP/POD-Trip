<?php
/**
* This script acts as a simple backend proxy for the Trip Database REST API
* It is used to bypass the CORS restrictions for the Angular frontend used by the search engine interface
*/

if (!isset($_GET['criteria'])) die('No criteria specified');

$url = "https://www.tripdatabase.com/search/json?criteria=" . urlencode($_GET['criteria']);

if (isset($_GET['page'])) $url .= '&skip=' . (($_GET['page']-1) * 30);

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_HEADER, 0);
curl_setopt($curl, CURLOPT_RETURNTRANSFER , 1);

echo curl_exec($curl);
?>
