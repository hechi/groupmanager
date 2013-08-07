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

/*********** STATUS-FLAGS for notification of creating process ***********/
var ERROR = -2;     // an error appears
var NOTVALID = -1;   // groupname is not valid
var OK = 1;         // every thing is okay groupname is valid
var CHECKING = 2;    // checking if groupname is not taken

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
 * @param status flag, see on the head of this file
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

function displayFail(){
    self.notifyCreation.removeClass("hidden");
    self.notifyCreation.attr("src",OC.imagePath('core','loading.gif'));
    self.notifyCreation.attr("alt","loading...");
}

function displayOk(){
    self.notifyCreation.removeClass("hidden");
    self.notifyCreation.attr("src",OC.imagePath('core','actions/add.png'));
    self.notifyCreation.attr("alt","loading...");
}

function displayLoading(){
    self.notifyCreation.removeClass("hidden");
    self.notifyCreation.attr("src",OC.imagePath('core','loading.gif'));
    self.notifyCreation.attr("alt","loading...");
}

function hideNotify(){
    self.notifyCreation.addClass("hidden");
}

function debugLog(msg){
    console.log("Groupmanager: "+msg);
}

// define all actions for the buttons and textfields etc.
function regActions(){
    self.newGroupButton.click(function(){
        self.newGroupButton.addClass("hidden");
        self.newGroupButton.removeClass("button");
        self.newGroupField.removeClass("hidden");
        self.notifyGroupCreation(self.CHECKING);
        self.notifyGroupCreation(self.ERROR);
    });
    
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
}

$(document).ready(function () {
    // be sure that all routes from /appinfo/routes.php are loaded
	OC.Router.registerLoadedCallback(function(){
	   console.log("blub");
	   init();
	   regActions();
    });
});

