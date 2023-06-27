export default class URLPort {

	static readonly #cleanArgs: [ RegExp, string ] = [ /^:*0*/, '' ];

	static readonly #portMatchRegex: RegExp = /^(?:[0-9]|[1-9][0-9]{0,3}|[1-5][0-9]{4}|6(?:[0-4][0-9]{3}|5(?:[0-4][0-9]{2}|5(?:[0-2][0-9]|3[0-5]))))$/;

	static #canonicalize(value: string): string {
		return this.#clean(
			Object.assign(
				new URL('protocol://hostname'),
				{
					port: value,
				},
			).port,
		);
	}

	static #clean(value: string): string {
		return (
			value.trim()
				.replace(...this.#cleanArgs).trim()
		);
	}

	static #validate(value: bigint | number | string): string | undefined {
		try {
			const type: string = typeof value;
			if (
				(
					type === 'number'
					&& Number.isSafeInteger(value = Math.floor(value as number))
				)
				|| (
					type === 'bigint'
					&& Number.isSafeInteger(value = Number(value as bigint))
				)
				&& value >= 0
				&& value <= 0xFFFF
			) {
				return value.toString(10);
			} else if (
				(value = this.#clean(value as string)).length === 0
				|| !this.#portMatchRegex.test(value)
			) {
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

	public constructor(value: bigint | number | string) {
		this.value = (this.#value = value as string);
	}

	public get value(): string {
		return this.#value;
	}

	public set value(value: bigint | number | string) {
		const validatedValue: string | undefined = (this.constructor as typeof URLPort).#validate(value);
		if (validatedValue === undefined) {
			if (typeof value === 'bigint') {
				value = Number(value);
			}
			throw new Error(`Invalid property URLPort.value: ${ JSON.stringify(value) }; expected valid non-empty port number or string`);
		} else {
			this.#value = validatedValue;
		}
	}

	public render(): string {
		return this.#value;
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
