export default class URLSearch {

	static #cleanArgs: [ RegExp, string ] = [ /^\?+/, '' ];

	static #fixArgs: [ RegExp, string ] = [ /=(&|$)/g, '$1' ];

	static #clean(value: string): string {
		return (
			value.trim()
				.replace(...this.#cleanArgs).trim()
				.replace(...this.#fixArgs).trim()
		);
	}

	static #validate(value: string | URLSearchParams): URLSearchParams | undefined {
		try {
			if (value instanceof URLSearchParams) {
				return value;
			} else if (
				typeof value !== 'string'
				|| (value = this.#clean(value)).length === 0
			) {
				return undefined;
			} else {
				return new URLSearchParams(value);
			}
		} catch (_: unknown) {
			return undefined;
		}
	}

	#value: URLSearchParams;

	public constructor(value: string | URLSearchParams) {
		this.value = (this.#value = value as URLSearchParams);
	}

	public get value(): URLSearchParams {
		return this.#value;
	}

	public set value(value: string | URLSearchParams) {
		const validatedSearchParams: URLSearchParams | undefined = (this.constructor as typeof URLSearch).#validate(value);
		if (validatedSearchParams === undefined) {
			throw new Error(`Invalid property URLSearch.value: ${ JSON.stringify(value) }; expected instance of URLSearchParams or valid non-empty search string`);
		} else {
			this.#value = validatedSearchParams;
		}
	}

	public render(): string {
		try {
			return (this.constructor as typeof URLSearch).#clean(this.#value.toString());
		} catch (_: unknown) {
			return '';
		}
	}

	public toJSON(): Record<string, string> {
		return Object.fromEntries(this.#value.entries());
	}

	public toString(): string {
		return (this.constructor as typeof URLSearch).#clean(this.#value.toString());
	}

	public valueOf(): URLSearchParams {
		return this.#value;
	}
}
