import * as React from "react";
import * as ReactRouter from "react-router-dom";

import Vocabulary from "./Vocabulary";

// const renderVocabulary = () => <Vocabulary/>;

const App = () => (
    <div className="vt-app">
        {/*<ReactRouter.Route path="/vocabulary" render={renderVocabulary}/>*/}
        <Vocabulary/>
    </div>
);

export default App;
