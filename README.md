# caldav-integration

This addon is a calendar connector for eXo Platform allowing to read events in a caldav server and display it in eXo. 
It also allow to send event from eXo to the caldav server.

## How to configure

Availables properties are :

- exo.agenda.caldav.connector.enabled : true/false (Default true)
- exo.agenda.caldav.connector.url : the url of the caldav server. There is no default value. As some caldav provider need the username inside the caldav url, the url can be set like this : 

`exo.agenda.caldav.connector.url=http://www.myserver.com/webdav/calendar/`

or
`exo.agenda.caldav.connector.url=http://localhost/dav.php/calendars/{username}/`

If exists, {username} will be replaced by the user username to call caldav API. 


