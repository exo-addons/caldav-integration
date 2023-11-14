package org.exoplatform.caldav.service;

import org.exoplatform.caldav.model.CaldavUserSetting;

public interface CaldavConnectorService {

  /**
   * Creates a new caldav user setting
   *
   * @param caldavUserSetting {@link CaldavUserSetting} object to create
   * @param userIdentityId User identity creating the exchange user setting
   * @throws IllegalAccessException when the user is not authorized to create
   *           caldav setting
   */
  void createCaldavSetting(CaldavUserSetting caldavUserSetting, long userIdentityId) throws IllegalAccessException;

  /**
   * Retrieves caldav user setting by its technical user identity identifier.
   *
   * @param userIdentityId User identity getting the caldav user setting
   * @return A {@link CaldavUserSetting} object
   */
  CaldavUserSetting getCaldavSetting(long userIdentityId);

  /**
   * Deletes an caldav user setting
   *
   * @param userIdentityId User identity deleting his caldav user setting
   */
  void deleteCaldavSetting(long userIdentityId);
}
