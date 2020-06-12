import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import SearchPage from './layouts/SearchPage/SearchPage';
import SearchPageWebArchive from './layouts/SearchPage/SearchPage';
import Nav from './components/nav/Nav';
import {useTranslation} from 'react-i18next';

function App() {
  const {t} = useTranslation();

  document.querySelector('title').innerText = t('pageTitle.title');
  return (
    <Router>
      <Nav></Nav>
      <Switch>
        <Route exact path='/' component={SearchPage}></Route>
        <Route
          exact
          path='/webarchiveParser'
          component={SearchPageWebArchive}
        ></Route>
      </Switch>
    </Router>
  );
}

export default App;
