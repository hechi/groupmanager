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
    self.newGroupButton=$("#newGroupButton");
    self.newGroupField=$("#newGroupField");
    self.grouplist=$("#grouplist");
    self.userSearchResult=$("#userSearchResult");
    self.userSearchInput=$("#userSearchInput");
    self.memberlist=$("#memberlist");
    self.notifyCreation=$("#notifyCreation");
    self.newGroupText=$("#newGroupText");
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
 * hide newGroup Button, display input field and display description text
 */
function displayNewGroupInput(){
    self.newGroupButton.addClass("hidden");
    self.newGroupButton.removeClass("button");
    self.newGroupField.removeClass("hidden");
    self.newGroupText.removeClass("hidden");
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
    //TODO: remove group from db with ID
    element.remove();
}

/**
 * remove member from group and delete created element where the displayed information
 * are stored on the right side
 * @param int uid member id 
 * @param HTMLobject element a HTML element where the remove method can be called
 */
function removeMember(uid,element){
    //TODO: remove member from group on db
    //TODO: check if there is  at least one member left
    element.remove();
}

/**
 * if the button 'New Group' is pressed display the input field and description
 */
function newGroup(){
    self.displayNewGroupInput();
}

/**
 * create the group via db call and take the groupid from the db to create
 * the HTML element with the groupid
 * TODO: call pagecontroller
 */
function createGroup(){
    if(self.checkGroupname()&&self.newGroupField.attr('value')!=""){
        self.grouplist.append(self.createLiElement(0,self.newGroupField.attr('value')));
        self.debugLog("create group "+self.newGroupField.attr('value'));
    }else{
        self.displayNotValid();
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
 * create a li element for the leftcontent
 * @param int gid of the group
 * @param string groupname which should be displayed
 * @return li object
 */
function createLiElement(gid,groupname){
    var newLiElement = $('<li>');
    var newTextField = $('<textfield>');
    var removeIcon = $('<a>');
    newTextField.text(groupname);
    removeIcon.addClass("svg");
    removeIcon.addClass("delete");
    removeIcon.addClass("action");
    removeIcon.attr('original-title',translate('Delete'));
    removeIcon.click(function(){
        //TODO ask if you are sure
        self.removeGroup(gid,newLiElement);
    });    
    newLiElement.append(newTextField);
    newLiElement.append(removeIcon);
    newLiElement.addClass("group");
    return newLiElement;
}

/**
 * TODO
 * check if groupname is not taken
 * @param string characters of the groupname
 * @return boolean true if the groupname is valid
 */
function checkGroupname(groupname){
    self.notifyGroupCreation(self.CHECKING);
    self.notifyGroupCreation(self.OK);
    return true;
}

/**
 * TODO
 * get users that matches the string in the userSearchResult field
 * @param string characters of the username
 */
function getUsers(username){
    //TODO get users with the special characters form the DB
    //remove all child elements with the class userBox
    self.userSearchResult.children(".userBox").remove();
    self.userSearchResult.append(createUser(0,"mem1"));
    self.userSearchResult.append(createUser(1,"mem2"));
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
        self.addMember(uid);
    });
    return newTextField;
}

/**
 * TODO permission checking and should the user have the permission to remove himself?
 * create a HTML table row with the given parameters
 * @param int uid userid
 * @param string name which should be displayed
 * @param string email address which should be displayed
 * @param boolean if the user have the permission to change and delete members
 */
function createMember(uid,name,email,admin){
    var newRow = $('<tr>');
    
    //cell for name
    var cellName = $('<td>');
    cellName.addClass("name");
    cellName.addClass("ui-draggable");
    cellName.text(name);
    
    //cell for email address
    var cellEmail = $('<td>');
    cellEmail.addClass("email");
    cellEmail.text(email);
    
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
    //TODO check if user have permission to change
    adminCheckbox.attr('disabled','disabled');
    cellAdmin.append(adminCheckbox);
    
    //cell for the delete action
    //TODO add action to delete member of group and check the permission
    var cellDelete = $('<td>');
    if(admin){
        var removeIcon = $('<a>');
        removeIcon.addClass("svg");
        removeIcon.addClass("delete");
        removeIcon.addClass("action");
        removeIcon.attr('original-title',translate('Delete'));
        removeIcon.click(function(){
            //TODO alert box ? alert("remove member "+uid);
            self.removeMember(uid,newRow);
        });
        cellDelete.append(removeIcon);
    }       
    newRow.append(cellName);
    newRow.append(cellEmail);
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
 */
function addMember(uid){
    //TODO get member from DB
    //TODO save member to group
    var tbody = self.memberlist.children('tbody');
    //TODO dummy
    tbody.append(self.createMember(0,"mem1","bla@fuu",true));
    tbody.append(self.createMember(1,"memasdf","bla@fuu",false));
}

/**
 * add top content actions
 */
function topContent(){
    self.newGroupButton.click(function(){
        self.newGroup();
    });
    self.newGroupField.keypress(function(event){
        if(event.which==KEY_ENTER){
            self.createGroup();
        }else{
            self.checkGroupname(self.newGroupField.attr('value'));
        }
    });
    //text disappear if user click into that field
    self.newGroupField.click(function(){
        self.newGroupField.attr('value','');
    });
}

/**
 * add left content actions
 */

function leftContent(){
}

/**
 * add right content actions
 */
function rightContent(){
    self.userSearchInput.keypress(function(event){
        // TODO db query
        self.getUsers(self.userSearchInput.attr('value'));
    });
    //text disappear if user click into that field
    self.userSearchInput.click(function(){
        self.userSearchInput.attr('value','');
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
	   self.debugLog("start groupmanager");
	   init();
	   regActions();
    });
});

