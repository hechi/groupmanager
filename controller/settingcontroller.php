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
use \OCA\Groupmanager\Lib\Groupmanagerconfig;

class SettingController extends Controller {

    /**
     * Constructor of the SettingsController
     * initialize the attribute
     */
    public function __construct($api, $request){
        parent::__construct($api, $request);
    }
    
    /**
     * TODO
     */
    public function getSettings(){
        $uniqueGroup = Groupmanagerconfig::getUniqueGroupIdSetting();
        $autocomp = Groupmanagerconfig::getAutocompletionSetting();
        $array = array('uniqueGroup'=>$uniqueGroup,'autocomp'=>$autocomp);
        return $this->renderJSON($array);
    }
    
    /**
     * TODO
     */
    public function saveSettings(){
        $resUnique = Groupmanagerconfig::setUniqueGroupIdSetting($this->params('uniqueGroup'));
        $resAuto = Groupmanagerconfig::setAutocompletionSetting($this->params('autocomp'));
        $res = $resUnique && $resAuto;
        $array = array('res'=>$res);
        return $this->renderJSON($array);
    }
}
