import { Component, ReactNode } from 'react';
import BackButton from '../components/BackButton';



interface EndingProps {
    history: any;
    location: {
      state: {
        activeDocuments: File[];
      }
    }
  }
  
  interface EndingState {
    loadingShown: boolean;
  }

class Ending extends Component<EndingProps, EndingState> {

    goHome() {
        this.props.history.push({
            pathname: '/Home',
            state: { }
          });
      }

    render(): ReactNode {
        return(
            <div>
                 <BackButton onClick={() => this.goHome()} />
                 <div id="pdf-found-div" className="App">
                    Ending.
                </div>
            </div>

        )
    }
    
}

export default Ending;
