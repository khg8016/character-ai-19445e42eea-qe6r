import React, { useState } from 'react';
import { Plus, Edit } from 'lucide-react';
import { useProfile } from '../../contexts/ProfileContext';
import { Modal } from '../ui/Modal';
import { PrototypeForm } from './PrototypeForm';
import { usePrototypeManagement } from '../../hooks/usePrototypeManagement';
import type { Prototype, PrototypeInput } from '../../types/prototype';

interface PrototypeActionsProps {
  prototype?: Prototype;
  onSuccess: () => void;
}

export function PrototypeActions({ prototype, onSuccess }: PrototypeActionsProps) {
  const { profile } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loading, createPrototype, updatePrototype } = usePrototypeManagement();

  // Only show actions for Expert users
  if (!profile || profile.user_level !== 'Expert') {
    return null;
  }

  const handleSubmit = async (data: PrototypeInput) => {
    try {
      if (prototype) {
        const { error } = await updatePrototype(prototype.id, data);
        if (!error) {
          setIsModalOpen(false);
          onSuccess();
        }
      } else {
        const { error } = await createPrototype(data);
        if (!error) {
          setIsModalOpen(false);
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Error handling prototype:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                 bg-blue-600 hover:bg-blue-700 rounded-md"
      >
        {prototype ? (
          <>
            <Edit className="w-4 h-4 mr-2" />
            Edit Prototype
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Add Prototype
          </>
        )}
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={prototype ? 'Edit Prototype' : 'Add New Prototype'}
      >
        <PrototypeForm
          prototype={prototype}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          loading={loading}
        />
      </Modal>
    </>
  );
}