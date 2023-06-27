export default class URLPassword {

	static #canonicalize(value: string): string {
		return this.#clean(
			decodeURIComponent(
				Object.assign(
					new URL('http://username@hostname'),
					{
						password: encodeURIComponent(value),
					},
				).password,
			),
		);
	}

	static #clean(value: string): string {
		return value.trim();
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
					: canonicalValue
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
		const validatedValue: string | undefined = (this.constructor as typeof URLPassword).#validate(value);
		if (validatedValue === undefined) {
			throw new Error(`Invalid property URLPassword.value: ${ JSON.stringify(value) }; expected valid non-empty password string`);
		} else {
			this.#value = validatedValue;
		}
	}

	public render(): string {
		try {
			return (
				this.#value.length === 0
				? ''
				: encodeURIComponent(
					(this.constructor as typeof URLPassword).#canonicalize(this.#value)
				)
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
