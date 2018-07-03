<?php
/*
 * Admin Class
 * Handles Form Processing mostly..
 *
 */
class Admin extends User {
    var $formData;
    var $message;
    
    function __construct($postData) {
        $this->formData = $postData;
        
        //Instantiate USER...
        //$username = isset($this->formData['username']) ? $this->formData['username']: '';
        //$password = isset($this->formData['password']) ? $this->formData['password']: '';
        
        //Try a Log in whenever you do admin stuff..
        //parent::__construct($username, $password);
        
        switch($postData['task']) {
            case 'send':
                $this->send();
                break;
        }
    }

    protected function send() {
        $form = new Form($this->formData['formName'], $this->formData);

        if(!$form->send()) {
            echo '<pre>';
            print_r($form->message);
            echo '</pre>';
        } else {
            $this->message = "Form send successfully. I will reply soon.";
        }

        
        //header('Location: '.'http://claramidnight.local/index.php?'.$this->formData['redirect']);
        //die();
    }
}
