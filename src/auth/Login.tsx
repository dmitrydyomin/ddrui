import React from 'react';
import { Field, Form } from 'react-final-form';

import { useLogin } from '../api/authAPI';

export const Login: React.FC = () => {
  const { error, login } = useLogin();

  return (
    <div className="signin-container">
      <main className="form-signin">
        <Form onSubmit={login}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <h1 className="h3 mb-3 fw-normal">C10r</h1>

              <div className="form-floating">
                <Field
                  component="input"
                  className="form-control"
                  id="inputUsername"
                  name="username"
                  placeholder="username"
                  type="text"
                  required
                />
                <label htmlFor="inputUsername">Логин</label>
              </div>
              <div className="form-floating">
                <Field
                  component="input"
                  className="form-control"
                  id="inputPassord"
                  name="password"
                  placeholder="password"
                  type="password"
                  required
                />
                <label htmlFor="inputPassord">Пароль</label>
              </div>

              <div className="checkbox mb-3">
                <label>
                  <Field component="input" name="remember" type="checkbox" />{' '}
                  Запомнить меня
                </label>
              </div>

              <button className="w-100 btn btn-lg btn-primary" type="submit">
                Войти
              </button>

              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>
          )}
        </Form>
      </main>
    </div>
  );
};
