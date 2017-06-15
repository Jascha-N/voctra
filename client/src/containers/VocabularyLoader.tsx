import * as Blueprint from "@blueprintjs/core";
import * as React from "react";
import * as ReactRouter from "react-router";

import VocabularyViewer from "../components/VocabularyViewer";

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

interface VocabularyLoaderState {
    status: Status;
    path?: string;
    error?: string;
    vocabulary?: VocabularyJson;
}

export default class VocabularyLoader extends React.Component<{}, VocabularyLoaderState> {
    public state = {
        status: Status.NotLoaded
    };

    public render() {
        return <VocabularyViewer {...this.state} onSelectVocabulary={this.handleSelectVocabulary}/>;
    }

    private fetchVocabulary(name: string) {
        const path = `/vocab/${name}`;

        this.setState({ status: Status.Loading, path });
        fetch(`${path}/vocabulary.json`)
            .then(
                (response) => {
                    if (!response.ok) {
                        throw Error(`${response.status} ${response.statusText}`);
                    }
                    return response;
                }
            )
            .then((response) => response.json())
            .then((vocabulary) => this.setState({ status: Status.Loaded, vocabulary }))
            .catch((error) => this.setState({ status: Status.Error, error: error.message }));
    }

    private readonly handleSelectVocabulary = (name: string) => {
        this.fetchVocabulary(name);
    }
}
