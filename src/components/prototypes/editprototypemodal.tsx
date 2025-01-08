import React from 'react';
import { Modal } from '../ui/Modal';
import { PrototypeForm } from './PrototypeForm';
import { usePrototypeManagement } from '../../hooks/usePrototypeManagement';
import type { Prototype, PrototypeInput } from '../../types/prototype';

interface EditPrototypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  prototype: Prototype;
  onSuccess: () => void;
}

export function EditPrototypeModal({ isOpen, onClose, prototype, onSuccess }: EditPrototypeModalProps) {
  const { loading, updatePrototype } = usePrototypeManagement();

  const handleSubmit = async (data: PrototypeInput) => {
    const { error } = await updatePrototype(prototype.id, {
      title: data.title,
      description: data.description,
      image_url: data.image_url,
      category: data.category,
      tags: data.tags,
      features: data.features,
      requirements: data.requirements,
      getting_started: data.getting_started
    });
    
    if (!error) {
      await onSuccess();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Prototype">
      <PrototypeForm
        prototype={prototype}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}