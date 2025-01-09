'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { jobPostingStore } from '@/lib/jobPostingStore';

// Debug: Log environment variables
console.log('SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// Initialize Supabase client using the auth-helpers client
const supabase = createClientComponentClient()
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
  const storedSkills = jobPostingStore.getField<Skill[]>('skills') || [];
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>(storedSkills)
  const [categories, setCategories] = useState<Category[]>([])
  const [expanded, setExpanded] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initializePage = async () => {
      try {
        setIsLoading(true)
        await fetchSkills()
      } catch (error) {
        console.error('Error initializing page:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializePage()
  }, [])

  useEffect(() => {
    console.log('5. selectedSkills state changed to:', selectedSkills)
  }, [selectedSkills])

  const fetchSkills = async () => {
    console.log('=== Starting fetchSkills ===')
    try {
      console.log('Attempting to fetch from skills_view...')
      const { data: skillsData, error } = await supabase
        .from('skills_view')
        .select('*')
      
      console.log('Fetch complete')
      console.log('Error:', error)
      console.log('Data received:', skillsData)
      
      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        throw error
      }
      
      if (skillsData) {
        console.log('First skill record:', skillsData[0]);
        console.log('Skills data structure:', Object.keys(skillsData[0]));
        console.log('Processing skills data...')
        console.log('Number of skills:', skillsData.length)
        const categoryList = skillsData.reduce((acc: Category[], skill) => {
          console.log('\n--- Processing Skill ---');
          console.log('Skill:', skill.skill_name);
          console.log('Category:', skill.category_name);
          
          const existingCategory = acc.find(cat => cat.name === skill.category_name)
          console.log('Found existing category:', existingCategory?.name || 'none');
          
          if (existingCategory) {
            console.log('Adding to existing category:', existingCategory.name);
            existingCategory.skills.push({
              skill_id: skill.skill_id,
              skill_name: skill.skill_name,
              category_id: skill.skill_id,
              category_name: skill.category_name
            })
          } else {
            console.log('Creating new category:', skill.category_name);
            acc.push({
              id: acc.length + 1,
              name: skill.category_name,
              skills: [{
                skill_id: skill.skill_id,
                skill_name: skill.skill_name,
                category_id: skill.skill_id,
                category_name: skill.category_name
              }]
            })
          }
          
          console.log('Current categories:', acc.map(c => ({name: c.name, skillCount: c.skills.length})));
          return acc
        }, [])

        console.log('\nFinal Category List:', categoryList.map(c => ({
          name: c.name,
          skills: c.skills.map(s => s.skill_name)
        })));

        setCategories(categoryList)
        
        if (categoryList.length > 0) {
          setExpanded([categoryList[0].name])
        }
      }
    } catch (error) {
      console.error('Error in fetchSkills:', error)
      throw error
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

  const handleNext = () => {
    if (selectedSkills.length > 0) {
      jobPostingStore.saveField('skills', selectedSkills);
      router.push('/buyer/post-job/location')
    } else {
      console.log('Error: No skills selected')
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
              <span className="text-gray-500 text-sm">2/6</span>
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
                {console.log('6. Rendering selectedSkills:', selectedSkills)}
                {selectedSkills && selectedSkills.length > 0 ? (
                  renderSelectedSkills()
                ) : (
                  <p className="text-gray-500 text-sm">No skills selected yet</p>
                )}
              </div>
            </div>

            <div className="space-y-0 divide-y divide-gray-200">
              {console.log('Categories available:', categories)}
              {categories.map((category) => {
                console.log('Rendering category:', category.name);
                return (
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
                            .filter(skill => !selectedSkills.find(s => s.skill_id === skill.skill_id))
                            .map((skill) => (
                              <button
                                key={skill.skill_id}
                                type="button"
                                onClick={() => {
                                  console.log('CLICK TEST - Button clicked for skill:', skill.skill_name);
                                  handleAddSkill(skill)
                                }}
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
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link href="/buyer/post-job/title" className="inline-flex items-center text-gray-600 hover:text-gray-900">
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
              Next: Location
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
