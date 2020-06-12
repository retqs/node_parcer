import React, {useState} from 'react';
import {NavLink} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import i18next from 'i18next';

function Nav() {
  const {t} = useTranslation();

  return (
    <nav className='nav'>
      <ul className='navList'>
        <li className='navList__item'>
          <NavLink
            className='navList__item--link'
            activeClassName='current'
            to='/'
            exact
          >
            {t('nav.searchPage')}
          </NavLink>
        </li>
        <li className='navList__item'>
          <NavLink
            className='navList__item--link'
            activeClassName='current'
            to='/webarchiveParser'
          >
            {t('nav.searchPageWA')}
          </NavLink>
        </li>
        <li className='navList__item'>
          <select
            name='languages'
            id='languages'
            className='selectLanguage'
            onChange={(e) => i18next.changeLanguage(e.target.value)}
          >
            <option value='ru'>RU</option>
            <option value='en'>EN</option>
          </select>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
