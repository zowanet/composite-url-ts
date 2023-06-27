import PercentEncoder from './PercentEncoder.mjs';

export default class URLPathname {

	static readonly #cleanArgs: [ RegExp, string ] = [ /\/+/g, '/' ];

	static readonly #fixArgs: [ RegExp, string ] = [ /^\/*/, '/' ];

	static readonly #percentEncoder: PercentEncoder = new PercentEncoder;

	static #canonicalize(value: string): string {
		return this.#clean(
			Object.assign(
				new URL('http:hostname'),
				{
					pathname: this.#percentEncoder.encode(this.#clean(value)),
				},
			).pathname,
		);
	}

	static #clean(value: string): string {
		return (
			value.trim()
				.replace(...this.#cleanArgs).trim()
				.replace(...this.#fixArgs).trim()
		);
	}

	static #validate(value: string): string | undefined {
		try {
			if (typeof value !== 'string') {
				return undefined;
			} else {
				return decodeURIComponent(this.#canonicalize(value));
			}
		} catch (_: unknown) {
			return undefined;
		}
	}

	#value: string;

	public constructor(value: string) {
		this.value = (this.#value = value);
	}

	public get value(): string {
		return this.#value;
	}

	public set value(value: string) {
		const validatedValue: string | undefined = (this.constructor as typeof URLPathname).#validate(value);
		if (validatedValue === undefined) {
			throw new Error(`Invalid property URLPathname.value: ${ JSON.stringify(value) }; expected valid non-empty pathname string`);
		} else {
			this.#value = validatedValue;
		}
	}

	public render(): string {
		try {
			return (this.constructor as typeof URLPathname).#canonicalize(this.#value);
		} catch (_: unknown) {
			return '';
		}
	}

	public toJSON(): string {
		return String(this);
	}

	public toString(): string {
		return this.valueOf();
	}

	public valueOf(): string {
		return this.#value;
	}
}
