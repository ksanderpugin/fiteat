<?php
/**
 * Created by PhpStorm.
 * User: Alexander
 * Date: 25.09.2015
 * Time: 17:20
 */

$arr_uri = explode("/",$_SERVER['REQUEST_URI']);
array_shift($arr_uri);
$type = $arr_uri[1] == "" ? array_key_exists("auth",$_POST) ? "mail" : "test" : $arr_uri[1];

require_once 'config.php';
require_once 'sql.php';
require_once 'user.php';

switch($type) {
    case "mail":
        $mail = array_key_exists("mail",$_POST) ? $_POST["mail"] : exit("No login");
        $pass = array_key_exists("pass",$_POST) ? $_POST["pass"] : exit("No pass");
        $user = User::getInst();
        $request = $user->requestAuth($mail,$pass);
        echo json_encode($request);
        exit;

    case "test":
        $user = User::getInst();
        if ($user->isAuthorized()) {
            $res = [
                "state" => true,
                "id" => $user->getUserInfo()["id"],
                "name" => $user->getUserInfo()["name"]
            ];
            echo json_encode($res);
        } else {
            echo json_encode(["state"=>false]);
        }
        exit;

    case "vk":
        //
        break;
}


function oAuthVK() {
    if (array_key_exists('code',$_GET)) {

        $url = 'https://oauth.vk.com/access_token?' . urldecode(http_build_query([
                'client_id' => Config::VK_APP_ID,
                'client_secret' => Config::VK_SECRET_CODE,
                'redirect_uri' => Config::VK_REDIRECT,
                'code' => $_GET['code']
            ]));

        $data = file_get_contents($url);
        $data = json_decode($data,true);
        if (array_key_exists('access_token',$data)) {
            $email = $data['email'];
            $url = 'https://api.vk.com/method/users.get?' . urldecode(http_build_query([
                    'user_id' => $data['user_id'],
                    'fields' => 'photo_100',
                    'access_token' => $data['access_token']
                ]));

            $userVK = json_decode(file_get_contents($url),true);
            if (array_key_exists('response',$userVK)) {
//                <p><img src="$userVK['response'][0]['photo_100']">Hello, $userVK['response'][0]['first_name'] . " " .  $userVK['response'][0]['last_name'].</p>
//                <p>Your Email "$email" registered at FitEat. Thanks.</p>
            }
        }
    }
}
