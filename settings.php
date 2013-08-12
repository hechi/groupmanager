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
* It uses the Template to include the javascript /app/settings.js 
* and a placeholder template. The template will be filled by the js/settings.js
*
*/


namespace OCA\Groupmanager;

\OC_Util::checkAdminUser();

\OCP\Util::addscript( 'groupmanager', 'settings' );

$tmpl = new \OCP\Template('groupmanager', 'settings');

return $tmpl->fetchPage();
