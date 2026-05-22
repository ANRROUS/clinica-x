'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { AlertCircle, Check } from 'lucide-react';

type FieldName = 'nombre' | 'apellido' | 'email' | 'celular';

type FormValues = {
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  comentario: string;
};

type TouchedState = Record<FieldName, boolean>;

const initialValues: FormValues = {
  nombre: '',
  apellido: '',
  email: '',
  celular: '',
  comentario: '',
};

const initialTouched: TouchedState = {
  nombre: false,
  apellido: false,
  email: false,
  celular: false,
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getFieldError(field: FieldName, values: FormValues) {
  const value = values[field].trim();

  if (field === 'nombre') {
    return value ? '' : 'Este campo está vacío. Ingresa tu nombre';
  }

  if (field === 'apellido') {
    return value ? '' : 'Este campo está vacío. Ingresa tu apellido';
  }

  if (field === 'email') {
    if (!value) {
      return 'Este campo está vacío. Ingresa tu email';
    }

    return emailRegex.test(value) ? '' : 'Por favor, ingresa un email válido';
  }

  if (!value) {
    return '';
  }

  const digitsOnly = value.replace(/\D/g, '');
  return digitsOnly.length >= 7 ? '' : 'Por favor, ingresa un número válido';
}

function getFieldState(field: FieldName, values: FormValues, touched: TouchedState, submitted: boolean) {
  const value = values[field].trim();
  const error = getFieldError(field, values);
  const interacted = touched[field] || submitted;

  if (field === 'email') {
    const hasAt = value.includes('@');
    const looksValid = hasAt && !value.startsWith('@') && !value.endsWith('@') && !value.includes(' ');

    return {
      error,
      showError: interacted && Boolean(error),
      showSuccess: Boolean(value) && looksValid && !error,
    };
  }

  if (field === 'celular') {
    const digitsOnly = value.replace(/\D/g, '');
    const isValid = !value || digitsOnly.length >= 7;

    return {
      error,
      showError: interacted && Boolean(value) && !isValid,
      showSuccess: Boolean(value) && isValid,
    };
  }

  return {
    error,
    showError: interacted && !value,
    showSuccess: Boolean(value),
  };
}

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [touched, setTouched] = useState<TouchedState>(initialTouched);

  const setField = (field: FieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const touchField = (field: FieldName) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const resetForm = () => {
    setValues(initialValues);
    setTouched(initialTouched);
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    const hasErrors = (['nombre', 'apellido', 'email', 'celular'] as FieldName[]).some(
      (field) => Boolean(getFieldError(field, values))
    );

    if (hasErrors) {
      toast.error('Corrige los campos marcados antes de enviar.');
      return;
    }

    setLoading(true);
    try {
      toast.success('Formulario de contacto enviado correctamente.');
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  const renderField = (
    field: FieldName,
    label: string,
    placeholder: string,
    type: 'text' | 'email' | 'tel',
    required = false
  ) => {
    const { error, showError, showSuccess } = getFieldState(field, values, touched, submitted);

    return (
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-700">
          {label} {required ? <span className="text-red-600">*</span> : null}
        </label>
        
        <div className="relative">
          <input
            type={type}
            inputMode={field === 'celular' ? 'numeric' : undefined}
            maxLength={field === 'celular' ? 9 : undefined}
            pattern={field === 'celular' ? '[0-9]*' : undefined}
            required={required}
            value={values[field]}
            onChange={(event) => {
              if (field === 'celular') {
                const numericValue = event.target.value.replace(/\D/g, '').slice(0, 9);
                setField(field, numericValue);
                return;
              }

              if (field === 'nombre' || field === 'apellido') {
                const textOnlyValue = event.target.value.replace(/[0-9]/g, '');
                setField(field, textOnlyValue);
                return;
              }

              setField(field, event.target.value);
            }}
            onBlur={() => touchField(field)}
            className={`w-full border-0 border-b bg-transparent px-1 py-2 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:ring-0 ${
              showError
                ? 'border-red-600 focus:border-red-600'
                : showSuccess
                  ? 'border-[#229c45] focus:border-[#229c45]'
                  : 'border-gray-300 focus:border-[#008585]'
            }`}
            placeholder={placeholder}
          />

          <div className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2">
            {showError ? (
              <AlertCircle className="h-6 w-6 text-red-600" />
            ) : showSuccess ? (
              <Check className="h-6 w-6 text-[#229c45]" />
            ) : null}
          </div>
        </div>

        {showError ? (
          <p className="mt-1 text-center text-xs font-medium leading-none text-red-600">
            {error}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-center text-lg font-bold uppercase tracking-wide text-gray-900">
        Contáctanos
      </h3>

      <div className="grid gap-5 sm:grid-cols-2">
        {renderField('nombre', 'Nombre', 'Escribe tu nombre', 'text', true)}
        {renderField('apellido', 'Apellido', 'Escribe tu apellido', 'text', true)}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {renderField('email', 'Email', 'Ej. email@gmail.com', 'email', true)}
        {renderField('celular', 'Número de celular', 'Ej. XXX-XXXX-XXXX', 'tel')}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-700">Comentario</label>
        <textarea
          rows={4}
          value={values.comentario}
          onChange={(event) => setValues((current) => ({ ...current, comentario: event.target.value }))}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#008585] focus:ring-1 focus:ring-[#008585]"
          placeholder="Cuéntanos en qué podemos ayudarte"
        />
      </div>

      <div className="flex justify-center pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-[#008585] px-10 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#007070] disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </form>
  );
}
