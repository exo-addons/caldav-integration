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
package org.exoplatform.caldav.storage;

import org.exoplatform.caldav.model.CaldavUserSetting;
import org.exoplatform.caldav.utils.CaldavConnectorUtils;
import org.exoplatform.commons.api.settings.SettingService;
import org.exoplatform.commons.api.settings.SettingValue;
import org.exoplatform.commons.api.settings.data.Context;

public class CaldavConnectorStorage {

  private SettingService settingService;

  public CaldavConnectorStorage(SettingService settingService) {
    this.settingService = settingService;
  }

  public void createCaldavSetting(CaldavUserSetting caldavUserSetting, long userIdentityId) {
    String caldavUrl = System.getProperty("exo.agenda.caldav.connector.url");
    String encodedPassword = CaldavConnectorUtils.encode(caldavUserSetting.getPassword());

    this.settingService.set(Context.USER.id(String.valueOf(userIdentityId)),
                            CaldavConnectorUtils.CALDAV_CONNECTOR_SETTING_SCOPE,
                            CaldavConnectorUtils.CALDAV_USERNAME_KEY,
                            SettingValue.create(caldavUserSetting.getUsername()));
    this.settingService.set(Context.USER.id(String.valueOf(userIdentityId)),
                            CaldavConnectorUtils.CALDAV_CONNECTOR_SETTING_SCOPE,
                            CaldavConnectorUtils.CALDAV_PASSWORD_KEY,
                            SettingValue.create(encodedPassword));
    this.settingService.set(Context.USER.id(String.valueOf(userIdentityId)),
                            CaldavConnectorUtils.CALDAV_CONNECTOR_SETTING_SCOPE,
                            CaldavConnectorUtils.CALDAV_URL_KEY,
                            SettingValue.create(caldavUrl));
  }

  public CaldavUserSetting getCaldavSetting(long userIdentityId) {

    SettingValue<?> username = this.settingService.get(Context.USER.id(String.valueOf(userIdentityId)),
                                                       CaldavConnectorUtils.CALDAV_CONNECTOR_SETTING_SCOPE,
                                                       CaldavConnectorUtils.CALDAV_USERNAME_KEY);
    SettingValue<?> password = this.settingService.get(Context.USER.id(String.valueOf(userIdentityId)),
                                                       CaldavConnectorUtils.CALDAV_CONNECTOR_SETTING_SCOPE,
                                                       CaldavConnectorUtils.CALDAV_PASSWORD_KEY);
    SettingValue<?> caldavUrl = this.settingService.get(Context.USER.id(String.valueOf(userIdentityId)),
                                                        CaldavConnectorUtils.CALDAV_CONNECTOR_SETTING_SCOPE,
                                                        CaldavConnectorUtils.CALDAV_URL_KEY);

    CaldavUserSetting caldavUserSetting = new CaldavUserSetting();
    if (username != null) {
      caldavUserSetting.setUsername((String) username.getValue());
    }
    if (password != null) {
      String decodePassword = CaldavConnectorUtils.decode((String) password.getValue());
      caldavUserSetting.setPassword(decodePassword);
    }
    if (caldavUrl != null) {
      caldavUserSetting.setCaldavUrl((String) caldavUrl.getValue());
    }
    return caldavUserSetting;
  }

  public void deleteCaldavSetting(long userIdentityId) {

    this.settingService.remove(Context.USER.id(String.valueOf(userIdentityId)),
                               CaldavConnectorUtils.CALDAV_CONNECTOR_SETTING_SCOPE,
                               CaldavConnectorUtils.CALDAV_USERNAME_KEY);
    this.settingService.remove(Context.USER.id(String.valueOf(userIdentityId)),
                               CaldavConnectorUtils.CALDAV_CONNECTOR_SETTING_SCOPE,
                               CaldavConnectorUtils.CALDAV_PASSWORD_KEY);
    this.settingService.remove(Context.USER.id(String.valueOf(userIdentityId)),
                               CaldavConnectorUtils.CALDAV_CONNECTOR_SETTING_SCOPE,
                               CaldavConnectorUtils.CALDAV_URL_KEY);
  }
}
