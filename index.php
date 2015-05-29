<?php 
	$v = '1';
	
	include( 'less-setup.php' );
?>
<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<title>PEKA-TV</title>
	
	<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	
	<!-- Favicon -->
	
	<!-- Old IE icon 32x32 -->
	<!--[if IE]><link rel="shortcut icon" href="favicon.ico"><![endif]-->
	
	<!-- Touch Icons - iOS and Android 2.1+ 180x180 pixels in size. -->
	<link rel="apple-touch-icon" href="/favicon-180x180.png">
	
	<!-- Firefox, Chrome, Safari, IE 11+ and Opera. 192x192 pixels in size. -->
	<link rel="icon" href="/favicon-192x192.png">
	
	<!-- END Favicon -->
	
	<!-- Fonts -->
	<link href='http://fonts.googleapis.com/css?family=Press+Start+2P|Inconsolata|Oswald:400,700,300|PT+Sans:400,400italic,700&subset=latin,cyrillic' rel='stylesheet' type='text/css'>

	<!-- CSS -->
	<link rel="stylesheet" href="/css/style.css?v=<?php echo $v; ?>">
</head>
<body>

	<!-- Menu Widget-->
	<ul id="menu">
		<li title="Games">
			<a href="/#games" class="btn-page" data-name="games">
				<i class="fa fa-gamepad"></i>
			</a>
		</li>
		<li data-type="page" class="btn-page" data-name="following" title="Following">
			<a href="/#following">
				<i class="fa fa-heart"></i>
			</a>
		</li>
		<li data-type="page" class="btn-page" data-name="multi" title="Multi Twitch">
			<a href="/#multi" class="btn-multi">
				<i class="fa fa-th-large"></i>
			</a>
		</li>
		<li title="Refresh">
			<i class="btn-refresh fa fa-refresh"></i>
		</li>
	</ul>
	<!-- END Menu -->

	<!-- Pages -->
	<div id="pages">

		<!-- Games -->
		<div id="page-games" class="page">
			<h3 class="g-title">
				Games<span class="total"></span>
			</h3>

			<div class="g-page-settings">

				<div id="sort-games" class="block sort">
					<span class="title">Sort by:</span>
					<ul>
						<li class="number" data-name="viewers" data-type="MaxMin">VIEWERS <i></i></li>
						<li class="alphabet" data-name="name" data-type="MaxMin">NAME <i></i></li>
					</ul>
				</div>

				<div class="search block">
					<input id="games-search" type="text" placeholder="Search">
				</div>

			</div>

			<ul class="list"></ul>
		</div>
		<!-- END Games -->

		<!-- Streams -->
		<div id="page-streams" class="page">
			<h3 class="g-title">
				<span class="game-name"></span><span class="total"></span>
			</h3>

			<div class="g-page-settings">

				<div id="sort-streams" class="block separator sort">
					<span class="title">Sort by:</span>
					<ul>
						<li class="number" data-name="viewers" data-type="MaxMin">VIEWERS <i></i></li>
						<li class="alphabet" data-name="streamer" data-type="MaxMin">STREAMER NAME <i></i></li>
					</ul>
				</div>

				<div id="filter-streams" class="block filter">
					<span class="title">Filter by:</span>
					<ul>
						<li data-filter="fps">30+ FPS</li>
						<li>
							<select data-filter="language">
								<option value="all">Language ALL</option>
								<option value="en">Language EN</option>
								<option value="ru">Language RU</option>
								<option value="de">Language DE</option>
								<option value="es">Language ES</option>
								<option value="lv">Language LV</option>
								<option value="lt">Language LT</option>
								<option value="ee">Language EE</option>
							</select>
						</li>
					</ul>
				</div>

				<div class="search block">
					<input id="streams-search" type="text" placeholder="Search">
				</div>

			</div>

			<ul class="list"></ul>
		</div>
		<!-- END Streams -->

		<!-- Channel -->
		<div id="page-channel" class="page"></div>
		<!-- END Channel -->

		<!-- Following -->
		<div id="page-following" class="page">
			<h3 class="g-title">
				Following <span class="total">0</span>
			</h3>

			<ul class="list"></ul>
		</div>
		<!-- END Following -->

		<!-- Multitwitch -->
		<div id="page-multi" class="page">
			<div class="header">
				<div class="title">Multi Twitch</div>

				<div class="separator"></div>

				<div class="btn">
					<i class="btn-save fa fa-floppy-o" title="Save"></i>
				</div>
				<div class="btn">
					<i class="btn-edit fa fa-cog" title="Edit"></i>
				</div>

				<div class="separator"></div>

				<div class="add-wrapper">
					<input type="text" placeholder="Add channel..">
					<i class="btn-add fa fa-plus" title="Add"></i>
				</div>

				<div class="chat-select">
					<span>Chat:</span>
					<select>
						<option>Off</option>
						<option>sc2tv.ru</option>
						<option>goodgame.ru</option>
					</select>
				</div>
			</div>

			<div class="wrapper">
				<div class="chat">
					<ul></ul>
				</div>
				<div class="video">
					<ul></ul>
				</div>
			</div>
		</div>
		<!-- END Multitwitch -->

		<!-- Loading Widget-->
		<div id="loading">
			<div class="wrapper">
				<div class="text"></div>
				<div class="progress"><div></div></div>
				<div class="prc"></div>
			</div>
		</div>
		<!-- END Loading Widget-->

	</div>
	<!-- END Pages -->



	<!-- App -->
	<script>
		var app = {};
	</script>

	<!-- Libs -->
	<script src="/js/helpers/grapnel.min.js"></script>
	<script src="/js/helpers/jquery.min.js"></script>
	<script src="/js/helpers/jquery.transit.min.js"></script>
	<script src="/js/helpers/psdev.lazyload.js"></script>

	<!-- Core -->
	<script src="/js/helpers/helpers.js?v=<?php echo $v; ?>"></script>
	<script src="/js/helpers/provider.js?v=<?php echo $v; ?>"></script>
	<script src="/js/helpers/page.js?v=<?php echo $v; ?>"></script>

	<!-- Views -->
	<script src="/js/view/games.view.js?v=<?php echo $v; ?>"></script>
	<script src="/js/view/streams.view.js?v=<?php echo $v; ?>"></script>
	<script src="/js/view/channel.view.js?v=<?php echo $v; ?>"></script>
	<script src="/js/view/multi.view.js?v=<?php echo $v; ?>"></script>

	<!-- Widgets -->
	<script src="/js/widgets/menu.widget.js?v=<?php echo $v; ?>"></script>
	<script src="/js/widgets/loading.widget.js?v=<?php echo $v; ?>"></script>

	<!-- Pages -->
	<script src="/js/page/games.page.js?v=<?php echo $v; ?>"></script>
	<script src="/js/page/streams.page.js?v=<?php echo $v; ?>"></script>
	<script src="/js/page/channel.page.js?v=<?php echo $v; ?>"></script>
	<script src="/js/page/following.page.js?v=<?php echo $v; ?>"></script>
	<script src="/js/page/multi.page.js?v=<?php echo $v; ?>"></script>

	<!-- App -->
	<script src="/js/app.js?v=<?php echo $v; ?>"></script>
	
</body>
</html>