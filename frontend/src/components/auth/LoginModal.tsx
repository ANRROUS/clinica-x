'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from './AuthModal';
import LoginFormContent from './LoginFormContent';

export default function LoginModal() {
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
      <LoginFormContent onSuccess={handleSuccess} />
    </AuthModal>
  );
}
