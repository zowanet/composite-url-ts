import URLProtocol from './URLProtocol.mjs';
import URLUsername from './URLUsername.mjs';
import URLPassword from './URLPassword.mjs';
import URLHostname from './URLHostname.mjs';
import URLPort from './URLPort.mjs';
import URLPathname from './URLPathname.mjs';
import URLSearch from './URLSearch.mjs';
import URLHash from './URLHash.mjs';

export default class CompositeURL {

	#protocol: URLProtocol | undefined;
	#username: URLUsername | undefined;
	#password: URLPassword | undefined;
	#hostname: URLHostname | undefined;
	#port: URLPort | undefined;
	#pathname: URLPathname | undefined;
	#search: URLSearch | undefined;
	#hash: URLHash | undefined;

	public constructor({
		href,
		origin,
		host,
		uri,
		protocol,
		username,
		password,
		hostname,
		port,
		pathname,
		search,
		searchParams,
		hash,
	}: {
		href?: string;
		origin?: string;
		host?: string;
		uri?: string;
		protocol?: string;
		username?: string;
		password?: string;
		hostname?: string;
		port?: string;
		pathname?: string;
		search?: string;
		searchParams?: string;
		hash?: string;
	} = {}) {
		if (href !== undefined) {
			this.href = href;
		}
		if (origin !== undefined) {
			this.origin = origin;
		}
		if (host !== undefined) {
			this.host = host;
		}
		if (uri !== undefined) {
			this.uri = uri;
		}
		if (protocol !== undefined) {
			this.protocol = protocol;
		}
		if (username !== undefined) {
			this.username = username;
		}
		if (password !== undefined) {
			this.password = password;
		}
		if (hostname !== undefined) {
			this.hostname = hostname;
		}
		if (port !== undefined) {
			this.port = port;
		}
		if (pathname !== undefined) {
			this.pathname = pathname;
		}
		if (search !== undefined) {
			this.search = search;
		}
		if (searchParams !== undefined) {
			this.search = searchParams;
		}
		if (hash !== undefined) {
			this.hash = hash;
		}
	}

