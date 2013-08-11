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
* Fills the Templates and acts with the user. Make click actions and so on.
* It is also for fancy effects
* 
*/

/* member which standing in the ul of template*/
var members = new Array();
/* for better use, because this is not erverywhere usable */
var self;
/*********** elements of the template ***********/
var newGroupButton;
var newGroupField;
var grouplist;
var userSearchResult;
var userSearchInput;
var memberlist;
var notifyCreation;
var newGroupText;
var expandNewGroup;
var newGroupButton;
var expandDescription;
var expandPic;
var groupdescription;
var groupdescriptionsave;
var modDescription;

/*********** STATUS-FLAGS for notification of creating process ***********/
var ERROR = -2;     // an error appears
var NOTVALID = -1;   // groupname is not valid
var OK = 1;         // every thing is okay groupname is valid
var CHECKING = 2;    // checking if groupname is not taken

/*********** KEY EVENTs ***********/
var KEY_ENTER = 13;

/**
 * init needed HTML field to have an easier useage in this document
 */
function init(){
    this.self = this;
    //ids
    self.rightcontent=$("#rightcontent");
    self.newGroupButton=$("#newGroupButton");
    self.newGroupField=$("#newGroupField");
    self.grouplist=$("#grouplist");
    self.userSearchResult=$("#userSearchResult");
    self.userSearchInput=$("#userSearchInput");
    self.memberlist=$("#memberlist");
    self.notifyCreation=$("#notifyCreation");
    self.newGroupText=$("#newGroupText");
    self.expandNewGroup=$("#expandNewGroup");
    self.newGroupOk=$("#newGroupOk");
    self.newGroupCancle=$("#newGroupCancle");
    self.newGroupButton=$("#newGroupButton");
    self.expandDescription=$("#expandDescription");
    self.expandPic=$("#expandPic");
    self.newDescription=$("#newDescription");
    self.groupdescription=$("#groupdescription");
    self.groupdescriptionsave=$("#groupdescriptionsave");
    //class definitions
    self.modDescription=$(".modDescription");
}

// serialize a list to a jsonstring
// this jsonstring can be used to parse it into an array
function serializeListToJSON(tagName){
    var serialized = '{';
    var len = $('li', tagName).length - 1;
    var delim;
    $('li', tagName).each(function(i) {
        var $li = $(this);
        var $text = $li.text();
        delim = (i < len) ? ',' : '';
        var name = $li[0].tagName.toLowerCase();
        serialized += '"'+ i + '":' + '"' + $text + '"' + delim;
    });
    serialized += '}';    
    debugLog(serialized);
    return serialized;
}

/**
 * @param flag int, status flag. see on the head of this file
 */
function notifyGroupCreation(flag){
    switch(flag){
        case ERROR:
            displayError("error is appeared");
            break;
        case NOTVALID:
            displayNotValid();
            break;
        case OK:
            displayOk();
            break;
        case CHECKING:
            displayLoading();
            break;
        default: 
            displayError("groupcreation error");
            debugLog("groupcreation error");
    }
}

/**
 * display a dialog to say there is an error
 * @param string msg which should be displayed for the user
 */
function displayError(msg){
    OC.dialogs.alert(msg+" please check logs or contact your systemadministrator",t('groupmanager','Error'));
    debugLog(msg);
}

//TODO: find a error sign
/**
 * display a string and sign that the groupname is not valid and someone else
 * has taken it
 */
function displayNotValid(){
    self.hideNotify();
    self.newGroupText.removeClass("hidden");
    self.newGroupText.text(self.translate("group name already taken"));
}

/**
 * show a checkmark sign on the right side of the groupnameinputfield
 * it says that the groupname is valid und can be confirmed with ENTER/RETURN
 */
function displayOk(){
    self.notifyCreation.removeClass("hidden");
    self.notifyCreation.attr("src",OC.imagePath('groupmanager','checkmark.png'));
    self.notifyCreation.attr("alt","groupname is valid");
    self.hideNewGroupText();
}

/**
 * show a loading sign on the right side of the groupnameinputfield
 * describe the process to validate the groupname
 */ 
function displayLoading(){
    self.notifyCreation.removeClass("hidden");
    self.notifyCreation.attr("src",OC.imagePath('core','loading.gif'));
    self.notifyCreation.attr("alt","loading...");
    self.hideNewGroupText();
}

/**
 * show the dialog to add group
 */
