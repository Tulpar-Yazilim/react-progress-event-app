import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import "moment/locale/tr";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./assets/custom.css";
import routes from "./routes";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.css";

function App() {
  React.useEffect(() => {
    moment.locale("tr");
  }, []);

  return (
    <Router basename={process.env.REACT_APP_BASENAME || ""}>
      <div>
        {routes.map((route, index) => {
          return (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={(props) => {
                return (
                  <route.layout {...props}>
                    <route.component {...props} />
                  </route.layout>
                );
              }}
            />
          );
        })}
      </div>
    </Router>
  );
}

export default App;
