import { canLogInOnThisPhone, isSessionRejected, notifySessionRejected, onSessionRejected } from './session';

describe('isSessionRejected', () => {
  const withToken = { url: '/issues/', headers: { Authorization: 'Token abc' } };

  it('detects a 401 on an authenticated call', () => {
    expect(isSessionRejected(401, withToken)).toBe(true);
  });

  it('ignores other statuses, calls without token and the login call', () => {
    expect(isSessionRejected(403, withToken)).toBe(false);
    expect(isSessionRejected(500, withToken)).toBe(false);
    expect(isSessionRejected(401, { url: '/issues/', headers: {} })).toBe(false);
    expect(isSessionRejected(401, { url: '/authentication/login/', headers: { Authorization: 'Token abc' } })).toBe(false);
    expect(isSessionRejected(401, undefined)).toBe(false);
  });
});

describe('session rejected listeners', () => {
  it('notifies subscribed listeners until they unsubscribe', () => {
    const listener = jest.fn();
    const unsubscribe = onSessionRejected(listener);

    notifySessionRejected();
    unsubscribe();
    notifySessionRejected();

    expect(listener).toHaveBeenCalledTimes(1);
  });
});

describe('canLogInOnThisPhone', () => {
  it('lets anyone log in when nothing is waiting to be sent', () => {
    expect(canLogInOnThisPhone('ccgp.a@mgp.bj', 'fc.b@mgp.bj', false)).toBe(true);
    expect(canLogInOnThisPhone(null, 'fc.b@mgp.bj', true)).toBe(true);
  });

  it('keeps unsent data for its owner', () => {
    expect(canLogInOnThisPhone('ccgp.a@mgp.bj', 'fc.b@mgp.bj', true)).toBe(false);
    expect(canLogInOnThisPhone('ccgp.a@mgp.bj', ' CCGP.A@mgp.bj ', true)).toBe(true);
  });
});
