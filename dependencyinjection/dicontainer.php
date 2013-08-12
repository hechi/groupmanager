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
* Use to load the app. The DependencyInjection creats the Instance of the 
* PHP classes
*/

namespace OCA\Groupmanager\DependencyInjection;

// import the DIContainer from the AppFramework
use \OCA\AppFramework\DependencyInjection\DIContainer as BaseContainer;

// import the Controllers
use \OCA\Groupmanager\Controller\PageController;
use \OCA\Groupmanager\Controller\SettingController;

// import the ItemMapper
use \OCA\Groupmanager\DB\GroupMapper;

class DIContainer extends BaseContainer {

    public function __construct(){
        parent::__construct('groupmanager');

        // use this to specify the template directory
        $this['TwigTemplateDirectory'] = __DIR__ . '/../templates';

        $this['PageController'] = function($c){
            return new PageController($c['API'], $c['Request']);
        };
        
        $this['SettingController'] = function($c){
            return new SettingController($c['API'], $c['Request']);
        };
        
        /**
		 * MAPPERS
		 */
		$this['GroupMapper'] = $this->share(function($c){
			return new GroupMapper($c['API']);
		});
    }

}
