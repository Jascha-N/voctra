import * as Blueprint from "@blueprintjs/core";
import * as React from "react";
import * as ReactRouter from "react-router-dom";

enum StateType {
    Intro,
    Learn,
    Test
}

interface IntroState {
    type: StateType.Intro;
    page: number;
}

interface LearnState {
    type: StateType.Learn;
    index: number;
}

// interface TestState {
//     type: StateType.Test;
// }

type State = IntroState | LearnState; // | TestState;

// const WORDS: Array<[string, string, string]> = [
//     ["daina", "lied", "resources/images/room1.jpg"],
//     ["kede", "stoel", "resources/images/room2.jpg"]
// ];

type Props = ReactRouter.RouteComponentProps<{}>;

class Trainer extends React.Component<Props, State> {
    private static readonly INTRO_PAGES = [
        (
            <p>
                In het komende uur ga je Litouwse woorden leren. Probeer deze woorden zo goed mogelijk te onthouden,
                zodat je ze volgende week op een toets naar het Nederlands kunt vertalen!
            </p>
        ),
        (
            <p>
                Zoals in het filmpje werd uitgelegd, zie je bij de eerste presentatie van een nieuw woord een
                achtergrondplaatje. Deze plaatjes zijn bedoeld om je te helpen om een duidelijk, levendig beeld te
                bedenken bij elk woord.
            </p>
        ),
        [
            (
                <p key="1">
                    We raden je sterk aan om de methode te gebruiken die in de film uitgelegd werd. Probeer in elk geval
                    een beeld te bedenken bij elk woord en koppel het aan de vertaling.
                </p>
            ),
            (
                <p key="2">
                    Mocht je vinden dat de plaatjes je niet helpen, dan mag je de plaatjes negeren. Het gaat erom dat je
                    de woorden onthoudt, niet de achtergrondplaatjes.
                </p>
            )
        ],
        (
            <p>
                Straks tijdens het oefenen ga je ook oefenen om de woorden te vertalen. Je kunt de vertaling indienen
                door op <span className="pt-text-muted">[Enter]</span> te drukken. Het vertalen helpt je om de woorden
                te onthouden.  Volgende week tijdens de toets moet je de woorden ook vertalen.
            </p>
        ),
        [
            (
                <p key="1">
                    Een laatste tip: tijdens het oefenen kun je bijna altijd op{" "}
                    <span className="pt-text-muted">[Enter]</span> drukken om sneller door te gaan met de volgende
                    trial.
                </p>
            ),
            (
                <p key="2">
                    Druk <span className="pt-text-muted">[Enter]</span> om met het oefenen te beginnen! Veel succes!
                </p>
            )
        ]
    ];

    public readonly state: State = {
        type: StateType.Intro,
        page: 0
    };

    private readonly handlers = {
        next: (event: React.MouseEvent<HTMLElement>) => {
            this.setState((state) => {
                switch (state.type) {
                    case StateType.Intro: {
                        if (state.page === Trainer.INTRO_PAGES.length - 1) {
                            return { type: StateType.Learn };
                        } else {
                            return { ...state, page: state.page + 1 };
                        }
                    }
                    default: {
                        return state;
                    }
                }
            });
        }
    };

    public render() {
        switch (this.state.type) {
            case StateType.Intro: {
                return (
                    <div className="vt-trainer">
                        <div className="vt-trainer-intro">
                            <div>
                                {Trainer.INTRO_PAGES[this.state.page]}
                            </div>
                        </div>
                        <div className="vt-trainer-continue">
                            <Blueprint.Button
                                className="pt-large"
                                iconName="key-enter"
                                onClick={this.handlers.next}
                            >
                                Verder <span className="pt-text-muted">[Enter]</span>
                            </Blueprint.Button>
                        </div>
                    </div>
                );
            }
            case StateType.Learn: {
                return (
                    <div className="vt-trainer">
                        <div className="vt-trainer-image">
                            <img src="/vocab/example/images/room1.jpg"/>
                        </div>
                        <div className="vt-trainer-instructions pt-card pt-elevation-1">
                            <span>
                                Vorm een beeld bij het woord en druk op <span className="pt-text-muted">[Enter]</span>
                            </span>
                        </div>
                        <div className="vt-trainer-score pt-card pt-elevation-1">
                            Score: 0
                        </div>
                    </div>
                );
            }
        }
    }
}

export default Trainer;
