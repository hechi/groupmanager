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
* 
* Represents a group of users in the Groupmanager app
*
*/

namespace OCA\Groupmanager\Db;

class Group {

    //Attribute
	private $groupid;
	private $groupname;
	private $listOfMembers;
	private $listOfAdmins;
	private $description;
	private $creator;

    /**
     * contructor that initialized the attributes if there is no parameter take 
     * default options
     */
	public function __construct($fromRow=null){
		$this->groupid = 0;
		$this->groupname = "empty";
		$this->listOfMembers = array();
		$this->listOfAdmins = array();
		$this->description = "no description";
		$this->creator = "";

		if($fromRow){
			$this->fromRow($fromRow);
		}
	}

    /**
     * extract all information from the parameter and transfer it to the 
     * attributes
     * @param row is an associative array
     */
	public function fromRow($row){
        //if there is an parameter with the name groupid
        //it happens if we want to create a new group
        if(isset($row['groupid'])){
	        $this->groupid = $row['groupid'];
        }
        //check if groupname is set
        if(isset($row['groupname'])){
		    $this->groupname = $row['groupname'];
		}
	    //check if there is a parameter with the description
	    //if not write "no description" into the attribute
	    if(isset($row['description'])){
    		$this->description = $row['description'];
		}else{
		    $this->description = "no description";
		}
		//check if there is a parameter with the creator
		if(isset($row['groupcreator'])){
		    $this->creator = $row['groupcreator'];
		}
	}
	
/*************** GETTER ***************/

    /**
     * returns the groupid of this group
     * @return int
     */
	public function getGroupid(){
		return intval($this->groupid);
	}

    /**
     * returns the group name of this group
     * @return string
     */
	public function getGroupname(){
		return $this->groupname;
	}

    /**
     * returns the creator of this group
     * @return string
     */
	public function getCreator(){
	    return $this->creator;
	}
	
	/**
     * returns an array with members
     * @return array of strings
     */
	public function getMemberList(){
		return $this->listOfMembers;
	}
	
	/**
	 * transfer the member list to a string of members separate with comma
	 * @return string
	 */	
	public function getMemberListAsStr(){
	    $memberStr = '';
        foreach($this->getMemberList() as $mem){
            $memberStr = $memberStr.$mem.',';
        }
        return $memberStr;
	}

    /**
     * returns an array with members which have admin privileges
     * @return array of strings
     */
	public function getAdminList(){
		return $this->listOfAdmins;
	}
	
	/**
	 * transfer the admin list to a string of admins separate with comma
	 * @return string
	 */
	public function getAdminListAsStr(){
	    $admStr = '';
        foreach($this->getAdminList() as $adm){
            $admStr = $admStr.$adm.',';
        }
        return $admStr;
	}
	
	/**
     * return the description of this group
     * @return string
     */
	public function getDescription(){
		return $this->description;
	}

    /**
     * put all information in an array and give it back
     * @return array with groupid groupname member groupadmin description (associative array)
     */        
	public function getProperties(){
	        return array('groupid' => $this->getGroupid(), 
	                     'groupname' => $this->getGroupname(),
	                     'members' => $this->getMemberListAsStr(),
	                     'admins' => $this->getAdminListAsStr(),
	                     'description'=> $this->getDescription(),
	                     'groupcreator' => $this->getCreator());	
	}

/*************** SETTER ***************/

    /**
     * set the group id
     * @param int a unique groupid
     */
	public function setGroupid($id){
		$this->groupid = $id;
	}

    /**
     * set the name of this group
     * @param string
     */
	public function setGroupname($name){
		$this->groupname = $name;
	}

	/**
     * set a member as the creator of this group
     * @param string
     */
	public function setCreator($creator){
	    $this->creator = $creator;
	}
	
	/**
     * set the description of this group
     * @param string
     */
	public function setDescription($descr){
		$this->description = $descr;
	}
	
/*************** METHODS ***************/
	
	/**
     * check if a user is in this group, he can be in the adminList or in the
     * memberList
     * @param string username
     * @return boolean if the user is in this group return true, otherwise
     *                 false
     */
	public function isInGroup($user){
	    return $this->isAdmin($user) || $this->isMember($user);
	}
	
	/**
     * check if the given user is in the adminList
     * @param string username
     * @return boolean if the user is a admin return true, otherwise false
     */
	public function isAdmin($user){
	    return $this->isInList($this->getAdminList(),$user);
	}
	
	/**
     * check if the given user is in the memberList
     * @param string username
     * @return boolean if the user is a member return true, otherwise false
     */
	public function isMember($user){
	    return $this->isInList($this->getMemberList(),$user);
	}
	
	/**
     * search in a array and if it is an element of the array return true
     * otherwise return false
     * @param array list in which to search
     * @param string searchElement
     * @return boolean true if it is in the list, otherwise false
     */
	private function isInList(array $array,$search){
	    $ret = false;
	    foreach($array as $element){
	        if($element === $search){
	            $ret=true;
	        }
	    }
	    return $ret;
	}
	
	/**
	 * Add a userid as a member to the group
	 * @param $user userid which want to be a member of the group
	 */
	public function addMember($user){
	        //check if user is already in the list
	        if(!($this->isInList($this->listOfMembers,$user))){
    	        array_push($this->listOfMembers,$user);
	        }
	}
	
	/**
	 * Remove a userid from the members array
	 * @param $user userid which should be remove from the list
	 */	
	public function removeMember($user){
	       if(count($this->listOfMembers)>0){
	            for ($i = 0; $i < count($this->listOfMembers); $i++) {
	                if($user === $listOfMembers[$i]){
        	            unset($this->listOfMembers[$i]);
	                }
                }
	        }
	}
	
	/**
	 * Add a userid as a admin to the group
	 * @param $user userid which should be a member of the group
	 */	
	public function addAdmin($user){
	        //check if the user is already in the list
	        if(!($this->isInList($this->listOfAdmins,$user))){
	            array_push($this->listOfAdmins,$user);
	        }
	}
	
	/**
	 * Remove a userid from the groupadmin array
	 * @param $user userid which should be remove from the list
	 */
	public function removeAdmin($user){
	       if(count($this->listOfAdmins)>0){
	            for ($i = 0; $i < count($this->listOfAdmins); $i++) {
	                if($user === $listOfAdmins[$i]){
        	            unset($this->listOfAdmins[$i]);
	                }
                }
	        }
	}
}