function displayNewGroupDialog(){
    self.newGroupField.attr('value',self.translate("Groupname"));
    self.newDescription.val(self.translate("Description"));
    self.expandNewGroup.fadeIn("fast");
}

/**
 * show the right content
 */
function displayRightContent(){
    self.rightcontent.removeClass("hidden");
}

/**
 * hide the right content
 */
function hideRightContent(){
    self.rightcontent.addClass("hidden");
}

/**
 * hide text on the top
 */
function hideNewGroupText(){
    self.newGroupText.addClass("hidden");
}

/**
 * hide notification image
 */
function hideNotify(){
    self.notifyCreation.addClass("hidden");
}

/**
 * hide new group dialog
 */
function hideNewGroupDialog(){
    self.expandNewGroup.fadeOut("fast");
}

/**
 * only for debug informations
 * @param string msg print msg text on console.log
 */
function debugLog(msg){
    console.log("Groupmanager: "+msg);
}

/**
 * remove group from db and delete created element where the displayed information
 * are stored on the left side
 * @param int gid group id 
 * @param HTMLobject element a HTML element where the remove method can be called
 */
function removeGroup(gid,element){
    GROUPDB.getGroupWithId(gid,function(group){
        if(group.isUserAdmin(OC.currentUser)){
            GROUPDB.removeGroup(gid);
            $(document).find('.tipsy').hide();
            element.remove();
            self.hideRightContent();
        }else{
            //TODO
            alert("you dont have the permission to delete this group");
        }
    });

/*
    if(GROUPDB.getGroupWithId(gid).isUserAdmin(OC.currentUser)){
        GROUPDB.removeGroup(gid);
        $(document).find('.tipsy').hide();
        element.remove();
        self.hideRightContent();
    }else{
        //TODO
        alert("you dont have the permission to delete this group");
    }
*/
}

/**
 * remove member from group and delete created element where the displayed information
 * are stored on the right side, but there must be one admin left
 * @param int uid member id 
 * @param HTMLobject element a HTML element where the remove method can be called
 */
function removeMember(uid,element){
    //there must be more than one member left
    if(self.memberlist.find('.member').length>1){
        //if the member is not a admin, then remove it, else it must be two admins
        //left in the group to remove one
        if(self.memberlist.find('input:checked').length>1 || element.find('input:checked').length==0){
            GROUPDB.removeMember(self.getSelectedGroupid(),uid,function(result){
                if(result){
                    $(document).find('.tipsy').hide();//TODO tipsy does not remove
                    element.remove();
                }
            });
            /*
            var result = GROUPDB.removeMember(self.getSelectedGroup().getGroupid(),uid);
            if(result){
                $(document).find('.tipsy').hide();//TODO tipsy does not remove
                element.remove();
            }
            */
        }else{
            //TODO
            alert("can not remove all admin members");
        }
    }else{
        //TODO print error because only one member left
        //TODO must have min of one admin
        alert("can not remove all members");
    }
}

/**
 * if the button 'New Group' is pressed display the input field and description
 */
function newGroup(){
    self.displayNewGroupDialog();
}

/**
 * create the group via db call and take the groupid from the db to create
 * the HTML element with the groupid
 */
function createGroup(){
    self.debugLog("create Group");
    if(self.newGroupField.attr('value')!=""){
        GROUPDB.isGroupnameValid(self.newGroupField.attr('value'),function(valid){
            if(valid){
                GROUPDB.saveGroup(self.newGroupField.attr('value'),self.newDescription.val(),OC.currentUser,function(resultGroupid){
                    self.grouplist.append(self.createLiElement(resultGroupid,self.newGroupField.attr('value'),true));
                    self.debugLog("create group "+self.newGroupField.attr('value'));
                });
                /*
                var resultGroupid=GROUPDB.saveGroup(self.newGroupField.attr('value'),new Array(new Array(OC.currentUser,true)),self.newDescription.val(),OC.currentUser);
                self.grouplist.append(self.createLiElement(resultGroupid,self.newGroupField.attr('value'),true));
                self.debugLog("create group "+self.newGroupField.attr('value'));
                */
            }else{
                self.displayNotValid();
            }
        });
    }
}

/**
 * call the translation function of owncloud (core/js/js.js
 * @param string message to translate, it have been in the l10n/*.php files
 * @return string returns the translated string
 */
function translate(msg){
    return t('groupmanager',msg);
}

/**
 * add a group to the leftcontent
 * @param Group group need a groupobject
 */
