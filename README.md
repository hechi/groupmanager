README
======

**This is under development, please dont use it on a productive server!**
*Tested on Owncloud master (77596ace816d1c5805a1d71e4603d4849099822b) and Owncloud 5.0.10 with appframework 0.102*

Description:
------------

The groupmanager app allows users to manage there own groups. They dont have to
be admins.

**Advantage for Admins**
- less administration
- turn off and on autocompletions while searching usernames in the app (for data protection)

**Advantage for Users**
- create/delete groups
- add/remove members to groups
- describe what the groups are for
- set administration privileges for members, so they can modify the group as well 
  (not on the hole owncloud)
  
Dependencies:
-------------

The groupmanager uses the appframework. So you have to enable it first.

Maintainers:
------------

- [Andreas Hechenberger](https://github.com/hechi)

Developer setup:
----------------
- clone latest appframework

```bash
git clone git@github.com:owncloud/appframework.git
```
- clone this repository 

```bash
git clone git@github.com:hechi/groupmanager.git
```
- link both into your *owncloud/apps/* directory

```bash
ln -s /path/to/appframework appframework
ln -s /path/to/groupmanager groupmanager
```
- enable the appframework via app settings in owncloud
- enable the groupmanager via app settings in owncloud

