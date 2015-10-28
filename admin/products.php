<?php

include "../php/config.php";
include "../php/sql.php";
$sql = SQL::getInst();

$comm = array_key_exists("action",$_REQUEST) ? $_REQUEST["action"] : "show";
$comm();

function show() {
    global $sql;
    $groups = $sql->query("SELECT id, name FROM products WHERE parent = 0");
    include "views/products_v.php";
}

function add_group() {
    global $sql;
    if (strlen($_POST["group"]) > 5) $sql->execute("INSERT INTO products (name,k,b,z,u,sv) VALUE (':name',0,0,0,0,0)",[
        [
            "name" => ":name",
            "val" => $_POST["group"],
            "type" => SQL::PARAM_STR
        ]
    ]);
    show();
}

function show_group() {
    global $sql;
    $data = $sql->query("SELECT name FROM products WHERE id = :id", [["name"=>":id","val"=>$_GET["gid"],"type"=>SQL::PARAM_INT]]);
    $parent_name = $data[0]["name"];
    $parent = $_GET["gid"];
    $products = $sql->query("SELECT name, k, b, z, u FROM products WHERE parent = :parent ORDER BY name",[["name"=>":parent","val"=>$parent,"type"=>SQL::PARAM_INT]]);
    include "views/products_in_group.php";
}

function add_product() {
    global $sql;
    if (
        $_POST["parent"] != "" &&
        $_POST["name"] != "" &&
        $_POST["kkal"] != "" &&
        $_POST["bel"] != "" &&
        $_POST["zhir"] != "" &&
        $_POST["ugl"] != "" &&
        $_POST["sv"] != ""
    ) {
        $sql->execute("INSERT INTO products (name,parent,k,b,z,u,sv) VALUE (':name',:parent,:k,:b,:z,:u,:sv)",
            [
                ["name"=>":name", "val"=>$_POST["name"], "type"=>SQL::PARAM_STR],
                ["name"=>":parent", "val"=>$_POST["parent"], "type"=>SQL::PARAM_INT],
                ["name"=>":k", "val"=>$_POST["kkal"], "type"=>SQL::PARAM_INT],
                ["name"=>":b", "val"=>$_POST["bel"], "type"=>SQL::PARAM_FLOAT],
                ["name"=>":z", "val"=>$_POST["zhir"], "type"=>SQL::PARAM_FLOAT],
                ["name"=>":u", "val"=>$_POST["ugl"], "type"=>SQL::PARAM_FLOAT],
                ["name"=>":sv", "val"=>$_POST["sv"], "type"=>SQL::PARAM_INT]
            ]);
    }
    show_group();
}