<?php
/*
 * Form Class
 * Handles -FORMS-
 *
 */
class Form extends Database {
    var $formName;
    var $fields = [];
    var $message;
    var $subject;
    var $required;
    
    function __construct($formName, $fields = array()) {
        parent::__construct();

        $this->formName = $formName;

        switch($formName) {
            case 'bookingform':
                $this->fields = [
                    "name" => $fields['Name'],
                    "email" => $fields['Email'],
                    "phone" => $fields['Phone'],
                    "date" => $fields['Date'],
                    "location" => $fields['Location'],
                    "type" => $fields['Type'],
                    "details" => $fields["Details"],
                    "extras" => [
                        "+10" => $fields['Extras-+10']
                    ]
                ];

                $this->required = ["name","email"];
                $this->subject = "New booking request from claramidnight.com";

                break;
            case 'contactform':
                $this->fields = [
                    "name" => $fields['Name'],
                    "email" => $fields['Email'],
                    "message" => $fields['Message'],
                ];

                $this->required = [];
                $this->subject = "New enquiry from **";

                break;
        }
    }

    
    function getServiceOptions() {
        $query = 'SELECT title, id FROM show_types';
        $results = $this->select($query);

        return $results;
    }
    function getLocations() {
        $query = 'SELECT location FROM travel_expenses';
        $results = $this->select($query);

        return $results;
    }

    protected function getAdminEmail() {
        $query = 'SELECT email FROM user WHERE is_admin = 1';
        $results = $this->select($query);

        
        return $results[0]['email'];
    }

    protected function saveMsg($msg) {
        $values = [
            "body" => json_encode($msg),
            "sender" => $msg['email'],
        ];

        //print_r($values);
        //die();

        if( $this->insert('submissions', $values) ) {
            return true;
        } else {
            echo $this->sqlError; die();
            //return false;
        }    
    }

    function send() {
        $to = $this->getAdminEmail();
        $subject = $this->subject;

        //HTML Email headers..
        $headers = "From: noreply@**.com" . "\r\n"; 
        $headers .= "Reply-to: ". $this->fields["email"] . "\r\n";
        $headers .= 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
        

        //Validation
        if( !$this->isEmpty($this->fields) ) {
            return false;
        }


        //Compose Email
        $message = "<p>This form submission was received on ".date('j F, Y', time())."</p>";
        
        foreach($this->fields as $key=>$field) {
            //$message .= "<br/>";
            
            if(is_array($field)) {
                $message .= "<strong>".$key."</strong>:";
                $message .= "<ul>";
                
                foreach($field as $label=>$option) {
                    $message .= "<li>".$label.": ".$option."</li>";
                }

                $message .= "</ul>";
            } else {
                $message .= "<p><strong>".$key."</strong>: ".$field."</p>";
            }
        }

        //Send & Save
        $this->saveMsg( $this->fields );

        if( mail( $to, $subject, $message, $headers, '-fwebmaster@example.com' ) ) {
            return true;
        } else {
            $this->message = "Failed to send.";
            return false;
        }
    }

    protected function isEmpty($fields) {
        $errors = [];

        if(!empty($fields)) {
            
            foreach($this->required as $fieldName) {
                if( trim($fields[$fieldName]) == TRUE ) {
                    array_push($errors, $fieldName);
                }
            }


            if(!empty($errors)) {
                $this->message = $errors;
                return false;
            } 
                
            return true;
        }
    }

    protected function checkEmail($email) {

    }
}





