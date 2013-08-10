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

var dummyGroup=new Group(0,"gruppe",new Array(new Array("admin",true),new Array("hans0",false),new Array("hans6",true)),"Hundeschüssel","hans4");
var dummyGroup2=new Group(1,"group",new Array(new Array("admin",false),new Array("hans3",true),new Array("hans1",false)),"Mäuseknochen","hans1");
var listOfGroups = new Array(dummyGroup,dummyGroup2);
var listOfUsers = null;

function User(uid,displayname,email){
    this.uid=uid;
    this.displayname=displayname;
    this.email=email;
}

/**
 * send a html request and take the result as a json object
 * @param string the requested link
 * @param json values that append the request
 * @result json if the request was successful 
 */
function getJsonQuery(request,jsonParam){
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
        }
    },"json");
    return ret;
}

var GROUPDB={
    /**
     * setup the connection to the pagecontroller
     */
    init:function(){
        GROUPDB_Dummy.init();
    },
    getGroups:function(uid,callback){
        console.log("query to DB");
        var result = getJsonQuery('getGroups',null);
        console.log(result);
        console.log("done");
        if (callback && typeof(callback) === "function") {  
            callback(result);  
        }
    },
    //TODO callback
    getGroupWithId:function(gid,callback){
        var result = GROUPDB_Dummy.getGroupWithId(gid);
        callback(result);
    },
    saveDescription:function(gid,description){
        GROUPDB_Dummy.saveDescription(gid,description);
    },
    //TODO callback
    saveGroup:function(groupname,listOfMembers,groupdescription,admin,callback){
        console.log("save group");
        var result = GROUPDB_Dummy.saveGroup(groupname,listOfMembers,groupdescription,admin);
        callback(result);
    },
    removeGroup:function(gid){
        GROUPDB_Dummy.removeGroup(gid);
    },
    addMember:function(gid,uid,adminPermission){
        GROUPDB_Dummy.addMember(gid,uid,adminPermission);
    },
    modifyMember:function(gid,uid,adminPermission){
        GROUPDB_Dummy.modifyMember(gid,uid,adminPermission);
    },
    //TODO callback
    removeMember:function(gid,uid,callback){
        GROUPDB_Dummy.removeMember(gid,uid);
        callback(true);
    },
    //TODO callback
    getUser:function(uid,callback){
        var result = GROUPDB_Dummy.getUser(uid);
        callback(result);
    },
    //TODO callback
    isGroupnameValid:function(groupname,callback){
        var result = GROUPDB_Dummy.isGroupnameValid(groupname);
        callback(result)
    },
    //TODO callback
    getUsersWith:function(uid,callback){
        var result = GROUPDB_Dummy.getUsersWith(uid);
        callback(result);
    }
};

var GROUPDB_Dummy={
    
    /**
     * TODO
     */
    init:function(){
        if(listOfUsers==null){
            var userList = new Array();
            listOfUsers=new Array();
            listOfUsers.push(new User(OC.currentUser,"Current User","current@user.com"));
            for(var i = 0 ; i<8;i++){
                userList[i] = new User("hans"+i,"Hans Meier"+i,"hans"+i+"@meier.com");
                listOfUsers.push(userList[i]);
            }
        }
    },
    getGroups:function(uid){
        //TODO
        return listOfGroups;
    },
    getGroupWithId:function(gid){
        //TODO
        return GROUPDB_Dummy.getGroups()[gid];
    },
    saveDescription:function(gid,description){
        //TODO
        console.log("save description:"+description+" in group "+gid);
    },
    saveGroup:function(groupname,listOfMembers,groupdescription,admin){
        //TODO get back the new groupid
        console.log("save group "+groupname+" "+listOfMembers+" "+groupdescription+" "+admin);
        var group = new Group(listOfGroups.length,groupname,listOfMembers,groupdescription,admin);
        listOfGroups.push(group);     
        return group.getGroupid();
    },
    removeGroup:function(gid){
        //TODO
        console.log("remove group"+gid);
    },
    addMember:function(gid,uid,adminPermission){
        //TODO
        console.log("add "+uid+" to group "+gid+" with adminPermissions? "+adminPermission);
        GROUPDB_Dummy.getGroupWithId(gid).getListOfMembers().push(uid,adminPermission);
    },
    modifyMember:function(gid,uid,adminPermission){
        console.log("modify "+uid+" in group "+gid+" with adminPermissions? "+adminPermission);
    },
    removeMember:function(gid,uid){
        //TODO
        console.log("remove member "+uid+" from group "+gid);
        //TODO check if there es a other member with admin privileges
        return true;
    },
    getUser:function(uid){
        //TODO
        for(var i=0;i<listOfUsers.length;i++){
            if(listOfUsers[i].uid==uid){
                return listOfUsers[i];
            }
        }
        return null;
    },
    isGroupnameValid:function(groupname){
        //TODO
        return true;
    },
    getUsersWith:function(uid){
        //TODO
        return listOfUsers;
    },
};
