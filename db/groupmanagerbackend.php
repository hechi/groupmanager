<?php

/**
* ownCloud - Groupmanager App
*
* @author Andreas Hechenberger
* @copyright 2013 Andreas Hechenberger oc@hechenberger.me
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
* License as published by the Free Software Foundation; either
* version 3 of the License, or any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU AFFERO GENERAL PUBLIC LICENSE for more details.
*
* You should have received a copy of the GNU Affero General Public
* License along with this library.  If not, see <http://www.gnu.org/licenses/>.
*
*/

/**
 * Implements the GroupInterface to use it as Backend for OC
 * The Interface is found in core/lib/group/interface.php
 * Or shorter \OCP\GroupInterface
 *
 * must implements:
 *      implementsActions(...)
 *      inGroup(...)
 *      getUserGroups(...)
 *      getGroups(...)
 *      groupExists(...)
 *      usersInGroup(...)
 */
namespace OCA\Groupmanager\Db;

use \OCA\Groupmanager\DB\Group;
use \OCA\Groupmanager\DB\GroupMapper;

class GroupmanagerBackend implements \OCP\GroupInterface {

    //private $itemMapper = null;

    // contructor
	public function __construct(){
	   // $itemMapper = new ItemMapperOutside();
	   	$this->tableName = '*PREFIX*groupmanager_groups';
		$this->tableMember = '*PREFIX*groupmanager_members';
    }
    /**
    * @brief Check if backend implements actions
    * @param int $actions bitwise-or'ed actions
    * @return boolean
    *
    * Returns the supported actions as int to be
    * compared with OC_GROUP_BACKEND_CREATE_GROUP etc.
    */
    public function implementsActions($actions){
        //TODO check again
        return (bool)(OC_GROUP_BACKEND_GET_DISPLAYNAME & $actions);
    }

    /**
    * @brief is user in group?
    * @param string $uid uid of the user
    * @param string $gid gid of the group
    * @return bool
    *
    * Checks whether the user is member of a group or not.
    */
    public function inGroup($uid, $gid){
        /*
        //get all groups where the user is a member or admin
        $groups = $this->findByUserId($uid);
        //default: the user is not in list
        $ret = false;
        //check for all groups if it have the groupid and the user is a
        //member or admin of this group
        foreach($groups as $item){
            if(($item->getGroupid()==$gid) && ($item->isInGroup($uid))){
                //user is in the group
                $ret = true;
            }
        }
        //give back the result
        return $ret;
        */
        return true;
    }

    /**
    * @brief Get all groups a user belongs to
    * @param string $uid Name of the user
    * @return array with group names
    *
    * This function fetches all groups a user belongs to. It does not check
    * if the user exists at all.
    */
    public function getUserGroups($uid){
        /*
        //get all groups where the user is a member or admin
        $groups = $this->findByUserId($uid);
        //create an empty array
        $groupnames = array();
        //check the SystemSettings for the uniqueGroupId flag
        $withCreator=false;
        if($this->getUniqueGroupIdSetting()){
            $withCreator=true;
        }
        //fill the array with all names of the groups
        foreach($groups as $item){
            if($withCreator){
                //if the uniqueGroupId is set then concat to the groupname also the groupcreator
                array_push($groupnames,$item->getGroupname()." (".$item->getGroupcreator().") ");
            }else{
                //else give only the groupname back
                array_push($groupnames,$item->getGroupname());
            }
        }   
        //return the names
        return $groupnames;  
        */
        return array("hans","beter");
    }

