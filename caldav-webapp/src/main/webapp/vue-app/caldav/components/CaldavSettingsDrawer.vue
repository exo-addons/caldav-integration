<!--
Copyright (C) 2023 eXo Platform SAS.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
-->
<template>
  <exo-drawer
    id="caldavSettingsDrawer"
    ref="caldavSettingsDrawer"
    body-classes="hide-scroll decrease-z-index-more"
    :right="!$vuetify.rtl"
    @closed="cancelConnection"
    disable-pull-to-refresh>
    <template slot="title">
      {{ $t('agenda.caldavCalendar.settings.connect.drawer.title') }}
    </template>
    <template slot="content">
      <v-form ref="form1" class="pa-2 ms-2 mt-4">
        <div class="d-flex flex-column flex-grow-1">
          <div class="d-flex flex-column mb-2">
            <label class="d-flex flex-row font-weight-bold my-2">{{ $t('agenda.caldavCalendar.settings.connect.username.label') }}</label>
            <div class="d-flex flex-row">
              <v-text-field
                v-model="account"
                type="text"
                name="account"
                :error-messages="accountErrorMessage"
                :placeholder="$t('agenda.caldavCalendar.settings.connect.username.placeholder')"
                class="input-block-level ignore-vuetify-classes pa-0"
                outlined
                required
                dense />
            </div>
          </div>
          <div class="d-flex flex-column mb-2">
            <label class="d-flex flex-row font-weight-bold my-2">{{ $t('agenda.caldavCalendar.settings.connect.password.label') }}</label>
            <div class="d-flex flex-row">
              <v-text-field
                v-model="password"
                :type="toggleFieldType"
                name="password"
                :append-icon="displayPasswordIcon"
                :placeholder="$t('agenda.caldavCalendar.settings.connect.password.placeholder') "
                maxlength="100"
                class="input-block-level ignore-vuetify-classes pa-0"
                required
                outlined
                dense
                @click:append="showPassWord = !showPassWord" />
            </div>
          </div>
        </div>
      </v-form>
    </template>
    <template slot="footer">
      <div class="d-flex">
        <v-spacer />
        <v-btn
          class="btn me-2"
          @click="cancelConnection">
          {{ $t('agenda.caldavCalendar.settings.connect.actions.cancel') }}
        </v-btn>
        <v-btn
          :loading="saving"
          :disabled="disableConnectButton"
          class="btn btn-primary"
          @click="saveSettings">
          {{ $t('agenda.caldavCalendar.settings.connect.actions.connect') }}
        </v-btn>
      </div>
    </template>
  </exo-drawer>
</template>

<script>

export default {

  data: () => ({
    account: '',
    password: '',
    showPassWord: false,
    connectionSuccess: false,
    saving: false,
    error: '',
    accountErrorMessage: ''
  }),
  computed: {
    displayPasswordIcon() {
      return this.showPassWord ? 'mdi-eye': 'mdi-eye-off';
    },
    toggleFieldType() {
      return this.showPassWord ? 'text': 'password';
    },
    disableConnectButton() {
      return this.account === '' || this.account < 3 || this.password === '';
    }
  },
  watch: {
    account() {
      if (this.account.length<3) {
        this.accountErrorMessage = this.$t('agenda.caldavCalendar.settings.connect.username.error');
      } else {
        this.accountErrorMessage = '';
      }
    },
    saving() {
      if (this.saving) {
        this.$refs.caldavSettingsDrawer.startLoading();
      } else {
        this.$refs.caldavSettingsDrawer.endLoading();
      }
    },
  },
  methods: {
    openCaldavDrawer() {
      this.$refs.caldavSettingsDrawer.open();
    },
    closeCaldavDrawer() {
      this.$refs.caldavSettingsDrawer.close();
    },
    cancelConnection() {
      document.dispatchEvent(new CustomEvent('test-connection'));
      this.closeCaldavDrawer();
    },
    saveSettings() {
      if (!this.disableConnectButton) {
        this.saving = true;
        const caldavSettings = {
          'username': this.account,
          'password': this.password
        };
        this.$agendaCaldavService.createCaldavSetting(caldavSettings).then((respStatus) => {
          if (respStatus === 200) {
            this.$emit('display-alert', this.$t('agenda.caldavCalendar.settings.connection.successMessage'));
          }
        }).then(() => {
          this.$agendaCaldavService.getCaldavSetting().then((settings) => {
            document.dispatchEvent(new CustomEvent('test-connection', {detail: settings}));
            this.reset();
            this.closeCaldavDrawer();
          });
        }).catch(() => {
          this.$emit('display-alert', this.$t('agenda.caldavCalendar.settings.connection.errorMessage'), 'error');
        }).finally(() => {
          window.setTimeout(() => {
            this.saving = false;
          }, 200);
        });
      }
    },
    reset() {
      this.account ='';
      this.password = '';
    }
  }

};
</script>