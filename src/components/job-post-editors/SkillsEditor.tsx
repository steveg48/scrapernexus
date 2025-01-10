'use client';

import { useState, useEffect } from 'react';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Skill {
  skill_id: number;
  skill_name: string;
  category_id: number;
  category_name: string;
}

interface Category {
  id: number;
  name: string;
  skills: Skill[];
}

interface SkillsEditorProps {
  selectedSkills: Skill[];
  onSave: (skills: Skill[]) => void;
  onCancel: () => void;
}

export default function SkillsEditor({ selectedSkills, onSave, onCancel }: SkillsEditorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localSelectedSkills, setLocalSelectedSkills] = useState<Skill[]>(selectedSkills);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setIsLoading(true);
      const { data: skillsData, error } = await supabase
        .from('skills_view')
        .select('*');

      if (error) throw error;

      if (skillsData) {
        const categoryList = skillsData.reduce((acc: Category[], skill) => {
          const existingCategory = acc.find(cat => cat.name === skill.category_name);

          if (existingCategory) {
            existingCategory.skills.push({
              skill_id: skill.skill_id,
              skill_name: skill.skill_name,
              category_id: skill.category_id,
              category_name: skill.category_name
            });
          } else {
            acc.push({
              id: skill.category_id,
              name: skill.category_name,
              skills: [{
                skill_id: skill.skill_id,
                skill_name: skill.skill_name,
                category_id: skill.category_id,
                category_name: skill.category_name
              }]
            });
          }
          return acc;
        }, []);

        setCategories(categoryList);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setExpanded(prev =>
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const toggleSkill = (skill: Skill) => {
    setLocalSelectedSkills(prev =>
      prev.some(s => s.skill_id === skill.skill_id)
        ? prev.filter(s => s.skill_id !== skill.skill_id)
        : [...prev, skill]
    );
  };

  const handleSave = () => {
    onSave(localSelectedSkills);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading skills...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {categories.map(category => (
          <div key={category.id} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleCategory(category.name)}
              className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100"
            >
              <span className="font-medium">{category.name}</span>
              {expanded.includes(category.name) ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            
            {expanded.includes(category.name) && (
              <div className="p-4 grid grid-cols-2 gap-3">
                {category.skills.map(skill => (
                  <button
                    key={skill.skill_id}
                    onClick={() => toggleSkill(skill)}
                    className={`flex items-center justify-between p-2 rounded ${
                      localSelectedSkills.some(s => s.skill_id === skill.skill_id)
                        ? 'bg-custom-green/10 text-custom-green'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span>{skill.skill_name}</span>
                    {localSelectedSkills.some(s => s.skill_id === skill.skill_id) ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-custom-green rounded-md hover:bg-custom-green/90"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