    /**
    * @brief get a list of all groups
    * @param string $search
    * @param int $limit
    * @param int $offset
    * @return array with group names
    *
    * Returns a list with all groups
    */
    public function getGroups($search = '', $limit = -1, $offset = 0){
        /*
        //get all groups from the database
        $groups = $this->findAll();
        //create an empty array
        $groupnames = array();
        //check the SystemSettings for the uniqueGroupId flag
        $withCreator=false;
        if($this->getUniqueGroupIdSetting()){
            $withCreator=true;
        }
        //fill the array with all names of the groups
        foreach($groups as $item){
            if($withCreator){
                //if the uniqueGroupId is set then concat to the groupname also the groupcreator
                array_push($groupnames,$item->getGroupname()." (".$item->getGroupcreator().") ");
            }else{
                //else give only the groupname back
                array_push($groupnames,$item->getGroupname());
            }
        }  
        //return the names
        return $groupnames;  
        */
        return array();
    }

    /**
    * check if a group exists
    * @param string $gid
    * @return bool
    */
    public function groupExists($gid){
        return $this->groupnameExists($gid);  
    }

    /**
    * @brief get a list of all users in a group
    * @param string $gid
    * @param string $search
    * @param int $limit
    * @param int $offset
    * @return array with user ids
    */
    public function usersInGroup($gid, $search = '', $limit = -1, $offset = 0){
        /*
        $item = $this->findGroupByName($gid);
        $users = $item->getMember();
        foreach($item->getAdminArray() as $admin){
            if(!in_array($admin,$users)){
                array_push($users,$admin);
            }
        }      
        return $users; 
        */
        return array();   
    }
    
    
    /*** DB ***/
    
    private $tableName;
	private $tableMember; 
	private $tableAdmin;  
	
	/**
    * Used to abstract the owncloud database access away
    * @param string $sql the sql query with ? placeholder for params
    * @param int $limit the maximum number of rows
    * @param int $offset from which row we want to start
    * @return \OCP\DB a query object
    */
    public function prepareQuery($sql, $limit=null, $offset=null){
        return \OCP\DB::prepare($sql, $limit, $offset);
    }
	
	/**
    * Runs an sql query
    * @param string $sql the prepare string
    * @param array $params the params which should replace the ? in the sql query
    * @param int $limit the maximum number of rows
    * @param int $offset from which row we want to start
    * @return \PDOStatement the database query result
    */
    protected function execute($sql, array $params=array(), $limit=null, $offset=null){
        $query = $this->prepareQuery($sql, $limit, $offset);
        return $query->execute($params);
    }

	/**
	 * Finds all groups where the user is a member or admin of by user id
	 * @param string $userId: the id of the user 
	 * @return list of groups
	 */
	public function findByUserId($userId){
	    /*
	    //create sql querys to select all groupid's in admin and member table
	    $sqlGroupadmin = 'SELECT groupid FROM `'.$this->tableAdmin.'` 
	                        WHERE `admin` = ?';
	    $sqlGroupmember = 'SELECT groupid FROM `'.$this->tableMember.'` 
	                        WHERE `member` = ?';
	    
	    $userToSearch = array($userId);
	    
	    //fire sql query on database
	    $resultGroupadmin = $this->execute($sqlGroupadmin,$userToSearch);
	    $resultGroupmember = $this->execute($sqlGroupmember,$userToSearch);
	    
        //create an array with groupids
        //check for double values, because we dont want dublicated entries
	    $selectedGroupids=array();
	    
	    while($row = $resultGroupadmin->fetchRow()){
	        if(!in_array($row['groupid'],$selectedGroupids)){
	            array_push($selectedGroupids,$row['groupid']);
	        }
	    }
	    while($row = $resultGroupmember->fetchRow()){
	        if(!in_array($row['groupid'],$selectedGroupids)){
	            array_push($selectedGroupids,$row['groupid']);
	        }
	    }
	    
	    //create sql querys and fire in loop to database, to get all
	    //groups where the user is a member or an admin of
	    $sql = 'SELECT * FROM `'.$this->tableName.'` WHERE `groupid` = ?';
	    //an entityList for the groups
	    $entityList = array();
	    foreach($selectedGroupids as $groupid){
	        $params = array($groupid);
	        $result = $this->execute($sql,$params);
	        $entity = new Item($result->fetchRow());
	        array_push($entityList,$entity);
        }	
		return $entityList;
		*/
		return array();
	}
	
