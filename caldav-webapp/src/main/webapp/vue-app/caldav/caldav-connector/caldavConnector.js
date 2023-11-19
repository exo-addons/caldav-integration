import * as caldavConnectorService from '../js/agendaCaldavService.js';
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
  connect(askWriteAccess) {
    if (askWriteAccess) {
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
    }
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
  }
};
