package org.exoplatform.caldavintegration.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CaldavUserSetting {

  private String  username;

  private String  password;
}
