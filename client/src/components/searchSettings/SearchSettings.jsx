import React, {useRef} from 'react';
import {ReactComponent as SettingsIcon} from '../../assets/icons/settings.svg';
import {useOfContext} from '../../context';
import useClickOutside from '../../Utlities/useClickOutside';
import {ReactComponent as CheckedIcon} from '../../assets/icons/checked.svg';
import {useTranslation} from 'react-i18next';

function SearchSettings() {
  const {
    setSearchSettings,
    settingsSearch,
    toggleSettings,
    isSettingsOpen,
    closeSettings,
  } = useOfContext();
  const containerRef = useRef();

  const {t} = useTranslation();

  useClickOutside(containerRef, closeSettings);

  const handleInputChange = (e) =>
    setSearchSettings({...settingsSearch, [e.target.name]: e.target.value});

  const handleCheckboxChange = (e) =>
    setSearchSettings({...settingsSearch, [e.target.name]: e.target.checked});

  return (
    <div className='formSettings' ref={containerRef}>
      <button
        className={`formSettings__btn ${isSettingsOpen ? 'active' : ''}`}
        type='button'
        onClick={() => toggleSettings()}
      >
        <span>{t('settings.title')}</span> <SettingsIcon></SettingsIcon>
      </button>

      <div className={`settings ${isSettingsOpen ? 'open' : ''}`}>
        <fieldset className='settings__row'>
          <label className='settings__label' htmlFor='htmlTag'>
            {t('settings.HTMLTagRow')}
            <input
              id='htmlTag'
              name='htmlTag'
              type='text'
              value={settingsSearch.htmlTag}
              onChange={handleInputChange}
              autoComplete='off'
            />
          </label>
        </fieldset>

        <fieldset className='settings__row'>
          <label className='settings__label' htmlFor='content'>
            {t('settings.toPaste')}
            <textarea
              cols='30'
              rows='10'
              id='content'
              name='content'
              type='text'
              value={settingsSearch.content}
              onChange={handleInputChange}
              spellCheck='false'
            ></textarea>
          </label>
        </fieldset>

        <fieldset className='settings__row'>
          <label className='settings__label checkedIcon' htmlFor='pasteAfter'>
            {t('settings.pasteAfter')}
            <input
              id='pasteAfter'
              name='pasteAfter'
              type='checkbox'
              value={settingsSearch.pasteAfter}
              onChange={handleCheckboxChange}
              style={{display: 'none'}}
            />
            {settingsSearch.pasteAfter && <CheckedIcon></CheckedIcon>}
          </label>
        </fieldset>

        <fieldset className='settings__row'>
          <label className='settings__label checkedIcon' htmlFor='pasteBefore'>
            {t('settings.pasteBefore')}
            <input
              id='pasteBefore'
              name='pasteBefore'
              type='checkbox'
              value={settingsSearch.pasteBefore}
              onChange={handleCheckboxChange}
              style={{display: 'none'}}
            />
            {settingsSearch.pasteBefore && <CheckedIcon></CheckedIcon>}
          </label>
        </fieldset>

        <fieldset className='settings__row'>
          <label className='settings__label checkedIcon' htmlFor='replace'>
            {t('settings.replace')}
            <input
              id='replace'
              name='replace'
              type='checkbox'
              value={settingsSearch.replace}
              onChange={handleCheckboxChange}
              style={{display: 'none'}}
            />
            {settingsSearch.replace && <CheckedIcon></CheckedIcon>}
          </label>
        </fieldset>

        <hr />

        <fieldset className='settings__row'>
          <label
            className='settings__label checkedIcon'
            htmlFor='loadCSSAndJSFromWebArchive'
          >
            {t('settings.loadFromWA')}
            <input
              id='loadCSSAndJSFromWebArchive'
              name='loadCSSAndJSFromWebArchive'
              type='checkbox'
              value={settingsSearch.loadCSSAndJSFromWebArchive}
              onChange={handleCheckboxChange}
              style={{display: 'none'}}
            />
            {settingsSearch.loadCSSAndJSFromWebArchive && (
              <CheckedIcon></CheckedIcon>
            )}
          </label>
        </fieldset>

        <fieldset className='settings__row'>
          <label
            className='settings__label checkedIcon'
            htmlFor='parseCSSAndJS'
          >
            {t('settings.parseCSSJS')}
            <input
              id='parseCSSAndJS'
              name='parseCSSAndJS'
              type='checkbox'
              value={settingsSearch.parseCSSAndJS}
              onChange={handleCheckboxChange}
              style={{display: 'none'}}
            />
            {settingsSearch.parseCSSAndJS && <CheckedIcon></CheckedIcon>}
          </label>
        </fieldset>

        <fieldset className='settings__row'>
          <label
            className='settings__label checkedIcon'
            htmlFor='removeAllCSSAndJS'
          >
            {t('settings.removeCSSJS')}
            <input
              id='removeAllCSSAndJS'
              name='removeAllCSSAndJS'
              type='checkbox'
              value={settingsSearch.removeAllCSSAndJS}
              onChange={handleCheckboxChange}
              style={{display: 'none'}}
            />
            {settingsSearch.removeAllCSSAndJS && <CheckedIcon></CheckedIcon>}
          </label>
        </fieldset>

        <fieldset className='settings__row'>
          <label
            className='settings__label checkedIcon'
            htmlFor='transformToHttps'
          >
            {t('settings.toHttps')}
            <input
              id='transformToHttps'
              name='transformToHttps'
              type='checkbox'
              value={settingsSearch.transformToHttps}
              onChange={handleCheckboxChange}
              style={{display: 'none'}}
            />
            {settingsSearch.transformToHttps && <CheckedIcon></CheckedIcon>}
          </label>
        </fieldset>

        <fieldset className='settings__row'>
          <label
            className='settings__label checkedIcon'
            htmlFor='transformToHttp'
          >
            {t('settings.toHttp')}
            <input
              id='transformToHttp'
              name='transformToHttp'
              type='checkbox'
              value={settingsSearch.transformToHttp}
              onChange={handleCheckboxChange}
              style={{display: 'none'}}
            />
            {settingsSearch.transformToHttp && <CheckedIcon></CheckedIcon>}
          </label>
        </fieldset>
      </div>
    </div>
  );
}

export default SearchSettings;
