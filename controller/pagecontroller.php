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
* The pagecontroller is the connection between the javascript (app.js) and the
* database (groupmapper).
*/

namespace OCA\Groupmanager\Controller;

// import the AppFramwork classes
use \OCA\AppFramework\Controller\Controller;
use \OCA\AppFramework\Db\DoesNotExistException;
use \OCA\AppFramework\Core\API;
use \OCA\AppFramework\Http\Request;

// import the Group, that represents the Entry in the database
use OCA\Groupmanager\Db\Groupmapper;
use OCA\Groupmanager\Db\Group;
use OCA\Groupmanager\Lib\Groupmanagerconfig;

class PageController extends Controller {

    /* Attribute */
    private $groupmapper;

    /**
     * Constructor of the PageController
     * initialize the attribute
     */
    public function __construct($api, $request){
        parent::__construct($api, $request);
        
        //$this->initAdminSettings();
        $this->groupmapper = Groupmapper::getInstance($api);
    }
    
    /**
     * Redirects to the index page
     *
     * @CSRFExemption
     * @IsAdminExemption
     * @IsSubAdminExemption
     */
    public function redirectToIndex(){
            $url = $this->api->linkToRoute('groupmanagerIndex');
            return new RedirectResponse($url);
    }


    /**
     * Prints the index page of Groupmanager
     *
     * @CSRFExemption
     * @IsAdminExemption
     * @IsSubAdminExemption
     */
    public function index(){
        // loads the stylesheets from css directory
		$this->api->addStyle('style'); //style = /css/style.css

        // loads the script from the js directory
		$this->api->addScript('app'); //app = /js/app.js
		$this->api->addScript('group'); //app = /js/group.js
		$this->api->addScript('operations'); //app = /js/operations.js
        
        //templateName is the name of the Template in /templates
		$templateName = 'main';
		// create a array with parameters if need
		$params = array();		
		// paint/render the the template with parameters on the website
		return $this->render($templateName, $params);
    }
    
    /**
     * get all groups where the current user is a member or admin
     * return a json object with all groups and there properties
	 * 
	 * @CSRFExemption
	 * @IsAdminExemption
	 * @IsSubAdminExemption
	 * @return json object
     */
	public function getGroups(){
	    try{
	        $groups = $this->groupmapper->getGroups($this->api->getUserId());
	    }catch(DoesNotExistException $e){
	        //TODO throw exception
	    }
	    //extract all attributes as a associative array, because the 
	    //renderJSON Method can convert that to a json object
	    $array = array();
	    foreach($groups as $group){
	        //check if the admin whant a uniqueGroupId with the 
	        if(Groupmanagerconfig::getUniqueGroupIdSetting()=="true"){
	            $group->setGroupname($group->getGroupname().":".$group->getGroupid());
	        }
	        array_push($array,$group->getProperties());
	    }
	    return $this->renderJSON($array);	
	}
	
	/**
     * get group by id
	 * 
	 * @CSRFExemption
	 * @IsAdminExemption
	 * @IsSubAdminExemption
	 * @return json object with all group properties
     */
	public function getGroup(){
	    $group = $this->groupmapper->getGroup($this->params('groupid'));
	    if(Groupmanagerconfig::getUniqueGroupIdSetting()=="true"){
	        $group->setGroupname($group->getGroupname().":".$group->getGroupid());
	    }
	    return $this->renderJSON($group->getProperties());
	}
	
	/**
     * create a group
	 * 
	 * @CSRFExemption
	 * @IsAdminExemption
	 * @IsSubAdminExemption
	 * @return json object returns a singl value (groupid)
     */
	public function saveGroup(){
        $isValid=$this->groupmapper->checkGroupname($this->params('gname'));
        $groupid=null;
        if($isValid){
	        $groupid = $this->groupmapper->saveGroup($this->params('gname'),
	                                                 $this->params('gdesc'));
        }
	    $array = array($groupid);
	    return $this->renderJSON($array);
	}
	
	/**
     * returns a users
     *
     * @CSRFExemption
 	 * @IsAdminExemption
	 * @IsSubAdminExemption
	 * @return json object with uid and displayName
     */
    public function getUser(){
        // get the given uid from the url
        // send by js/app.js
        $uid = $this->params('username');
                
        $users = \OCP\User::getUsers($uid);
        // create a array with parameters if need
		$params = array();
		// check for usernames with the searchstring
        foreach($users as $user){
            // check if autocompletion is true, than we are allow to search
            // in the username for characters, else it must be the whole
            // username
            if($user === $uid){
                $displayName = \OCP\User::getDisplayName($user);
                $params = array('uid'=>$user,'displayName'=>$displayName);
            }
        }
		        
        // give back all information to the website as an JSON Object
        return $this->renderJSON($params);
	}
	
