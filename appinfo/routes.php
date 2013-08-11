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
* Generate routes to methods (like a link or rather url's)
* 
*/

namespace OCA\Groupmanager;

use \OCA\AppFramework\App;
use \OCA\Groupmanager\DependencyInjection\DIContainer;

/*************************
 * Define your routes here
 ************************/

/**
 * Normal Routes
 */

// Route to the index Method from pagecontroller.php
$this->create('groupmanagerIndex', '/')->action(
    function($params){
        // call the index method on the class PageController
        App::main('PageController', 'index', $params, new DIContainer());
    }
);

//TODO
$this->create('getGroups', '/getGroups/')->post()->action(
    function($params){
        // call the index method on the class PageController
        App::main('PageController', 'getGroups', $params, new DIContainer());
    }
);
//TODO
$this->create('getGroup', '/getGroup/')->post()->action(
    function($params){
        // call the index method on the class PageController
        App::main('PageController', 'getGroup', $params, new DIContainer());
    }
);
//TODO
$this->create('saveGroup', '/saveGroup/')->post()->action(
    function($params){
        // call the index method on the class PageController
        App::main('PageController', 'saveGroup', $params, new DIContainer());
    }
);
//TODO
$this->create('getUsers', '/getUsers/')->post()->action(
    function($params){
        // call the index method on the class PageController
        App::main('PageController', 'getUsers', $params, new DIContainer());
    }
);
$this->create('getUser', '/getUser/')->post()->action(
    function($params){
        // call the index method on the class PageController
        App::main('PageController', 'getUser', $params, new DIContainer());
    }
);
$this->create('isGroupnameValid', '/isGroupnameValid/')->post()->action(
    function($params){
        // call the index method on the class PageController
        App::main('PageController', 'isGroupnameValid', $params, new DIContainer());
    }
);
