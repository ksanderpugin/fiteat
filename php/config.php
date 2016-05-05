<?php

class Config {
	/*
	const SQL_SERVER_HOST = 'localhost';
	const SQL_SERVER_USER_NAME = 'root';
	const SQL_SERVER_USER_PASS = 'PavPat2010';
	const SQL_SERVER_BD_NAME = 'fiteat'; //*/
	//*
    const SQL_SERVER_HOST = 'zoostyle.mysql.ukraine.com.ua';
    const SQL_SERVER_USER_NAME = 'zoostyle_fe';
    const SQL_SERVER_USER_PASS = '6kz7f4hx';
    const SQL_SERVER_BD_NAME = 'zoostyle_fe'; //*/

    const FB_APP_ID = '515962271900994';
    const FB_SECURE_CODE = '0c726bc40c1393e39b14de3b4743b73c';
    const FB_REDIRECT = 'http://fiteat.info/login/fb';

    const VK_APP_ID = '5073549';
    const VK_SECRET_CODE = 'aVk3AZyQUZcGUCLdfZz3';
    const VK_REDIRECT = 'http://fiteat.info/login/vk';

    public static function getFbUrl() {
        return 'https://www.facebook.com/dialog/oauth?' .
        urldecode(http_build_query([
            'client_id' => self::FB_APP_ID,
            'redirect_uri' => self::FB_REDIRECT,
            'response_type' => 'code',
            'scope' => 'email'
        ]));
    }

    public static function getVkUrl() {
        return 'https://oauth.vk.com/authorize?' .
        urldecode(http_build_query([
            'client_id' => self::VK_APP_ID,
            'redirect_uri' => self::VK_REDIRECT,
            'display' => 'page',
            'response_type' => 'code',
            'scope' => 'email'
        ]));
    }
} 