import { useState, useEffect } from 'react';
import { useSupabase } from '../../hooks/useSupabase';
import { CharacterCategory } from '../../types/database';
import { Input } from './Input';
import { Button } from './Button';
import { ImageUpload } from './ImageUpload';
import { TextArea } from './TextArea';
import { Select } from './Select';
import { uploadImageFromUrl } from '../../lib/storage/index';

interface CharacterFormProps {
  onSubmit: (data: CharacterFormData) => Promise<void>;
  isLoading: boolean;
}

export interface CharacterFormData {
  name: string;
  description: string;
  avatarUrl: string;
  greetingMessage: string;
  categoryId: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  avatarUrl?: string;
  greetingMessage?: string;
  categoryId?: string;
}

export function CharacterForm({ onSubmit, isLoading }: CharacterFormProps) {
  const { supabase } = useSupabase();
  const [categories, setCategories] = useState<CharacterCategory[]>([]);
  const [formData, setFormData] = useState<CharacterFormData>({
    name: '',
    description: '',
    avatarUrl: '',
    greetingMessage: '',
    categoryId: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadCategories = async () => {
      if (!supabase) return;
      const { data } = await supabase.from('character_categories').select('*');
      if (data) setCategories(data);
    };

    loadCategories();
  }, [supabase]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '캐릭터 이름을 입력해주세요';
    } else if (formData.name.length > 50) {
      newErrors.name = '이름은 50자를 초과할 수 없습니다';
    }

    if (!formData.description.trim()) {
      newErrors.description = '캐릭터 설명을 입력해주세요';
    } else if (formData.description.length < 20) {
      newErrors.description = '설명은 최소 20자 이상이어야 합니다';
    }

    if (!formData.greetingMessage.trim()) {
      newErrors.greetingMessage = '인사말을 입력해주세요';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = '카테고리를 선택해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const allTouched = Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouched(allTouched);

    if (validateForm()) {
      try {
        const updatedFormData = { ...formData };
        if (updatedFormData.avatarUrl.startsWith('https://oaidalleapiprodscus')) {
          const { url } = await uploadImageFromUrl(updatedFormData.avatarUrl);
          updatedFormData.avatarUrl = url;
        }
        
        await onSubmit(updatedFormData);
      } catch (error) {
        console.error('Form submission error:', error);
        setErrors(prev => ({
          ...prev,
          avatarUrl: '이미지 업로드 중 오류가 발생했습니다.'
        }));
      }
    }
  };

  const handleBlur = (field: keyof CharacterFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateForm();
  };

  const isFormValid = () => {
    return formData.name.trim() !== '' &&
           formData.description.trim().length >= 20 &&
           formData.greetingMessage.trim() !== '' &&
           formData.categoryId !== '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="캐릭터 이름"
        required
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        onBlur={() => handleBlur('name')}
        error={touched.name ? errors.name : undefined}
        placeholder="캐릭터의 이름을 입력하세요"
      />

      <TextArea
        label="설명"
        required
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        onBlur={() => handleBlur('description')}
        error={touched.description ? errors.description : undefined}
        rows={3}
        placeholder="캐릭터의 특성과 성격을 자세히 설명해주세요"
      />

      <ImageUpload
        label="아바타 이미지"
        value={formData.avatarUrl}
        onChange={(url) => setFormData(prev => ({ ...prev, avatarUrl: url }))}
        error={touched.avatarUrl ? errors.avatarUrl : undefined}
        characterName={formData.name}
        characterDescription={formData.description}
      />

      <TextArea
        label="인사말"
        required
        value={formData.greetingMessage}
        onChange={(e) => setFormData(prev => ({ ...prev, greetingMessage: e.target.value }))}
        onBlur={() => handleBlur('greetingMessage')}
        error={touched.greetingMessage ? errors.greetingMessage : undefined}
        rows={2}
        placeholder="대화를 시작할 때 처음 하는 인사말을 입력해주세요"
      />

      <Select
        label="카테고리"
        required
        value={formData.categoryId}
        onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
        onBlur={() => handleBlur('categoryId')}
        error={touched.categoryId ? errors.categoryId : undefined}
        options={categories.map((category) => ({
          value: category.id,
          label: category.name,
        }))}
      />

      <div className="flex justify-end">
        <Button 
          type="submit" 
          isLoading={isLoading}
          disabled={!isFormValid() || isLoading}
          variant="secondary"
          className="w-full sm:w-auto"
        >
          생성하기
        </Button>
      </div>
    </form>
  );
}