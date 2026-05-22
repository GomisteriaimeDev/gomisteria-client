import React, { ReactNode } from 'react';
import './Form.scss';

interface FormWrapperProps {
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  title?: string;
  children: ReactNode;
}

const FormWrapper: React.FC<FormWrapperProps> = ({ onSubmit, title, children }) => {
  return (
    <div className="formWrapper">
      <legend>{title}</legend>
      {children}
    </div>
  );
};

export default FormWrapper;
