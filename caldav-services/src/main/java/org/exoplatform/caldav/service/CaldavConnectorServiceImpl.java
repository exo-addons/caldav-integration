package org.exoplatform.caldav.service;

import org.apache.commons.lang3.StringUtils;
import org.exoplatform.caldav.model.CaldavUserSetting;
import org.exoplatform.caldav.storage.CaldavConnectorStorage;
import org.exoplatform.services.log.ExoLogger;
import org.exoplatform.services.log.Log;

public class CaldavConnectorServiceImpl implements CaldavConnectorService {
  private CaldavConnectorStorage caldavConnectorStorage;

  private static final Log       LOG = ExoLogger.getLogger(CaldavConnectorServiceImpl.class);

  public CaldavConnectorServiceImpl(CaldavConnectorStorage caldavConnectorStorage) {
    this.caldavConnectorStorage = caldavConnectorStorage;
  }

  @Override
  public void createCaldavSetting(CaldavUserSetting caldavUserSetting, long userIdentityId) throws IllegalAccessException {
    if (StringUtils.isNotBlank(caldavUserSetting.getPassword()) && StringUtils.isNotBlank(caldavUserSetting.getUsername())) {
      caldavConnectorStorage.createCaldavSetting(caldavUserSetting, userIdentityId);
    } else {
      throw new IllegalAccessException("username or password not be null");
    }
  }

  @Override
  public CaldavUserSetting getCaldavSetting(long userIdentityId) {
    return caldavConnectorStorage.getCaldavSetting(userIdentityId);
  }

  @Override
  public void deleteCaldavSetting(long userIdentityId) {
    caldavConnectorStorage.deleteCaldavSetting(userIdentityId);
  }
}
