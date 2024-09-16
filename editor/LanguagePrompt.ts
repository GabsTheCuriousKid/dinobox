// Copyright (C) 2020 John Nesky, distributed under the MIT license.

import { HTML } from "imperative-html/dist/esm/elements-strict.js";
import { Prompt } from "./Prompt.js";
import { SongDocument } from "./SongDocument.js";

//namespace beepbox {
const { button, div, h2, p, select, option } = HTML;

export class LanguagePrompt implements Prompt {
	private readonly _languageSelect: HTMLSelectElement = select({ style: "width: 100%;" },
		option({ value: "english" }, "English"),
		option({ value: "german" }, "Deutsch"),
	);
	private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });
	private readonly _okayButton: HTMLButtonElement = button({ class: "okayButton", style: "width:45%;" }, "Okay");

	public readonly container: HTMLDivElement = div({ class: "prompt noSelection", style: "width: 220px;" },
		h2("Set Language"),
		
		div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
			div({ class: "selectContainer", style: "width: 100%;" }, this._languageSelect),
		),
		p({style: "text-align: left; margin: 0.5em 0;"},
			"this doesn't work right now."
		),
		div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" },
			this._okayButton,
		),
		this._cancelButton,
	);

	private readonly lastLanguage: string | null = window.localStorage.getItem("language")

	constructor(private _doc: SongDocument) {
		if (this.lastLanguage != null) {
			this._languageSelect.value = this.lastLanguage;
		}
		this._okayButton.addEventListener("click", this._saveChanges);
		this._cancelButton.addEventListener("click", this._close);
		this.container.addEventListener("keydown", this._whenKeyPressed);
		this._languageSelect.addEventListener("change", this._previewLanguage);
	}

	private _close = (): void => {
		if (this.lastLanguage != null) {
			window.localStorage.setItem("language", this.lastLanguage);
		} else {
			window.localStorage.setItem("language", "english");
		}
		this._doc.undo();
	}

	public cleanUp = (): void => {
		this._okayButton.removeEventListener("click", this._saveChanges);
		this._cancelButton.removeEventListener("click", this._close);
		this.container.removeEventListener("keydown", this._whenKeyPressed);
	}

	private _whenKeyPressed = (event: KeyboardEvent): void => {
		if ((<Element>event.target).tagName != "BUTTON" && event.keyCode == 13) { // Enter key
			this._saveChanges();
		}
	}

	private _saveChanges = (): void => {
		window.localStorage.setItem("language", this._languageSelect.value);
		this._doc.prompt = null;
		this._doc.undo();
	}

	private _previewLanguage = (): void => {
		this._doc.notifier.changed();
	}
}
//}