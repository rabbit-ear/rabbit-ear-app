import ar from "../languages/ar-001.json?raw";
import de from "../languages/de-DE.json?raw";
import en from "../languages/en-US.json?raw";
import es from "../languages/es-ES.json?raw";
import fr from "../languages/fr-FR.json?raw";
import jp from "../languages/jp-JP.json?raw";
import ko from "../languages/ko-KR.json?raw";
import vi from "../languages/vi-VN.json?raw";
import zh from "../languages/zh-Hans.json?raw";

const dictionaryJSONs: { [key: string]: string } = {
  ar,
  de,
  en,
  es,
  fr,
  jp,
  ko,
  vi,
  zh,
};

// source for RFC 4646 language codes and their names
// https://www.venea.net/web/culture-code
type LanguageDictionary = { [key: string]: string };

// Localization JSON dictionaries will be kept in their own directory
// and saved under their RFC 4646 name.
// In-app language selection will simply select between ISO 639-1
// language codes (the .language property on this class).
// ISO 3166-1 Alpha 2 region codes will be largely ignored.
export class Localization {
  #languageDictionaries: { [key: string]: LanguageDictionary } = {};

  #language = $state("en");

  #dictionary: LanguageDictionary = $derived(
    this.#languageDictionaries[this.#language] ?? this.#languageDictionaries.en
  );

  get language(): string { return this.#language; }

  allLanguages(): { [key: string]: string } {
    const languages: { [key: string]: string } = {};
    Object.keys(this.#languageDictionaries)
      .forEach(key => { languages[key] = this.#languageDictionaries[key].name; });
    return languages;
  }

  setLanguage(code: string): void {
    this.#language = code;
  }

  constructor() {
    try {
      Object.keys(dictionaryJSONs).forEach(key => {
        const dictionary = JSON.parse(dictionaryJSONs[key]) as LanguageDictionary;
        this.#languageDictionaries[key] = dictionary;
      });
    } catch {
      window.alert("A language dictionary is corrupted");
    }
  }

  localize(key: string): string {
    return this.#dictionary[key] ?? key;
  }
}
