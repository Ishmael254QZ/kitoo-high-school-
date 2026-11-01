<?php
/**
 * MongoDB Database Configuration
 */

class Database {
    private $client;
    private $db;
    
    public function __construct() {
        try {
            $mongodb_uri = getenv('MONGODB_URI') ?: 'mongodb://localhost:27017';
            $db_name = 'kitoo_sms';
            
            // Using MongoDB PHP Library (requires mongodb extension)
            $this->client = new MongoDB\Client($mongodb_uri);
            $this->db = $this->client->selectDatabase($db_name);
        } catch (Exception $e) {
            error_log('Database connection error: ' . $e->getMessage());
            throw new Exception('Database connection failed');
        }
    }
    
    public function getCollection($collectionName) {
        return $this->db->selectCollection($collectionName);
    }
    
    public function getDb() {
        return $this->db;
    }
}

// Return connection helper function
function getDbConnection() {
    static $db = null;
    if ($db === null) {
        $db = new Database();
    }
    return $db;
}
?>
