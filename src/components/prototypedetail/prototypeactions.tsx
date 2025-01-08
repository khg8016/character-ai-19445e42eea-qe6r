import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { useProfile } from '../../contexts/ProfileContext';
import { usePrototypeManagement } from '../../hooks/usePrototypeManagement';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { useAuth } from '../../components/auth/AuthContext';
import type { Prototype } from '../../types/prototype';

interface PrototypeActionsProps {
  prototype: Prototype;
  onEdit: () => void;
  onDeleted: () => void;
}

export function PrototypeActions({ prototype, onEdit, onDeleted }: PrototypeActionsProps) {
  const { profile } = useProfile();
  const { user } = useAuth();
  const { deletePrototype } = usePrototypeManagement();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Only show actions if user is Expert AND is the author of the prototype
  if (!profile || 
      !user || 
      profile.user_level !== 'Expert' || 
      prototype.author.id !== user.id) {
    return null;
  }

  const handleDelete = async () => {
    const { error } = await deletePrototype(prototype.id);
    if (!error) {
      onDeleted();
    }
  };

  return (
    <>
      <div className="flex gap-2 mb-6">
        <button
          onClick={onEdit}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                   bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit
        </button>
        <button
          onClick={() => setShowDeleteConfirmation(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                   bg-red-600 hover:bg-red-700 rounded-md"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </button>
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDelete}
        title="Delete Prototype"
        message={`Are you sure you want to delete "${prototype.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
}