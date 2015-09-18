<?php
/**
 * Created by PhpStorm.
 * User: Александр
 * Date: 17.09.2015
 * Time: 18:39
 */

require_once '../../php/config.php';

if (array_key_exists('code',$_GET)) {

    $url = 'https://oauth.vk.com/access_token?' . urldecode(http_build_query([
            'client_id' => Config::VK_APP_ID,
            'client_secret' => Config::VK_SECRET_CODE,
            'redirect_uri' => Config::VK_REDIRECT,
            'code' => $_GET['code']
        ]));

    $data = file_get_contents($url);
    $data = json_decode($data,true);
    //var_dump($data);
    echo '<br><br>' . PHP_EOL;
    if (array_key_exists('access_token',$data)) {
        $email = $data['email'];
        $url = 'https://api.vk.com/method/users.get?' . urldecode(http_build_query([
                'user_id' => $data['user_id'],
                'fields' => 'photo_100',
                'access_token' => $data['access_token']
            ]));

        $userVK = json_decode(file_get_contents($url),true);
        if (array_key_exists('response',$userVK)) {
            ?>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>FitEat auth from VK</title>
            </head>
            <body>
                <p><img src="<?=$userVK['response'][0]['photo_100']?>">Hello, <?=$userVK['response'][0]['first_name'] . " " .  $userVK['response'][0]['last_name']?>.</p>
                <p>Your Email "<?=$email?>" registered at FitEat. Thanks.</p>
            </body>
            </html>
<?php
        }
        exit;
        //var_dump($userVK);
    }
    header('Location: http://' . $_SERVER['SERVER_NAME']);
}