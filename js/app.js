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
// this jsonstring can be used in an php document to parse it into an array
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
    if(self.checkGroupname()){
        self.grouplist.append(self.createLiElement(self.newGroupField.attr('value')));
        self.debugLog("create group "+self.newGroupField.attr('value'));
    }else{
        self.displayFail();
    }
}

/**
 * call the translation function of owncloud (core/js/js.js
 * return string returns the translated string
 */
function translate(msg){
    return t('groupmanager',msg);
}

/**
 *
 */
 //<a href="#" class="svg delete action" original-title="{{trans('Delete')}}"></a>
function createLiElement(groupname){
    var newLiElement = $('<li>');
    var newTextField = $('<textfield>');
    var removeIcon = $('<a>');
    newTextField.text(groupname);
    removeIcon.addClass("svg");
    removeIcon.addClass("delete");
    removeIcon.addClass("action");
    removeIcon.attr('original-title',translate('Delete'));
    newLiElement.append(newTextField);
    newLiElement.append(removeIcon);
    newLiElement.addClass("group");
    return newLiElement;
}

/**
 * check if groupname is not taken
 * @return boolean true if the groupname is valid
 */
function checkGroupname(){
    self.notifyGroupCreation(self.CHECKING);
    self.notifyGroupCreation(self.OK);
    return true;
}

function topContent(){
    self.newGroupButton.click(function(){
        self.newGroup();
    });
    self.newGroupField.keypress(function(event){
        if(event.which==KEY_ENTER){
            self.createGroup();
        }else{
            self.checkGroupname();
        }
    });
}

function leftContent(){

}

function rightContent(){

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

