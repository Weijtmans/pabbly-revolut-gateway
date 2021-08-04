import React from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom"
import Main from './views/main'

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route exact path="/">
                        < Main />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
}

export default App