<?php
setcookie("uk","",time() - 24*3600, "/");
header("Location: http://" . $_SERVER['SERVER_NAME']);