import * as Blueprint from "@blueprintjs/core";
import * as React from "react";
import * as ReactIntl from "react-intl";
import * as ReactRouter from "react-router";

import { Status, VocabularyJson } from "../containers/VocabularyLoader";

interface VocabularyViewerProps {
    status: Status;
    path?: string;
    error?: string;
    vocabulary?: VocabularyJson;

    onSelectVocabulary?: (name: string) => void;
}

class VocabularyViewer extends React.Component<VocabularyViewerProps & ReactIntl.InjectedIntlProps, {}> {
    private handlers = {
        change: (event: React.ChangeEvent<HTMLSelectElement>) => {
            const { onSelectVocabulary } = this.props;
            if (onSelectVocabulary) {
                onSelectVocabulary(event.target.value);
            }
        }
    };

    public render() {
        const { status, path, error, vocabulary } = this.props;
        const { intl } = this.props;

        switch (status) {
            case Status.Loading: {
                return <Blueprint.NonIdealState visual={<Blueprint.Spinner/>}/>;
            }
            case Status.NotLoaded: {
                const title = intl.formatMessage({ id: "vocabulary-viewer" });
                const description = intl.formatMessage({ id: "select-vocabulary" });

                return (
                    <Blueprint.NonIdealState
                        visual="book"
                        title={title}
                        description={description}
                        action={this.renderSelect()}
                    />
                );
            }
            case Status.Error: {
                const title = intl.formatMessage({ id: "an-error-occurred" });

                return (
                    <Blueprint.NonIdealState
                        visual="error"
                        title={title}
                        description={error}
                        action={this.renderSelect()}
                    />
                );
            }
            case Status.Loaded: {
                const { sourceLang, destLang, entries } = vocabulary!;

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

                const sourceLangText = intl.formatMessage({ id: `lang.${sourceLang}`});
                const destLangText = intl.formatMessage({ id: `lang.${destLang}`});

                return (
                    <table className="vt-viewer pt-table pt-striped">
                        <thead>
                            <tr>
                                <th>
                                    <ReactIntl.FormattedMessage id="word"/>
                                    {" "}
                                    <span className="pt-text-muted">({sourceLangText})</span>
                                </th>
                                <th>
                                    <ReactIntl.FormattedMessage id="translation"/>
                                    {" "}
                                    <span className="pt-text-muted">({destLangText})</span>
                                </th>
                                <th>
                                    <ReactIntl.FormattedMessage id="image"/>
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
    }

    private renderSelect() {
        const selectDefault = this.props.intl.formatMessage({ id: "choose-vocabulary" });

        return (
            <div className="pt-select">
                <select defaultValue="" onChange={this.handlers.change}>
                    <option value="" disabled={true} hidden={true}>{selectDefault}</option>
                    <option value="example">Example</option>
                    <option value="nope">Does not exist!</option>
                </select>
            </div>
        );
    }
}

export default ReactIntl.injectIntl(VocabularyViewer);
