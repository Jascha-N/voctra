import * as Blueprint from "@blueprintjs/core";
import * as React from "react";
import * as ReactI18next from "react-i18next";
import * as ReactRouter from "react-router";

type VocabularyEntry = [string, string, string];

interface VocabularyJson {
    sourceLang: string;
    destLang: string;
    entries: VocabularyEntry[];
}

enum Status {
    NotLoaded,
    Loading,
    Loaded,
    Error
}

interface VocabularyState {
    status: Status;
    path?: string;
    error?: string;
    vocabulary?: VocabularyJson;
}

type VocabularyProps = ReactI18next.InjectedTranslateProps;

class Vocabulary extends React.Component<VocabularyProps, VocabularyState> {
    public state: VocabularyState = {
        status: Status.NotLoaded
    };

    public render() {
        const { t } = this.props;
        const { status, path, error, vocabulary } = this.state;

        const selectVocabulary = (event: React.ChangeEvent<HTMLSelectElement>) => {
            if (event.target.value) {
                this.fetchVocabulary(event.target.value);
            }
        };

        const vocabularySelect = (
            <div className="pt-select">
                <select defaultValue="" onChange={selectVocabulary}>
                    <option value="" disabled={true} hidden={true}>{t("choose-vocabulary")}</option>
                    <option value="basic">Basic</option>
                    <option value="nope">Does not exist!</option>
                </select>
            </div>
        );

        switch (status) {
            case Status.Loading:
                return <Blueprint.NonIdealState visual={<Blueprint.Spinner/>}/>;
            case Status.NotLoaded:
                return (
                    <Blueprint.NonIdealState
                        visual="book"
                        title={t("vocabulary-viewer")}
                        description={t("select-vocabulary")}
                        action={vocabularySelect}
                    />
                );
            case Status.Error:
                return (
                    <Blueprint.NonIdealState
                        visual="error"
                        title={t("an-error-occurred")}
                        description={error}
                        action={vocabularySelect}
                    />
                );
            case Status.Loaded:
                const { sourceLang, destLang, entries } = vocabulary;

                const content = entries.map(([word, translation, image], index) => {
                    const imageUrl = image.charAt(0) === "/" ? image : `${path}/${image}`;

                    return (
                        <tr key={index}>
                            <td>{word}</td>
                            <td>{translation}</td>
                            <td><a href={imageUrl}>{image}</a></td>
                        </tr>
                    );
                });

                return (
                    <table className="vt-viewer pt-table pt-striped">
                        <thead>
                            <tr>
                                <th>
                                    {t("word")}&nbsp;
                                    <span className="pt-text-muted">({t(`lang:${sourceLang}`)})</span>
                                </th>
                                <th>
                                    {t("translation")}&nbsp;
                                    <span className="pt-text-muted">({t(`lang:${destLang}`)})</span>
                                </th>
                                <th>
                                    {t("image")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {content}
                        </tbody>
                    </table>
                );
        }
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
}

export default ReactI18next.translate(["common", "lang"], { wait: true })(Vocabulary);
