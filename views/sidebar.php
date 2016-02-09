<div id="sidebar_menu">
    <div class="sidebar_menu_body">
        <div class="sidebar_menu_button logo" onclick="document.location = 'http://<?=$_SERVER['SERVER_NAME']?>'"><!--Fiteat--></div>
        <div class="sidebar_menu_button"><a href="recipes.html">Рецепты</a></div>
        <div class="sidebar_menu_button"><a href="/diary/">Дневник питания</a></div>
        <div class="sidebar_menu_button"><a>Мой стол</a></div>

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

        <?php else : ?>
        <div class="sidebar_menu_button logged_in"><a>Настройки</a></div>
        <div class="sidebar_menu_button logged_in" onclick="logIn('out')"><a>Выйти</a></div>
        <?php endif ?>
        <p class="sidebar_menu_close" onclick="sidebarMenu('hide')">✖</p>
    </div>
    <div class="sidebar_page_background" onclick="sidebarMenu('hide')"></div>
</div>