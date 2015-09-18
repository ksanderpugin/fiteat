<?php

class SQL {

    public static function getInst() {
        if (!self::$inst) self::$inst = new self();
        return self::$inst;
    }

    public function query($query_str, $params = []) {
        if ($this->mysql === false) return false;
        $query = $this->getQuerySTR($query_str, $params);
        $this->last_query = $query;
        $result = $this->mysql->query($query);
        if ($result === false) {
            $this->last_error = $this->mysql->error;
            return false;
        }
        $ret_res = [];
        while ($row = $result->fetch_assoc()) {
            $ret_res[] = $row;
        }
        return $ret_res;
    }

    public function execute($query_str, $params = []) {
        if ($this->mysql === false) return false;
        $query = $this->getQuerySTR($query_str, $params);
        $this->last_query = $query;
        if (!$this->mysql->real_query($query)) {
            $this->last_error = $this->mysql->error;
            return false;
        }
        return true;
    }

    public function getInsertID() {
        return $this->mysql->insert_id;
    }

    public function getLastQuery() {
        return $this->last_query;
    }

    public function getLastError() {return $this->last_error;}

    protected $mysql;
    protected $last_query;
    protected $last_error;

    protected function getQuerySTR ($query_str, $params = []) {
        foreach ($params as $param) {
            switch ($param['type']) {

                case $this::PARAM_INT:
                    $val = (int) $param['val'];
                    break;

                case $this::PARAM_FLOAT:
                    $val = (float) $param['val'];
                    break;

                case $this::PARAM_BOOL:
                    $val = $param['val'] ? 1 : 0;
                    break;

                default:
                    $val = str_replace("'","\\'",$param['val']);
                    break;
            }
            $query_str = str_replace($param['name'], $val, $query_str);
        }
        return $query_str;
    }

    private static $inst;
    private function __construct() {
        $this->mysql = new mysqli(Config::SQL_SERVER_HOST,Config::SQL_SERVER_USER_NAME,Config::SQL_SERVER_USER_PASS,Config::SQL_SERVER_BD_NAME);
        if (mysqli_connect_error()) {
            $this->last_error = mysqli_connect_error();
            $this->mysql = false;
        } else {
            $this->execute("set names utf8");
        }
    }
    private function __clone() {}

    const PARAM_INT = 0, PARAM_FLOAT = 1, PARAM_STR = 2, PARAM_BOOL = 3;
} 