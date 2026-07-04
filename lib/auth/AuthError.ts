export class AuthError extends Error {
  constructor(public kind: 'invalid-credentials' | 'unreachable' | 'validation') {
    super(kind);
  }
}
