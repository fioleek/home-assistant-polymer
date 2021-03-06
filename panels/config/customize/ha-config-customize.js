import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import '../../../src/resources/ha-style.js';
import '../../../src/util/hass-mixins.js';
import '../../../src/util/hass-util.js';
import '../ha-config-section.js';
import '../ha-entity-config.js';
import './ha-form-customize.js';

/*
 * @appliesMixin window.hassMixins.LocalizeMixin
 */
class HaConfigCustomize extends window.hassMixins.LocalizeMixin(PolymerElement) {
  static get template() {
    return html`
    <style include="ha-style">
    </style>

    <app-header-layout has-scrolling-region="">
      <app-header slot="header" fixed="">
        <app-toolbar>
          <paper-icon-button icon="mdi:arrow-left" on-click="_backTapped"></paper-icon-button>
          <div main-title="">[[localize('ui.panel.config.customize.caption')]]</div>
        </app-toolbar>
      </app-header>

      <div class\$="[[computeClasses(isWide)]]">
        <ha-config-section is-wide="[[isWide]]">
          <span slot="header">Customization</span>
          <span slot="introduction">
            Tweak per-entity attributes.<br>
            Added/edited customizations will take effect immediately. Removed customizations will take effect when the entity is updated.
          </span>
          <ha-entity-config hass="[[hass]]" label="Entity" entities="[[entities]]" config="[[entityConfig]]">
          </ha-entity-config>
        </ha-config-section>
      </div>
    </app-header-layout>
`;
  }

  static get is() { return 'ha-config-customize'; }

  static get properties() {
    return {
      hass: Object,
      isWide: Boolean,

      entities: {
        type: Array,
        computed: 'computeEntities(hass)',
      },

      entityConfig: {
        type: Object,
        value: {
          component: 'ha-form-customize',
          computeSelectCaption: stateObj =>
            window.hassUtil.computeStateName(stateObj) + ' (' + window.hassUtil.computeDomain(stateObj) + ')'
        }
      },
    };
  }

  computeClasses(isWide) {
    return isWide ? 'content' : 'content narrow';
  }

  _backTapped() {
    history.back();
  }

  computeEntities(hass) {
    return Object.keys(hass.states)
      .map(key => hass.states[key])
      .sort(window.hassUtil.sortByName);
  }
}
customElements.define(HaConfigCustomize.is, HaConfigCustomize);
