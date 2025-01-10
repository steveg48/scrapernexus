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
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [isScopeModalOpen, setIsScopeModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();
  
  const [jobDetails, setJobDetails] = useState({
    title: 'No title specified',
    description: 'No description provided',
    skills: [] as Skill[],
    scope: {
      scope: '',
      duration: ''
    },
    location: 'Worldwide',
    budget: '$0',
    project_type: 'standard'
  });

  const [tempValues, setTempValues] = useState({
    title: '',
    description: '',
    scope: {
      scope: '',
      duration: ''
    },
    location: '',
    budget: {
      type: 'fixed',
      fixedRate: '0',
      fromRate: '0',
      toRate: '0'
    },
    project_type: 'standard'
  });

  const [editingField, setEditingField] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = jobPostingStore.getAllData();
      setJobDetails({
        title: storedData.title || 'No title specified',
        description: storedData.description || 'No description provided',
        skills: Array.isArray(storedData.skills) ? storedData.skills : [],
        scope: storedData.scope || { scope: '', duration: '' },
        location: storedData.location === 'us' ? 'U.S. Only' : 'Worldwide',
        budget: formatBudget(storedData.budget) || '$0',
        project_type: storedData.project_type || 'standard'
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
        budget: currentBudget || { 
          type: 'fixed', 
          fixedRate: '0',
          fromRate: '0',
          toRate: '0'
        }
      }));
    } else if (field === 'scope') {
      const currentScope = jobPostingStore.getField('scope');
      setTempValues(prev => ({
        ...prev,
        scope: currentScope || { scope: '', duration: '' }
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
    } else if (field === 'scope') {
      const scopeValue = value as {
        scope: string;
        duration: string;
      };
      jobPostingStore.saveField('scope', scopeValue);
      setJobDetails(prev => ({
        ...prev,
        scope: scopeValue
      }));
    } else {
      jobPostingStore.saveField(field, value);
    }

    if (field === 'budget') {
      setJobDetails(prev => ({
        ...prev,
        budget: formatBudget(value)
      }));
    } else if (field === 'scope') {
      // Already handled above
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
    if (!budget || (!budget.fixedRate && !budget.fromRate)) return '$0 (Fixed Price)';
    
    if (budget.type === 'fixed') {
      return budget.fixedRate ? `$${parseFloat(budget.fixedRate).toFixed(2)} (Fixed Price)` : '$0 (Fixed Price)';
    } else if (budget.type === 'hourly') {
      return budget.fromRate && budget.toRate ? `$${budget.fromRate} - $${budget.toRate} (Per Hour)` : '$0 (Per Hour)';
    }
    return '$0 (Fixed Price)';
  };

  const formatScope = (scope: any) => {
    if (!scope || !scope.scope || !scope.duration) return 'Not specified';
    
    let duration;
    switch (scope.duration) {
      case '1-to-3':
        duration = '1 to 3 months';
        break;
      case '3-to-6':
        duration = '3 to 6 months';
        break;
      case 'more-than-6':
        duration = 'More than 6 months';
        break;
      default:
        duration = scope.duration;
    }
    
    return `${scope.scope}, ${duration}`;
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
                <h3 className="text-base font-bold text-[#8FDAFF] mb-2">Title</h3>
                {editingField === 'title' ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={tempValues.title}
                      onChange={(e) => setTempValues({ ...tempValues, title: e.target.value })}
                      className="w-full p-2 border rounded focus:border-custom-green focus:ring-1 focus:ring-custom-green"
                      autoFocus
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingField(null)}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSave('title')}
                        className="px-3 py-1 text-sm bg-custom-green text-white rounded hover:bg-custom-green/90"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">{jobDetails.title}</p>
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
                <h3 className="text-base font-bold text-[#8FDAFF] mb-2">Description</h3>
                {editingField === 'description' ? (
                  <div className="space-y-4">
                    <textarea
                      value={tempValues.description}
                      onChange={(e) => setTempValues({ ...tempValues, description: e.target.value })}
                      className="w-full p-2 border rounded focus:border-custom-green focus:ring-1 focus:ring-custom-green"
                      rows={6}
                      autoFocus
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingField(null)}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSave('description')}
                        className="px-3 py-1 text-sm bg-custom-green text-white rounded hover:bg-custom-green/90"
                      >
                        Save
                      </button>
                    </div>
                  </div>
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
                <h3 className="text-base font-bold text-[#8FDAFF] mb-2">Skills</h3>
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
                <h3 className="text-base font-bold text-[#8FDAFF] mb-2">Scope</h3>
                <p className="text-gray-600">{formatScope(jobDetails.scope)}</p>
              </div>
              <button 
                onClick={() => setIsScopeModalOpen(true)}
                className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Location Section */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div className="flex-grow">
                <h3 className="text-base font-bold text-[#8FDAFF] mb-2">Location preferences</h3>
                {editingField === 'location' ? (
                  <div className="space-y-4">
                    <select
                      value={tempValues.location}
                      onChange={(e) => setTempValues({ ...tempValues, location: e.target.value })}
                      className="w-full p-2 border rounded focus:border-custom-green focus:ring-1 focus:ring-custom-green"
                      autoFocus
                    >
                      <option value="worldwide">Worldwide</option>
                      <option value="us">U.S. Only</option>
                    </select>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingField(null)}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSave('location')}
                        className="px-3 py-1 text-sm bg-custom-green text-white rounded hover:bg-custom-green/90"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">{jobDetails.location}</p>
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
                <h3 className="text-base font-bold text-[#8FDAFF] mb-2">Budget</h3>
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
                  <p className="text-gray-600">{jobDetails.budget}</p>
                )}
              </div>
              <button 
                onClick={() => handleStartEdit('budget')}
                className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#039625] rounded-full"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Project Type Section */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div className="flex-grow">
                <h3 className="text-base font-bold text-[#8FDAFF] mb-2">Project Type</h3>
                <p className="text-gray-600">Post as standard for free</p>
              </div>
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

      {/* Scope Modal */}
      {isScopeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Select Scope</h2>
                <button
                  onClick={() => setIsScopeModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scope Options */}
              <div className="space-y-4 mb-6">
                <label className="block">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="scope"
                      value="Large"
                      checked={tempValues.scope.scope === 'Large'}
                      onChange={(e) => setTempValues({
                        ...tempValues,
                        scope: {
                          ...tempValues.scope,
                          scope: e.target.value
                        }
                      })}
                      className="h-4 w-4 text-custom-green"
                    />
                    <span className="ml-3 text-base font-medium text-gray-900">Large</span>
                  </div>
                  <p className="mt-1 ml-7 text-gray-600">
                    Longer term or complex initiatives (ex. develop and execute a brand strategy (i.e., graphics, positioning))
                  </p>
                </label>

                <label className="block">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="scope"
                      value="Medium"
                      checked={tempValues.scope.scope === 'Medium'}
                      onChange={(e) => setTempValues({
                        ...tempValues,
                        scope: {
                          ...tempValues.scope,
                          scope: e.target.value
                        }
                      })}
                      className="h-4 w-4 text-custom-green"
                    />
                    <span className="ml-3 text-base font-medium text-gray-900">Medium</span>
                  </div>
                  <p className="mt-1 ml-7 text-gray-600">
                    Well-defined projects (ex. design business rebrand package (i.e., logos, icons))
                  </p>
                </label>

                <label className="block">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="scope"
                      value="Small"
                      checked={tempValues.scope.scope === 'Small'}
                      onChange={(e) => setTempValues({
                        ...tempValues,
                        scope: {
                          ...tempValues.scope,
                          scope: e.target.value
                        }
                      })}
                      className="h-4 w-4 text-custom-green"
                    />
                    <span className="ml-3 text-base font-medium text-gray-900">Small</span>
                  </div>
                  <p className="mt-1 ml-7 text-gray-600">
                    Quick and straightforward tasks (ex. create logo for a new product)
                  </p>
                </label>
              </div>

              {/* Duration Section */}
              <div className="mb-6">
                <h3 className="text-base font-medium text-gray-900 mb-4">How long will your work take?</h3>
                <div className="space-y-4">
                  <label className="block">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="duration"
                        value="1-to-3"
                        checked={tempValues.scope.duration === '1-to-3'}
                        onChange={(e) => setTempValues({
                          ...tempValues,
                          scope: {
                            ...tempValues.scope,
                            duration: e.target.value
                          }
                        })}
                        className="h-4 w-4 text-custom-green"
                      />
                      <span className="ml-3 text-base text-gray-900">1 to 3 months</span>
                    </div>
                  </label>

                  <label className="block">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="duration"
                        value="3-to-6"
                        checked={tempValues.scope.duration === '3-to-6'}
                        onChange={(e) => setTempValues({
                          ...tempValues,
                          scope: {
                            ...tempValues.scope,
                            duration: e.target.value
                          }
                        })}
                        className="h-4 w-4 text-custom-green"
                      />
                      <span className="ml-3 text-base text-gray-900">3 to 6 months</span>
                    </div>
                  </label>

                  <label className="block">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="duration"
                        value="more-than-6"
                        checked={tempValues.scope.duration === 'more-than-6'}
                        onChange={(e) => setTempValues({
                          ...tempValues,
                          scope: {
                            ...tempValues.scope,
                            duration: e.target.value
                          }
                        })}
                        className="h-4 w-4 text-custom-green"
                      />
                      <span className="ml-3 text-base text-gray-900">More than 6 months</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsScopeModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleSave('scope');
                    setIsScopeModalOpen(false);
                  }}
                  className="px-4 py-2 text-sm bg-custom-green text-white rounded hover:bg-custom-green/90"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
