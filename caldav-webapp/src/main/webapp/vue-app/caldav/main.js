/*
 * Copyright (C) 2023 eXo Platform SAS.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import './initComponents.js';
import * as agendaCaldavService from './js/agendaCaldavService.js';
import caldavConnector from './caldav-connector/caldavConnector.js';

extensionRegistry.registerExtension('agenda', 'connectors', caldavConnector);
document.dispatchEvent(new CustomEvent('agenda-connectors-refresh'));

if (!Vue.prototype.$agendaCaldavService) {
  window.Object.defineProperty(Vue.prototype, '$agendaCaldavService', {
    value: agendaCaldavService,
  });
}

// getting language of the PLF
const lang = eXo.env.portal.language || 'en';
// init Vue app when locale resources are ready
const url = `${eXo.env.portal.context}/${eXo.env.portal.rest}/i18n/bundle/locale.portlet.Caldav-${lang}.json`;

const vuetify = new Vuetify(eXo.env.portal.vuetifyPreset);
if (extensionRegistry) {
  const components = extensionRegistry.loadComponents('CaldavAgendaConnectors');
  if (components && components.length > 0) {
    components.forEach(cmp => {
      Vue.component(cmp.componentName, cmp.componentOptions);
    });
  }
}
const appId = 'CaldavApplication';

export function init() {
  exoi18n.loadLanguageAsync(lang, url).then(i18n => {

    // init Vue app when locale resources are ready
    Vue.createApp({
      template: `<caldav-agenda-connectors id="${appId}" />`,
      vuetify,
      i18n
    }, `#${appId}`, 'Caldav connector Settings');
  });
}

Vue.use(Vuetify);