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
* This file handle all the communication with the pagecontroller
* 
*/

/**
 * represent a user in the frontend
 */
function User(uid,displayname){
    this.uid=uid;
    this.displayname=displayname;
}

/**
 * send a html request and take the result as a json object
 * @param string the requested link
 * @param json values that append the request
 * @result json if the request was successful 
 */
function getJsonQuery(request,jsonParam,callback){
    console.log("build request");
    var getUrl=null;
    if(jsonParam==null){
        getUrl = OC.Router.generate(request);
    }else{
        getUrl = OC.Router.generate(request,jsonParam);
    }
    console.log("call: "+getUrl);
    console.log("param: "+jsonParam);
    var ret = null;
    $.post(getUrl,function(result){
        if(result.status=='success'){
            ret=result.data;
            callback(ret);
        }
    },"json");
}

/**
 * parse a json object to a list of groups
 * @param json object
 * @return array a list of group objects
 */
function jsonToGroupList(json){
    var list = new Array();
    console.log("json length: "+json.length);
    for(var i=0;i<json.length;i++){
            list.push(jsonToGroup(json[i]));
    }
    return list;
}

/**
 * parse a single json to a group object
 * @param json object with (groupid,groupname,commaSeperatedString,description,
 *                           groupcreator)
 * @return group object
 */
function jsonToGroup(json){
    var listOfMembers = parseMembers(json.members,json.admins);
    var group = new Group(json.groupid,
                          json.groupname,
                          listOfMembers,
                          json.description,
                          json.groupcreator);
    return group;
}

/**
 * parse a comma seperated string to a list of (username,admin) tuple,
 * the admin is a boolean for the permission to change things
 * @param string members to parse
 * @param string a string with usernames the are also admins
 * @return array(array) a array in an array, the second is the tuple
 */
function parseMembers(members,admins){
    var listMembers = members.split(",");
    var list = new Array();
    for(var i = 0; i<listMembers.length;i++){
        if(listMembers[i]!=""){
            if(admins.indexOf(listMembers[i])>=0){
                list.push(new Array(listMembers[i],true));
            }else{
                list.push(new Array(listMembers[i],false));
            }
        }
    }
    return list;
}

/**
 * represent the connection to the pagecontroller
 */
var GROUPDB={
    /**
     * get all groups of the current user and parse the result to a list of gorup
     * object and give it back via callback function
     * @param function which called at the end if this function is done
     */
    getGroups:function(callback){
        console.log("query to DB");
        getJsonQuery('getGroups',null,function(result){
            console.log("result: "+result);
            var listOfGroups = jsonToGroupList(result);
            console.log("after convert result: "+listOfGroups);
            if (callback && typeof(callback) === "function") {  
                callback(listOfGroups);  
            }
        });
    },
    /**
     * get a group with groupid and parse it to a group object and give it back 
     * via callback function
     * @param int groupid which group we want
     * @param function which called at the end if this function is done
     */
    getGroupWithId:function(gid,callback){
        getJsonQuery('getGroup',{groupid:gid},function(result){
            var group = jsonToGroup(result);
            callback(group);
        });
    },
    /**
     * send a new description for a group to the server
     * @param int groupid which groupdescription we want to change
     * @param function which called at the end if this function is done
     */
    saveDescription:function(gid,description,callback){
        console.log("query to DB");
        getJsonQuery('saveDescription',{groupid:gid,desc:description},function(result){
            console.log("result: "+result);
            if (callback && typeof(callback) === "function") {  
                callback(result.res);  
            }
        });
    },
    /**
     * send new created group to server, so he can save it and give the new 
     * created groupid back via callback function
     * @param string groupname
     * @param string groupdescription
     * @param function which called at the end if this function is done
     */
    saveGroup:function(groupname,groupdescription,callback){
        console.log("save group");
        getJsonQuery('saveGroup',{gname:groupname,
                                  gdesc:groupdescription},function(result){
            console.log("result: "+result);
            
            if (callback && typeof(callback) === "function") {  
                callback(result);  
            }
        });
    },
    /**
     * remove group via groupid, if it was successful we get true via
     * callback function, otherwise false
     * @param int groupid
     * @param function which called at the end if this function is done
     */
    removeGroup:function(gid,callback){
        console.log("remove group");
        getJsonQuery('removeGroup',{groupid:gid},function(result){
            console.log("result: "+result);
            if (callback && typeof(callback) === "function") {  
                callback(result.res);  
            }
        });
    },
    /**
     * add a user as member to the group with gid, if it was successful we get 
     * true via callback function, otherwise false
     * @param int groupid
     * @param string userid
     * @param function which called at the end if this function is done
     */
    addMember:function(gid,uid,callback){
        console.log("add member "+uid+" to group "+gid);
        getJsonQuery('addMember',{groupid:gid,
                                  userid:uid},function(result){
            console.log(result);            
            if (callback && typeof(callback) === "function") {  
                callback(result);  
            }
        });
    },
    /**
     * modify the admin permission for user with the uid in the group with gid
     * if it was successful we get true via callback function, otherwise false
     * @param int groupid
     * @param string userid
     * @param bool new admin permission, true if he get the admin status for
     *             for this group, otherwise false
     * @param function which called at the end if this function is done
     */
    modifyMember:function(gid,uid,adminPermission,callback){
        console.log("modify member "+uid+" of group "+gid);
        getJsonQuery('modifyMember',{groupid:gid,
                                     userid:uid,
                                     adm:adminPermission},function(result){
            console.log(result);            
            if (callback && typeof(callback) === "function") {  
                callback(result.res);  
            }
        });
    },
    /**
     * remove member with the userid of the group with the groupid, 
     * if it was successful we get true via callback function, otherwise false
     * @param int groupid
     * @param string userid
     * @param function which called at the end if this function is done
     */
    removeMember:function(gid,uid,callback){
        console.log("remove member "+uid+" of group "+gid);
        getJsonQuery('removeMember',{groupid:gid,
                                     userid:uid},function(result){
            console.log(result);            
            if (callback && typeof(callback) === "function") {  
                callback(result.res);  
            }
        });
    },
    /**
     * get displayName of the user with the uid, return the user information
     * back via callback function
     * @param string userid
     * @param function which called at the end if this function is done
     */
    getUser:function(uid,callback){
        getJsonQuery('getUser',{username:uid},function(result){
            console.log(result);
            
            var user = new User(result.uid,result.displayName);
            
            if (callback && typeof(callback) === "function") {  
                callback(user);  
            }
        });
    },
    /**
     * check if the groupname is already taken by a other user, return true via
     * callback function if the groupname is NOT taken, otherwise false
     * @param function which called at the end if this function is done
     */
    isGroupnameValid:function(groupname,callback){
        getJsonQuery('isGroupnameValid',{gname:groupname},function(result){
            console.log(result);
            
            
            if (callback && typeof(callback) === "function") {  
                callback(result.valid);  
            }
        });
    },
    /**
     * get a list with all users if there beginning matches the uid
     * @param string part of the username
     * @param function which called at the end if this function is done
     */
    getUsersWith:function(uid,callback){
        getJsonQuery('getUsers',{searchString:uid},function(result){
            console.log(result);
            
            var list = new Array();
            for(var i=0;i<result.length;i++){
                var user = new User(result[i].uid,result[i].displayName);
                list.push(user);
            }
            if (callback && typeof(callback) === "function") {  
                callback(list);  
            }
        });
    }
};
