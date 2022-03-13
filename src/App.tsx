import {
  MemoryRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Ending from "./pages/Ending";
import './styles/App.css';

// import Footer from './components/Footer';

function App() {

  return (
    <div className="">
      <Router>
        <Switch>
            <Route exact path="/Checkout" component={Checkout} />
            <Route exact path="/Final" component={Ending} />
            <Route path="/" component={Home} />
        </Switch>
      </Router>
      {/* <Footer /> */ }       
    </div>
  );
}

export default App;
