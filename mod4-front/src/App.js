import React, { Component } from "react";
// import logo from './logo.svg';
import "./App.css";
import { HomePage } from "./views/HomePage";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { User } from "./components/User";
import { UserEdit } from "./components/UserEdit";
import { NavBar } from "./components/NavBar";
import { Login } from "./components/Login";
import { Portfolio } from "./components/Portfolio";
import { SignUp } from "./components/SignUp";
import { PrivateRoute } from "./components/PrivateRoute";
// import { Logout } from "./components/Logout";

class App extends Component {
  state = {

    currentUser: null
  };

  componentDidMount() {
    let userID = localStorage.getItem("userID");
    if (userID) {
      // Fetch user
      fetch(`http://localhost:3001/api/v1/users/${userID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
        .then(res => res.json())
        .then(currentUser => {
          this.setState({ currentUser });
        });
    }
  }

  setCurrentUser = currentUser => {
    this.setState({ currentUser });
  };

  fetchCurrentPrice = companySymbol => {
    fetch(`https://api.iextrading.com/1.0/stock/${companySymbol}/chart/1d`)
      .then(res => res.json())
      .then(prices =>
        prices.length
          ? this.setState({ currentPrice: prices[prices.length - 1] })
          : null
      );
  };

    currentPrices: []
  }
  fetchCurrentPrice = (companySymbol) => {
    fetch('https://api.iextrading.com/1.0//stock/market/batch?symbols=aapl,fb,tsla,ba,brk.b,dis,ge,hd,nke,sbux,dji,amzn,baba,goog,nflx,adbe,ftnt,grub,irbt,mcd&types=chart&range=1d')
      .then(res => res.json())
      .then(prices => {
        for( let symbol in prices){
          let chart = prices[symbol].chart
          prices[symbol] = chart[chart.length-1]
        }
        console.log(prices)
        this.setState({currentPrices: prices})
      })
      // .then(prices => prices.length ?
      //   this.setState({ currentPrice: prices[prices.length - 1] }) : null)
  }

  componentDidMount(){
    this.fetchCurrentPrice()
    setInterval(this.fetchCurrentPrice, 30000)
  }
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <NavBar currentUser={this.state.currentUser} />
          <Switch>
            <PrivateRoute path="/companies" component={HomePage} />
            <Route
              path="/login"
              render={props => (
                <Login {...props} setCurrentUser={this.setCurrentUser} />
              )}
            />
            {/* <Route path="/logout" component={Logout} /> */}
          <PrivateRoute path="/companies" render={(props) => <HomePage {...props} currentPrices={this.state.currentPrices} />} />
            <Route path="/login" component={Login} />
            <PrivateRoute path="/users/:id/edit" component={UserEdit} />
            <PrivateRoute path="/users" component={User} />
            <PrivateRoute path="/Portfolio" render={(props) => <Portfolio {...props} currentPrices={this.state.currentPrices} /> } />
            <Route path="/SignUp" component={SignUp} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
