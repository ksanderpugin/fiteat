<?php

/**
 * Created by PhpStorm.
 * User: Alexander
 * Date: 24.09.2015
 * Time: 18:59
 */
class User
{

    public static function getInst() {
        if (!self::$inst) self::$inst = new self();
        return self::$inst;
    }

    public function requestAuth($mail,$pass) {
        $sql = SQL::getInst();
        $data = $sql->query("SELECT * FROM users WHERE mail = ':mail'",[
            ["name"=>":mail","val"=>$mail,"type"=>SQL::PARAM_STR]
        ]);
        if ($data === false) return ["state"=>false,"error"=>"System Error!","errno"=>666];
        if (empty($data)) return ["state"=>false,"error"=>"Mail not found","errno"=>101];
        if($data[0]["pass"] == $pass) {
            $cookie_str = $data[0]["id"] . "_" . $data[0]["key"];
            $cookie_code = $this->codeString($cookie_str);
            setcookie("uk",$cookie_code,time()+24*360000,"/");
            return [
                "state" => true,
                "id" => $data[0]["id"],
                "name" => $data[0]["name"],
            ];
        }
        return ["state"=>false,"error"=>"Invalid password","errno"=>102];
    }

    public function isAuthorized(){
        return $this->auth;
    }

    public function getUserInfo() {
        return $this->user_info;
    }

    protected $auth;
    protected $user_info;

    // private functions and variables =================================================================================
    private static $inst;
    private function __construct() {
        $this->auth = false;
        $this->user_info = false;
        if (array_key_exists('uk',$_COOKIE)) {
            $uk = $this->decodeString($_COOKIE['uk']);
            $uk_arr = explode("_",$uk);
            $sql = SQL::getInst();
            $data = $sql->query("SELECT * FROM users WHERE id = :id",[
                ["name" => ":id", "val" => $uk_arr[0], "type" => SQL::PARAM_INT]
            ]);
            if ($data !== false && !empty($data)) {
                if ($data[0]["key"] == $uk_arr[1]) {
                    $this->auth = true;
                    $this->user_info = [
                        "id" => $data[0]["id"],
                        "name" => $data[0]["name"],
                        "mail" => $data[0]["c_mail"] ? $data[0]["mail"] : false,
                        "phone" => $data[0]["phone"],
                        "subs" => $data[0]["subs"]
                    ];
                }
            }
        }
    }
    private function codeString($str) {
        $num_arr_code = [
            "0" => ['A','V','W','r','s',':'],
            "2" => ['B','U','X','q','t','1'],
            "4" => ['C','T','Y','p','u','2'],
            "6" => ['D','S','Z','o','v','3'],
            "8" => ['E','R','a','n','w','4'],
            "1" => ['F','Q','b','m','x','5'],
            "3" => ['G','P','c','l','y','6'],
            "5" => ['H','O','d','k','z','7'],
            "7" => ['I','N','e','j','.','8'],
            "9" => ['J','M','f','i',',','0'],
            "_" => ['K','L','g','h',';','9']
        ];
        $result_string = "";
        for ($i=0; $i<strlen($str); $i++) {
            $result_string .= $num_arr_code[$str[$i]][mt_rand(0,5)];
        }
        return $result_string;
    }
    private function decodeString($str) {
        $result = strtr($str,[
            'A' => '0','V' => '0','W' => '0','r' => '0','s' => '0',':' => '0',
            'B' => '2','U' => '2','X' => '2','q' => '2','t' => '2','1' => '2',
            'C' => '4','T' => '4','Y' => '4','p' => '4','u' => '4','2' => '4',
            'D' => '6','S' => '6','Z' => '6','o' => '6','v' => '6','3' => '6',
            'E' => '8','R' => '8','a' => '8','n' => '8','w' => '8','4' => '8',
            'F' => '1','Q' => '1','b' => '1','m' => '1','x' => '1','5' => '1',
            'G' => '3','P' => '3','c' => '3','l' => '3','y' => '3','6' => '3',
            'H' => '5','O' => '5','d' => '5','k' => '5','z' => '5','7' => '5',
            'I' => '7','N' => '7','e' => '7','j' => '7','.' => '7','8' => '7',
            'J' => '9','M' => '9','f' => '9','i' => '9',',' => '9','0' => '9',
            'K' => '_','L' => '_','g' => '_','h' => '_',';' => '_','9' => '_'
        ]);
        return $result;
    }
    private function __clone() {}
}