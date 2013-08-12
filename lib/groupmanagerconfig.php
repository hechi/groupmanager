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
* Handel the settings in the configuration file (owncloud/config/config.php)
*/

namespace OCA\Groupmanager\Lib;	

class Groupmanagerconfig {

	/**
     * Get the value of the uniqueGroupId from the /config/config.php
     * @return bool: Returns True if The Value is Yes, otherwise False
     */
    public static function getUniqueGroupIdSetting(){
        $value = Groupmanagerconfig::getSettingByName('groupmanagerUniqueGroupId');
        //if the autocompletion is not set yet, than return default value 
        //default : false
        if($value===''){
            $value = false;
        }
        return $value;
    }
    
    /**
     * Get the value of the autocompletionBox from the /config/config.php
     * @return bool: Returns True if The Value is Yes, otherwise False
     */
    public static function getAutocompletionSetting(){
        $value = Groupmanagerconfig::getSettingByName('groupmanagerAutocompletionBox');
        //if the autocompletion is not set yet, than return default value 
        //default : true
        if($value===''){
            $value = true;
        }
        return $value;
    }
    
    /**
     * Get a value of the settingAttribute from the /config/config.php
     * @param $key: settingAttribute in the /config/config.php
     * @return string: Returns the string of the /config/config.php
     */
    private static function getSettingByName($key){
        return \OCP\Config::getSystemValue($key, '');
    }
    
    /**
     * Set the settingAttribute of the uniqueGroupId into the /config/config.php
     * file
     * @param $value bool: set the attribute
     * @return bool return true if the write process was successful
     */    
    public static function setUniqueGroupIdSetting($value){
        return Groupmanagerconfig::setSettingByName('groupmanagerUniqueGroupId',$value);
    }
    
    /**
     * Set the settingAttribute of the autocompletionBox into the /config/config.php
     * file
     * @param $value bool: set the attribute
     * @return bool return true if the write process was successful
     */
    public static function setAutocompletionSetting($value){
        return Groupmanagerconfig::setSettingByName('groupmanagerAutocompletionBox',$value);
    }
    
    /**
     * Set value of the given settingAttribute into the /config/config.php
     * file
     * @param $key string: name of the attribute
     * @param $value : value to set
     * @return bool return true if the write process was successful
     */
    private static function setSettingByName($key,$value){
         return \OCP\Config::setSystemValue($key,$value);
    }
}
