'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { jobPostingStore } from '@/lib/jobPostingStore';
import Modal from '@/components/Modal';
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

export default function ReviewPage() {
  const [isScreeningExpanded, setIsScreeningExpanded] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();
  
  const [jobDetails, setJobDetails] = useState({
    title: 'No title specified',
    description: 'No description provided',
    skills: [] as Skill[],
    scope: 'Not specified',
    location: 'Worldwide',
    budget: 'Not specified'
  });

  const [tempValues, setTempValues] = useState({
    title: '',
    description: '',
    scope: '',
    location: '',
    budget: {
      type: 'fixed',
      fixedRate: '',
      fromRate: '',
      toRate: ''
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = jobPostingStore.getAllData();
      setJobDetails({
        title: storedData.title || 'No title specified',
        description: storedData.description || 'No description provided',
        skills: Array.isArray(storedData.skills) ? storedData.skills : [],
        scope: formatScope(storedData.scope),
        location: storedData.location === 'us' ? 'United States only' : 'Worldwide',
        budget: formatBudget(storedData.budget)
      });
    }
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

  const handleStartEdit = (field: string) => {
    if (field === 'skills') {
      setIsSkillsModalOpen(true);
      fetchSkills();
      return;
    }
    
    if (field === 'budget') {
      const currentBudget = jobPostingStore.getField('budget');
      setTempValues(prev => ({
        ...prev,
        budget: currentBudget || { type: 'fixed', fixedRate: '' }
      }));
    } else {
      setTempValues(prev => ({
        ...prev,
        [field]: jobDetails[field as keyof typeof jobDetails]
      }));
    }
    
    setEditingField(field);
  };

  const handleSave = (field: string) => {
    const value = tempValues[field as keyof typeof tempValues];
    
    // Special handling for budget
    if (field === 'budget') {
      const budgetValue = value as {
        type: string;
        fixedRate?: string;
        fromRate?: string;
        toRate?: string;
      };

      if (budgetValue.type === 'fixed') {
        jobPostingStore.saveField('budget', {
          type: 'fixed',
          fixedRate: budgetValue.fixedRate
        });
      } else {
        jobPostingStore.saveField('budget', {
          type: 'hourly',
          fromRate: budgetValue.fromRate,
          toRate: budgetValue.toRate
        });
      }
    } else {
      jobPostingStore.saveField(field, value);
    }

    if (field === 'budget') {
      setJobDetails(prev => ({
        ...prev,
        [field]: formatBudget(value)
      }));
    } else {
      setJobDetails(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    setEditingField(null);
  };

  const toggleCategory = (categoryName: string) => {
    setExpanded(prev =>
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const toggleSkill = (skill: Skill) => {
    setJobDetails(prev => ({
      ...prev,
      skills: prev.skills.some(s => s.skill_id === skill.skill_id)
        ? prev.skills.filter(s => s.skill_id !== skill.skill_id)
        : [...prev.skills, skill]
    }));
  };

  const handleSaveSkills = () => {
    jobPostingStore.saveField('skills', jobDetails.skills);
    setIsSkillsModalOpen(false);
  };

  const router = useRouter();

  const handleFinalize = () => {
    router.push('/buyer/post-job/feature');
  };

  const formatBudget = (budget: any) => {
    if (!budget) return 'Not specified';
    
    if (budget.type === 'fixed') {
      return `$${parseFloat(budget.fixedRate).toFixed(2)} fixed price`;
    } else if (budget.type === 'hourly') {
      return `$${budget.fromRate} - $${budget.toRate} per hour`;
    }
    return 'Not specified';
  };

  const formatScope = (scope: any) => {
    if (!scope) return 'Not specified';
    return `${scope.scope}, ${scope.duration}`;
  };

  const handleEditSection = (section: string) => {
    const routes: { [key: string]: string } = {
      title: '/buyer/post-job/title',
      description: '/buyer/post-job/description',
      skills: '/buyer/post-job/skills',
      scope: '/buyer/post-job/scope',
      location: '/buyer/post-job/location',
      budget: '/buyer/post-job/budget'
    };
    
    if (routes[section]) {
      router.push(`${routes[section]}?from=review`);
    }
  };

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Job details</h1>
            <button
              onClick={handleFinalize}
              className="px-6 py-2 bg-custom-green hover:bg-custom-green/90 text-white rounded-lg font-medium"
            >
              Next: Finalize Job Post
            </button>
          </div>

          {/* Job Details Sections */}
          <div className="space-y-8">
            {/* Title Section */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div className="flex-grow">
                {editingField === 'title' ? (
                  <input
                    type="text"
                    value={tempValues.title}
                    onChange={(e) => setTempValues({ ...tempValues, title: e.target.value })}
                    onBlur={() => handleSave('title')}
                    className="w-full p-2 border rounded focus:border-custom-green focus:ring-1 focus:ring-custom-green"
                    autoFocus
                  />
                ) : (
                  <h2 className="text-xl font-medium text-gray-900">{jobDetails.title}</h2>
                )}
              </div>
              <button 
                onClick={() => handleStartEdit('title')}
                className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Description Section */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div className="flex-grow">
                {editingField === 'description' ? (
                  <textarea
                    value={tempValues.description}
                    onChange={(e) => setTempValues({ ...tempValues, description: e.target.value })}
                    onBlur={() => handleSave('description')}
                    className="w-full p-2 border rounded focus:border-custom-green focus:ring-1 focus:ring-custom-green"
                    rows={6}
                    autoFocus
                  />
                ) : (
                  <p className="text-gray-600 whitespace-pre-wrap">{jobDetails.description}</p>
                )}
              </div>
              <button
                onClick={() => handleStartEdit('description')}
                className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Skills Section */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {jobDetails.skills.map((skill) => (
                    <span
                      key={skill.skill_id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                    >
                      {skill.skill_name}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleStartEdit('skills')}
                className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Scope Section */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div className="flex-grow">
                {editingField === 'scope' ? (
                  <input
                    type="text"
                    value={tempValues.scope}
                    onChange={(e) => setTempValues({ ...tempValues, scope: e.target.value })}
                    onBlur={() => handleSave('scope')}
                    className="w-full p-2 border rounded focus:border-custom-green focus:ring-1 focus:ring-custom-green"
                    autoFocus
                  />
                ) : (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Scope</h3>
                    <p className="text-gray-600">{jobDetails.scope}</p>
                  </div>
                )}
              </div>
              <button 
                onClick={() => handleStartEdit('scope')}
                className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Location Section */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div className="flex-grow">
                {editingField === 'location' ? (
                  <select
                    value={tempValues.location}
                    onChange={(e) => setTempValues({ ...tempValues, location: e.target.value })}
                    onBlur={() => handleSave('location')}
                    className="w-full p-2 border rounded focus:border-custom-green focus:ring-1 focus:ring-custom-green"
                    autoFocus
                  >
                    <option value="worldwide">Worldwide</option>
                    <option value="us">United States only</option>
                  </select>
                ) : (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Location preferences</h3>
                    <p className="text-gray-600">{jobDetails.location}</p>
                  </div>
                )}
              </div>
              <button 
                onClick={() => handleStartEdit('location')}
                className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Budget Section */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div className="flex-grow">
                {editingField === 'budget' ? (
                  <div className="space-y-4">
                    <select
                      value={tempValues.budget?.type || 'fixed'}
                      onChange={(e) => setTempValues({ 
                        ...tempValues, 
                        budget: { 
                          ...tempValues.budget,
                          type: e.target.value 
                        } 
                      })}
                      className="w-full p-2 border rounded focus:border-custom-green focus:ring-1 focus:ring-custom-green"
                    >
                      <option value="fixed">Fixed price</option>
                      <option value="hourly">Hourly rate</option>
                    </select>
                    {tempValues.budget?.type === 'fixed' ? (
                      <input
                        type="number"
                        value={tempValues.budget.fixedRate || ''}
                        onChange={(e) => setTempValues({
                          ...tempValues,
                          budget: {
                            ...tempValues.budget,
                            fixedRate: e.target.value
                          }
                        })}
                        placeholder="Enter fixed price"
                        className="w-full p-2 border rounded focus:border-custom-green focus:ring-1 focus:ring-custom-green"
                      />
                    ) : (
                      <div className="flex gap-4">
                        <input
                          type="number"
                          value={tempValues.budget?.fromRate || ''}
                          onChange={(e) => setTempValues({
                            ...tempValues,
                            budget: {
                              ...tempValues.budget,
                              fromRate: e.target.value
                            }
                          })}
                          placeholder="From rate"
                          className="w-full p-2 border rounded focus:border-custom-green focus:ring-1 focus:ring-custom-green"
                        />
                        <input
                          type="number"
                          value={tempValues.budget?.toRate || ''}
                          onChange={(e) => setTempValues({
                            ...tempValues,
                            budget: {
                              ...tempValues.budget,
                              toRate: e.target.value
                            }
                          })}
                          placeholder="To rate"
                          className="w-full p-2 border rounded focus:border-custom-green focus:ring-1 focus:ring-custom-green"
                        />
                      </div>
                    )}
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingField(null)}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSave('budget')}
                        className="px-3 py-1 text-sm bg-custom-green text-white rounded hover:bg-custom-green/90"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Budget</h3>
                    <p className="text-gray-600">{jobDetails.budget}</p>
                  </div>
                )}
              </div>
              <button 
                onClick={() => handleStartEdit('budget')}
                className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Screening Questions Section */}
            <div>
              <button
                onClick={() => setIsScreeningExpanded(!isScreeningExpanded)}
                className="w-full flex justify-between items-center py-4"
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Screening questions</h3>
                </div>
                {isScreeningExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Back and Next Buttons */}
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={handleFinalize}
              className="px-6 py-2 bg-custom-green hover:bg-custom-green/90 text-white rounded-lg font-medium"
            >
              Next: Finalize Job Post
            </button>
          </div>
        </div>
      </div>

      {/* Skills Modal */}
      <Modal
        isOpen={isSkillsModalOpen}
        onClose={() => setIsSkillsModalOpen(false)}
        title="What are the main skills required for your project?"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 gap-8">
            <div>
              <p className="text-sm text-gray-500 mb-6">
                For the best results, add 3-5 skills
              </p>

              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h2 className="text-base font-medium text-gray-900 mb-3">
                    Selected skills ({jobDetails.skills.length}/10)
                  </h2>
                  <div className="flex flex-wrap gap-2 min-h-[40px]">
                    {jobDetails.skills && jobDetails.skills.length > 0 ? (
                      jobDetails.skills.map((skill) => (
                        <div 
                          key={`selected-${skill.skill_id}`}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {skill.skill_name}
                          <button
                            onClick={() => toggleSkill(skill)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No skills selected yet</p>
                    )}
                  </div>
                </div>

                <div className="space-y-0 divide-y divide-gray-200">
                  {isLoading ? (
                    <div className="text-center py-4">Loading skills...</div>
                  ) : (
                    categories.map((category) => (
                      <div key={category.id}>
                        <button
                          type="button"
                          onClick={() => toggleCategory(category.name)}
                          className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50"
                        >
                          <span className="font-medium text-gray-900">{category.name}</span>
                          {expanded.includes(category.name) ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        
                        {expanded.includes(category.name) && (
                          <div className="px-4 py-3 bg-white">
                            <div className="flex flex-wrap gap-2">
                              {category.skills
                                .filter(skill => !jobDetails.skills.find(s => s.skill_id === skill.skill_id))
                                .map((skill) => (
                                  <button
                                    key={skill.skill_id}
                                    type="button"
                                    onClick={() => toggleSkill(skill)}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm border border-gray-300 text-gray-700 hover:border-gray-400"
                                  >
                                    {skill.skill_name}
                                    <Plus className="ml-1 h-4 w-4" />
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 mt-8 border-t">
            <button
              onClick={() => setIsSkillsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSkills}
              className={`px-6 py-2.5 rounded-lg font-medium ${
                jobDetails.skills.length > 0
                  ? 'bg-[#14a800] hover:bg-[#14a800]/90 text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={jobDetails.skills.length === 0}
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