	public function groupnameExists($groupname){
	    /*
	    $sql = 'SELECT * FROM `' . $this->tableName . '` WHERE `groupname` = ?';
	    $params = array($groupname);
	    $result = $this->execute($sql, $params);
	    $row = $result->fetchRow();
	    if($row==null){
	        return false;
	    }else{
	        return true;
	    }
	    */
	    return true;
	}
	
	public function findGroupByName($groupname){
	    /*
	    $sql = 'SELECT * FROM `' . $this->tableName . '` WHERE `groupname` = ?';
	    $params = array($groupname);
	    $result = $this->execute($sql, $params);
	    $row = $result->fetchRow();
	    $groupid = $row['groupid'];
	    
	    */
	    return $this->findByGroupId($groupid);
	}

	/**
	 * Finds a group by group id
	 * @param string $groupid: the id of the group that we want to find
	 * @throws DoesNotExistException: if the group does not exist
	 * @return the groupitem
	 */
	public function findByGroupId($groupId){
	    /*
		$sql = 'SELECT * FROM `' . $this->tableName . '` WHERE `groupid` = ?';
		$sqlGroupadmin = 'SELECT admin FROM `'. $this->tableAdmin. '` WHERE `groupid` = ?';
		$sqlGroupmember = 'SELECT member FROM `'. $this->tableMember. '` WHERE `groupid` = ?';
		
		$params = array($groupId);

		$result = $this->execute($sql, $params);
		$resultGroupadmin = $this->execute($sqlGroupadmin,$params);
		$resultGroumember = $this->execute($sqlGroupmember,$params);
		
		$group = $result->fetchRow();
		
		$groupadmins = array();
		while($row = $resultGroupadmin->fetchRow()){
		    //echo $row['admin'];
			array_push($groupadmins, $row['admin']);
		}
		
		$groupmembers = array();
		while($row = $resultGroumember->fetchRow()){
		    //echo $row['member'];
			array_push($groupmembers, $row['member']);
		}
		$entity = new Item($group);
		$entity->setAdmin($groupadmins);
		$entity->setMember($groupmembers);

		return $entity;
		*/
		return array();
	}

	/**
	 * Finds all Items
	 * @return array containing all items
	 */
	public function findAll(){
	    /*
		$sql = 'SELECT * FROM `' . $this->tableName . '`';
		
		$params = array();

		$result = $this->execute($sql, $params);
		
		//$groups = array();
		$groupList = array();
		
		while($row = $result->fetchRow()){
		    //array_push($groups,$row['groupid']);		
		    $item = $this->findByGroupId($row['groupid']);
		    array_push($groupList,$item);
		}
		return $groupList;
		*/
		return array();
	}


	/**
	 * Saves an groupitem into the database
	 * @param Item $group: the groupitem to be saved
	 * @return the item with the filled in id
	 */
	public function save($item){
	/*
        //TODO more sql magic to but it in the right tables
		$sqlGroup = 'INSERT INTO `'. $this->tableName . '`(`groupname`, `description`)'.
				' VALUES(?, ?)';
		$sqlGroupadmins = 'INSERT INTO `'. $this->tableAdmin . '`(`groupid`, `admin`)'.
		        ' VALUES(?, ?)';
		$sqlGroupmembers = 'INSERT INTO `'. $this->tableMember . '`(`groupid`, `member`)'.
		        ' VALUES(?, ?)';       
		        
		$paramsGroup = array(
			$item->getGroupname(),
			$item->getDescription()
		);

		$this->execute($sqlGroup, $paramsGroup);
		$item->setGroupid($this->api->getInsertId($this->tableName));

		foreach( $item->getGroupadmin() as $admin){
	        //create parameter list
	        $paramsGroupadmin = array(
	            $item->getGroupid(),
	            $admin
	        );
	        // fire sql query to the database
	        $this->execute($sqlGroupadmins,$paramsGroupadmin);
	    }
	    foreach( $item->getMember() as $member){
	        //create parameter list
	        //echo ' members ->'.$member;
	        $paramsGroupmembers = array(
	            $item->getGroupid(),
	            $member
	        );
	        // fire sql query to the database
	        $this->execute($sqlGroupmembers,$paramsGroupmembers);
	    }
	    */
	}


