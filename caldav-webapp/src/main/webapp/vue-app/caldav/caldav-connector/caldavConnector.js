import * as caldavConnectorService from '../js/agendaCaldavService.js';
import * as tsdav from 'tsdav';
import ICAL from 'ical.js';
export default {
  name: 'agenda.caldavCalendar',
  description: 'agenda.caldavCalendar.description',
  avatar: '/caldav/skin/image/caldav.png',
  isOauth: false,
  canConnect: true,
  canPush: true,
  initialized: true,
  isSignedIn: true,
  pushing: false,
  rank: 40,
  connect() {
    return new Promise((resolve, reject) => {
      document.dispatchEvent(new CustomEvent('open-caldav-connector-settings-drawer'));
      document.addEventListener('test-connection', (settings) => {
        if (settings.detail) {
          resolve(settings.detail.username);
        } else {
          reject('connection canceled');
        }
      });
    });
  },
  disconnect() {
    return new Promise((resolve, reject) => {
      return caldavConnectorService.deleteCaldavSetting().then((respStatus) => {
        if (respStatus === 200) {
          return resolve(null);
        }
      }).catch(e => {
        return reject(e);
      });
    });
  },
  getEvents(periodStartDate, periodEndDate) {
    return caldavConnectorService.getCaldavSetting().then((settings)=> {
      return this.retrieveEvents(settings, periodStartDate, periodEndDate);
    });
  },
  async getCalendar(clientCaldav){
    const calendars = await clientCaldav.fetchCalendars({headersToExclude: 'If-None-Match'});
    if (calendars.length === 0) {
      console.error('No calendar found');
      return null;
    } else {
      return calendars[0];
    }
  },
  async retrieveEvents(settings, periodStartDate, periodEndDate) {
    const start = caldavConnectorService.toRFC3339(periodStartDate, false, true);
    const end = caldavConnectorService.toRFC3339(periodEndDate, false, true);
    const clientCaldav = await tsdav.createDAVClient({
      serverUrl: settings.caldavUrl.replace('{username}',settings.username),
      credentials: {
        username: settings.username,
        password: settings.password,
      },
      authMethod: 'Basic',
      defaultAccountType: 'caldav',
    }).catch(() => {
      console.error('cant connect to caldav client check username and password');
    });
    //get calendar
    const calendar = await this.getCalendar(clientCaldav);
    if (!calendar) {
      return Promise.all(null);
    }
    const events = await clientCaldav.fetchCalendarObjects({
      calendar,
      expand: true,
      timeRange: {
        start: start,
        end: end,
      },
      headersToExclude: 'If-None-Match'
    });
    const listEvent = [];
    events.map(event => {
      const caldavEvent= {};
      const data = ICAL.parse(event.data);
      const iCal = new ICAL.Component(data);
      const vEvent = iCal.getFirstSubcomponent('vevent');
      if (vEvent) {
        const startDate = vEvent.getAllProperties('dtstart');
        const endDate = vEvent.getAllProperties('dtend');
        caldavEvent.summary = vEvent.getFirstPropertyValue('summary');
        caldavEvent.uid = vEvent.getFirstPropertyValue('uid');
        caldavEvent.color = '#FFFFFF';
        caldavEvent.type = 'remoteEvent';
        if (startDate && !startDate[0].jCal[3].includes('T')) {
          caldavEvent.allDay=true;
        }
        caldavEvent.start= startDate && new Date(startDate[0].jCal[3]);
        caldavEvent.end= endDate && new Date(endDate[0].jCal[3]);
        caldavEvent.etag= event.etag;
        caldavEvent.url = event.url;
        listEvent.push(caldavEvent);
      } else {
        return Promise.all(null);
      }

    });
    return listEvent;
  },
  pushEvent(event,) {
    return caldavConnectorService.getCaldavSetting().then((settings)=> {
      return this.saveEvent(event, settings);
    });
  },
  deleteEvent(event) {
    this.getEvents(event.startDate,event.endDate).then((events)=> {
      events.forEach((obj) => {
        if (event.id === parseInt(obj.uid)) {
          return caldavConnectorService.getCaldavSetting().then((settings)=> {
            return this.removeEvent(obj, settings);
          });
        }
      });
    });
  },
  async removeEvent(event, settings) {
    const clientCaldav = await tsdav.createDAVClient({
      serverUrl: settings.caldavUrl.replace('{username}',settings.username),
      credentials: {
        username: settings.username,
        password: settings.password,
      },
      authMethod: 'Basic',
      defaultAccountType: 'caldav',
    }).catch(() => {
      console.error('cant connect to caldav client check username and password');
    });
    //get calendar
    const calendar = await this.getCalendar(clientCaldav);
    if (!calendar) {
      return Promise.all(null);
    } else {
      return clientCaldav.deleteCalendarObject({
        calendarObject: {
          url: event.url,
          etag: event.etag,
        },
        headersToExclude: 'If-None-Match'
      });
    }
  },
  async saveEvent(event, settings) {
    const clientCaldav = await tsdav.createDAVClient({
      serverUrl: settings.caldavUrl.replace('{username}',settings.username),
      credentials: {
        username: settings.username,
        password: settings.password,
      },
      authMethod: 'Basic',
      defaultAccountType: 'caldav',
    }).catch(() => {
      console.error('cant connect to caldav client check username and password');
    });
    //get calendar
    const calendar = await this.getCalendar(clientCaldav);
    if (!calendar) {
      return Promise.all(null);
    } else {
      const eventId = event.id;
      let start = event.start.replace(/[-:]/g, '');
      let end = event.end.replace(/[-:]/g, '');
      let iCalString = `BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:${event.summary}
UID:${eventId}
`;
      if (event.allDay) {
        start = start.substring(0,8);
        end = end.substring(0,8);
        iCalString += `DTSTART:${start}
`;
      } else {
        iCalString += `DTSTART:${start}
DTEND:${end}
`;
      }
      if (event.location) {
        iCalString += `LOCATION:${event.location}
`;
      }
      let description = '';
      if (event.description) {
        description += `${event.description.replace('\n','\\n')}\\n`;
      }
      if (event.conferences.length > 0) {
        description += event.conferences[0]?.url;
      }
      if (description !== '') {
        iCalString += `DESCRIPTION:${description}
`;
      }
      if (event.recurrence?.rrule) {
        iCalString += `RRULE:${event.recurrence.rrule}
`;
      }
      iCalString += `END:VEVENT
END:VCALENDAR
`;
      iCalString=iCalString.trim();
      await clientCaldav.createCalendarObject({
        calendar, iCalString, filename: `${eventId}.ics`,headersToExclude: 'If-None-Match'
      });
    }
  }
};
