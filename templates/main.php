<div id="controls">
	<button class="button" id="new">{{trans('New Group')}}</button>
</div>
    <ul id="grouplist" class="hascontrols grouplist">
	    <!-- filled by the /js/app.js -->
	    <li class="group">
            <textfield>Testgroup 1</textfield>
            <a href="#" class="svg delete action" original-title="{{trans('Delete')}}"></a>
        </li>
        <li class="group">
            <textfield>Testgroup 2</textfield>
            <a href="#" class="svg delete action" original-title="{{trans('Delete')}}"></a>
        </li>
    </ul>

<div id="rightcontent">
	<!-- filled by the /js/app.js -->
	<div id="userSearchResult" class="userSearch">
	    <input id="userSearchInput" class="svg" value="{{trans('Search Users')}}" type="search"/></input>
	    <textfield class="userBox">mem1</textfield>
	    <textfield class="userBox">mem2</textfield>
	</div>
	<table id="memberlist">
        <thead>
            <tr id="groupHeader">
                <!--
                <td class="name">
                    <input type="checkbox" class="toggle" title="{{trans('(De-)select all')}}" />
                    <select class="action sort permanent" name="sort" title="{{trans('Sort order')}}">
                    <option value="fn">{{trans('Display name')}}</option>
                    <option value="fl">{{trans('First- Lastname')}}</option>
                    <option value="lf">{{trans('Last-, Firstname')}}</option>
                    </select>
                </td>
                -->
                <td class="name">{{trans('Name')}}</td>
                <td class="info email">{{trans('Email')}}</td>
                <td class="actions">{{trans('Admin')}}</td>
                <td class="actions">{{trans('Delete')}}</td>
            </tr>
        </thead>
        <tbody>
            <tr class="member" style="display: table-row;">
                <td class="name ui-draggable">Member 1</td>
                <td class="email">Member1@email.com</td>
                <td class="actions admin"><input type="checkbox" class="toggle" checked="checked" disabled="disabled" ></option></td>
                <td class="actions delete"><a href="#" class="svg delete action" original-title="{{trans('Delete')}}"></a></td>
            </tr>
            <tr class="member" style="display: table-row;">
                <td class="name ui-draggable">Member 2</td>
                <td class="email">Member2@email.com</td>
                <td class="actions admin"><input type="checkbox" class="toggle" checked="checked" disabled="disabled" ></option></td>
                <td class="actions delete"><a href="#" class="svg delete action" original-title="{{trans('Delete')}}"></a></td>
            </tr>
        </tbody>
    </table>
</div>