function addGroup(group){
    self.grouplist.append(self.createLiElement(group.getGroupid(),group.getGroupname(),group.isUserAdmin(OC.currentUser)));
}

/**
 * create a li element for the leftcontent
 * @param int gid of the group
 * @param string groupname which should be displayed
 * @return li object
 */
function createLiElement(gid,groupname,admin){
    var newLiElement = $('<li>');
    var newTextField = $('<textfield>');
    newTextField.text(groupname);
    if(admin){
        var removeIcon = $('<a>');
        removeIcon.addClass("svg");
        removeIcon.addClass("delete");
        removeIcon.addClass("action");
        removeIcon.attr('original-title',translate('Delete'));
        removeIcon.click(function(){
            //TODO ask if you are sure
            self.removeGroup(gid,newLiElement);
        });    
        newLiElement.append(removeIcon);
    }
    newLiElement.append(newTextField);
    newLiElement.attr('id',gid);
    newLiElement.addClass("group");
    newLiElement.click(function(){
        self.selectGroup(newLiElement);
        self.loadGroup(gid);
    });
    return newLiElement;
}

/**
 * activate the li element and deactivate all others
 * @param object element the li element which should be activate
 */
function selectGroup(element){
    var activeElements = self.grouplist.find('.active');
    activeElements.removeClass('active');
    element.addClass('active');
    self.debugLog("activate "+element.attr('id'));
    self.displayRightContent();
}

/**
 * get the selected group
 * @return Group object of the selected Group
function getSelectedGroup(){
//TODO think think think
    console.log("mist");
    return GROUPDB.getGroupWithId(self.grouplist.find('.active').attr('id'));
}
 */
/**
 * get the selected group
 * @return Group object of the selected Group
 */
function getSelectedGroupid(){
    return self.grouplist.find('.active').attr('id');
}

/**
 * load a group with the gid into the rightcontent
 * @param int gid groupid which should be loaded at the right side
 */
function loadGroup(gid){
    GROUPDB.getGroupWithId(self.getSelectedGroupid(),function(group){
        self.clearRightContent();
        self.debugLog("load group "+gid);
        if(group!=null){
            var memberList=group.getListOfMembers();
            self.debugLog("memberlist size? "+memberList.length);
            for(var i=0;i<memberList.length;i++){
                GROUPDB.getUser(memberList[i][0],function(member){
                    if(member!=null){
                        self.debugLog("add user "+member.uid+" to group "+group.getGroupname());
                        self.addMember(member.uid,group.isUserAdmin(member.uid),group.isUserAdmin(OC.currentUser));
                    }
                });
            /*
                var member = GROUPDB.getUser(memberList[i][0]);
                if(member!=null){
                    self.debugLog("add user "+member.uid+" to group "+group.getGroupname());
                    self.addMember(member.uid,group.isUserAdmin(member.uid),group.isUserAdmin(OC.currentUser));
                }
            */
            }
            self.groupdescription.val(group.getDescription());
            if(group!=null&&group.isUserAdmin(OC.currentUser)){
                self.groupdescriptionsave.click(function(){
                    self.saveDescription(group.getGroupid());
                });
                self.groupdescription.removeAttr('readonly');
                self.groupdescriptionsave.removeAttr('disabled');
            }else{
                self.groupdescription.attr('readonly','readonly');
                self.groupdescriptionsave.attr('disabled', 'disabled');
            }
        }
    });
}

/**
 * clear rightContent (memberlist and description)
 */
function clearRightContent(){
    self.memberlist.find(".member").remove();
    self.groupdescription.val("");
}

/**
 * check if groupname is not taken
 * @param string characters of the groupname
 * @return boolean true if the groupname is valid
 */
/*
function checkGroupname(groupname){
    self.notifyGroupCreation(self.CHECKING);
    GROUPDB.isGroupnameValid(groupname,function(valid){
        if(valid){
            self.notifyGroupCreation(self.OK);
            return true;        
        }else{
            self.notifyGroupCreation(self.NOTVALID);
            return false;
        }
    });
    /*
    var valid=GROUPDB.isGroupnameValid(groupname);
    if(valid){
        self.notifyGroupCreation(self.OK);
        return true;        
    }else{
        self.notifyGroupCreation(self.NOTVALID);
        return false;
    }
}
*/

/**
 * get users that matches the string in the userSearchResult field
 * @param string characters of the username
 */
