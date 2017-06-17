import * as Blueprint from "@blueprintjs/core";
import * as React from "react";
import * as ReactRouter from "react-router-dom";

interface TrainerState {
    dummy?: any;
}

class Trainer extends React.Component<ReactRouter.RouteComponentProps<{}>, TrainerState> {
    public render() {
        return (
            <div className="vt-trainer">
                <div className="vt-trainer-intro">
                    <p>
                        In het komende uur ga je Litouwse woorden leren. Probeer deze woorden zo goed mogelijk te
                        onthouden, zodat je ze volgende week op een toets naar het Nederlands kunt vertalen!
                    </p>
                    <Blueprint.Button className="vt-trainer-continue pt-large" iconName="key-enter">
                        Verder <span className="pt-text-muted">[Enter]</span>
                    </Blueprint.Button>
                </div>
            </div>
        );
    }
}

export default Trainer;
