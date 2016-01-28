<div class="header">
    <div class="header_container">
        <a class="header_mobile_menu" onclick="sidebarMenu('show')"></a>
        <div class="header_button header_left_button logo" onclick="document.location = 'http://<?=$_SERVER['SERVER_NAME']?>'"><!--Fiteat--></div>
        <div class="header_button header_left_button"><a href="recipes.html">Рецепты</a></div>
        <div class="header_button header_left_button"><a href="diary.html">Дневник питания</a></div>
        <div class="header_button header_left_button"><a href="#">Мой стол</a></div>
        <div class="header_button header_right_button header_menu_login">
            <?php if($user === false) : ?>
            <div class="not_logged_in header_menu_name">Вход</div>
            <div class="header_menu_user_settings">
                <form class="not_logged_in login_form" name="loginform" method="post" action="/account/login.php">

                    <p>Email</p>
						<span>
							<input id="username" type="text" placeholder="example@mail.com" name="mail">
						</span>

                    <p>Пароль</p>
						<span>
							<input id="password" type="password" placeholder="password" name="pass">
						</span>

                    <div id="registration_form">
                        <a id="registration_button" href="/account/registration.php">Регистрация</a><a id="forgot_password_button" href="#">Забыли пароль?</a>
                    </div>

                    <div id="login_form_buttons">
                        <div>
                            <a id="login_button_container" onclick="logIn('in')">Войти</a>
                            <a class="login_form_soc_button" id="fb" href="<?=$fb_url?>">
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                     width="415px" height="415px" viewBox="0 0 415 415" enable-background="new 0 0 415 415" xml:space="preserve" style="fill:rgb(68,98,153);"><!--#446299-->
                                    <path d="M149.472,164.49h26.12v-11.85v-11.608v-1.936c0-11.174,0.29-28.441,8.415-39.131c8.562-11.32,20.316-19.009,40.534-19.009
							c32.939,0,46.823,4.69,46.823,4.69l-6.53,38.696c0,0-10.882-3.145-21.041-3.145c-10.157,0-19.252,3.628-19.252,13.786v4.112v13.544
							v11.85h41.646l-2.902,37.776h-38.744v131.276h-48.949V202.267h-26.12V164.49z"/>
									</svg>
                            </a>
                            <a class="login_form_soc_button" href="<?=$vk_url?>" id="vk">
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                     width="415px" height="414.996px" viewBox="0 0 415 414.996" enable-background="new 0 0 415 414.996" xml:space="preserve" style="fill:rgb(82,119,152);"><!--#527798-->
                                    <path d="M316.801,307.104c-0.558,0-1.102,0-1.66,0c-17.838-2.978-29.993-15.776-40.373-27.618
							c-5.84-6.699-14.832-21.846-25.54-20.1c-15.205,2.49-7.647,28.877-14.003,40.188c-5.125,9.133-26.957,7.485-42.013,5.854
							c-47.521-5.124-71.805-30.895-93.093-58.598c-22.758-29.607-40.474-60.588-56.852-94.604c-5.305-11.01-12.355-23.192-12.355-36.837
							c7.703-6.372,20.272-4.182,32.957-4.182c10.753,0,27.547-2.405,35.419,1.676c4.682,2.405,9.406,15.247,13.187,23.437
							c8.676,18.798,16.656,32.327,27.188,47.717c4.561,6.672,11.567,19.255,19.771,17.581c7.967-1.617,8.718-21.561,9.062-34.317
							c0.399-14.487-0.016-32.498-4.116-40.187c-3.873-7.258-10.959-7.402-18.126-11.726c5.964-12.183,22.312-13.4,42.021-13.4
							c16.556,0,39.677-1.861,46.133,9.22c6.573,11.282,2.063,31.626,1.647,46.873c-0.457,17.137-3.378,34.833,8.248,42.706
							c8.934-0.986,13.743-9.835,18.939-16.75c11.367-15.133,18.396-28.232,27.187-47.717c3.608-8.004,7.474-21.775,14.003-24.281
							c9.95-3.823,25.812-0.831,40.373-0.831c11.939,0,33.242-3.35,37.079,5.026c3.181,6.944-6.184,24.482-9.061,29.292
							c-11.039,18.384-21.863,30.094-33.773,46.044c-4.769,6.385-14.603,16.593-14.017,26.801c0.444,7.744,8.104,13.687,14.017,19.257
							c12.785,12.067,21.76,20.859,32.126,34.316c3.895,5.07,12.341,16.048,11.525,22.607C380.195,315.007,332.778,302.18,316.801,307.104
							z"/>
									</svg>
                            </a>
                            <a class="login_form_soc_button" id="tw">
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                     width="415px" height="414.996px" viewBox="0 0 415 414.996" enable-background="new 0 0 415 414.996" xml:space="preserve" style="fill:rgb(78,174,233);"><!--#4eaee9-->
                                    <path d="M345.358,127.048c-9.754,4.326-20.237,7.249-31.239,8.564c11.229-6.731,19.854-17.39,23.915-30.092
							c-10.511,6.233-22.15,10.76-34.541,13.199c-9.921-10.571-24.058-17.176-39.701-17.176c-30.039,0-54.393,24.353-54.393,54.391
							c0,4.263,0.48,8.414,1.408,12.396c-45.205-2.269-85.283-23.923-112.11-56.831c-4.683,8.033-7.364,17.376-7.364,27.345
							c0,18.871,9.602,35.52,24.197,45.273c-8.917-0.283-17.304-2.729-24.637-6.803c-0.005,0.227-0.005,0.454-0.005,0.684
							c0,26.354,18.749,48.335,43.632,53.335c-4.564,1.242-9.369,1.908-14.33,1.908c-3.505,0-6.912-0.342-10.234-0.977
							c6.922,21.608,27.01,37.334,50.811,37.771c-18.614,14.59-42.068,23.287-67.552,23.287c-4.39,0-8.72-0.259-12.975-0.762
							c24.071,15.433,52.662,24.438,83.378,24.438c100.047,0,154.757-82.881,154.757-154.758c0-2.358-0.053-4.704-0.157-7.037
							C328.846,147.534,338.066,137.955,345.358,127.048z"/>
									</svg>
                            </a>
                        </div>
                    </div>
                </form>
            </div>
            <?php else : ?>
                <div class="logged_in header_menu_name" onclick=""><?=$user?></div>
                <div class="header_menu_user_settings">
                    <div class="logged_in" onclick="document.location = '/account/'">Кабинет</div>
                    <div class="logged_in" onclick="logIn('out')">Выйти</div>
                </div>
            <?php endif ?>
        </div>

        <div class="header_button header_right_button header_menu_search">
            <img src="/images/searchicon.png" alt="Search Icon">
            <form>
                <input type="text" placeholder="Поиск по сайту..." name="search">
            </form>
        </div>
        <div class="header_button header_right_button"><a href="#">О проекте</a></div>
    </div>
</div>
