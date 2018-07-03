<?php
/*
 * Page Class 
 * Get and set all --DATA-- for page...
 *
 */
class Page extends Database {
    var $pageTitle;
    var $metaDesc;
    var $scripts;
    var $css;
    var $content;
    var $tmpl;
    var $message;
    var $classes;
    var $redirect;
    var $request;

    function __construct($view, $request = array()) {
        parent::__construct();
        $user = new User;

        //$this->request = $this->cleanRequest($request);
        
        switch($view) {
            case 'login':
                $this->redirect = 'default';
                $form = new Form;
            
                if(!$user->loggedIn) {
                    $this->content = $form->buildLoginForm();
                } else {
                    $this->content = $form->buildLogoutForm();
                }
                break;
            case 'service':
                $page_id = $this->getPageId( $request['id'] );

                $this->content = [
                    'heros' => $this->getHeros( $page_id ),
                    'service' => $this->getServiceData( $request['id'] ),
                    'outfits' => $this->getOutfits( $request['id'] ),
                    'extras' => $this->getExtras( $request['id'] ),
                ];

                break;
            case 'gallery':
                
                $this->content = $this->getPage($request['id']);

                break;
            case 'general':
                
                $this->content = $this->getPage( $request['id'] );

                //print_r($this->content); die();

                break;
            case 'home':
                $view = 'default';

                $this->content = [
                    'heros' => $this->getHeros(1),
                    'shows' => $this->getShowTypes()
                ];

                break;
            default:
                
        }
        
        $this->tmpl = TMPL_DIR.$view.'/template.html';
    }

    //HELPERS
    function getExpenses() {
        $query = 'SELECT * FROM travel_expenses';
                  
        $results = $this->select($query);

        return $results;
    }

    //DATA METHODS
    protected function getExtras($show_id) {
        $query = 'SELECT e.title, e.price, e.description 
                  FROM extras as e
                  INNER JOIN show_extra_xref as x
                  ON e.id = x.extra_id
                  WHERE x.show_id = '.$show_id;

        $results = $this->select($query);

        return $results;
    }
    protected function getServiceData($id) {
        $query = 'SELECT * FROM show_types WHERE id = '.$id;

        $result = $this->select($query, 0);

        return $result[0];
    }

    protected function getShowTypes() {
        $query = 'SELECT * FROM show_types';

        $results = $this->select($query);

        return $results;
    }

    protected function getHeros($pageID) {
        $query = 'SELECT i.filename 
                  FROM hero_images as i
                  INNER JOIN hero_page_xref as x
                  ON i.id = x.hero_id
                  WHERE x.page_id = '.$pageID;

        $results = $this->select($query);

        return $results;
    }
    protected function getPageId($id) {
        $query = 'SELECT p.id 
                  FROM pages as p
                  INNER JOIN show_page_xref as x
                  ON p.id = x.page_id
                  WHERE x.show_id = '.$id;

        $results = $this->select($query, 0);

        if(count($results) > 0) {
            $page_id = $results[0]['id'];
        }

        return $page_id;
    }

    protected function getDefault() {
        $query = 'SELECT *
                  FROM pages 
                  ORDER BY id DESC';

        $results = $this->select($query);
        
        return $results;
    }

    protected function getPage($id) {
        $query = 'SELECT * FROM pages WHERE id = '.$id;

        $result = $this->select($query, 0);

        return $result[0];
    }
}