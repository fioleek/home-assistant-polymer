import '@polymer/app-route/app-route.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import '../src/layouts/hass-loading-screen.js';
import '../src/util/hass-util.js';
import './addon-view/hassio-addon-view.js';
import './hassio-data.js';
import './hassio-pages-with-tabs.js';

class HassioMain extends window.hassMixins.EventsMixin(PolymerElement) {
  static get template() {
    return html`
    <app-route route="[[route]]" pattern="/:page" data="{{routeData}}"></app-route>
    <hassio-data id="data" hass="[[hass]]" supervisor="{{supervisorInfo}}" homeassistant="{{hassInfo}}" host="{{hostInfo}}"></hassio-data>

    <template is="dom-if" if="[[!loaded]]">
      <hass-loading-screen narrow="[[narrow]]" show-menu="[[showMenu]]"></hass-loading-screen>
    </template>

    <template is="dom-if" if="[[loaded]]">
      <template is="dom-if" if="[[!equalsAddon(routeData.page)]]">
        <hassio-pages-with-tabs hass="[[hass]]" narrow="[[narrow]]" show-menu="[[showMenu]]" page="[[routeData.page]]" supervisor-info="[[supervisorInfo]]" hass-info="[[hassInfo]]" host-info="[[hostInfo]]"></hassio-pages-with-tabs>
      </template>
      <template is="dom-if" if="[[equalsAddon(routeData.page)]]">
        <hassio-addon-view hass="[[hass]]" narrow="[[narrow]]" show-menu="[[showMenu]]" route="[[route]]"></hassio-addon-view>
      </template>
    </template>
`;
  }

  static get is() { return 'hassio-main'; }

  static get properties() {
    return {
      hass: Object,
      narrow: Boolean,
      showMenu: Boolean,
      route: {
        type: Object,
        // Fake route object
        value: {
          prefix: '/hassio',
          path: '/dashboard',
          __queryParams: {}
        },
        observer: 'routeChanged',
      },
      routeData: Object,
      supervisorInfo: Object,
      hostInfo: Object,
      hassInfo: Object,
      loaded: {
        type: Boolean,
        computed: 'computeIsLoaded(supervisorInfo, hostInfo, hassInfo)',
      },
    };
  }

  ready() {
    super.ready();
    window.hassUtil.applyThemesOnElement(this, this.hass.themes, this.hass.selectedTheme, true);
    this.addEventListener('hass-api-called', ev => this.apiCalled(ev));
  }

  connectedCallback() {
    super.connectedCallback();
    this.routeChanged(this.route);
  }

  apiCalled(ev) {
    if (ev.detail.success) {
      let tries = 1;

      const tryUpdate = () => {
        this.$.data.refresh().catch(function () {
          tries += 1;
          setTimeout(tryUpdate, Math.min(tries, 5) * 1000);
        });
      };

      tryUpdate();
    }
  }

  computeIsLoaded(supervisorInfo, hostInfo, hassInfo) {
    return (supervisorInfo !== null &&
            hostInfo !== null &&
            hassInfo !== null);
  }

  routeChanged(route) {
    if (route.path === '' && route.prefix === '/hassio') {
      history.replaceState(null, null, '/hassio/dashboard');
      this.fire('location-changed');
    }
  }

  equalsAddon(page) {
    return page && page === 'addon';
  }
}

customElements.define(HassioMain.is, HassioMain);