	/**
	 * TODO if we modify a group
	 * Updates an item
	 * @param Item $item: the item to be updated
	 */
	public function update($item){
	/*
		$sqlGroup = 'UPDATE `'. $this->tableName . '` SET
				`groupname` = ?,
				`description` = ?
				WHERE `groupid` = ?';
				
		//TODO is this to dirty ?
		// 1.) delete all admins and members connected to the groupid
		// 2.) insert all admins and members
		$sqlGroupadmin = 'DELETE FROM `'.$this->tableAdmin.'` WHERE `groupid` = ?';
		$sqlGroupmember = 'DELETE FROM `'.$this->tableMember.'` WHERE `groupid` = ?';

		$paramsGroup = array(
			$item->getGroupname(),
			$item->getDescription(),
			$item->getGroupid()
		);
		
		$params = array($item->getGroupid());
        
        //update Groupinformation
		$this->execute($sqlGroup, $paramsGroup);
		// 1.) delete all admins and members
		$this->execute($sqlGroupadmin,$params);
		$this->execute($sqlGroupmember,$params);
		
		// 2.) insert all admins and members
		$sqlGroupadmins = 'INSERT INTO `'. $this->tableAdmin . '`(`groupid`, `admin`)'.
		        ' VALUES(?, ?)';
		$sqlGroupmembers = 'INSERT INTO `'. $this->tableMember . '`(`groupid`, `member`)'.
		        ' VALUES(?, ?)';
	    
	    foreach( $item->getGroupadmin() as $admin){
	        //create parameter list
	        $paramsGroupadmin = array(
	            $item->getGroupid(),
	            $admin
	        );
	        // fire sql query to the database
	        $this->execute($sqlGroupadmins,$paramsGroupadmin);
	    }
	    foreach( $item->getMember() as $member){
	        //create parameter list
	        //echo ' members ->'.$member;
	        $paramsGroupmembers = array(
	            $item->getGroupid(),
	            $member
	        );
	        // fire sql query to the database
	        $this->execute($sqlGroupmembers,$paramsGroupmembers);
	    }	
	    */
	}


	/**
	 * Deletes a group
	 * @param int $id: the id of the item
	 */
	public function deleteByGroupId($id){
	/*
		$sqlGroup = 'DELETE FROM `'.$this->tableName. '` WHERE `groupid` = ? ';
		$sqlGroupadmin = 'DELETE FROM `'.$this->tableAdmin. '` WHERE `groupid` = ? ';
		$sqlGroupmember = 'DELETE FROM `'.$this->tableMember. '` WHERE `groupid` = ? ';
	
	    $params = array($id);
	
	    $this->execute($sqlGroup,$params);
	    $this->execute($sqlGroupadmin,$params);
	    $this->execute($sqlGroupmember,$params);
	*/    
	}
	
	//TODO: make a better static Class for the settings
	
	/**
     * Get the value of the uniqueGroupId from the /config/config.php
     * @return bool: Returns True if The Value is Yes, otherwise False
     */
    private function getUniqueGroupIdSetting(){
        $value = $this->getSettingByName('groupmanagerUniqueGroupId');
        return $value;
    }
    
    /**
     * Get the value of the autocompletionBox from the /config/config.php
     * @return bool: Returns True if The Value is Yes, otherwise False
     */
    private function getAutocompletionSetting(){
        $value = $this->getSettingByName('groupmanagerAutocompletionBox');
        return $value;
    }
    
    /**
     * Get a value of the settingAttribute from the /config/config.php
     * @param $key: settingAttribute in the /config/config.php
     * @return string: Returns the string of the /config/config.php
     */
    private function getSettingByName($key){
        return \OCP\Config::getSystemValue($key, '');
    }
    
}
