<?php
/*
 * Route Class 
 * Set up --FILES-- need for this Route
 *
 */

class Route {
    var $controller;
    var $view = 'default';
    var $message;

    function __construct() {
        if(isset($_REQUEST['task'])) {
            //Do some admin..
            $admin = new Admin($_REQUEST);
            
            $this->message = $admin->message;
            
            if(isset($_REQUEST['view'])) {
                
                //LOAD NEW VIEW AND DISPLAY MESSAGE...
                $this->view = $_REQUEST['view'];
            }
        }
        
        if(isset($_GET['view'])) {
            $this->view = $_GET['view'];
        }
        
        $path = TMPL_DIR.$this->view.'/controller.php';
        
        //404
        $this->checkView($path);
        
        $this->controller = TMPL_DIR.$this->view.'/controller.php';
    }
    
    function checkView($path) {
        if(!file_exists($path)) {
            $this->view = 'error';
            return false;
        }
    }
}