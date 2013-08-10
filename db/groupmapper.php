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
        $uidPara = array(uid);
        $result = $this->execute($sqlGroupids,$uidPara);
        
        $selectedGroupids=array();
        // extract groupid from the db query and save it
        while($entry = $result->fetchRow()){
            if(!in_array($row['groupid'],$selectedGroupids)){
                array_push($selectedGroupids,$row['groupid']);
            }
        }
        // prepare sql state to get every group information
        $sql = 'SELECT * FROM `'.$this->tableName.'` 
                WHERE `groupid = ?`';
        $group = array();
        // get each group with the extracted groupid
        foreach($selectedGroupids as $groupid){
            $params = array($groupid);
            $result = $this->execute($sql,$params);
            $entity = new Group($result->fetchRow());
            array_push($group,$entity);
        }
        return $group;
    }

}
