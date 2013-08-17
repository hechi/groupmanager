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

    private $groupmapper = null;

    // contructor
	public function __construct($api){
	    $this->groupmapper = Groupmapper::getInstance($api);
    }
    
    /**
     * Check if backend implements actions
     * Returns the supported actions as int to be
     * compared with OC_GROUP_BACKEND_CREATE_GROUP etc.
     * @param int $actions bitwise-or'ed actions
     * @return boolean
     *
     */
    public function implementsActions($actions){
        return (bool)(OC_GROUP_BACKEND_GET_DISPLAYNAME & $actions);
    }

    /**
     * Checks whether the user is member of a group or not.
     * @param string $uid uid of the user
     * @param string $gid gid of the group
     * @return bool
     */
    public function inGroup($uid, $gid){
        $group = $this->groupmapper->getGroup($gid);
        return $group->isInGroup($uid);
    }

    /**
     * This function fetches all groups a user belongs to. It does not check
     * if the user exists at all.
     * @param string $uid Name of the user
     * @return array with group names
     *
     */
    public function getUserGroups($uid){
        $groups = $this->groupmapper->getGroups($uid);
        $groupnames = array();
        foreach($groups as $group){
            array_push($groupnames,$group->getGroupname());
        }
        return $groupnames;
    }

    /**
     * get a list of all groups
     * @param string $search
     * @param int $limit
     * @param int $offset
     * @return array with group names
     *
     */
    public function getGroups($search = '', $limit = -1, $offset = 0){
        $groups = $this->groupmapper->getAllGroups();
        $groupnames = array();
        foreach($groups as $group){
            array_push($groupnames,$group->getGroupname());
        }
        return $groupnames;
    }

    /**
     * check if a group with the groupname exists
     * @param string $groupname
     * @return bool
     */
    public function groupExists($groupname){
        return $this->groupmapper->isGroupname($groupname);  
    }

    /**
     * get a list of all users in a group
     * @param string $gid
     * @param string $search
     * @param int $limit
     * @param int $offset
     * @return array with user ids
     */
    public function usersInGroup($gid, $search = '', $limit = -1, $offset = 0){
        $group = $this->groupmapper->getGroup($gid);
        return $group->getMemberList();   
    }
}
