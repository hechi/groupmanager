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
            $entity = new Group($result->fetchRow());
            
            $entity = $this->addMembersToGroup($entity);      
            
            array_push($group,$entity);
        }
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

}
