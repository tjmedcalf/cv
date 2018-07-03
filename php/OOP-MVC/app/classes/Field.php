<?php

class Field extends Form {
    var $label;
    var $input;
    
    function __construct($type, $params) {
        $this->label = $params['label'];
        
        switch($type) {
            case 'date':
                $this->buildDate($params);
                break;
            case 'textarea':
                $this->buildTextArea($params);
                break;
            case 'select':
                $this->buildSelect($params);
                break;
            case 'hidden':
                $this->buildHidden($params);
                break;
            case 'password':
                $this->buildPassword($params);
                break;
            default:
                $this->buildText($params);
        }
    }
    
    function buildDate($params) {
        $this->input = '<input type="text" id="'.$params['name'].'" name="'.$params['name'].'" value="'.date('Y-m-d').'" />';
    }
    function buildTextArea($params) {
        $this->input = '<textarea id="'.$params['name'].'" name="'.$params['name'].'" cols="33" rows=""></textarea>';
    }
    function buildSelect($params) {
        $this->input = '<select name="'.$params['name'].'">';
        foreach($params['options'] as $value => $option ) {
            $this->input .= '<option value="'.$value.'">'.$option.'</option>';
        }
        $this->input .= '</select>';
    }
    
    function buildText($params) {
        $this->input = '<input type="text" id="'.$params['name'].'" name="'.$params['name'].'" value="'.$params['value'].'" />';
    }
    function buildPassword($params) {
        $this->input = '<input type="password" name="'.$params['name'].'" value="" />';
    }
    
    function buildHidden($params) {
        $this->input = '<input type="hidden" name="'.$params['name'].'" value="'.$params['value'].'" />';
    }
    
}