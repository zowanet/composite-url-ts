export default class PercentEncoder {

	static #whitespace: Array<string> = [ '\t', '\n', '\v', '\r' ];

	static #encodeWhitespaceRegex: RegExp = new RegExp(`[${ this.#whitespace.join('') }]`, 'g');
	static #encodeWhitespaceReplacement = (match: string): string => `%${ match.codePointAt(0)!.toString(16).toUpperCase().padStart(2, '0') }`;

	static #decodeNonASCIIRegex: RegExp = /%([8-9A-Fa-f][0-9A-Fa-f])/g;
	static #decodeNonASCIIReplacement = (_: string, match: string): string => String.fromCodePoint(Number.parseInt(match, 16));

	static #encodePercentRegex: RegExp = /%([A-Fa-f0-9][^A-Fa-f0-9]|[^A-Fa-f0-9][A-Fa-f0-9]|[^A-Fa-f0-9]{2}|.?$)/g;
	static #encodePercentReplacement: string = '%25$1';

	static #encode(value: string): string {
		const predicate = (char: string): boolean => value.includes(char);
		while (this.#whitespace.some(predicate)) {
			value = value.replace(this.#encodeWhitespaceRegex, this.#encodeWhitespaceReplacement);
		}
		while (this.#decodeNonASCIIRegex.test(value)) {
			value = value.replace(this.#decodeNonASCIIRegex, this.#decodeNonASCIIReplacement).trim();
		}
		while (this.#encodePercentRegex.test(value)) {
			value = value.replace(this.#encodePercentRegex, this.#encodePercentReplacement);
		}
		return value;
	}

	public encode(value: string): string {
		return (
			value.length === 0
			? ''
			: (this.constructor as typeof PercentEncoder).#encode(value)
		);
	}
}
