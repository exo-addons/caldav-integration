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
  initialized: false,
  isSignedIn: true,
  pushing: false,
  rank: 40,
  serverUrl: '',
  connect() {
    return new Promise((resolve, reject) => {
      document.dispatchEvent(new CustomEvent('open-caldav-connector-settings-drawer'));
      document.addEventListener('test-connection', (settings) => {
        if (settings.detail) {
          resolve('connection success');
        } else {
          reject('connection canceled');
        }
      });
    });
  },
  init(connector) {
    if (this.initialized) {
      return;
    }
    this.serverUrl = connector.serverUrl;
    this.initialized = true;
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
    const calendars = await clientCaldav.fetchCalendars();
    return calendars[0];
  },
  async retrieveEvents(settings, periodStartDate, periodEndDate) {
    const clientCaldav = await tsdav.createDAVClient({
      serverUrl: this.serverUrl,
      credentials: {
        username: settings.username,
        password: settings.password,
      },
      authMethod: 'Basic',
      defaultAccountType: 'caldav',
    });
    //get calendar
    const calendar = await this.getCalendar(clientCaldav);
    const events = await clientCaldav.fetchCalendarObjects({
      calendar,
      expand: true,
      timeRange: {
        start: periodStartDate,
        end: periodEndDate,
      }
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
        caldavEvent.start= startDate && new Date(startDate[0].jCal[3]);
        caldavEvent.end= endDate && new Date(endDate[0].jCal[3]);
        caldavEvent.etag= event.etag;
        listEvent.push(caldavEvent);
      } else {
        return Promise.all(null);
      }

    });
    return listEvent;
  }
};
