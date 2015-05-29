<?php

define( URL_CSS, 'css/style.css' );
define( URL_LESS_LIB, 'lessc.lib.php' );

include( URL_LESS_LIB ); 

$lessCompiller = new lessc;

$array = array(
	'css/prefixer.less',
	'css/fonts.less',
	'css/reset.less',
	
	'css/variables.less',
	'css/classes.less',
	'css/keyframes.less',
	
	'css/ui.less',
	'css/main.less',
	'css/responsive.less',
);

$less = '';
foreach ($array as $file) {
	$less .= file_get_contents( $file );
}

$css = '/* This file has been made with LESS compiler */' . "\r\n";
$css .= $lessCompiller->compile( $less );

file_put_contents( URL_CSS, $css );