	/**
     * returns a number of users, if the autocompleteion option is turned on
     * else it returns only one matching user
     *
     * @CSRFExemption
 	 * @IsAdminExemption
	 * @IsSubAdminExemption
	 * @return json object every entry have a uid and a displayName
     */
    public function getUsers(){
        // get the given searchString from the url
        // send by js/app.js
        $searchString = $this->params('searchString');
                
        //\OCP\User::getUsers($search = '', $limit = null, $offset = null);
        $users = \OCP\User::getUsers($searchString);
        // create a array with parameters if need
		$params = array();
		// check for usernames with the searchstring
        foreach($users as $user){
            // check if autocompletion is true, than we are allow to search
            // in the username for characters, else it must be the whole
            // username
            if((Groupmanagerconfig::getAutocompletionSetting()=="true" && stripos($user,$searchString)!==false) || $searchString===$user){
                // push the user in the return array
                $displayName = \OCP\User::getDisplayName($user);
                $more = array('uid'=>$user,'displayName'=>$displayName);
                array_push($params,$more);
            }
        }
		        
        // give back all information to the website as an JSON Object
		return $this->renderJSON($params);
    }
    
    /**
     * check if a groupname is not taken, return true if it is NOT taken,
     * false otherwise
     *
     * @CSRFExemption
 	 * @IsAdminExemption
	 * @IsSubAdminExemption
	 * @return json object with the entry valid. it can be true or false
     */
    public function isGroupnameValid(){
        $valid = $this->groupmapper->checkGroupname($this->params('gname'));
        $params = array('valid'=>$valid);
        return $this->renderJSON($params);
    }
    
    /**
     * save a new description to an existing group
     *
     * @CSRFExemption
 	 * @IsAdminExemption
	 * @IsSubAdminExemption
	 * @return json object with the entry res. it can be true if the operation
	 *                     was okay and the new description is stored in the DB,
	 *                     false otherwise
     */
    public function saveDescription(){
        $permission = $this->groupmapper->isGroupadmin($this->params('groupid'));
        $res = false;
        if($permission){
            $res = $this->groupmapper->saveDescription($this->params('groupid'),
                                                       $this->params('desc'));
        }
        $params = array('res'=>$res);
        return $this->renderJSON($params);
    }
    
    /**
     * add member to group
     *
     * @CSRFExemption
 	 * @IsAdminExemption
	 * @IsSubAdminExemption
	 * @return json object with the entry res. it can be true if the operation
	 *                     was okay and the new description is stored in the DB,
	 *                     false otherwise
     */
    public function addMember(){
        $permission = $this->groupmapper->isGroupadmin($this->params('groupid'));
        $res = false;
        if($permission){
            $res = $this->groupmapper->addMember($this->params('groupid'),
                                                 $this->params('userid'));
        }
        $params = array('res'=>$res);
        return $this->renderJSON($params);
    }
    
    /**
     * modify member of group
     *
     * @CSRFExemption
 	 * @IsAdminExemption
	 * @IsSubAdminExemption
	 * @return json object with the entry res. it can be true if the operation
	 *                     was okay and the new description is stored in the DB,
	 *                     false otherwise
     */
    public function modifyMember(){
        $adminLeft = $this->groupmapper->isAdminUserLeft($this->params('groupid'),
                                                         $this->params('userid'));
        $permission = $this->groupmapper->isGroupadmin($this->params('groupid'));
        $res = false;
        if($permission && $adminLeft){
            $res = $this->groupmapper->modifyMember($this->params('groupid'),
                                                    $this->params('userid'),
                                                    $this->params('adm'));
        }
        $params = array('res'=>$res);
        return $this->renderJSON($params);
    }
    
    /**
     * remove member from group
     *
     * @CSRFExemption
 	 * @IsAdminExemption
	 * @IsSubAdminExemption
	 * @return json object with the entry res. it can be true if the operation
	 *                     was okay and the new description is stored in the DB,
	 *                     false otherwise
     */
    public function removeMember(){
        $adminLeft = $this->groupmapper->isAdminUserLeft($this->params('groupid'),
                                                         $this->params('userid'));
        $permission = $this->groupmapper->isGroupadmin($this->params('groupid'));
        $res = false;
        if($permission && $adminLeft){
            $res = $this->groupmapper->removeMember($this->params('groupid'),
                                                    $this->params('userid'));
        }
        $params = array('res'=>$res);
        return $this->renderJSON($params);
    }
    
    /**
     * remove group
     *
     * @CSRFExemption
 	 * @IsAdminExemption
	 * @IsSubAdminExemption
	 * @return json object with the entry res. it can be true if the operation
	 *                     was okay and the new description is stored in the DB,
	 *                     false otherwise
     */
    public function removeGroup(){
        $permission = $this->groupmapper->isGroupadmin($this->params('groupid'));
        $res = false;
        if($permission){
            $res = $this->groupmapper->removeGroup($this->params('groupid'));
        }
        $params = array('res'=>$res);
        return $this->renderJSON($params);
    }
}
