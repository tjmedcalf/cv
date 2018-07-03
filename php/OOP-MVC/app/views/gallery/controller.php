<?php

$page = new Page($route->view, $_REQUEST);

$page->pageTitle = 'Gallery';
$page->metaDesc = '';
$page->classes['body'] = 'page--gallery';

$page->css = [
	[
		"type" => "ext",
		"src" => "/bower_components/strip/dist/css/strip.css"
	]
];

$page->scripts = [
	[
		"type" => "ext",
		"src" => "js/vendor/masonry.pkgd.min.js"
	],
	[
		"type" => "ext",
		"src" => "/js/vendor/imagesloaded.pkgd.min.js"
	],
	[
		"type" => "inline",
		"src" => "$(function() {
			var grid = $('.gridify').masonry({
				itemSelector: '.grid__item',
				columnWidth: '.grid__item:first-child',
				percentPosition: true
			});

			grid.imagesLoaded().progress(function() {
				grid.masonry('layout');
			});
		});"
	],
	[
		"type" => "ext",
		"src" => "/bower_components/strip/dist/js/strip.pkgd.min.js"
	]
];

$content = $page->content;

$images = scandir(IMG_DIR.DS."gallery");

/*
echo '<pre>';
print_r($images); die();
echo '</pre>';*/