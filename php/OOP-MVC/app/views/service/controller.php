<?php
//New page for localised variables...
//$params = array($_GET['id']);
$page = new Page('service', $_REQUEST);

//Set Local Vars. <--- These need to be local variables only for the view to see...

//$user = new User;
//$form = $page->content;
//$story = $form;

$page->pageTitle = 'Service';
$page->metaDesc = '';
$page->classes['body'] = 'page--service';
$page->css = [
	[
		"type" => "ext",
		"src" => "/bower_components/strip/dist/css/strip.css"
	]
];
$page->scripts = [
	[
		"type" => "ext",
		"src" => "js/tooltip.js"
	],
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
			var grid = $('.gallery').masonry({
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


$hero = $page->content['heros'];
$content = $page->content['service'];
$outfits = $page->content['outfits'];
$extras = $page->content['extras'];
$locations = $page->getExpenses();

$video_link = $content['video'];
$rating = $content['rating'];

function formatPrice($expense) {
	if($expense['costMin'] == $expense['costMax']) {
		return "~$".$expense['costMax'];
	} else {
		return "$".$expense['costMin'].'- $'.$expense['costMax'];
	}
}