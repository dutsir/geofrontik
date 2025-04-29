import {  forwardRef } from 'react';

interface TextAreaProps {
  name: string;
  label: string;
  value?: string;
  error?: string | string[];
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ name, label, value, error, className, onChange }, ref) => {
    return (
      <div className={`form-control ${className}`}>
        <label htmlFor={name} className="label">
          <span className='span_forthefirsttry_goih'>{label}</span>
        </label>
        <textarea
          ref={ref}
          id={name}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          
        />
        {error && (
          <label className='label_1_gointhestreet_tu_io'>
            <span>
              {typeof error === 'string' ? error : error.join(', ')}
            </span>
          </label>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;