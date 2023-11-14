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

    String encodedPassword = CaldavConnectorUtils.encode(caldavUserSetting.getPassword());

    this.settingService.set(Context.USER.id(String.valueOf(userIdentityId)),
                            CaldavConnectorUtils.CALDAV_CONNECTOR_SETTING_SCOPE,
                            CaldavConnectorUtils.CALDAV_USERNAME_KEY,
                            SettingValue.create(caldavUserSetting.getUsername()));
    this.settingService.set(Context.USER.id(String.valueOf(userIdentityId)),
                            CaldavConnectorUtils.CALDAV_CONNECTOR_SETTING_SCOPE,
                            CaldavConnectorUtils.CALDAV_PASSWORD_KEY,
                            SettingValue.create(encodedPassword));
  }

  public CaldavUserSetting getCaldavSetting(long userIdentityId) {

    SettingValue<?> username = this.settingService.get(Context.USER.id(String.valueOf(userIdentityId)),
                                                       CaldavConnectorUtils.CALDAV_CONNECTOR_SETTING_SCOPE,
                                                       CaldavConnectorUtils.CALDAV_USERNAME_KEY);
    SettingValue<?> password = this.settingService.get(Context.USER.id(String.valueOf(userIdentityId)),
                                                       CaldavConnectorUtils.CALDAV_CONNECTOR_SETTING_SCOPE,
                                                       CaldavConnectorUtils.CALDAV_PASSWORD_KEY);


    CaldavUserSetting caldavUserSetting = new CaldavUserSetting();
    if (username != null) {
      caldavUserSetting.setUsername((String) username.getValue());
    }
    if (password != null) {
      String decodePassword = CaldavConnectorUtils.decode((String) password.getValue());
      caldavUserSetting.setPassword(decodePassword);
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
  }
}
