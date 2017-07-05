import * as React from "react";
import * as ReactRouter from "react-router";

import VocabularyViewer from "../components/VocabularyViewer";
import { fetchJson } from "../util";

export type VocabularyEntry = [string, string, string];

export interface VocabularyJson {
    sourceLang: string;
    destLang: string;
    entries: VocabularyEntry[];
}

export enum Status {
    NotLoaded,
    Loading,
    Loaded,
    Error
}

type Props = ReactRouter.RouteComponentProps<{}>;

interface State {
    status: Status;
    path?: string;
    error?: string;
    vocabulary?: VocabularyJson;
}

class VocabularyLoader extends React.Component<Props, State> {
    public readonly state: State = {
        status: Status.NotLoaded
    };

    private readonly handlers = {
        selectVocabulary: (name: string) => {
            this.fetchVocabulary(name);
        }
    };

    public render() {
        return <VocabularyViewer {...this.state} onSelectVocabulary={this.handlers.selectVocabulary}/>;
    }

    private fetchVocabulary(name: string) {
        const path = `/vocab/${name}`;

        this.setState({ status: Status.Loading, path });
        fetchJson<VocabularyJson>(`${path}/vocabulary.json`)
            .then((vocabulary) => this.setState({ status: Status.Loaded, vocabulary }))
            .catch((error) => this.setState({ status: Status.Error, error: error.message }));
    }
}

export default VocabularyLoader;
