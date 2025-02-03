'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SkillsPage() {
  const router = useRouter()
  const [selectedSkills, setSelectedSkills] = useState(['JavaScript', 'Python', 'Ruby'])
  const [searchQuery, setSearchQuery] = useState('')

  const skillCategories = [
    {
      title: 'Programming Languages',
      skills: ['PHP', 'Java', 'C#', 'Go']
    },
    {
      title: 'Web Automation Tools',
      skills: ['Selenium', 'Puppeteer', 'Playwright']
    },
    {
      title: 'Web Technologies and Parsing',
      skills: ['HTML', 'CSS', 'XPath', 'BeautifulSoup']
    },
    {
      title: 'Proxy and Anti-Bot Solutions',
      skills: ['Residential Proxies', 'Rotating Proxies', 'Anti-Detection']
    },
    {
      title: 'Databases and Data Storage',
      skills: ['MySQL', 'MongoDB', 'PostgreSQL', 'Redis']
    },
    {
      title: 'API Integration',
      skills: ['REST APIs', 'GraphQL', 'OAuth']
    },
    {
      title: 'Cloud Platforms and Deployment',
      skills: ['AWS', 'Google Cloud', 'Docker']
    },
    {
      title: 'Data Visualization and Reporting',
      skills: ['Matplotlib', 'D3.js', 'Tableau']
    },
    {
      title: 'Machine Learning and AI',
      skills: ['TensorFlow', 'PyTorch', 'NLP']
    }
  ]

  const handleSkillClick = (skill: string) => {
    setSelectedSkills(prev => {
      if (prev.includes(skill)) {
        return prev.filter(s => s !== skill)
      }
      if (prev.length >= 10) {
        alert('You can select up to 10 skills')
        return prev
      }
      return [...prev, skill]
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <span className="text-sm text-gray-500">2/6 Job post</span>
      </div>
      
      <div className="grid grid-cols-2 gap-16">
        <div>
          <h1 className="text-2xl font-semibold mb-2">What are the main skills<br />required for your work?</h1>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-sm mb-2">
              Search or add up to 10 skills
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              placeholder="Search skills..."
            />
            <p className="text-sm text-gray-500 mt-1">For the best results, add 3-5 skills</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedSkills.map(skill => (
              <button
                key={skill}
                onClick={() => handleSkillClick(skill)}
                className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center gap-1"
              >
                {skill}
                <span className="text-gray-500">×</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {skillCategories.map(category => (
              <div key={category.title}>
                <div className="flex items-center justify-between cursor-pointer">
                  <h3 className="text-sm font-medium">{category.title}</h3>
                  <span className="text-gray-400">▼</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <button
              onClick={() => router.push('/buyer/jobs/create/budget')}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
