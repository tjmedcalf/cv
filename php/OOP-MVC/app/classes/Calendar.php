<?php
/*
 * Calendar Class 
 * Get and set all --DATA-- for calendar...
 *
 */
class Calendar extends Page {
    var $message;
    
    function __construct($months) {
        parent::__construct('calendar');
        $this->content = $this->get($months);
    }

    function getLink($id) {
        $query = 'SELECT id FROM stories WHERE memoryID = "'.$id.'"';

        if($result = $this->select($query, 'id')) {
            return 'index.php?view=story&id='.$result;
        }else {
            return false;
        }
    }

    function get($months = array()) {
        $all = array();

        foreach($months as $month) {
            $date = explode(',', $month);

            $query = 'SELECT * 
                      FROM memories 
                      WHERE MONTH(date) = '.$date[0].' AND YEAR(date) = '.$date[1].' 
                      ORDER BY date ASC';

            //These results are just one month...
            $results = $this->select($query);

            if(!is_array($results)) {
                $this->message = $month.' had no results..';
            } else {
                $monthObj = new stdClass();

                $monthObj->label = date('M',mktime(0,0,0,$date[0],1,$date[1]));
                $monthObj->entries = array();

                foreach($results as $raw) {

                    $entry = new stdClass();

                    $entry->id = $raw['id'];
                    $entry->memory = $raw['memory'];

                    $entry->date = array(
                        'weekday' => date('D', strtotime($raw['date'])),
                        'day' => date('j', strtotime($raw['date'])),
                        'suffix' => date('S', strtotime($raw['date'])),
                    );

                    $entry->img = $this->getImg($raw['date']);
                    $entry->link = $this->getLink($raw['id']);

                    $entry->classes = $raw['author'];
                    $entry->classes .= ' day-'.strtotime($raw['date']);
                    $entry->classes .= (!$entry->img) ? ' noImg' : ' hasImg';

                    array_push($monthObj->entries, $entry);
                }

                array_push($all, $monthObj);
            }
        }

        return $all;
    }
}