import React from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom"
import Main from './views/main'
import Success from './views/success'

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route exact path="/">
                        < Main />
                    </Route>
                    <Route exact path="/success">
                        < Success />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
}

export default App