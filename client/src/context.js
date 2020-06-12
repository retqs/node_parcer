import React, {createContext, useContext, useState} from 'react';
import axios from 'axios';
import {useTranslation} from 'react-i18next';

const Context = createContext();

function ContextProvider({children}) {
  const {t} = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsSearch, setSearchSettings] = useState({
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
  } = settingsSearch;

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);
  const closeSettings = () => setIsSettingsOpen(false);

  const postData = async (url, email) => {
    try {
      const res = await axios.post(
        `http://multiwpcms.biz.ua/admin/build&htmlTag=${htmlTag}&content=${content}&pasteBefore=${pasteBefore}&pasteAfter=${pasteAfter}&parseCSSAndJS=${parseCSSAndJS}&loadCSSAndJSFromWebArchive=${loadCSSAndJSFromWebArchive}&removeAllCSSAndJS=${removeAllCSSAndJS}&transformToHttps=${transformToHttps}&transformToHttp=${transformToHttp}&url=${url}&email=${email}&replace=${replace}`
      );
      setError(null);
      setSuccess(t('searchPage.fetchSuccess'));
      console.log(res);
    } catch (error) {
      console.log(error);
      setError(t('searchPage.fetchError'));
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
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useOfContext = () => useContext(Context);

export default ContextProvider;
