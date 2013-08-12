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

/**
 * call the translation function of owncloud (core/js/js.js
 * @param string message to translate, it have been in the l10n/*.php files
 * @return string returns the translated string
 */

var self;
var notificationMod;
var headText;
var groupIdentifierText;
var groupUniqueCheckBox;
var autocompletionText;
var autocompletionCheckBox;
var save;

/*********** STATUS-FLAGS for notification ***********/
var ERROR = -1;
var OK = 1;

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
 * call the translation function of owncloud (core/js/js.js
 * @param string message to translate, it have been in the l10n/*.php files
 * @return string returns the translated string
 */
function translate(msg){
    return t('groupmanager',msg);
}

/**
 * TODO
 */
function loadSettings(){
    self.getJsonQuery("getSettings",null,function(result){
        if(result.uniqueGroup == true){
            self.groupUniqueCheckBox.attr('checked','checked');
        }else{
            self.groupUniqueCheckBox.removeAttr('checked');
        }
        if(result.autocomp == true){
            self.autocompletionCheckBox.attr('checked','checked');
        }else{
            self.autocompletionCheckBox.removeAttr('checked');
        }
    });
}

/**
 * TODO
 */
function saveSettings(ug,ac){
    self.getJsonQuery("saveSettings",{uniqueGroup:ug,autocomp:ac},function(result){
        console.log(result);
        if(result.res == true){
            self.notification(self.OK);
        }else{
            self.notification(self.ERROR);
        }
    });
}

/**
 * TODO
 */
function notification(flag){
    switch(flag){
        case ERROR:
            displayError(self.translate("Settings were NOT saved"));
            break;
        case OK:
            displayOk();
            break;
        default: 
            debugLog("save settings error");
    }
}

/**
 * TODO
 */
function displayError(msg){
    self.notificationMod.text(msg);
}

/**
 * TODO
 */
function displayOk(){
    self.notificationMod.text(self.translate("Settings have been saved"));
}

function actions(){
    self.save.click(function(){
        self.saveSettings(self.groupUniqueCheckBox.is(':checked'),self.autocompletionCheckBox.is(':checked'));
        console.log("Settings: unique "+self.groupUniqueCheckBox.is(':checked'));
        console.log("Settings: autocomp "+self.autocompletionCheckBox.is(':checked'));
    });
}

/**
 * TODO
 */
function init(){
    this.self = this;
    self.headText = $("#headText");
    self.notificationMod = $("#notificationMod");
    self.groupIdentifierText = $("#groupIdentifierText");
    self.groupUniqueCheckBox = $("#groupUniqueCheckBox");
    self.autocompletionText = $("#autocompletionText");
    self.autocompletionCheckBox = $("#autocompletionCheckBox");
    self.save = $("#save");
    self.fillWithText();
}

/**
 * TODO
 */
function fillWithText(){
    self.headText.text(self.translate("Groupmanager"));
    self.groupIdentifierText.text(self.translate("Unique groupidentifier"));
    self.autocompletionText.text(self.translate("Autocompletion"));
    self.save.text(self.translate("Save"));
}

$(document).ready(function () {
    // be sure that all routes from /appinfo/routes.php are loaded
	OC.Router.registerLoadedCallback(function(){
        init(); 
        loadSettings();
        actions();   
	});
});
