# caldav-integration

This addon is a calendar connector for eXo Platform allowing to read events in a caldav server and display it in eXo. 
It also allow to send event from eXo to the caldav server.
## How to install
Launch this commands :
```
cd ${EXO_HOME}
./addon install exo-caldav-integration
```

## How to configure

Availables properties are :

- exo.agenda.caldav.connector.enabled : true/false (Default true)
- exo.agenda.caldav.connector.url : the url of the caldav server. There is no default value. As some caldav provider need the username inside the caldav url, the url can be set like this : 

`exo.agenda.caldav.connector.url=http://www.myserver.com/webdav/calendar/`

or
`exo.agenda.caldav.connector.url=http://localhost/dav.php/calendars/{username}/`

If exists, {username} will be replaced by the user username to call caldav API. 

## Certificate
To allow eXo to communicate with GPLI server, you need to add the GLPI Server ssh certificate in the java truststore of eXo Server :

- Get the Glpi server certificate : `glpi.cer`
- On eXo Server, type this command (adapt the path of the java keystore)

```
keytool -import -alias glpi -keystore $JAVA_HOME/jre/lib/security/cacerts -file glpi.cer
``` 

## Validated providers
The following providers was tested and validated with this caldav-integration addon

04/01/2024 - MDaemon
