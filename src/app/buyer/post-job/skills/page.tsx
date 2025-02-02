'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase';
import { getJobPostingStore } from '@/lib/jobPostingStore';

// Debug: Log environment variables
console.log('SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// Initialize Supabase client using the shared client
const supabase = createBrowserClient();
console.log('Supabase client initialized:', !!supabase)

interface Skill {
  skill_id: number
  skill_name: string
  category_id: number
  category_name: string
}

interface Category {
  id: number
  name: string
  skills: Skill[]
}

export default function PostJobSkills() {
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [expanded, setExpanded] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initializePage = async () => {
      try {
        setIsLoading(true);
        const store = getJobPostingStore();
        await store.initialize();
        const storedSkills = await store.getField<Skill[]>('skills');
        if (storedSkills) {
          setSelectedSkills(storedSkills);
        }
        await fetchSkills();
      } catch (error) {
        console.error('Error initializing page:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, [])

  useEffect(() => {
    console.log('5. selectedSkills state changed to:', selectedSkills)
  }, [selectedSkills])

  const fetchSkills = async () => {
    try {
      const { data: skillsData, error } = await supabase
        .from('skills_view')
        .select('*')
        .order('skill_name')
      
      if (error) throw error

      if (skillsData) {
        const categoryList = skillsData.reduce((acc: Category[], skill) => {
          const existingCategory = acc.find(cat => cat.name === skill.category_name)
          
          if (existingCategory) {
            existingCategory.skills.push({
              skill_id: skill.skill_id,
              skill_name: skill.skill_name,
              category_id: skill.category_id,
              category_name: skill.category_name
            })
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
            })
          }
          
          return acc
        }, [])

        setCategories(categoryList)
        
        if (categoryList.length > 0) {
          setExpanded([categoryList[0].name])
        }
      }
    } catch (error) {
      console.error('Error fetching skills:', error)
    }
  }

  const handleAddSkill = (skill: Skill) => {
    if (selectedSkills.length < 10) {
      const newSkills = [...selectedSkills];
      if (!newSkills.find(s => s.skill_id === skill.skill_id)) {
        newSkills.push(skill);
        setSelectedSkills(newSkills);
      }
    }
  };

  const handleRemoveSkill = (skillToRemove: Skill) => {
    console.log('Removing skill:', skillToRemove)
    setSelectedSkills(prev => prev.filter(skill => skill.skill_id !== skillToRemove.skill_id))
  }

  const toggleCategory = (categoryName: string) => {
    setExpanded(prev => 
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    )
  }

  const handleNext = async () => {
    if (selectedSkills.length > 0) {
      try {
        const store = getJobPostingStore();
        await store.initialize();
        await store.saveField('skills', selectedSkills);
        router.push('/buyer/post-job/review');
      } catch (error) {
        console.error('Error saving skills:', error);
      }
    } else {
      console.log('Error: No skills selected');
    }
  };

  const renderSelectedSkills = () => {
    return selectedSkills.map((skill) => (
      <div 
        key={`selected-${skill.skill_id}`}
        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
      >
        {skill.skill_name}
        <button
          onClick={() => handleRemoveSkill(skill)}
          className="ml-2 text-blue-600 hover:text-blue-800"
        >
          ×
        </button>
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>Loading skills...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 text-sm">4/5</span>
              <span className="text-gray-900">Job post</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              What are the main skills<br />required for your project?
            </h1>
            <p className="text-sm text-gray-500">
              For the best results, add 3-5 skills
            </p>
          </div>

          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h2 className="text-base font-medium text-gray-900 mb-3">
                Selected skills ({selectedSkills.length}/10)
              </h2>
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {selectedSkills && selectedSkills.length > 0 ? (
                  renderSelectedSkills()
                ) : (
                  <p className="text-gray-500 text-sm">No skills selected yet</p>
                )}
              </div>
            </div>

            <div className="space-y-0 divide-y divide-gray-200">
              {categories.map((category) => (
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
                          .filter(skill => !selectedSkills?.some(s => s.skill_id === skill.skill_id))
                          .map((skill) => (
                            <button
                              key={skill.skill_id}
                              type="button"
                              onClick={() => handleAddSkill(skill)}
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
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link href="/buyer/post-job/budget" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <span>← Back</span>
          </Link>
          <div className="w-40">
            <button
              onClick={handleNext}
              className={`whitespace-nowrap px-6 py-2.5 rounded-lg font-medium ${
                selectedSkills.length > 0
                  ? 'bg-[#14a800] hover:bg-[#14a800]/90 text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={selectedSkills.length === 0}
            >
              Next: Review
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