function getUsers(username){
    //remove all child elements with the class userBox
    GROUPDB.getUsersWith(username,function(userList){
        self.userSearchResult.children(".userBox").remove();
        for(var i = 0;i<userList.length&&i<=6;i++){
            if(i>=6){
                var moreUser = $('<textfield>');
                moreUser.text("to many users...");
                moreUser.addClass("userBox");
                self.userSearchResult.append(moreUser);
            }else{
                self.userSearchResult.append(createUser(userList[i].uid,userList[i].displayname));
            }
        }
    });
    /*
    var userList = GROUPDB.getUsersWith(username);
    self.userSearchResult.children(".userBox").remove();
    for(var i = 0;i<userList.length&&i<=6;i++){
        if(i>=6){
            var moreUser = $('<textfield>');
            moreUser.text("to many users...");
            moreUser.addClass("userBox");
            self.userSearchResult.append(moreUser);
        }else{
            self.userSearchResult.append(createUser(userList[i].uid,userList[i].displayname));
        }
    }
    */
}

/**
 * create a HTML textfield with id and name of the user
 * @param int uid of the user
 * @param string name of the user which should be displayed
 * @return textfield object
 */
function createUser(uid,name){
    var newTextField = $('<textfield>');
    newTextField.attr('id',uid);
    newTextField.text(name);
    newTextField.addClass("userBox");
    newTextField.click(function(){
        GROUPDB.getGroupWithId(self.getSelectedGroupid(),function(group){
            if(group.isUserAdmin(OC.currentUser)){
                self.addMember(uid,false,true);
                if(group.isMember(uid)){
                    //TODO
                    alert("user is already member of this group");
                }else{
                    GROUPDB.addMember(group.getGroupid(),uid,false);
                }
            }
        });
    });
    return newTextField;
}

/**
 *
 */
function modifyMember(uid,permission){
    GROUPDB.modifyMember(self.getSelectedGroupid(),uid,permission);
}

/**
 * TODO permission checking and should the user have the permission to remove himself?
 * create a HTML table row with the given parameters
 * @param int uid userid
 * @param string name which should be displayed
 * @param bool admin if the user have the permission to change and delete members
 * @param bool adminPermission if the current user have the permission to change group preferences
 */
function createMember(uid,name,admin,adminPermission){
    var newRow = $('<tr>');
    
    //cell for name
    var cellName = $('<td>');
    cellName.addClass("name");
    cellName.addClass("ui-draggable");
    cellName.text(name);
    
    //cell for email address
    /* TODO remove
    var cellEmail = $('<td>');
    cellEmail.addClass("email");
    cellEmail.text(email);
    */
    
    //cell for admin status
    //TODO action if it change and if the user have the permission to change it
    var cellAdmin = $('<td>');
    cellAdmin.addClass("actions");
    cellAdmin.addClass("admin");
    var adminCheckbox = $('<input>');
    adminCheckbox.addClass("toggle");
    adminCheckbox.attr('type','checkbox');
    if(admin){
        adminCheckbox.attr('checked','checked');
    }
    if(!adminPermission){
        adminCheckbox.attr('disabled','disabled');
    }else{
        adminCheckbox.click(function(){
            if($(this).is(':checked')) {
                self.modifyMember(uid,true);
            }else{
                //only take admin permission if there is another admin,
                //because someone must be the last admin
                self.debugLog("count admins: "+self.memberlist.find('input:checked').length);
                if(self.memberlist.find('input:checked').length>=1){
                    self.modifyMember(uid,false);
                }else{
                    $(this).attr('checked','checked');
                }
            }
        });
    }
    cellAdmin.append(adminCheckbox);
    
    //cell for the delete action
    var cellDelete = $('<td>');
    if(adminPermission){
        var removeIcon = $('<a>');
        removeIcon.addClass("svg");
        removeIcon.addClass("delete");
        removeIcon.addClass("action");
        removeIcon.attr('original-title',translate('Delete'));
        removeIcon.click(function(){
            self.removeMember(uid,newRow);
        });
        cellDelete.append(removeIcon);
    }       
    newRow.append(cellName);
    /*TODO newRow.append(cellEmail);*/
    newRow.append(cellAdmin);
    newRow.append(cellDelete);
    newRow.addClass("member");
    newRow.attr('style',"display:table-row;");
    newRow.attr('id',uid);
    return newRow;
}

/**
 * add a user as member to the group
 * @param int uid of the user
 * @param bool admin true if the user have admin privileges
 * @param bool adminPermission did the current user have the permission to change the group preferences
 */
