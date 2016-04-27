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
            $cookie_str = $data[0]["id"] . "_" . $data[0]["ukey"];
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

    public function registration($data) {
        $key = rand(1,9)*100000000 +
            rand(0,9)*10000000 +
            rand(0,9)*1000000 +
            rand(0,9)*100000 +
            rand(0,9)*10000 +
            rand(0,9)*1000 +
            rand(0,9)*100 +
            rand(0,9)*10 +
            rand(0,9);
//        echo $key;
        $sql = SQL::getInst();
        if (!$sql->execute(
            "INSERT INTO users (mail,pass,name,soname,ukey) VALUE (':mail',':pass',':name',':soname',:ukey)",
            [
                ["name" => ":mail", "val" => $data[0], "type" => SQL::PARAM_STR],
                ["name" => ":pass", "val" => $data[1], "type" => SQL::PARAM_STR],
                ["name" => ":name", "val" => $data[2], "type" => SQL::PARAM_STR],
                ["name" => ":soname", "val" => $data[3], "type" => SQL::PARAM_STR],
                ["name" => ":ukey", "val" => $key, "type" => SQL::PARAM_INT]
            ]
        )) {
            return false;
        }
        $id = $sql->getInsertID();
        $cookie = $id . "_" . $key;
        $cookie_code = $this->codeString($cookie);
        setcookie("uk",$cookie_code,time()+24*360000,"/");
        return true;
    }

    public function isAuthorized(){
        return $this->auth;
    }

    public function getUserInfo() {
        return $this->user_info;
    }

    public function updateUserSettings($new_settings) {
        $sql_data = [];
        $params = [];

        if ($this->user_info["name"] != $new_settings["name"]) {
            $sql_data[] = "name=':name'";
            $params[] = [
                "name" => ":name",
                "val" => $new_settings["name"],
                "type" => SQL::PARAM_STR
            ];
        }

        if ($this->user_info["soname"] != $new_settings["surname"]) {
            $sql_data[] = "soname=':soname'";
            $params[] = [
                "name" => ":soname",
                "val" => $new_settings["surname"],
                "type" => SQL::PARAM_STR
            ];
        }

        if ($this->user_info["sex"] != $new_settings["gender"]) {
            $sql_data[] = "sex=:sex";
            $params[] = [
                "name" => ":sex",
                "val" => $new_settings["gender"],
                "type" => SQL::PARAM_INT
            ];
        }


        if ($new_settings["month"] < 10) $new_settings["month"] = "0".$new_settings["month"];
        if ($new_settings["day"] < 10) $new_settings["day"] = "0".$new_settings["day"];
        $birthday = $new_settings["year"]."-".$new_settings["month"]."-".$new_settings["day"];
        if ($birthday != $this->user_info["birthday"]) {
            $sql_data[] = "birthday=':birthday'";
            $params[] = [
                "name" => ":birthday",
                "val" => $birthday,
                "type" => SQL::PARAM_STR
            ];
        }

        if ($this->user_info["growth"] != $new_settings["height"]) {
            $sql_data[] = "growth=:growth";
            $params[] = [
                "name" => ":growth",
                "val" => $new_settings["height"],
                "type" => SQL::PARAM_INT
            ];
        }

        if ($this->user_info["weight"] != $new_settings["weight"]) {
            $sql_data[] = "weight=:weight";
            $params[] = [
                "name" => ":weight",
                "val" => $new_settings["weight"],
                "type" => SQL::PARAM_INT
            ];
        }

        if ($this->user_info["lifestyle"] != $new_settings["lifestyle"]) {
            $sql_data[] = "lifestyle=:lifestyle";
            $params[] = [
                "name" => ":lifestyle",
                "val" => $new_settings["lifestyle"],
                "type" => SQL::PARAM_INT
            ];
        }

        if ($this->user_info["norm_k"] != $new_settings["calories"]) {
            $sql_data[] = "norm_k=:calories";
            $params[] = [
                "name" => ":calories",
                "val" => $new_settings["calories"],
                "type" => SQL::PARAM_INT
            ];
        }

        if ($this->user_info["norm_b"] != $new_settings["proteins"]) {
            $sql_data[] = "norm_b=:proteins";
            $params[] = [
                "name" => ":proteins",
                "val" => $new_settings["proteins"],
                "type" => SQL::PARAM_INT
            ];
        }

        if ($this->user_info["norm_z"] != $new_settings["fats"]) {
            $sql_data[] = "norm_z=:fats";
            $params[] = [
                "name" => ":fats",
                "val" => $new_settings["fats"],
                "type" => SQL::PARAM_INT
            ];
        }

        if ($this->user_info["norm_u"] != $new_settings["carbohydrates"]) {
            $sql_data[] = "norm_u=:carbohydrates";
            $params[] = [
                "name" => ":carbohydrates",
                "val" => $new_settings["carbohydrates"],
                "type" => SQL::PARAM_INT
            ];
        }

        $ac = array_key_exists("calculate_calories",$new_settings) ? 10 : 0;
        $ab = array_key_exists("calculate_balance",$new_settings) ? 1 : 0;
        if ($this->user_info["norm_auto"] != ($ac+$ab) ) {
            $sql_data[] = "norm_auto=:norm_auto";
            $params[] = [
                "name" => ":norm_auto",
                "val" => $ac+$ab,
                "type" => SQL::PARAM_INT
            ];
        }

        if (!empty($sql_data)) {
            $query = "UPDATE users SET ";
            foreach ($sql_data as $str) {
                $query .= $str.",";
            }
            $query = substr($query,0,strlen($query)-1);
            $query .= " WHERE id = " . $this->user_info["id"];
            $sql = SQL::getInst();
            return $sql->execute($query,$params);
        }

        return true;
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
                if ($data[0]["ukey"] == $uk_arr[1]) {
                    $this->auth = true;
                    $this->user_info = [
                        "id" => $data[0]["id"],
                        "name" => $data[0]["name"],
                        "soname" => $data[0]["soname"],
                        "mail" => $data[0]["c_mail"] ? $data[0]["mail"] : false,
                        //"subs" => $data[0]["subs"],
                        "sex" => $data[0]["sex"],
                        "birthday" => $data[0]["birthday"],
                        "growth" => $data[0]["growth"],
                        "weight" => $data[0]["weight"],
                        "lifestyle" => $data[0]["lifestyle"],
                        "norm_k" => $data[0]["norm_k"],
                        "norm_b" => $data[0]["norm_b"],
                        "norm_z" => $data[0]["norm_z"],
                        "norm_u" => $data[0]["norm_u"],
                        "norm_auto" => $data[0]["norm_auto"],
                    	"favorite_list" => $data[0]["favorite_list"],
                    	"black_list" => $data[0]["black_list"]
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

    const SEX_MALE = 0;
    const SEX_FEMALE = 1;

    const LIFESTYLE_MINIMUM = 0;
    const LIFESTYLE_UNHINDERED_TRAINING = 1;
    const LIFESTYLE_TRAINING = 2;
    const LIFESTYLE_INTENSIVE_TRAINING = 3;
    const LIFESTYLE_EVERYDAY_TRAINING = 4;
    const LIFESTYLE_EVERYDAY_INTENSIVE_TRAINING = 5;
    const LIFESTYLE_HEAVY_PHYSICAL_WORK = 6;

    public static function getLifestyleString($lf_const) {

        switch ($lf_const) {

            case self::LIFESTYLE_MINIMUM:
                return "Минимальные нагрузки (сидячая работа)";

            case self::LIFESTYLE_UNHINDERED_TRAINING:
                return "Необременительные тренировки 2-3 раза в неделю";

            case self::LIFESTYLE_TRAINING:
                return "Тренировки 4-5 раз в неделю (или работа средней тяжести)";

            case self::LIFESTYLE_INTENSIVE_TRAINING:
                return "Интенсивные тренировки 4-5 раз в неделю";

            case self::LIFESTYLE_EVERYDAY_TRAINING:
                return "Ежедневные тренировки";

            case self::LIFESTYLE_EVERYDAY_INTENSIVE_TRAINING:
                return "Ежедневные интенсивные тренировки или тренировки 2 раза в день";

            case self::LIFESTYLE_HEAVY_PHYSICAL_WORK:
                return "Тяжелая физическая работа или интенсивные тренировки 2 раза в день";

        }

        return false;
    }

    public static function getNormCoefficient($lifestyle) {

        return 1.2 + $lifestyle*0.7/6;

    }
}