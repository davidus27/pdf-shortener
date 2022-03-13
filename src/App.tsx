import {
  MemoryRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Home from './pages/Home';
import Checkout from './pages/Checkout';
import './styles/App.css';

// import Footer from './components/Footer';

function App() {

  return (
    <div className="">
      <Router>
        <Switch>
            <Route exact path="/Checkout" component={Checkout} />
            <Route path="/" component={Home} />
        </Switch>
      </Router>
      {/* <Footer /> */ }       
    </div>
  );
}

export default App;
