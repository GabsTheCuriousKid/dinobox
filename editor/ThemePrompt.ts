// Copyright (C) 2020 John Nesky, distributed under the MIT license.

import { HTML } from "imperative-html/dist/esm/elements-strict.js";
import { Prompt } from "./Prompt.js";
import { SongDocument } from "./SongDocument.js";
import { ColorConfig } from "./ColorConfig.js";

//namespace beepbox {
const { button, div, h2, p, select, option, input } = HTML;

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
		option({ value: "custom_theme" }, "Custom"),
	);
	private readonly _fontSelect: HTMLSelectElement = select({ style: "width: 100%;" },
		option({ style: "font-family: \'Roboto\', sans-serif;", value: "roboto" }, "Roboto (Default)"),
		!this.isMobile ? option({ style: "font-family: \'Gill Sans\', \'Gill Sans MT\', Calibri, \'Trebuchet MS\', sans-serif;", value: "gillsans" }, "Gill Sans") : null,
		!this.isMobile ? option({ style: "font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif;", value: "segoeui" }, "Segoe UI") : null,
		option({ style: "font-family: \'Courier New\', Courier, monospace;", value: "couriernew" }, "Courier New"),
		!this.isMobile ? option({ style: "font-family: Impact, Haettenschweiler, \'Arial Narrow Bold\', sans-serif;", value: "impact" }, "Impact") : null,
	);
	private readonly Okay: string | null = window.localStorage.getItem("language") === "german" ? "Ok" : window.localStorage.getItem("language") === "english" ? "Okay" : window.localStorage.getItem("language") === "spanish" ? "Ok" : window.localStorage.getItem("language") === "russian" ? "ОК" : null
	private readonly SetTheme: string | null = window.localStorage.getItem("language") === "german" ? "Such einen Theme aus" : window.localStorage.getItem("language") === "english" ? "Set Theme" : window.localStorage.getItem("language") === "spanish" ? "Establecer tema" : window.localStorage.getItem("language") === "russian" ? "Установить тему" : null

	private readonly SetFont: string | null = window.localStorage.getItem("language") === "german" ? "Schriftart festlegen" : window.localStorage.getItem("language") === "english" ? "Set Font" : window.localStorage.getItem("language") === "spanish" ? "Configurar fuente" : window.localStorage.getItem("language") === "russian" ? "задать шрифт" : null

	private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });
	private readonly _okayButton: HTMLButtonElement = button({ class: "okayButton", style: "width:45%;" }, this.Okay);

	private readonly customTheme_LastPageMargin: string = window.localStorage.getItem("custom_PageMargin") || 'black';
	private readonly customTheme_LastEditorBackground: string = window.localStorage.getItem("custom_EditorBackground") || 'black';
	private readonly customTheme_LastHoverPreview: string = window.localStorage.getItem("custom_HoverPreview") || 'white';
	private readonly customTheme_LastPlayHead: string = window.localStorage.getItem("custom_PlayHead") || 'white';

	private readonly customTheme_LastPrimaryText: string = window.localStorage.getItem("custom_PrimaryText") || 'white';
	private readonly customTheme_LastSecondaryText: string = window.localStorage.getItem("custom_SecondaryText") || '#999';
	private readonly customTheme_LastInvertedText: string = window.localStorage.getItem("custom_InvertedText") || 'black';

	private readonly _resetColorsButton: HTMLButtonElement = button({ style: "width:55%;" }, "Reset Colors");

	private readonly _customTheme_PageMargin: HTMLInputElement = input({ class: "custom pageMargin", type: "color", style: "width:45%;" });
	private readonly _customTheme_EditorBackground: HTMLInputElement = input({ class: "custom editorBackground", type: "color", style: "width:45%;" });
	private readonly _customTheme_HoverPreview: HTMLInputElement = input({ class: "custom hoverPreview", type: "color", style: "width:45%;" });
	private readonly _customTheme_PlayHead: HTMLInputElement = input({ class: "custom playHead", type: "color", style: "width:45%;" });

	private readonly _resetMainButton: HTMLButtonElement = button({ style: "width:60%;" }, "Reset Main Colors");

	private readonly _customTheme_PrimaryText: HTMLInputElement = input({ class: "custom primaryText", type: "color", style: "width:45%;" });
	private readonly _customTheme_SecondaryText: HTMLInputElement = input({ class: "custom secondaryText", type: "color", style: "width:45%;" });
	private readonly _customTheme_InvertedText: HTMLInputElement = input({ class: "custom invertedText", type: "color", style: "width:45%;" });

	private readonly _resetTextButton: HTMLButtonElement = button({ style: "width:60%;" }, "Reset Text Colors");

	private readonly lastTheme: string | null = window.localStorage.getItem("colorTheme")

	private readonly lastFont: string | null = window.localStorage.getItem("chosenFont")

	private readonly _customThemeSection: HTMLDivElement = div({ class: "Main", style: "display: none;" },
		button({ class: "collapsible", style: "margin-bottom: 5px;" }, "Customize Main Colors"),
		div({ class: "collapseContent", style: "display: none;" },
			div({ class: "Main" },
				div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
					p("Page Margin:"),
					this._customTheme_PageMargin,
				),
				div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
					p("Editor Background:"),
					this._customTheme_EditorBackground,
				),
				div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
					p("Hover Preview:"),
					this._customTheme_HoverPreview,
				),
				div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
					p("Play Head:"),
					this._customTheme_PlayHead,
				),
				div({},
					this._resetMainButton,
				),
			),
		),
		button({ class: "collapsible", style: "margin-bottom: 5px;" }, "Customize Text Colors"),
		div({ class: "collapseContent", style: "display: none;" },
			div({ class: "Text" },
				div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
					p("Primary Text:"),
					this._customTheme_PrimaryText,
				),
				div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
					p("Secondary Text:"),
					this._customTheme_SecondaryText,
				),
				div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
					p("Inverted Text:"),
					this._customTheme_InvertedText,
				),
				div({},
					this._resetTextButton,
				),
			),
		),
		this._resetColorsButton,
	);

	public readonly container: HTMLDivElement = div({ class: "prompt noSelection", style: "width: 220px;" },
		h2(this.SetTheme),
		div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
			div({ class: "selectContainer", style: "width: 100%;" }, this._themeSelect),
			div({ id: "customThemeSection" }),
		),
		this._customThemeSection,
		h2(this.SetFont),
		div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
			div({ class: "selectContainer", style: "width: 100%;" }, this._fontSelect),
		),
		div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" },
			this._okayButton,
		),
		this._cancelButton,
	);

	constructor(private _doc: SongDocument) {
		if (this.lastTheme != null) {
			this._themeSelect.value = this.lastTheme;
		}
		if (this.lastFont != null) {
			this._fontSelect.value = this.lastFont;
		}
		this._customTheme_PageMargin.value = this.customTheme_LastPageMargin;
		this._customTheme_EditorBackground.value = this.customTheme_LastEditorBackground;
		this._customTheme_HoverPreview.value = this.customTheme_LastHoverPreview;
		this._customTheme_PlayHead.value = this.customTheme_LastPlayHead;
		this._customTheme_PrimaryText.value = this.customTheme_LastPrimaryText;
		this._customTheme_SecondaryText.value = this.customTheme_LastSecondaryText;
		this._customTheme_InvertedText.value = this.customTheme_LastInvertedText;
		
		this._okayButton.addEventListener("click", this._saveChanges);
		this._cancelButton.addEventListener("click", this._close);
		this._resetMainButton.addEventListener("click", this._resetMainColors);
		this._resetTextButton.addEventListener("click", this._resetTextColors);
		this._resetColorsButton.addEventListener("click", this._resetColors);
		this.container.addEventListener("keydown", this._whenKeyPressed);
		this._themeSelect.addEventListener("change", this._previewTheme);
		this._customTheme_PageMargin.addEventListener("change", this._changePageMargin);
		this._customTheme_EditorBackground.addEventListener("change", this._changeEditorBackground);
		this._customTheme_HoverPreview.addEventListener("change", this._changeHoverPreview);
		this._customTheme_PlayHead.addEventListener("change", this._changePlayHead);
		this._customTheme_PrimaryText.addEventListener("change", this._changePrimaryText);
		this._customTheme_SecondaryText.addEventListener("change", this._changeSecondaryText);
		this._customTheme_InvertedText.addEventListener("change", this._changeInvertedText);
		this._fontSelect.addEventListener("change", this._preview);
		this._themeSelect.addEventListener("change", this._handleThemeChange);

		this._initCollapsibleSections();

		this._handleThemeChange();
	}

	private _initCollapsibleSections(): void {
		const collapsibles = this.container.querySelectorAll(".collapsible");
		collapsibles.forEach((collapsible) => {
			collapsible.addEventListener("click", (event) => {
				const target = event.currentTarget as HTMLElement;
				target.classList.toggle("active");
				const content = target.nextElementSibling as HTMLElement;
				if (content.style.display === "block") {
					content.style.display = "none";
				} else {
					content.style.display = "block";
				}
			});
		});
	}

	private _handleThemeChange = (): void => {
		if (this._themeSelect.value === "custom_theme") {
			this._customThemeSection.style.display = "block"; // Show custom theme section
		} else {
			this._customThemeSection.style.display = "none"; // Hide custom theme section
		}
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
		window.location.reload();
	}

	private _previewTheme = (): void => {
		ColorConfig.setTheme(this._themeSelect.value);
		this._doc.notifier.changed();
	}

	private _preview = (): void => {
		this._doc.notifier.changed();
	}

	private _resetColors = (): void => {
		if (confirm("Are you sure?") === true) {
			window.localStorage.setItem("custom_PageMargin", "black");
			window.localStorage.setItem("custom_EditorBackground", "black");
			window.localStorage.setItem("custom_HoverPreview", "white");
			window.localStorage.setItem("custom_PlayHead", "white");
			window.localStorage.setItem("custom_PrimaryText", "white");
			window.localStorage.setItem("custom_SecondaryText", "#999");
			window.localStorage.setItem("custom_InvertedText", "black");
			window.location.reload()
			this._previewTheme();
		}
	}

	private _changePageMargin = (): void => {
		window.localStorage.setItem("custom_PageMargin", this._customTheme_PageMargin.value);
		this._previewTheme();
	}
	private _changeEditorBackground = (): void => {
		window.localStorage.setItem("custom_EditorBackground", this._customTheme_EditorBackground.value);
		this._previewTheme();
	}
	private _changeHoverPreview = (): void => {
		window.localStorage.setItem("custom_HoverPreview", this._customTheme_HoverPreview.value);
		this._previewTheme();
	}
	private _changePlayHead = (): void => {
		window.localStorage.setItem("custom_PlayHead", this._customTheme_PlayHead.value);
		this._previewTheme();
	}
	private _resetMainColors = (): void => {
		if (confirm("Are you sure?") === true) {
			window.localStorage.setItem("custom_PageMargin", "black");
			window.localStorage.setItem("custom_EditorBackground", "black");
			window.localStorage.setItem("custom_HoverPreview", "white");
			window.localStorage.setItem("custom_PlayHead", "white");
			window.location.reload()
			this._previewTheme();
		}
	}

	private _changePrimaryText = (): void => {
		window.localStorage.setItem("custom_PrimaryText", this._customTheme_PrimaryText.value);
		this._previewTheme();
	}
	private _changeSecondaryText = (): void => {
		window.localStorage.setItem("custom_SecondaryText", this._customTheme_SecondaryText.value);
		this._previewTheme();
	}
	private _changeInvertedText = (): void => {
		window.localStorage.setItem("custom_InvertedText", this._customTheme_InvertedText.value);
		this._previewTheme();
	}
	private _resetTextColors = (): void => {
		if (confirm("Are you sure?") === true) {
			window.localStorage.setItem("custom_PrimaryText", "white");
			window.localStorage.setItem("custom_SecondaryText", "#999");
			window.localStorage.setItem("custom_InvertedText", "black");
			window.location.reload()
			this._previewTheme();
		}
	}
}
//}