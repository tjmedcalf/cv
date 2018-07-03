<?php 
//New page for localised variables...
$page = new Page('home');

$page->pageTitle = 'Home';
$page->metaDesc = '';

$page->scripts = [
	[
		"type" => "ext",
		"src" => "js/cycle.js"
	],
	[
		"type" => "ext",
		"src" => "/js/media_grid.js"
	],
	[
		"type" => "ext",
		"src" => "/js/modal.js"
	]
];

$page->classes['body'] = 'page--home';


//Set Date Vars. <--- These need to be local variables only for the view to see...
//$entries = $page->content;

$shows = $page->content['shows'];
$heros = $page->content['heros'];