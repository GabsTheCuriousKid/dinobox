// Copyright (c) John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import {Scale, Config} from "../synth/SynthConfig.js";

export class ThemePreferences {
	public static readonly defaultVisibleOctaves: number = 3;
	
	public colorTheme: string;
	
	constructor() {
		this.reload();
	}
	
	public reload(): void {
		this.colorTheme = window.localStorage.getItem("colorTheme") || "dark classic";
	}
	
	public save(): void {
		window.localStorage.setItem("colorTheme", this.colorTheme);
	}
}
