<?php
/**
 * Created by PhpStorm.
 * User: Александр
 * Date: 16.09.2015
 * Time: 15:49
 */

include '../../php/config.php';
if (array_key_exists('code',$_GET)) {
    $params = [
        'client_id'     => Config::FB_APP_ID,
        'redirect_uri'  => Config::FB_REDIRECT,
        'client_secret' => Config::FB_SECURE_CODE,
        'code'          => $_GET['code']
    ];
    $url = 'https://graph.facebook.com/oauth/access_token';

    $tokenInfo = null;
    parse_str(file_get_contents($url . '?' . http_build_query($params)), $tokenInfo);

    if (count($tokenInfo) > 0 && array_key_exists('access_token',$tokenInfo)) {
        $params = array('access_token' => $tokenInfo['access_token']);
        $userInfo = json_decode(file_get_contents('https://graph.facebook.com/me' . '?' . urldecode(http_build_query($params))), true);
        if (array_key_exists('id',$userInfo)) {
            var_dump($userInfo);
        }
    }
}




/*$code = array_key_exists('code',$_GET) ? $_GET['code'] : die;

$url = "https://graph.facebook.com/oauth/access_token?client_id=" . Config::FB_APP_ID .
    "&redirect_uri=http://fiteat.info/login/fb&client_secret=" . Config::FB_SECURE_CODE .
    "&code=$code";

$data = file_get_contents($url);

$rows = explode("&",$data);
$data = [];
foreach($rows as $row) {
    $t = explode("=",$row);
    $data[$t[0]] = $t[1];
}

if (array_key_exists('access_token',$data)) {
    $url = "https://graph.facebook.com/v2.4/me?access_token=" . $data['access_token'];
    $data = file_get_contents($url);
    $fb_data = json_decode($data,true);
    echo "data:" . PHP_EOL;
    print_r($fb_data);
}

//*/