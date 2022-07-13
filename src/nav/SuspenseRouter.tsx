import type { BrowserHistory } from 'history';
import { createBrowserHistory } from 'history';
import React from 'react';
import { useLayoutEffect, useRef, useState, useTransition } from 'react';
import { Router } from 'react-router';

export interface SuspenseRouterProps {
  basename?: string;
  children?: React.ReactNode;
  timeout?: number;
  window?: Window;
}

export function SuspenseRouter({
  basename,
  children,
  // timeout,
  window,
}: SuspenseRouterProps) {
  let historyRef = useRef<BrowserHistory>();
  // @ts-ignore
  const [, startTransition] = useTransition({ timeoutMs: 2000 });

  if (historyRef.current == null) {
    const history = createBrowserHistory({ window });

    const { push, replace, go } = history;

    history.push = (...args) => {
      startTransition(() => {
        push.apply(history, args);
      });
    };
    history.replace = (...args) => {
      startTransition(() => {
        replace.apply(history, args);
      });
    };
    history.go = (...args) => {
      startTransition(() => {
        go.apply(history, args);
      });
    };

    historyRef.current = history;
  }

  let history = historyRef.current;
  let [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      basename={basename}
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
}
