import React, {createContext, useContext, useState} from 'react';

import axios from 'axios';
import {useTranslation} from 'react-i18next';

const Context = createContext();

function ContextProvider({children}) {
  const {t} = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settingsSearch, setSearchSettings] = useState({
    sitemap: '',
    specialId: '',
    htmlTag: '',
    content: '',
    pasteBefore: false,
    pasteAfter: false,
    parseCSSAndJS: false,
    loadCSSAndJSFromWebArchive: true,
    removeAllCSSAndJS: false,
    transformToHttps: true,
    transformToHttp: false,
    replace: false,
    parser_deep: 1,
    sitemaps_html: '',
  });
  const [fetchError, setError] = useState(null);
  const [fetchSuccess, setSuccess] = useState(null);

  const {
    htmlTag,
    content,
    pasteBefore,
    pasteAfter,
    parseCSSAndJS,
    loadCSSAndJSFromWebArchive,
    removeAllCSSAndJS,
    transformToHttps,
    transformToHttp,
    replace,
    specialId,
    sitemap,
    parser_deep,
    sitemaps_html,
  } = settingsSearch;

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);
  const closeSettings = () => setIsSettingsOpen(false);

  const fetchPhotos = async () => {
    try {
      const res = await axios.get('http://multiwpcms.biz.ua/get_all_photos');

      console.log(res.data);
      if (res.data === 200) setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const postData = async (url, email) => {
    if (window.location.pathname.includes('webarchiveParser')) {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `http://multiwpcms.biz.ua/speed_load?htmlTag=${htmlTag}&sitemaps_html=${sitemaps_html}&content=${content}&parser_deep=${parser_deep}&sitemap=${sitemap}&pasteBefore=${pasteBefore}&pasteAfter=${pasteAfter}&parseCSSAndJS=${parseCSSAndJS}&loadCSSAndJSFromWebArchive=${loadCSSAndJSFromWebArchive}&removeAllCSSAndJS=${removeAllCSSAndJS}&transformToHttps=${transformToHttps}&transformToHttp=${transformToHttp}&url=${url}&email=${email}&replace=${replace}&special_id=${specialId}`,
          {
            onDownloadProgress: (progressEvent) => {
              const process = parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              );

              console.log(process);
            },
          }
        );
        setError(null);
        setSuccess(t('searchPage.fetchSuccess'));

        if (res.status === 200) fetchPhotos();
      } catch (error) {
        setError(t('searchPage.fetchError'));
      }
    } else {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `http://multiwpcms.biz.ua/speed_load_all?htmlTag=${htmlTag}&sitemaps_html=${sitemaps_html}&content=${content}&parser_deep=${parser_deep}&sitemap=${sitemap}&pasteBefore=${pasteBefore}&pasteAfter=${pasteAfter}&parseCSSAndJS=${parseCSSAndJS}&loadCSSAndJSFromWebArchive=${loadCSSAndJSFromWebArchive}&removeAllCSSAndJS=${removeAllCSSAndJS}&transformToHttps=${transformToHttps}&transformToHttp=${transformToHttp}&url=${url}&email=${email}&replace=${replace}&special_id=${specialId}`,
          {
            onDownloadProgress: (progressEvent) => {
              const process = parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              );

              console.log(process);
            },
          }
        );

        setError(null);
        setSuccess(t('searchPage.fetchSuccess'));

        if (res.status === 200) fetchPhotos();
      } catch (error) {
        setError(t('searchPage.fetchError'));
      }
    }
  };

  return (
    <Context.Provider
      value={{
        isModalOpen,
        toggleModal,
        settingsSearch,
        setSearchSettings,
        isSettingsOpen,
        toggleSettings,
        closeSettings,
        postData,
        fetchError,
        fetchSuccess,
        isLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useOfContext = () => useContext(Context);

export default ContextProvider;
