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
* The GroupMapper maps the Group class into the database.
* It make all the SQL Magic to communicate with the database.
*/

namespace OCA\Groupmanager\Db;

// import important AppFramework classes
use \OCA\AppFramework\Core\API;
use \OCA\AppFramework\Db\Mapper;
use \OCA\AppFramework\Db\DoesNotExistException;


class GroupMapper extends Mapper {

    /* Attribute */
	private $tableName;
	private $tableMember; 
	
	/**
	 * initialize the names of the database tables
	 * @param API $api: Instance of the API abstraction layer
	 */
	public function __construct($api=null){
	    parent::__construct($api,'groupmanager_groups');
	    // the *PREFIX* stands for the dabasename that every admin take
		$this->tableName = '*PREFIX*groupmanager_groups';
		$this->tableMember = '*PREFIX*groupmanager_members';
	}
	
	/**
	 * get all groups where the user is member of
	 * @param int uid userid 
	 * @return array with group objects
     */
    public function getGroups($uid){
        // get all group ids where the user is member
        $sqlGroupids = 'SELECT groupid FROM `'.$this->tableMember.'`
                        WHERE `userid` = ?';
        $uidPara = array($uid);
        $result = $this->execute($sqlGroupids,$uidPara);
        
        $selectedGroupids=array();
        // extract groupid from the db query and save it
        while($row = $result->fetchRow()){
            if(!in_array($row['groupid'],$selectedGroupids)){
                array_push($selectedGroupids,$row['groupid']);
            }
        }
        // prepare sql state to get every group information
        $sql = 'SELECT * FROM `'.$this->tableName.'` 
                WHERE `groupid` = ?';
        $group = array();
        // get each group with the extracted groupid
        foreach($selectedGroupids as $groupid){
            $params = array($groupid);
            $result = $this->execute($sql,$params);
            $resultRow = $result->fetchRow();
            //check if there is a group with this id
            //if there is one than great a group and add it to the group array
            if($resultRow['groupid']==$groupid){
                $entity = new Group($resultRow);
                $entity = $this->addMembersToGroup($entity);      
                array_push($group,$entity);
            }
        }
        return $group;
    }
    
    /**
	 * get all groups where the user is member of
	 * @param int uid userid 
	 * @return array with group objects
     */
    public function getGroup($gid){
        // prepare sql state to get every group information
        $sql = 'SELECT * FROM `'.$this->tableName.'` 
                WHERE `groupid` = ?';
        $params = array($gid);
        $result = $this->execute($sql,$params);
        $group = new Group($result->fetchRow());
        $group = $this->addMembersToGroup($group);
        return $group;
    }
    
    /**
     * get all members of group with permissions
     * @param Group object of the group to fill the members in
     */
    private function addMembersToGroup($group){
        // get all Members from group
        $sqlGroupmembers = 'SELECT * FROM `'.$this->tableMember.'`
                            WHERE `groupid` = ?';
        
        $params = array($group->getGroupid());
        $result = $this->execute($sqlGroupmembers,$params);
        while($row = $result->fetchRow()){
            $group->addMember($row['userid']);
            if($row['admin']==true){
                $group->addAdmin($row['userid']);
            }
        }                
        return $group;
    }
    
