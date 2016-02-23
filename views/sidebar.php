<div id="sidebar_menu">
    <div class="sidebar_menu_body">
        <!--<div class="sidebar_menu_button logo"></div>//-->
        <?php if ($user) :
            $n_ = mb_substr(trim($user),0,1,"UTF-8");
            ?>
        <div class="sidebar_menu_account_info">
            <div class="sidebar_menu_account_logo"><span><?=$n_?></span></div>
            <div class="sidebar_menu_account_name"><?=$user?></div>
        </div>
        <div class="sidebar_menu_button"><a>Рецепты</a></div>
        <div class="sidebar_menu_button"><a>Мой стол</a></div>
        <div class="sidebar_menu_button"><a href="/diary/">Дневник питания</a></div>
        <div class="sidebar_menu_button sidebar_menu_up_line"><a href="/account/">Личный кабинет</a></div>
        <div class="sidebar_menu_button"><a href="/account/settings.php">Настройки</a></div>
        <div class="sidebar_menu_button"><a href="/account/settings.php">Выход</a></div>
        <?php endif ?>


        <?php if ($user === false) : ?>
                <span class="not_logged_in">
					<input type="text" placeholder="example@mail.com" name="name">
				</span>
				<span class="not_logged_in">
					<input type="password" placeholder="password" name="contacts">
				</span>

        <div class="sidebar_menu_button not_logged_in" onclick="logIn('in')"><a>Войти</a></div>


				<span class="not_logged_in" style="padding-left: 10px;">
					Войти с помощью:
				</span>

        <div class="sidebar_menu_form_soc_button not_logged_in">
            <a href="<?=$fb_url?>" class="sidebar_menu_form_soc_block">
                <span>Facebook</span>
                <div id="fb_side">&nbsp;</div>
            </a>
        </div>
        <div class="sidebar_menu_form_soc_button not_logged_in">
            <a href="<?=$vk_url?>" class="sidebar_menu_form_soc_block">
                <span style="margin-right:1px;">Вконтакте</span>
                <div id="vk_side">&nbsp;</div>
            </a>
        </div>
        <div class="sidebar_menu_form_soc_button not_logged_in">
            <a href="" class="sidebar_menu_form_soc_block">
                <span>Twitter</span>
                <div id="tw_side">&nbsp;</div>
            </a>
        </div>

        <?php endif ?>
        <!--<p class="sidebar_menu_close" onclick="sidebarMenu('hide')">✖</p>-->
    </div>
    <div class="sidebar_page_background" onclick="sidebarMenu('hide')"></div>
</div>