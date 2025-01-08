import { useState } from 'react';
import { useAuth } from '../components/auth/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { createPrototype } from '../services/prototypes/createPrototype';
import { updatePrototype } from '../services/prototypes/updatePrototype';
import { deletePrototype } from '../services/prototypes/deletePrototype';
import type { PrototypeInput } from '../types/prototype';
import toast from 'react-hot-toast';

export function usePrototypeManagement() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { profile } = useProfile();

  const checkExpertAccess = () => {
    if (!profile) {
      toast.error('You must be logged in to manage prototypes');
      return false;
    }
    if (profile.user_level !== 'Expert') {
      toast.error('Only Expert users can publish prototypes');
      return false;
    }
    return true;
  };

  return {
    loading,
    createPrototype: async (input: PrototypeInput) => {
      if (!checkExpertAccess()) {
        return { prototype: null, error: new Error('Insufficient permissions') };
      }

      setLoading(true);
      try {
        return await createPrototype(input, user);
      } finally {
        setLoading(false);
      }
    },
    updatePrototype: async (id: string, input: PrototypeInput) => {
      if (!checkExpertAccess()) {
        return { prototype: null, error: new Error('Insufficient permissions') };
      }

      setLoading(true);
      try {
        return await updatePrototype(id, input, user);
      } finally {
        setLoading(false);
      }
    },
    deletePrototype: async (id: string) => {
      if (!checkExpertAccess()) {
        return { error: new Error('Insufficient permissions') };
      }

      setLoading(true);
      try {
        return await deletePrototype(id, user);
      } finally {
        setLoading(false);
      }
    }
  };
}