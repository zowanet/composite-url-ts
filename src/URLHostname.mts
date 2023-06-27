import PercentEncoder from './PercentEncoder.mjs';

export default class URLHostname {

	static readonly #cleanArgs: [ RegExp, string ] = [ /(^\.+|\.+$)/g, '' ];

	static readonly #percentEncoder: PercentEncoder = new PercentEncoder;

	static #canonicalize(value: string): string {
		return this.#clean(
			Object.assign(
				new URL('http:hostname'),
				{
					hostname: this.#percentEncoder.encode(value),
				},
			).hostname,
		);
	}

	static #clean(value: string): string {
		return (
			value.trim()
				.replace(...this.#cleanArgs).trim()
				.toLowerCase()
		);
	}

	static #validate(value: string): string | undefined {
		try {
			if ((value = this.#clean(value)).length === 0) {
				return undefined;
			} else {
				const canonicalValue: string = this.#canonicalize(value);
				return (
					canonicalValue.length === 0
					? undefined
					: decodeURIComponent(canonicalValue)
				);
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
		const validatedValue: string | undefined = (this.constructor as typeof URLHostname).#validate(value);
		if (validatedValue === undefined) {
			throw new Error(`Invalid property URLHostname.value: ${ JSON.stringify(value) }; expected valid non-empty hostname string`);
		} else {
			this.#value = validatedValue;
		}
	}

	public render(): string {
		try {
			return (
				this.#value.length === 0
				? ''
				: (this.constructor as typeof URLHostname).#canonicalize(this.#value)
			);
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
