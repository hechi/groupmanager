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
* Describe a group object for the frontend, to have a nicer and easyier useage.
* 
*/

function Group(gid,groupname,listOfMembers,description,creator){
    /* Attributes */
    this.gid=gid || 0;
    this.groupname=groupname || "no group";
    this.listOfMembers=listOfMembers || new Array(OC.currentUser());
    this.description=description || "no description";
    this.creator=creator || OC.currentUser();
    /* Methods */
    this.getGroupid = getGroupid;
    this.getGroupname = getGroupname;
    this.getListOfMembers = getListOfMembers;
    this.getDescription = getDescription;
    this.getCreator = getCreator;
    this.isUserAdmin = isUserAdmin;
    this.isMember = isMember;
}

function getGroupid(){
    return this.gid;
}

function getGroupname(){
    //TODO check if preferences what the creatorid in the groupname
    return this.groupname;
}

function getListOfMembers(){
    return this.listOfMembers;
}

function getDescription(){
    return this.description;
}

function getCreator(){
    return this.creator;
}

function isMember(uid){
    var result = false;
    for(var i = 0;i<this.listOfMembers.length;i++){
        // if user is in list of members and he have the admin permission for the group
        if(this.listOfMembers[i][0]==uid){
            return true;
        }
    }    
    return result;
}

function isUserAdmin(uid){
    var result = false;
    for(var i = 0;i<this.listOfMembers.length;i++){
        // if user is in list of members and he have the admin permission for the group
        if(this.listOfMembers[i][0]==uid&&this.listOfMembers[i][1]==true){
            return true;
        }
    }    
    return result;
}


