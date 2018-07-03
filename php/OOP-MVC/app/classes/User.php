<?php 
class User extends Database {
    var $username;
    var $user_id;
    var $loggedIn = false;
    var $super = false;
    var $message;
    
    function __construct($username = '', $password = '') {
        parent::__construct();
        
        if($_SESSION['user_id']) {
            $this->loggedIn = true;
            if($_SESSION['user_id'] == 1) {
                $this->super = true;
            }
            $this->username = $this->getName($_SESSION['user_id']);
            $this->user_id = $_SESSION['user_id'];
        } else {
            //Attempt a login
            if($username != '') {
                if($password != '') {
                    $this->login($username, $password);
                } else {
                    $this->message = 'You forgot to enter a password.';
                }
            } else {
                $this->message = 'You forgot to enter a username.';
            }
        }
    }
    
    function login($username, $password) {
        if($_SESSION['user_id']) {
            $this->message = 'You are alreay logged in.';
        }

        $cleanName = filter_var($username, FILTER_SANITIZE_STRING);
        $cleanPass = filter_var($password, FILTER_SANITIZE_STRING);

        $query = 'SELECT * FROM users WHERE username = "'.$cleanName.'" AND password = "'.$cleanPass.'"';
        $result = $this->select($query);

        if(!$result) {
            $this->$message = 'Username doesn\'t exist or wrong password.';
        } else {
            $_SESSION['user_id'] = $result[0]['id'];
            $this->loggedIn = true;
            $this->message = 'Login Successful!';
        }
    }
    
    function logout() {
        if($_SESSION['user_id']) {
            unset($_SESSION['user_id']);
            
            $this->message = 'Log out Successful!';
        }
    }
    
    function getName($user_id) {
        $query = 'SELECT * FROM users WHERE id = "'.$user_id.'"';
        $result = $this->select($query);

        if($result) {
            return $result[0]['username'];
        }
    }
    
    
}
