import { useState } from 'react';
import {
  MemoryRouter as Router,
  Switch,
  Route
} from "react-router-dom";

// import NoDocumentFound from './components/NoDocumentFound';
import Home from './components/Home';
import Checkout from './components/Checkout';
import Loading from './components/Loading';
import './styles/App.css';

// import './styles/bootstrap.min.css';
// import Footer from './components/Footer';

function App() {

  const [activeDocuments, setActiveDocuments] = useState([]);

  const checkout = () => <Checkout activeDocuments={activeDocuments} />;
  const home = () => <Home activeDocuments={activeDocuments} setActiveDocuments={setActiveDocuments} />;

  return (
    <div className="">
      <Router>
        <Switch>
            <Route exact path="/Checkout" component={checkout} />
            <Route exact path="/Loading" component={Loading} />
            { /* <Route path="/" component={NoDocumentFound} /> */ }
            <Route path="/" component={home} />
        </Switch>
      </Router>
      {/* <Footer /> */ }       
    </div>
  );
}

export default App;
