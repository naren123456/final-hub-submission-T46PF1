import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LoggedIn from './LoggedIn'

const App = () => (
    <MuiThemeProvider>
      <LoggedIn />
    </MuiThemeProvider>
  );
  
  export default App;