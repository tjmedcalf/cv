<?php 
session_start();
//Constants
define('DIR_BASE',     dirname( __FILE__ ).'/');
require_once(DIR_BASE.'/app/classes/_Constants.php');


require_once(DIR_BASE.'/app/classes/Database.php');
require_once(DIR_BASE.'/app/classes/User.php');
require_once(DIR_BASE.'/app/classes/Page.php');
require_once(DIR_BASE.'/app/classes/Route.php');
require_once(DIR_BASE.'/app/classes/Admin.php');
require_once(DIR_BASE.'/app/classes/Form.php');
require_once(DIR_BASE.'/app/classes/Log.php');

date_default_timezone_set('Pacific/Auckland');

//Start View
$route = new Route();

//Inlcude the controller which instantiates it's own version of page..
include($route->controller);
?>

<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>
            <?php //echo $notification ? '('.checkStories().') ': ''; ?>
            <?php echo $page->pageTitle; ?>
        </title>
        <meta name="description" content="<?php echo $page->metaDesc; ?>">
        <meta name="viewport" content="width=device-width">

        <link href='https://fonts.googleapis.com/css?family=Merriweather:400,300,400italic,700,900' rel='stylesheet' type='text/css'>
        <link href='https://fonts.googleapis.com/css?family=Open+Sans:300,300italic,400,600,400italic,700,800' rel='stylesheet' type='text/css'>
        <link href='https://fonts.googleapis.com/css?family=Open+Sans+Condensed:700' rel='stylesheet' type='text/css'>

        <link rel="stylesheet" href="/css/style.css">

        <?php if(isset($page->css) && !empty($page->css)): ?>
            
            <?php foreach($page->css as $key => $style): ?>
                <?php switch( $style['type'] ):
                case 'ext': ?>
                        <link href="<?php echo $style['src']; ?>" rel="stylesheet" />
                <?php break; 
                case 'inline': ?>
                    <style>
                        <?php echo $style['src']; ?>
                    </style>
                <?php break;?>
                <?php endswitch; ?>
               
            <?php endforeach; ?>
        <?php endif; ?>

    </head>

    <body>
        <?php if($route->message != '') : ?>
            <div class="message">
                <p><i class="icon-info-circle"></i> <?php echo $route->message; ?></p>
            </div>
        <?php endif; ?>
        
        <div class="page <?php echo $page->classes['body']; ?>">
			<?php include(TMPL_DIR.'/_partials/header.php'); ?>
            
            <?php include($page->tmpl); ?>

            <?php include(TMPL_DIR.'/_partials/footer.php'); ?>
        </div>

        <div class="modal">
            <div class="modal__inner">
                <div class="modal__content">
                    <div class="modal__controls">
                        <button class="btn--control">
                            <i class="icon-close"></i>
                        </button>
                        <nav class="modal__pagenav">
                            <ul>
                                <li class="btn--control">
                                    <i class="icon-chevron-up"></i>
                                </li>
                                <li class="btn--control">
                                    <i class="icon-chevron-down"></i>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <p>...</p>
                </div>
                
                <div>
                    <img src="/img/portrait.png" alt="">        
                </div>
            </div>
        </div>
        
		<script src="/js/vendor/jquery.js"></script>
        <script src="/js/vendor/jquery-ui.js"></script>
        <script src="/js/vendor/selectboxit.js"></script>
        <script src="/js/vendor/regula-1.3.4.min.js"></script>
        <!-- <script src="/js/vendor/jquery.selectBoxIt.min.js"></script> -->

        <script src="/js/main.js"></script>
        
        
        <?php if(isset($page->scripts) && !empty($page->scripts)): ?>
            <?php foreach($page->scripts as $key => $script): ?>
                <?php switch( $script['type'] ): 
                case 'ext': ?>
                        <script src="<?php echo $script['src']; ?>"></script> 
                <?php break; 
                case 'inline': ?>
                    <script>
                        <?php echo $script['src']; ?>
                    </script>
                <?php break;?>
                <?php endswitch; ?>
               
            <?php endforeach; ?>
        <?php endif; ?>

        <script src="/js/form.js"></script>

        <!-- <script>
            /*(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

            ga('create', 'UA-53885115-1', 'auto');
            ga('send', 'pageview');*/
        </script> -->
    </body>
</html>








