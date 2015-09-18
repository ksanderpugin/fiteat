<?php

class Recipe
{
    public function getList($n) {
        $sql = SQL::getInst();
        $data = $sql->query("SELECT id, name, b, z, u, k, img FROM recipes LIMIT $n");
        return $data;
    }
}