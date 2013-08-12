<!-- head panel to create new groups -->
<div class="controls">
	<button id="newGroupButton" class="button">{{trans('New Group')}}</button>
    <div id="expandNewGroup" class="hidden">
	    <input id="newGroupField" class="addGroup" type="text" tabindex="0" placeholder="{{trans('Groupname')}}"></input>
	    <img id="notifyCreation" class="hidden addGroup" alt="NotifyError" ></img>
	    <textfield  id="newGroupText" class="addGroup">{{trans('please enter a new group name')}}</textfield>
	    <br>
        <textarea id="newDescription" class="addGroup" cols="10" rows="1" placeholder="{{trans('Description')}}" ></textarea>
        <br>
        <button id="newGroupOk" class="button addGroup" >{{trans('Ok')}}</button><button id="newGroupCancle" class="button" >{{trans('Cancle')}}</button>
    </div>
</div>
<!-- the left list of groups, where the user is member of -->
<ul id="grouplist" class="hascontrols">
    <!-- filled by the /js/app.js -->
</ul>
<!-- content of the activated group -->
<div id="rightcontent" class="hidden">
	<div id="userSearchResult" class="userSearch">
	    <input id="userSearchInput" class=" svg" placeholder="{{trans('Search Users')}}" type="search"/></input>
	</div>
	<div id="expandDescription">
	    <img id="expandPic" class="action" alt="{{trans('expand for description')}}"/>
	    <textarea id="groupdescription" class="modDescription hidden" cols="100" rows="1" placeholder="{{trans('Description')}}"></textarea>
	    <button id="groupdescriptionsave" class="modDescription hidden">{{trans('Save')}}</button>
	</div>
	<table id="memberlist">
        <thead>
            <tr id="groupHeader">
                <td class="name">{{trans('Name')}}</td>
                <td class="actions">{{trans('Admin')}}</td>
                <td class="actions">{{trans('Delete')}}</td>
            </tr>
        </thead>
        <tbody>
            <!-- filled by the /js/app.js -->
        </tbody>
    </table>
</div>
