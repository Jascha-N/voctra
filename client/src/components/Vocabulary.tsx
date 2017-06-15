import * as Blueprint from "@blueprintjs/core";
import * as React from "react";
import * as ReactI18next from "react-i18next";
import * as ReactRouter from "react-router";

import { Status, VocabularyJson } from "../containers/VocabularyLoader";

interface VocabularyProps extends ReactI18next.InjectedTranslateProps {
    status: Status;
    path?: string;
    error?: string;
    vocabulary?: VocabularyJson;
    selectVocabulary: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Vocabulary = (props: VocabularyProps) => {
    const { t } = props;
    const { status, path, error, vocabulary, selectVocabulary } = props;

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
};

export default ReactI18next.translate(["common", "lang"], { wait: true })(Vocabulary);
