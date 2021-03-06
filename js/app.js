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
var rightcontent;
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
var newDescription;
var start;

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
    self.rightcontent=$("#right");
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
    self.start=$("#start");
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
            displayError("Error is appeared");
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
            displayError("Groupcreation error");
            debugLog("groupcreation error");
    }
}

/**
 * display a dialog to say there is an error
 * @param string msg which should be displayed for the user
 */
function displayError(msg){
    OC.dialogs.alert(msg+" please check logs or contact your systemadministrator.",t('groupmanager','Error'));
    debugLog(msg);
}

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
            self.displayError("You dont have the permission to delete this group");
        }
    });
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
                    // tipsy does not remove
                    $(document).find('.tipsy').hide();
                    element.remove();
                }
            });
        }else{
            self.displayError("Can not remove all admin members");
        }
    }else{
        self.displayError("Can not remove all members");
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
                GROUPDB.saveGroup(self.newGroupField.attr('value'),self.newDescription.val(),function(resultGroupid){
                    self.grouplist.append(self.createLiElement(resultGroupid,self.newGroupField.attr('value'),true));
                    self.debugLog("create group "+self.newGroupField.attr('value'));
                });
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
            OCdialogs.confirm(translate('Delete this group. Are you sure?'),translate('delete group'),function(result){
                if(result){
                    self.removeGroup(gid,newLiElement);
                }
            });
        });    
        newLiElement.append(removeIcon);
    }
    newLiElement.append(newTextField);
    newLiElement.attr('id',gid);
    newLiElement.addClass("group");
    newLiElement.click(function(){
        self.selectGroup(newLiElement);
        self.loadGroup(gid);
        self.hideStartpage();
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
                        self.addMember(member.uid,member.displayname,group.isUserAdmin(member.uid),group.isUserAdmin(OC.currentUser));
                    }
                });
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
                self.addMember(uid,name,false,true);
                if(group.isMember(uid)){
                    self.displayError("User is already member of this group");
                }else{
                    GROUPDB.addMember(group.getGroupid(),uid,function(result){
                        if(result){
                            self.debugLog("add user:"+uid+" to group "+group.getGroupid()+" was successful");
                        }else{
                            self.debugLog("add user error");
                        }
                    });
                }
            }
        });
    });
    return newTextField;
}

/**
 * modifiy a member from the active group with the given permission
 * @param string username
 * @param bool new permission, true if comes a admin, otherwise false
 */
function modifyMember(uid,permission){
    GROUPDB.modifyMember(self.getSelectedGroupid(),uid,permission,function(result){
        if(result){
            self.debugLog("modify user:"+uid+" new permission "+permission+" was successful");
        }else{
            self.debugLog("modify error");
        }
    });
}

/**
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
    
    //cell for admin status
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
 * @param string displayname of user
 * @param bool admin true if the user have admin privileges
 * @param bool adminPermission did the current user have the permission to change the group preferences
 */
function addMember(uid,displayname,admin,adminPermission){
    var tbody = self.memberlist.children('tbody');
    if(tbody.find('#'+uid).length<1){
        tbody.append(self.createMember(uid,displayname,admin,adminPermission));
    }   
    /*
    GROUPDB.getUser(uid,function(member){
        var tbody = self.memberlist.children('tbody');
        if(tbody.find('#'+uid).length<1){
            tbody.append(self.createMember(member.uid,member.displayname,admin,adminPermission));
        }
    });
    */
}

/**
 * save the modified description text to db
 * @param int gid the group id
 */
function saveDescription(gid){
    self.debugLog(self.groupdescription.val());
    GROUPDB.saveDescription(gid,self.groupdescription.val(),function(result){
        if(result){
            self.debugLog("save new description to group "+gid+" was successful");
        }else{
            self.debugLog("save description error");
        }
    });
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
    GROUPDB.getGroups(function(list){
        if(list!=null){
            //print initialpage
            self.showStartpage();
            for(var i=0;i<list.length;i++){
                self.addGroup(list[i]);
                self.debugLog("add group "+list[i].getGroupname());
            }
        }
    });
}

/**
 * register autocompletion on the inputfield
 */
function registerSearchInput(){
    self.debugLog("register search action");
    self.userSearchInput.autocomplete({minLength: 1, 
            source: function(search, response) {
                    GROUPDB.getUsersWith(search.term,function(userList){
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
                        response(userList);
                    });
            },
            focus: function(event, focused) {
                event.preventDefault();
            },
            select: function(event, selected) {
                event.stopPropagation();
                return false;
            }}).data('ui-autocomplete')._renderItem = function(ul, item){/*no dropdown menue*/};
}

/**
 * get image and add it to the start page
 */
function initStartpage(){
    var img = $('<img>');
    img.attr('src',OC.imagePath('groupmanager','groupmanager.svg'));
    img.attr('width','50%');
    self.start.append(img);
}

/**
 * show startpage
 */
function showStartpage(){
    self.start.removeClass('hidden');
}

/**
 * hide startpage
 */
function hideStartpage(){
    self.start.addClass('hidden');
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
        }
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
    initStartpage();
    getGroups();
}

/**
 * add right content actions
 */
function rightContent(){
    self.registerSearchInput();
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
    showStartpage();  
}

/**
 * define all actions for the buttons and textfields etc.
 */
function regActions(){
    topContent();
    leftContent();
    rightContent();
}

/**
 * start modifieing
 */
$(document).ready(function () {
    // be sure that all routes from /appinfo/routes.php are loaded
	OC.Router.registerLoadedCallback(function(){
	   init();
	   hideRightContent();
	   self.debugLog("start groupmanager");
	   regActions();
    });
});

