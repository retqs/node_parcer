import React, {useState, useEffect, useRef} from 'react';
import _ from 'lodash';
import Modal from '../../components/modal/Modal';
import {useOfContext} from '../../context';
import SearchSettings from '../../components/searchSettings/SearchSettings';
import {Trans, useTranslation} from 'react-i18next';

import {ReactComponent as EmailIcon} from '../../assets/icons/email.svg';
import {ReactComponent as SearchIcon} from '../../assets/icons/search.svg';
import {ReactComponent as WaveIcon} from '../../assets/icons/wave.svg';

function SearchPage() {
  const {
    toggleModal,
    isModalOpen,
    postData,
    fetchError,
    fetchSuccess,
  } = useOfContext();
  const [t, i18n] = useTranslation();

  const [urlValue, setUrlValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [isInDebounce, setIsIsDebounce] = useState(false);
  const [isError, setIsError] = useState({
    input: false,
    submit: false,
  });

  const debounce = useRef(
    _.debounce((url) => {
      setUrlValue(url);

      if (!url.includes('http://') && !url.includes('https://')) {
        setIsError({...isError, input: true});
      } else {
        setIsError({...isError, input: false});
      }
    }, 1500)
  );

  useEffect(() => {
    if (urlValue) {
      setIsIsDebounce(true);
      debounce.current(urlValue);
    }
  }, [urlValue, emailValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (urlValue === '' || emailValue === '') {
      setIsError({...isError, form: true});
      setTimeout(() => setIsError({...isError, form: false}), 3000);
    } else {
      setIsError({...isError, form: false});
      postData(urlValue, emailValue);
    }
  };

  return (
    <>
      {isModalOpen && (
        <Modal
          title={t('searchPage.modalTitle')}
          body={t('searchPage.modalBody')}
        ></Modal>
      )}
      <section className='container'>
        <h1 className='pageTitle'>
          {t('searchPage.title')}
          <span className='pageTitle__remark'>{t('searchPage.email')}</span>
        </h1>
        <form className='form' id='form' onSubmit={handleSubmit}>
          <SearchSettings></SearchSettings>
          <label
            id='urlLabel'
            className='formInputContainer'
            htmlFor='urlInput'
          >
            <SearchIcon></SearchIcon>
            <input
              id='urlInput'
              placeholder={t('searchPage.urlPlaceholder')}
              className='form__input'
              type='url'
              spellCheck='false'
              autoComplete='off'
              onChange={(e) => setUrlValue(e.target.value)}
              value={urlValue}
              // pattern='https://.*'
            />
            {isError.input && (
              <span className='inputErrorUrl'>{t('searchPage.error')}</span>
            )}
          </label>
          <label
            id='emailLabel'
            className='formInputContainer'
            htmlFor='emailInput'
          >
            <EmailIcon></EmailIcon>
            <input
              id='emailInput'
              placeholder={t('searchPage.emailPlaceholder')}
              className='form__input'
              type='email'
              spellCheck='false'
              autoComplete='off'
              onChange={(e) => setEmailValue(e.target.value)}
              value={emailValue}
            />
          </label>

          <button
            className='form__submit'
            id='submit'
            type='submit'
            disabled={isError.input || isError.form}
          >
            <span>{t('searchPage.submit')}</span>
          </button>
          {isError.form && (
            <span className='inputErrorUrl'>{t('searchPage.errorEmpty')}</span>
          )}
        </form>
        <article className='info'>
          <h2 className='info__example'>{t('searchPage.example')}</h2>
          {fetchError !== null ? (
            <span className='info__error'>{fetchError}</span>
          ) : (
            <span className='info__success'>{fetchSuccess}</span>
          )}
          <div className='info__right'>
            <span className='hint' onClick={() => toggleModal()}>
              {t('searchPage.hint')}
            </span>
          </div>
        </article>
        <WaveIcon></WaveIcon>
      </section>
    </>
  );
}

export default SearchPage;
