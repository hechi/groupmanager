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

class PageController extends Controller {

    /* Attribute */
//    private $itemController;
//    private $itemMapper;
    private $groupmapper;

    /**
     * Constructor of the PageController
     * initialize the attribute
     * TODO
     */
    public function __construct($api, $request){
        parent::__construct($api, $request);
        
        //$this->initAdminSettings();
        $this->groupmapper = new Groupmapper($api);
    }
    
    /**
     * @CSRFExemption
     * @IsAdminExemption
     * @IsSubAdminExemption
     *
     * Redirects to the index page
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
     * get all groups where the user is a member or admin
	 * 
	 * @CSRFExemption
	 * @IsAdminExemption
	 * @IsSubAdminExemption
	 * @return TODO
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
	 * @return TODO
     */
	public function getGroup(){
	    $group = $this->groupmapper->getGroup($this->params('groupid'));
	    return $this->renderJSON($group->getProperties());
	}
	
	/**
     * create a group
	 * 
	 * @CSRFExemption
	 * @IsAdminExemption
	 * @IsSubAdminExemption
	 * @return TODO
     */
	public function saveGroup(){
        //TODO check if groupname is valid
	    $groupid = $this->groupmapper->saveGroup($this->params('gname'),
	                                           $this->params('gdesc'),
	                                           $this->params('adm'));
	    $array = array($groupid);
	    return $this->renderJSON($array);
	}
}
