'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Skill {
  skill_id: number
  skill_name: string
  category_id: number
  category_name: string
}

interface SkillsByCategory {
  [key: string]: {
    id: number
    name: string
    skills: Skill[]
  }
}

export default function PostJobSkills() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [skillsByCategory, setSkillsByCategory] = useState<SkillsByCategory>({})
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const { data: skillsData, error } = await supabase
        .from('skills_view')
        .select('*')
      
      if (error) throw error
      
      if (skillsData) {
        console.log('Skills data:', skillsData)
        
        // Group skills by category
        const grouped = skillsData.reduce((acc, skill) => {
          if (!acc[skill.category_name]) {
            acc[skill.category_name] = {
              id: skill.category_id,
              name: skill.category_name,
              skills: []
            }
          }
          acc[skill.category_name].skills.push({
            skill_id: skill.skill_id,
            skill_name: skill.skill_name,
            category_id: skill.category_id,
            category_name: skill.category_name
          })
          return acc
        }, {} as SkillsByCategory)

        console.log('Grouped skills:', grouped)
        setSkillsByCategory(grouped)
        
        // Initially expand the first category
        if (Object.keys(grouped).length > 0) {
          setExpandedCategories([Object.keys(grouped)[0]])
        }
      }
    } catch (error) {
      console.error('Error fetching skills:', error)
    }
  }

  const addSkill = (skillName: string) => {
    if (selectedSkills.length < 10 && !selectedSkills.includes(skillName)) {
      setSelectedSkills([...selectedSkills, skillName])
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove))
  }

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Progress bar */}
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

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
          {/* Left column */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              What are the main skills<br />required for your project?
            </h1>
            <p className="text-sm text-gray-500">
              For the best results, add 3-5 skills
            </p>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Selected skills section */}
            <div>
              <h2 className="text-base font-medium text-gray-900 mb-3">Selected skills</h2>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-custom-gray text-white"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-white hover:text-gray-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Skill Categories */}
            <div className="space-y-0 divide-y divide-gray-200">
              {Object.entries(skillsByCategory).map(([categoryName, category]) => (
                <div key={category.id}>
                  <button
                    onClick={() => toggleCategory(categoryName)}
                    className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-900">{categoryName}</span>
                    {expandedCategories.includes(categoryName) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  
                  {expandedCategories.includes(categoryName) && (
                    <div className="px-4 py-3 bg-white">
                      <div className="flex flex-wrap gap-2">
                        {category.skills
                          .filter(skill => !selectedSkills.includes(skill.skill_name))
                          .map((skill) => (
                            <button
                              key={skill.skill_id}
                              onClick={() => addSkill(skill.skill_name)}
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

        {/* Navigation buttons */}
        <div className="flex items-center">
          <div className="flex-1">
            <Link href="/buyer/post-job/title" className="inline-flex items-center text-gray-600 hover:text-gray-900">
              <span>← Back</span>
            </Link>
          </div>
          <button
            onClick={() => router.push('/buyer/post-job/scope')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedSkills.length > 0
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            Next: Scope
          </button>
        </div>
      </div>
    </div>
  )
}
