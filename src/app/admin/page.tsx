'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const objectiveSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1)
})

const templateSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  domain: z.enum(['MIND', 'BODY', 'SOUL', 'WEALTH']),
  difficulty: z.enum(['F', 'E', 'D', 'C', 'B', 'A', 'S']),
  xpReward: z.number().min(10).max(10000),
  rarity: z.enum(['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC']),
  durationDays: z.number().min(1).max(365),
  primaryAttr: z.enum(['strength', 'intelligence', 'charisma', 'willpower', 'perception', 'vitality']),
  secondaryAttr: z.enum(['strength', 'intelligence', 'charisma', 'willpower', 'perception', 'vitality']),
  minLevel: z.number().min(1).max(100),
  objectives: z.array(objectiveSchema).min(1)
})

type TemplateFormValues = z.infer<typeof templateSchema>

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      title: '',
      description: '',
      domain: 'BODY',
      difficulty: 'D',
      xpReward: 50,
      rarity: 'COMMON',
      durationDays: 1,
      primaryAttr: 'strength',
      secondaryAttr: 'vitality',
      minLevel: 1,
      objectives: [{ id: 'obj-1', title: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'objectives'
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/users').then(res => {
        if (!res.ok) throw new Error('Forbidden')
        return res.json()
      }),
      fetch('/api/admin/quest-templates').then(res => res.json())
    ])
      .then(([usersData, templatesData]) => {
        setUsers(usersData.users || [])
        setTemplates(templatesData.templates || [])
      })
      .catch(err => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const onSubmit = async (data: TemplateFormValues) => {
    try {
      const res = await fetch('/api/admin/quest-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Failed to create template')
      
      form.reset()
      // Refetch templates
      const templatesRes = await fetch('/api/admin/quest-templates')
      const templatesData = await templatesRes.json()
      setTemplates(templatesData.templates || [])
    } catch (err: any) {
      alert(err.message)
    }
  }

  const deleteTemplate = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      const res = await fetch(`/api/admin/quest-templates/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setTemplates(prev => prev.filter(t => t.id !== id))
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) return <div className="text-[#E8E6E0] p-8 font-mono">Verifying credentials...</div>
  if (error) return <div className="text-[#C41E1E] p-8 font-mono">{error}</div>

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-12 font-mono pb-24 md:pb-12 text-[#1E293B]" style={{ fontFamily: '"Fira Code", monospace' }}>
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#F8FAFC] tracking-tight mb-2">SYSTEM ADMINISTRATION</h1>
        <div className="h-[1px] w-24 bg-[#3B82F6] mx-auto mb-4" />
        <p className="text-[#94A3B8] text-sm uppercase tracking-widest">Trust & Authority established.</p>
      </div>

      {/* Users Table */}
      <div className="bg-[#0F172A] border border-[#1E293B] p-6 shadow-xl">
        <h2 className="text-[#F8FAFC] text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#3B82F6]" /> Entity Roster
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#94A3B8]">
            <thead className="bg-[#1E293B] text-[#F8FAFC]">
              <tr>
                <th className="p-3">Character</th>
                <th className="p-3">Class</th>
                <th className="p-3">Level</th>
                <th className="p-3">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-[#1E293B] hover:bg-[#1E293B]/50 transition-colors">
                  <td className="p-3 text-[#E2E8F0]">{u.character_name || 'Unknown'}</td>
                  <td className="p-3 uppercase">{u.class || 'Novice'}</td>
                  <td className="p-3 text-[#3B82F6]">{u.level || 1}</td>
                  <td className="p-3">{new Date(u.updated_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center">No entities found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quest Templates Editor */}
      <div className="bg-[#0F172A] border border-[#1E293B] p-6 shadow-xl">
        <h2 className="text-[#F8FAFC] text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#F97316]" /> Quest Template Editor
        </h2>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 mb-12 border-b border-[#1E293B] pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#E2E8F0] text-sm">
            
            <div className="flex flex-col gap-2">
              <label>Title</label>
              <input {...form.register('title')} className="bg-[#1E293B] border border-[#334155] p-2 focus:outline-none focus:border-[#3B82F6]" />
              {form.formState.errors.title && <span className="text-[#C41E1E] text-xs">{form.formState.errors.title.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label>Domain</label>
              <select {...form.register('domain')} className="bg-[#1E293B] border border-[#334155] p-2 focus:outline-none focus:border-[#3B82F6]">
                <option value="MIND">MIND</option>
                <option value="BODY">BODY</option>
                <option value="SOUL">SOUL</option>
                <option value="WEALTH">WEALTH</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label>Description</label>
              <textarea {...form.register('description')} className="bg-[#1E293B] border border-[#334155] p-2 h-24 focus:outline-none focus:border-[#3B82F6]" />
              {form.formState.errors.description && <span className="text-[#C41E1E] text-xs">{form.formState.errors.description.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label>Difficulty</label>
              <select {...form.register('difficulty')} className="bg-[#1E293B] border border-[#334155] p-2 focus:outline-none focus:border-[#3B82F6]">
                <option value="F">F (Trivial)</option>
                <option value="D">D (Easy)</option>
                <option value="C">C (Normal)</option>
                <option value="B">B (Hard)</option>
                <option value="A">A (Extreme)</option>
                <option value="S">S (Mythic)</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label>Rarity</label>
              <select {...form.register('rarity')} className="bg-[#1E293B] border border-[#334155] p-2 focus:outline-none focus:border-[#3B82F6]">
                <option value="COMMON">COMMON</option>
                <option value="UNCOMMON">UNCOMMON</option>
                <option value="RARE">RARE</option>
                <option value="EPIC">EPIC</option>
                <option value="LEGENDARY">LEGENDARY</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label>XP Reward</label>
              <input type="number" {...form.register('xpReward', { valueAsNumber: true })} className="bg-[#1E293B] border border-[#334155] p-2 focus:outline-none focus:border-[#3B82F6]" />
              {form.formState.errors.xpReward && <span className="text-[#C41E1E] text-xs">{form.formState.errors.xpReward.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label>Duration (Days)</label>
              <input type="number" {...form.register('durationDays', { valueAsNumber: true })} className="bg-[#1E293B] border border-[#334155] p-2 focus:outline-none focus:border-[#3B82F6]" />
            </div>

            <div className="flex flex-col gap-2">
              <label>Primary Attribute</label>
              <select {...form.register('primaryAttr')} className="bg-[#1E293B] border border-[#334155] p-2 focus:outline-none focus:border-[#3B82F6]">
                <option value="strength">Strength</option>
                <option value="intelligence">Intelligence</option>
                <option value="charisma">Charisma</option>
                <option value="willpower">Willpower</option>
                <option value="perception">Perception</option>
                <option value="vitality">Vitality</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label>Secondary Attribute</label>
              <select {...form.register('secondaryAttr')} className="bg-[#1E293B] border border-[#334155] p-2 focus:outline-none focus:border-[#3B82F6]">
                <option value="strength">Strength</option>
                <option value="intelligence">Intelligence</option>
                <option value="charisma">Charisma</option>
                <option value="willpower">Willpower</option>
                <option value="perception">Perception</option>
                <option value="vitality">Vitality</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2 md:col-span-2">
              <label>Minimum Level Requirement</label>
              <input type="number" {...form.register('minLevel', { valueAsNumber: true })} className="bg-[#1E293B] border border-[#334155] p-2 focus:outline-none focus:border-[#3B82F6]" />
            </div>

            {/* Objectives */}
            <div className="md:col-span-2 flex flex-col gap-4 bg-[#1E293B] p-4 border border-[#334155]">
              <label className="text-[#F8FAFC]">Objectives List</label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <input {...form.register(`objectives.${index}.title` as const)} placeholder="Objective description..." className="flex-1 bg-[#0F172A] border border-[#334155] p-2 focus:outline-none focus:border-[#3B82F6]" />
                  <button type="button" onClick={() => remove(index)} className="p-2 text-[#C41E1E] hover:bg-[#C41E1E]/20 transition-colors">DEL</button>
                </div>
              ))}
              <button type="button" onClick={() => append({ id: `obj-${fields.length + 1}`, title: '' })} className="self-start text-[#3B82F6] hover:text-[#60A5FA] mt-2">+ Add Objective</button>
            </div>

          </div>
          
          <button type="submit" className="bg-[#F97316] text-[#F8FAFC] py-4 mt-6 uppercase tracking-widest font-bold hover:bg-[#EA580C] transition-colors self-center px-12 disabled:opacity-50">
            Commit Template
          </button>
        </form>

        {/* Existing Templates Table */}
        <h3 className="text-[#F8FAFC] text-lg font-semibold mb-4">Existing Templates</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#94A3B8]">
            <thead className="bg-[#1E293B] text-[#F8FAFC]">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Domain</th>
                <th className="p-3">Rank</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(t => (
                <tr key={t.id} className="border-b border-[#1E293B] hover:bg-[#1E293B]/50 transition-colors">
                  <td className="p-3 text-[#E2E8F0]">{t.title}</td>
                  <td className="p-3">{t.domain}</td>
                  <td className="p-3 text-[#F97316]">{t.difficulty}</td>
                  <td className="p-3">
                    <button onClick={() => deleteTemplate(t.id)} className="text-[#C41E1E] hover:text-white transition-colors uppercase text-xs tracking-wider">PURGE</button>
                  </td>
                </tr>
              ))}
              {templates.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center">No templates exist in the void.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
