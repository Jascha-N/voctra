import * as React from "react";
import * as ReactRouter from "react-router-dom";

import VocabularyLoader from "../containers/VocabularyLoader";

// const renderVocabulary = () => <Vocabulary/>;

const App = () => (
    <div className="vt-app">
        {/*<ReactRouter.Route path="/vocabulary" render={renderVocabulary}/>*/}
        <VocabularyLoader/>
    </div>
);

export default App;