    /**
     * TODO
     */
    public function saveGroup($groupname,$groupdescription,$admin){
        // generate sql statement
        $sqlGroup = 'INSERT INTO `'.$this->tableName.'`(`groupname`,
                    `description`,`groupcreator`) VALUES(?, ?, ?)';
        $sqlGroupMember = 'INSERT INTO `'.$this->tableMember.'`(`groupid`,
                          `userid`,`admin`) VALUES(?, ?, ?)';
        // get current user
        $currentUser = $this->api->getUserId();
        // generate array with group informations
        $paramsGroup = array($groupname,$groupdescription,$currentUser);
        // run sql query
        $this->execute($sqlGroup,$paramsGroup);
        // get last created groupid
        $groupid = $this->api->getInsertId($this->tableName);
        // generate array with group admin information
        $paramsMember = array($groupid,$currentUser,true);
        // run sql query
        $this->execute($sqlGroupMember,$paramsMember);    
        return $groupid;
    }
    /**
     * TODO
     * @return bool if there is the same groupname return false, because the
     *              groupname is not valid, otherwise return true
     */
    public function checkGroupname($groupname){
        $sql = 'SELECT groupname FROM `'.$this->tableName.'` 
                WHERE `groupname` = ?';
        $params = array($groupname);
        $result = $this->execute($sql,$params)->fetchAll();
        if(count($result) > 0){
            return false;
        }else{
            return true;
        }
    }
    
    /**
     * TODO
     * @return bool if the query was successful return true, otherwise false
     */
    public function saveDescription($gid,$description){
        $sql = 'UPDATE `'.$this->tableName.'` SET `description` = ?
                                              WHERE `groupid` = ?';
                                          
        $params = array($description,$gid);
        $result = $this->execute($sql,$params);
        if($result>0){
            return true;
        }else{
            return false;        
        }
    }
    
    /**
     * TODO
     * @return bool if there is a group with this gid return true, otherwise false
     */
    private function isGroup($gid){
        $sql = 'SELECT * FROM `'.$this->tableName.'` 
                WHERE `groupid` = ?';
        $params = array($gid);
        $result = $this->execute($sql,$params)->fetchAll();
        if(count($result)>0){
            return true;
        }else{
            return false;        
        }
    }
    
    /**
     * TODO
     * @return bool if the query was successful return true, otherwise false
     */
    public function addMember($gid,$uid){
        if($this->isGroup($gid)){
            $sql = 'INSERT INTO `'.$this->tableMember.'`(`groupid`,
                   `userid`,`admin`) VALUES(?, ?, ?)';
                                              
            $params = array($gid,$uid,false);
            $result = $this->execute($sql,$params);
            if($result>0){
                return true;
            }else{
                return false;        
            }
        }else{
            return false;
        }
    }
    
    /**
     * TODO
     * @return bool if the query was successful return true, otherwise false
     */
    public function modifyMember($gid,$uid,$admin){
        if($this->isGroup($gid)){
            $sql = 'UPDATE `'.$this->tableMember.'` SET `admin` = ?
                    WHERE `groupid` = ? AND `userid` = ?';
            // convert to bool, because $admin is a string
            if($admin=="true"){
                $admin=true;
            }else{
                $admin=false;
            }                                  
            $params = array($admin,$gid,$uid);
            $result = $this->execute($sql,$params);
            if($result>0){
                return true;
            }else{
                return false;        
            }
        }else{
            return false;
        }
    }
    /**
     * TODO
     * @return bool if the query was successful return true, otherwise false
     */
    public function removeMember($gid,$uid){
        if($this->isGroup($gid)){
            $sql = 'DELETE FROM `'.$this->tableMember.'` WHERE `groupid` = ? AND `userid` = ?';
            $params = array($gid,$uid);
            $result = $this->execute($sql,$params);
            if($result>0){
                return true;
            }else{
                return false;        
            }
        }else{
            return false;
        }
    }
    
    /**
     * TODO
     * @return bool if the query was successful return true, otherwise false
     */
    public function removeAllMemberFromGroup($gid){
        if($this->isGroup($gid)){
            $sql = 'DELETE FROM `'.$this->tableMember.'` WHERE `groupid` = ? ';
            $params = array($gid);
            $result = $this->execute($sql,$params);
            if($result>0){
                return true;
            }else{
                return false;        
            }
        }else{
            return false;
        }
    }
    
    /**
     * TODO
     * @return bool if the query was successful return true, otherwise false
     */
    public function removeGroup($gid){
        if($this->isGroup($gid)){
            $this->removeAllMemberFromGroup($gid);
            $sql = 'DELETE FROM `'.$this->tableName.'` WHERE `groupid` = ?';
            $params = array($gid);
            $result = $this->execute($sql,$params) && $this->removeAllMemberFromGroup($gid);
            if($result>0){
                return true;
            }else{
                return false;        
            }
        }else{
            return false;
        }
    }

}
