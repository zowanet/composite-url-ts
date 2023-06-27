# composite-url

### Install

```bash
npm install @zowanet/composite-url
```

```bash
yarn add @zowanet/composite-url
```

```bash
pnpm add @zowanet/composite-url
```

### Import

```typescript
import CompositeURL from '@zowanet/composite-url';
```

```javascript
const { default: CompositeURL } = await import('@zowanet/composite-url');
```

### Usage

```typescript
console.log(new CompositeURL({
    protocol: 'protocol',
    username: 'username',
    password: 'password',
    hostname: 'hostname',
    port: 9999,
    pathname: 'pathname',
    search: 'search',
    hash: 'hash',
}).href); // "protocol://username:password@hostname:9999/pathname?search#hash"

console.log(new CompositeURL({
	uri: '/path/to/file?foo=bar&baz=qux#fragment',
}).pathname); // "/path/to/file"
```