	public get href(): string {
		const renderedProtocol: string = this.#protocol?.render() ?? '';
		const renderedHost: string = this.host;
		const renderedUsername: string = renderedHost.length === 0 ? '' : (this.#username?.render() ?? '');
		const renderedPassword: string = renderedUsername.length === 0 ? '' : (this.#password?.render() ?? '');
		return [
			renderedProtocol,
			(renderedProtocol.length === 0 && renderedHost.length === 0) ? '' : '://',
			renderedUsername,
			renderedPassword.length === 0 ? '' : ':',
			renderedPassword,
			renderedUsername.length === 0 ? '' : '@',
			renderedHost,
			this.uri,
		].join('');
	}

	public get origin(): string {
		const renderedHost: string = this.host;
		const renderedProtocol: string = this.#protocol?.render() ?? '';
		return [
			renderedProtocol,
			(renderedHost.length === 0 && renderedProtocol.length === 0) ? '' : '//',
			renderedHost,
		].join('');
	}

	public get host(): string {
		const renderedProtocol: string = this.#protocol?.render() ?? '';
		const renderedHostname: string = this.#hostname?.render() ?? '';
		const port: string = this.#port?.value ?? '';
		const renderedPort: string = (
			(
				renderedHostname.length === 0
				|| (renderedProtocol === 'http' && port === '80')
				|| (renderedProtocol === 'https' && port === '443')
				|| (renderedProtocol === 'ssh' && port === '22')
			)
			? ''
			: (this.#port?.render() ?? '')
		);
		return [
			renderedHostname,
			renderedPort.length === 0 ? '' : ':',
			renderedPort,
		].join('');
	}

	public get uri(): string {
		const renderedSearch: string = this.#search?.render() ?? '';
		const renderedHash: string = this.#hash?.render() ?? '';
		return [
			this.#pathname?.render() ?? '/',
			renderedSearch.length === 0 ? '' : '?',
			renderedSearch,
			renderedHash.length === 0 ? '' : '#',
			renderedHash,
		].join('');
	}

	public get protocol(): string {
		return String(this.#protocol ?? '');
	}

	public get username(): string {
		return String(this.#username ?? '');
	}

	public get password(): string {
		return String(this.#password ?? '');
	}

	public get hostname(): string {
		return String(this.#hostname ?? '');
	}

	public get port(): string {
		const port: string = String(this.#port ?? '');
		if (port.length === 0) {
			switch (this.protocol) {
				case 'https':
					return '443';
				case 'http':
					return '80';
				case 'ssh':
					return '22';
				default:
					return '';
			}
		} else {
			return port;
		}
	}

	public get pathname(): string {
		return String(this.#pathname ?? '/');
	}

	public get search(): string {
		return String(this.#search ?? '');
	}

	public get searchParams(): URLSearchParams {
		return this.#search?.value ?? new URLSearchParams;
	}

	public get hash(): string {
		return String(this.#hash ?? '');
	}

	public set href(href: string) {
		try {
			const url: URL = new URL(href);
			this.protocol = url.protocol;
			this.username = url.username;
			this.password = url.password;
			this.hostname = url.hostname;
			this.port = url.port;
			this.pathname = url.pathname;
			this.search = url.searchParams;
			this.hash = url.hash;
		} catch (_: unknown) {
			throw new Error(`Invalid property CompositeURL(href): ${ JSON.stringify(href) }; expected valid non-empty href string`);
		}
	}

	public set origin(origin: string) {
		try {
			const url: URL = new URL(`${ origin }/pathname?search#hash`);
			const protocol: string = url.protocol;
			const port: string = url.port;
			if (
				url.origin === origin
				|| (
					url.origin === origin.replace(/:[0-9]+$/, '')
					&& (
						(protocol === 'http:' && port.length === 0)
						|| (protocol === 'https:' && port.length === 0)
					)
				)
			) {
				this.protocol = protocol;
				this.hostname = url.hostname;
				if (port.length > 0) {
					this.port = port;
				} else if (protocol === 'http:') {
					this.port = 80;
				} else if (protocol === 'https:') {
					this.port = 443;
				}
			} else {
				throw undefined;
			}
		} catch (_: unknown) {
			throw new Error(`Invalid property CompositeURL(origin): ${ JSON.stringify(origin) }; expected valid non-empty origin string`);
		}
	}

	public set host(host: string) {
		try {
			const url: URL = new URL(`http://${ host }/`);
			const port: string = url.port;
			if (url.host === host) {
				this.hostname = url.hostname;
				if (port.length > 0) {
					this.port = port;
				}
			} else {
				throw undefined;
			}
		} catch (_) {
			throw new Error(`Invalid property CompositeURL(host): ${ JSON.stringify(host) }; expected valid non-empty host string`);
		}
	}

	public set uri(uri: string) {
		try {
			const url: URL = new URL(`http://host/${ uri }`);
			if (url.href.slice(12).replace(/^\/+/, '') === uri.replace(/^\/+/, '')) {
				this.pathname = url.pathname;
				this.search = url.searchParams;
				this.hash = url.hash;
			} else {
				throw undefined;
			}
		} catch (_) {
			throw new Error(`Invalid property CompositeURL(uri): ${ JSON.stringify(uri) }; expected valid non-empty uri string`);
		}
	}

	public set protocol(protocol: any) {
		if (!protocol) {
			this.clearProtocol();
		} else {
			this.#protocol = new URLProtocol(protocol);
		}
	}

	public set username(username: any) {
		if (!username) {
			this.clearUsername();
		} else {
			this.#username = new URLUsername(username);
		}
	}

	public set password(password: any) {
		if (!password) {
			this.clearPassword();
		} else {
			this.#password = new URLPassword(password);
		}
	}

	public set hostname(hostname: any) {
		if (!hostname) {
			this.clearHostname();
		} else {
			this.#hostname = new URLHostname(hostname);
		}
	}

	public set port(port: any) {
		if (!port) {
			this.clearPort();
		} else {
			this.#port = new URLPort(port);
		}
	}

	public set pathname(pathname: any) {
		if (!pathname) {
			this.clearPathname();
		} else {
			this.#pathname = new URLPathname(pathname);
		}
	}

	public set search(search: any) {
		if (!search) {
			this.clearSearch();
		} else {
			this.#search = new URLSearch(search);
		}
	}

	public set searchParams(searchParams: any) {
		this.search = searchParams;
	}

	public set hash(hash: any) {
		if (!hash) {
			this.clearHash();
		} else {
			this.#hash = new URLHash(hash);
		}
	}

	public clearProtocol(): void {
		this.#protocol = undefined;
	}

	public clearUsername(): void {
		this.#username = undefined;
	}

	public clearPassword(): void {
		this.#password = undefined;
	}

	public clearHostname(): void {
		this.#hostname = undefined;
	}

	public clearPort(): void {
		this.#port = undefined;
	}

	public clearPathname(): void {
		this.#pathname = undefined;
	}

	public clearSearch(): void {
		this.#search = undefined;
	}

	public clearHash(): void {
		this.#hash = undefined;
	}

	public toJSON(): Record<string, string | Record<string, string>> {
		return Object.assign({}, Object.fromEntries(Object.entries(
			{
				protocol: this.#protocol?.value,
				username: this.#username?.value,
				password: this.#password?.value,
				hostname: this.#hostname?.value,
				port: this.port || undefined,
				pathname: this.pathname,
				search: (
					(this.#search?.value as URLSearchParams & { size: number }).size === 0
					? undefined
					: this.#search?.toJSON()
				),
				hash: this.#hash?.value,
			},
		).filter(
			(value: [ string, string | Record<string, string> | undefined ]): value is [ string, string | Record<string, string> ] => (
				value !== undefined
			),
		)));
	}

	public toString(): string {
		return this.valueOf();
	}

	public valueOf(): string {
		return this.href;
	}
}
