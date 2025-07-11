'use client';

import Loading from '@/components/Layouts/loading'
import {ProtectedRoute} from '@/components/ProtectedRoute';
import { API_URL } from '@/lib/constants';
import { useEffect } from 'react';


export default function AdminPage() {

  useEffect(() => {
    window.location.href = `${API_URL}/admin`;
  }, []);

  return (
    <ProtectedRoute>
      <Loading loading={true} />
    </ProtectedRoute>
  )
}
