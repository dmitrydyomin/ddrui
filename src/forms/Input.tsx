import React from 'react';
import { Field } from 'react-final-form';

interface InputProps {
  label: string;
  name: string;
  type?: 'text' | 'password' | 'email';
}

export const Input: React.FC<InputProps> = ({ label, name, type }) => (
  <div className="row mb-3">
    <label htmlFor={name} className="col-sm-2 col-form-label">
      {label}
    </label>
    <div className="col-sm-10">
      <Field
        component="input"
        type={type || 'text'}
        className="form-control"
        id={name}
        name={name}
      />
    </div>
  </div>
);
