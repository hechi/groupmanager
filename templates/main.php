<!-- head panel to create new groups -->
<div class="controls">
	<button id="newGroupButton" class="button">{{trans('New Group')}}</button>
    <div id="expandNewGroup" class="hidden">
	    <input id="newGroupField" class="addGroup" type="text" tabindex="0" value="{{trans('Groupname')}}"></input>
	    <img id="notifyCreation" class="hidden addGroup" alt="NotifyError" ></img>
	    <textfield  id="newGroupText" class="addGroup">{{trans('please enter a new group name')}}</textfield>
	    <br>
        <textarea id="newDescription" class="addGroup" cols="10" rows="1" >{{trans('Description')}}</textarea>
        <br>
        <button id="newGroupOk" class="button addGroup" >{{trans('Ok')}}</button><button id="newGroupCancle" class="button" >{{trans('Cancle')}}</button>
    </div>
</div>
<!-- the left list of groups, where the user is member of -->
<ul id="grouplist" class="hascontrols">
    <!-- filled by the /js/app.js -->
    <!-- TODO REMOVE
    <li class="group">
        <textfield>Testgroup 1</textfield>
        <a href="#" class="svg delete action" original-title="{{trans('Delete')}}"></a>
    </li>
    <li class="group">
        <textfield>Testgroup 2</textfield>
        <a href="#" class="svg delete action" original-title="{{trans('Delete')}}"></a>
    </li>
    -->
</ul>
<!-- content of the activated group -->
<div id="rightcontent" class="hidden">
	<!-- filled by the /js/app.js -->
	<div id="userSearchResult" class="userSearch">
	    <input id="userSearchInput" class=" svg" value="{{trans('Search Users')}}" type="search"/></input>
	</div>
	<div id="expandDescription">
	    <img id="expandPic" class="action" alt="{{trans('expand for description')}}"/>
	    <textarea id="groupdescription" class="modDescription hidden" cols="100" rows="1">{{trans('Description')}}</textarea>
	    <button id="groupdescriptionsave" class="modDescription hidden">{{trans('Save')}}</button>
	</div>
	<table id="memberlist">
        <thead>
            <tr id="groupHeader">
                <td class="name">{{trans('Name')}}</td>
                <td class="info email">{{trans('Email')}}</td>
                <td class="actions">{{trans('Admin')}}</td>
                <td class="actions">{{trans('Delete')}}</td>
            </tr>
        </thead>
        <tbody>
            <!-- TODO REMOVE
            <tr class="member" style="display: table-row;">
                <td class="name ui-draggable">Member 1</td>
                <td class="email">Member1@email.com</td>
                <td class="actions admin"><input type="checkbox" class="toggle" checked="checked" disabled="disabled" ></input></td>
                <td class="actions delete"><a href="#" class="svg delete action" original-title="{{trans('Delete')}}"></a></td>
            </tr>
            <tr class="member" style="display: table-row;">
                <td class="name ui-draggable">Member 2</td>
                <td class="email">Member2@email.com</td>
                <td class="actions admin"><input type="checkbox" class="toggle" checked="checked" disabled="disabled" ></input></td>
                <td class="actions delete"><a href="#" class="svg delete action" original-title="{{trans('Delete')}}"></a></td>
            </tr>
            -->
        </tbody>
    </table>
</div>