function addMember(uid,admin,adminPermission){
    GROUPDB.getUser(uid,function(member){
        var tbody = self.memberlist.children('tbody');
        if(tbody.find('#'+uid).length<1){
            tbody.append(self.createMember(member.uid,member.displayname,admin,adminPermission));
        }
    });
/*
    var member = GROUPDB.getUser(uid);
    var tbody = self.memberlist.children('tbody');
    if(tbody.find('#'+uid).length<1){
        tbody.append(self.createMember(member.uid,member.displayname,member.email,admin,adminPermission));
    }
*/
}

/**
 * save the modified description text to db
 * @param int gid the group id
 */
function saveDescription(gid){
    self.debugLog(self.groupdescription.val());
    GROUPDB.saveDescription(gid,self.groupdescription.val());
}

/**
 * expand/roll out the description of the group
 */
function expand(){
    self.expandPic.attr('src',OC.imagePath('core','actions/triangle-s.png'));
    self.expandDescription.height(self.expandDescription.height()+self.groupdescription.height()+self.groupdescriptionsave.height()+50);
    self.modDescription.removeClass('hidden');
}

/**
 * contract/rolling in the description of the group
 */
function contract(){
    self.expandPic.attr('src',OC.imagePath('core','actions/triangle-n.png'));
    self.expandDescription.height(self.expandPic.height());
    self.modDescription.addClass('hidden');    
}

/**
 * get groups from this user and add these groups to the leftcontent
 */
function getGroups(){
    GROUPDB.getGroups(OC.currentUser,function(list){
        if(list!=null){
            //TODO print init page on right side?
            for(var i=0;i<list.length;i++){
                self.addGroup(list[i]);
                self.debugLog("add group "+list[i].getGroupname());
            }
        }
    });
/*
    var list=GROUPDB.getGroups(OC.currentUser);
    for(var i=0;i<list.length;i++){
        self.addGroup(list[i]);
        self.debugLog("add group "+list[i].getGroupname());
    }
*/
}

/**
 * add top content actions
 */
function topContent(){
    self.newGroupButton.click(function(){
        self.newGroup();
        self.debugLog("show newGroup");
        
        self.displayNewGroupDialog();
    });
    self.newGroupField.keyup(function(event){
        if(event.which==KEY_ENTER){
            self.createGroup();
        }else{
            self.notifyGroupCreation(self.CHECKING);
            GROUPDB.isGroupnameValid(self.newGroupField.attr('value'),function(valid){
                if(valid){
                    self.notifyGroupCreation(self.OK);
                }else{
                    self.notifyGroupCreation(self.NOTVALID);
                }
            });
        /*
            self.checkGroupname(self.newGroupField.attr('value'));
        */
        }
    });
    //text disappear if user click into that field
    self.newGroupField.click(function(){
        self.newGroupField.attr('value','');
    });
    //cancle button fade out the new group dialog
    self.newGroupCancle.click(function(){
        self.hideNewGroupDialog();
    });
    self.newGroupOk.click(function(){
        self.createGroup();
        self.hideNewGroupDialog();
    });
}

/**
 * add left content actions
 */

function leftContent(){
    getGroups();
}

/**
 * add right content actions
 */
function rightContent(){
    self.userSearchInput.keyup(function(event){
        console.log(self.userSearchInput.attr('value'));
        self.getUsers(self.userSearchInput.attr('value'));
    });
    //text disappear if user click into that field
    self.userSearchInput.click(function(){
        self.userSearchInput.attr('value','');
    });
    self.expandPic.attr('src',OC.imagePath('core','actions/triangle-n.png'));
    self.expandPic.attr('value','close');
    self.expandDescription.height(self.expandPic.height()+16);
    self.expandPic.click(function(){
        if(self.expandPic.attr('value')=='close'){
            self.expand();
            self.expandPic.attr('value','open');
        }else{     
            self.contract();
            self.expandPic.attr('value','close');
        }
    });    
}

/**
 * define all actions for the buttons and textfields etc.
 */
function regActions(){
    topContent();
    leftContent();
    rightContent();
}

$(document).ready(function () {
    // be sure that all routes from /appinfo/routes.php are loaded
	OC.Router.registerLoadedCallback(function(){
	   init();
	   hideRightContent();
	   GROUPDB.init();
	   self.debugLog("start groupmanager");
	   regActions();
    });
});

