// Copyright (C) 2020 John Nesky, distributed under the MIT license.

import { HTML } from "imperative-html/dist/esm/elements-strict.js";
import { Prompt } from "./Prompt.js";
import { SongDocument } from "./SongDocument.js";
import { ColorConfig } from "./ColorConfig.js";

//namespace beepbox {
const { button, div, h2, select, option } = HTML;

export class ThemePrompt implements Prompt {
	private readonly isMobile: boolean = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|android|ipad|playbook|silk/i.test(navigator.userAgent) )
	private readonly _themeSelect: HTMLSelectElement = select({ style: "width: 100%;" },
		option({ value: "dark classic" }, "BeepBox Dark"),
		option({ value: "dark competition" }, "BeepBox Competitive"),
		option({ value: "light classic" }, "BeepBox Light"),
		option({ value: "light competition" }, "BeepBox Light Competitive"),
		option({ value: "dark dinobox" }, "DinoBox Dark"),
		option({ value: "marine" }, "Marine"),
		option({ value: "flame" }, "Flame"),
		option({ value: "amber" }, "Amber"),
		option({ value: "emerald" }, "Emerald"),
		option({ value: "amethyst" }, "Amethyst"),
	);
	private readonly _fontSelect: HTMLSelectElement = select({ style: "width: 100%;" },
		option({ style: "font-family: \'Roboto\', sans-serif;", value: "roboto" }, "Roboto (Default)"),
		!this.isMobile ? option({ style: "font-family: \'Gill Sans\', \'Gill Sans MT\', Calibri, \'Trebuchet MS\', sans-serif;", value: "gillsans" }, "Gill Sans") : null,
		!this.isMobile ? option({ style: "font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif;", value: "segoeui" }, "Segoe UI") : null,
		option({ style: "font-family: \'Courier New\', Courier, monospace;", value: "couriernew" }, "Courier New"),
	);
	private readonly Okay: string | null = window.localStorage.getItem("language") === "german" ? "Ok" : window.localStorage.getItem("language") === "english" ? "Okay" : window.localStorage.getItem("language") === "spanish" ? "Ok" : window.localStorage.getItem("language") === "russian" ? "ОК" : null
	private readonly SetTheme: string | null = window.localStorage.getItem("language") === "german" ? "Such einen Theme aus" : window.localStorage.getItem("language") === "english" ? "Set Theme" : window.localStorage.getItem("language") === "spanish" ? "Establecer tema" : window.localStorage.getItem("language") === "russian" ? "Установить тему" : null

	private readonly SetFont: string | null = window.localStorage.getItem("language") === "german" ? "Schriftart festlegen" : window.localStorage.getItem("language") === "english" ? "Set Font" : window.localStorage.getItem("language") === "spanish" ? "Configurar fuente" : window.localStorage.getItem("language") === "russian" ? "задать шрифт" : null

	private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });
	private readonly _okayButton: HTMLButtonElement = button({ class: "okayButton", style: "width:45%;" }, this.Okay);

	public readonly container: HTMLDivElement = div({ class: "prompt noSelection", style: "width: 220px;" },
		h2(this.SetTheme),
		div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
			div({ class: "selectContainer", style: "width: 100%;" }, this._themeSelect),
		),
		h2(this.SetFont),
		div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
			div({ class: "selectContainer", style: "width: 100%;" }, this._fontSelect),
		),
		div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" },
			this._okayButton,
		),
		this._cancelButton,
	);
	private readonly lastTheme: string | null = window.localStorage.getItem("colorTheme")

	private readonly lastFont: string | null = window.localStorage.getItem("chosenFont")

	constructor(private _doc: SongDocument) {
		if (this.lastTheme != null) {
			this._themeSelect.value = this.lastTheme;
		}
		if (this.lastFont != null) {
			this._fontSelect.value = this.lastFont;
		}
		this._okayButton.addEventListener("click", this._saveChanges);
		this._cancelButton.addEventListener("click", this._close);
		this.container.addEventListener("keydown", this._whenKeyPressed);
		this._themeSelect.addEventListener("change", this._previewTheme);
		this._fontSelect.addEventListener("change", this._preview);
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
		window.localStorage.setItem("chosenFont", this._fontSelect.value);
		this._doc.prompt = null;
		this._doc.prefs.colorTheme = this._themeSelect.value;
		this._doc.undo();
	}

	private _previewTheme = (): void => {
		ColorConfig.setTheme(this._themeSelect.value);
		this._doc.notifier.changed();
	}

	private _preview = (): void => {
		this._doc.notifier.changed();
	}
}
//}