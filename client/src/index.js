import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Provider from './context';
import {I18nextProvider, initReactI18next} from 'react-i18next';
import i18next from 'i18next';
import common_en from './translations/en/common.json';
import common_ru from './translations/ru/common.json';

i18next.use(initReactI18next).init({
  interpolation: {escapeValue: false},
  react: {
    useSuspense: false,
  },
  lng: 'ru',
  resources: {
    ru: {
      translation: common_ru,
    },
    en: {
      translation: common_en,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <Provider>
        <App />
      </Provider>
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
