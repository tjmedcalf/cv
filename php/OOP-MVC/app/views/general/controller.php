<?php 
//New page for localised variables...
$page = new Page('general', $_REQUEST);

$page->pageTitle = $page->content['title'];
$page->metaDesc = '';

$page->scripts = '';

$page->classes['body'] = 'page--general';


//Set Date Vars. <--- These need to be local variables only for the view to see...
//$entries = $page->content;

$content = $page->content;

//print_r($content); die();

$showContactForm = $page->content['show_form'] > 0 ? true: false;