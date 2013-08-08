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

// searialize a list to a jsonstring
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
            displayFail();
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

function displayError(msg){
    OC.dialogs.alert(msg+" please check logs or contact your systemadministrator",t('groupmanager','Error'));
    debugLog(msg);
}

//TODO: find a error sign
function displayFail(){
    self.notifyCreation.removeClass("hidden");
    self.notifyCreation.attr("src",OC.imagePath('core','loading.gif'));
    self.notifyCreation.attr("alt","error");
    self.hideNewGroupText();
}

function displayOk(){
    self.notifyCreation.removeClass("hidden");
    self.notifyCreation.attr("src",OC.imagePath('groupmanager','checkmark.png'));
    self.notifyCreation.attr("alt","groupname is valid");
    self.hideNewGroupText();
}

function displayLoading(){
    self.notifyCreation.removeClass("hidden");
    self.notifyCreation.attr("src",OC.imagePath('core','loading.gif'));
    self.notifyCreation.attr("alt","loading...");
    self.hideNewGroupText();
}

function hideNewGroupText(){
    self.newGroupText.addClass("hidden");
}

/**
 * hide notification image
 */
function hideNotify(){
    self.notifyCreation.addClass("hidden");
}

function displayNewGroupInput(){
    self.newGroupButton.addClass("hidden");
    self.newGroupButton.removeClass("button");
    self.newGroupField.removeClass("hidden");
    self.newGroupText.removeClass("hidden");
}

function debugLog(msg){
    console.log("Groupmanager: "+msg);
}

function removeGroup(id,element){
    //TODO: remove group from db with ID
    element.remove();
}

function removeMember(id,element){
    //TODO: remove member from group on db
    //TODO: check if there is  at least one member left
    element.remove();
}

/**
 * if the button 'New Group' is pressed
 */
function newGroup(){
    self.displayNewGroupInput();
}

/**
 * create group
 * TODO: call pagecontroller
 */
function createGroup(){
    if(self.checkGroupname()&&self.newGroupField.attr('value')!=""){
        self.grouplist.append(self.createLiElement(0,self.newGroupField.attr('value')));
        self.debugLog("create group "+self.newGroupField.attr('value'));
    }else{
        self.displayFail();
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
 * @param int id of the group
 * @param string groupname which should be displayed
 * @return li object
 */
 //<a href="#" class="svg delete action" original-title="{{trans('Delete')}}"></a>
function createLiElement(id,groupname){
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
        self.removeGroup(id,newLiElement);
    });    
    newLiElement.append(newTextField);
    newLiElement.append(removeIcon);
    newLiElement.addClass("group");
    return newLiElement;
}

/**
 *TODO
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
 * get users that matches the string in the userSearchResult field
 * @param string characters of the username
 */
function getUsers(username){
    //TODO get users with the spezial characters form the DB
    //remove alle child elements with the class userBox
    self.userSearchResult.children(".userBox").remove();
    self.userSearchResult.append(createUser(0,"mem1"));
    self.userSearchResult.append(createUser(1,"mem2"));
}

/**
 * create a textfield with id and name of the user
 * @param int id of the user
 * @param string name of the user which should be displayed
 * @return textfield object
 */
function createUser(id,name){
    var newTextField = $('<textfield>');
    newTextField.attr('id',id);
    newTextField.text(name);
    newTextField.addClass("userBox");
    newTextField.click(function(){
        self.addMember(id);
    });
    return newTextField;
}

/**
 * TODO permission checking and should the user have the permission to remove himselfe?
 * create a table row with the given parameters
 * @param int id userid
 * @param string name which should be displayed
 * @param string email address which should be displayed
 * @param boolean if the user have the permission to change and delete members
 */
function createMember(id,name,email,admin){
    var newRow = $('<tr>');
    
    //cell for name
    var cellName = $('<td>');
    cellName.addClass("name");
    cellName.addClass("ui-draggable");
    cellName.text(name);
    
    //cell for emailaddress
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
            alert("remove member "+id);
            self.removeMember(id,newRow);
        });
        cellDelete.append(removeIcon);
    }       
    newRow.append(cellName);
    newRow.append(cellEmail);
    newRow.append(cellAdmin);
    newRow.append(cellDelete);
    newRow.addClass("member");
    newRow.attr('style',"display:table-row;");
    newRow.attr('id',id);
    return newRow;
}

/**
 * add a user as member to the group
 * @param int id of the user
 */
function addMember(id){
    //TODO get member from DB
    //TODO save member to group
    var tbody = self.memberlist.children('tbody');
    //TODO dummy
    tbody.append(self.createMember(0,"mem1","bla@fuu",true));
    tbody.append(self.createMember(1,"memasdf","bla@fuu",false));
}

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

function leftContent(){
}

function rightContent(){
    self.userSearchInput.keypress(function(event){
        //TODO
        self.getUsers(self.userSearchInput.attr('value'));
    });
    //text disappear if user click into that field
    self.userSearchInput.click(function(){
        self.userSearchInput.attr('value','');
    });
}

// define all actions for the buttons and textfields etc.
function regActions(){
    topContent();
    leftContent();
    rightContent();
    
}

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

$(document).ready(function () {
    // be sure that all routes from /appinfo/routes.php are loaded
	OC.Router.registerLoadedCallback(function(){
	   console.log("blub");
	   init();
	   regActions();
    });
});

