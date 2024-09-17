// Copyright (C) 2020 John Nesky, distributed under the MIT license.

import { HTML } from "imperative-html/dist/esm/elements-strict.js";
import { Prompt } from "./Prompt.js";
import { SongDocument } from "./SongDocument.js";
import { ColorConfig } from "./ColorConfig.js";

//namespace beepbox {
const { button, div, h2, select, option } = HTML;

export class ThemePrompt implements Prompt {
	private readonly _themeSelect: HTMLSelectElement = select({ style: "width: 100%;" },
		option({ value: "dark classic" }, "BeepBox Dark"),
		option({ value: "dark competition" }, "BeepBox Competitive"),
		option({ value: "light classic" }, "BeepBox Light"),
		option({ value: "light competition" }, "BeepBox Light Competitive"),
		option({ value: "marine" }, "Marine"),
		option({ value: "flame" }, "Flame"),
		option({ value: "amber" }, "Amber"),
		option({ value: "emerald" }, "Emerald"),
		option({ value: "amethyst" }, "Amethyst"),
	);
	private readonly Okay: string | null = window.localStorage.getItem("language") === "german" ? "Ok" : window.localStorage.getItem("language") === "english" ? "Okay" : null
	private readonly SetTheme: string | null = window.localStorage.getItem("language") === "german" ? "Such einen Theme aus" : window.localStorage.getItem("language") === "english" ? "Set Theme" : window.localStorage.getItem("language") === "spanish" ? "Establecer tema" : null

	private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });
	private readonly _okayButton: HTMLButtonElement = button({ class: "okayButton", style: "width:45%;" }, this.Okay);

	public readonly container: HTMLDivElement = div({ class: "prompt noSelection", style: "width: 220px;" },
		h2(this.SetTheme),
		div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
			div({ class: "selectContainer", style: "width: 100%;" }, this._themeSelect),
		),
		div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" },
			this._okayButton,
		),
		this._cancelButton,
	);
	private readonly lastTheme: string | null = window.localStorage.getItem("colorTheme")

	constructor(private _doc: SongDocument) {
		if (this.lastTheme != null) {
			this._themeSelect.value = this.lastTheme;
		}
		this._okayButton.addEventListener("click", this._saveChanges);
		this._cancelButton.addEventListener("click", this._close);
		this.container.addEventListener("keydown", this._whenKeyPressed);
		this._themeSelect.addEventListener("change", this._previewTheme);
	}

	private _close = (): void => {
		if (this.lastTheme != null) {
			ColorConfig.setTheme(this.lastTheme);
		} else {
			ColorConfig.setTheme("dark classic");
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
		window.localStorage.setItem("colorTheme", this._themeSelect.value);
		this._doc.prompt = null;
		this._doc.prefs.colorTheme = this._themeSelect.value;
		this._doc.undo();
	}

	private _previewTheme = (): void => {
		ColorConfig.setTheme(this._themeSelect.value);
		this._doc.notifier.changed();
	}
}
//}