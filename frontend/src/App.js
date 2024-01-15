import Footer from './components/Footer';
import Header from './components/Header';
import Home from './components/Home';
import { Route, Routes} from "react-router-dom";
import ViewBooks from './components/ViewBooks';
import Unauthorized from './components/Unauthorized';
import { ToastContainer } from 'react-toastify';
import { DataContextProvider } from './context/DataContext';
import { ViewBookProvider } from './context/ViewBookContext';

function App() {

  return (
    <div className="App">
      <DataContextProvider>
        <Header/>
        <ToastContainer autoClose={400}/>
        <main>
        <Routes>
            <Route path='/' element = {<Home/>} 
            />
            <Route path='/books' element = {
              <ViewBookProvider>
                <ViewBooks/>
              </ViewBookProvider>
            } 
            />
            <Route path='/unauthorized' element = {
              <Unauthorized/>
            }
            />
        </Routes>
        </main>
        <Footer/>
      </DataContextProvider>
    </div>
  );
}

export default App;
