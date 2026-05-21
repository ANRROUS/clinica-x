'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from './AuthModal';
import RegisterFormContent from './RegisterFormContent';

export default function RegisterModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    router.back();
  };

  const handleSuccess = () => {
    setIsOpen(false);
    const returnUrl = sessionStorage.getItem('returnUrl') || '/perfil';
    sessionStorage.removeItem('returnUrl');
    router.push(returnUrl);
  };

  return (
    <AuthModal isOpen={isOpen} onClose={handleClose}>
      <RegisterFormContent onSuccess={handleSuccess} />
    </AuthModal>
  );
}
