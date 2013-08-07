<!-- head panel to create new groups -->
<div id="controls">
	<div class="input" id="inputNewGroup">
	    <button class="button addGroup" id="newGroupButton">{{trans('New Group')}}</button>
	    <input class="hidden addGroup" type="text" tabindex="0" id="newGroupField" value="{{trans('Groupname')}}"></input>
	    <img class="hidden" id="notifyCreation" alt="NotifyError" ></img>
	    <textfield class="hidden addGroup" id="newGroupText">{{trans('please enter a new group name')}}</textfield>
    </div>
</div>
<!-- the left list of groups, where the user is member of -->
<ul id="grouplist" class="hascontrols grouplist">
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
<div id="rightcontent">
	<!-- filled by the /js/app.js -->
	<div id="userSearchResult" class="userSearch">
	    <input id="userSearchInput" class="svg" value="{{trans('Search Users')}}" type="search"/></input>
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
