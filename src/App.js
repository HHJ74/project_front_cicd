import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import SubPage from './components/SubPage';
import Login from './components/Login';
import Join from './components/Join';
import Purchase from './components/Purchase';
import Purchase_Complete from './components/Purchase_Complete';
import DetailPage from './components/DetailPage';
import CartPage from './components/CartPage';
import ProductDetail from './components/ProductDetail';
import Register from './components/Register';
import Community from './components/Community';
import DiyItem from './components/DiyItem';
import Find_pw from './components/Find_pw';
import Find_id from './components/Find_id';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />}></Route>
          <Route path="/subpage" element={<SubPage />}></Route>
          <Route path="/detail/" element={<DetailPage />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/findid" element={<Find_id />}></Route>
          <Route path="/findpw" element={<Find_pw />}></Route>
          <Route path="/register" element={<Register />} />
          <Route path="/join" element={<Join />}></Route>
          <Route path="/purchase" element={<Purchase />}></Route>
          <Route path="/purchase_complete" element={<Purchase_Complete />} />
          <Route path="/cart" element={<CartPage />}></Route>
          <Route path="/product_detail/:productId" element={<ProductDetail />} />
          <Route path="/diyitem" element={<DiyItem/>} />
          <Route path="/community" element={<Community/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
