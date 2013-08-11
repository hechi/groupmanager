<?php

// define the namespace were the all php classes can be found
namespace OCA\Groupmanager;

// register the app to the appframework
$api = new \OCA\AppFramework\Core\API('groupmanager');

// creates a new GroupBackend
$groupBackend = new \OCA\Groupmanager\Db\GroupmanagerBackend($api);

// register the GroupBackend to Owncloud
\OC_Group::useBackend($groupBackend);

// add the left navigation entry
$api->addNavigationEntry(array(

  // the string under which your app will be referenced in owncloud
  'id' => $api->getAppName(),

  // sorting weight for the navigation. The higher the number, the higher
  // will it be listed in the navigation
  'order' => 10,

  // the route that will be shown on startup
  'href' => $api->linkToRoute('groupmanagerIndex'),

  // the icon that will be shown in the navigation
  // this file needs to exist in img/example.png
  'icon' => $api->imagePath('groupmanager.png'),

  // the title of your application. This will be used in the
  // navigation or on the settings page of your app
  'name' => $api->getTrans()->t('Groupmanager')

));

// register the settings in the admin panel
//$api->registerAdmin('settings');

