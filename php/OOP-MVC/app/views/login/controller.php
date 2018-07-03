<?php
$type = $_GET['table'];

$page = new Page('login');

$page->pageTitle = 'Login';

$form = $page->content;
