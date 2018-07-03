<?php 
class Database {
    private $con = '';
    var $sqlError;
    
    function __construct() {
        //if(strpos($_SERVER['HTTP_HOST'], '.com') !== false) {
            //Live
            $host = 'test_host';
            $username = 'test_user';
            $password = 'test_password';
            $dbname = 'test_dbName';
        //} else {
            //Local
        //}

        //$this->con = mysqli_connect($host,$username,$password,$dbname);
        $this->con= new mysqli($host,$username,$password,$dbname);

        // Check connection
        if (mysqli_connect_errno()) {
          echo "Failed to connect to MySQL: " . mysqli_connect_error();
          die();
        }
    }

    function select($query, $single = false) {
        $results = mysqli_query($this->con, $query);
        
        if($results->num_rows > 0) {
            if(!$single) {
                $data = array();
                
                while($row = $results->fetch_assoc()) {
                    array_push($data, $row);
                }
            }else {
                $data = $results->fetch_object()->$single;
            }
        } else {
            return false;
        }
        
        return $data;
    }
    
    function insert($table, $values) {
        $query = 'INSERT INTO '.$table.' (';
        foreach($values as $row => $data) {
            $query .= $row.',';
        }
        $query = rtrim($query, ',');
        
        $query .= ') VALUES (';
        foreach($values as $row => $data) {
            //REPLACE QUOTES
            if( strpos($data, '"') ) {
                //die();
                $newData = str_replace('"', '\"', $data);
                $query .= '"'.$newData.'",';
            } else {
                $query .= '"'.$data.'",';
            }
        }

        $query = rtrim($query, ',');
        $query .= ')';

        //echo $query; die();
        
        $success = mysqli_query($this->con, $query);
        
        if(!$success ) {
            $this->sqlError = $this->con->error;
            return false;
        }
        
        return true;
    }
    
    function delete($table, $id) {
        $query = 'DELETE FROM '.$table.' WHERE id = "'.$id.'"';
        
        mysqli_query($this->con, $query);
        
        if (mysqli_affected_rows($this->con) > 0) {
            return true;
        } else {
            $this->sqlError = $this->con->error;
            return false;
        }
    }

    function cleanRequest($request) {
        

        return $cleaned;
    }
}