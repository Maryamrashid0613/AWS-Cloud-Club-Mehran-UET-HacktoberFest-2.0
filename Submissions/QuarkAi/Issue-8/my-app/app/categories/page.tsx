'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Package } from 'lucide-react'
import { useUser } from '@/hooks/useUser'

interface CategoryWithCount {
  id: string
  name: string
  description: string | null
  icon: string | null
  color: string | null
  is_active: boolean
  product_count: number
  created_at: string
  updated_at: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null)
  const [loading, setLoading] = useState(true)
  const { user, isAdmin } = useUser()

  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    color: '',
  })

  useEffect(() => {
    fetchCategories()

    const channel = supabase
      .channel('categories-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, fetchCategories)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchCategories)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchCategories() {
    try {
      // Fetch categories with product counts
      const { data: categoriesData, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) {
        console.error('Error fetching categories:', error)
        setLoading(false)
        return
      }

      // Get product counts for each category
      const { data: products } = await supabase
        .from('products')
        .select('category_id')

      const productCounts = new Map<string, number>()
      products?.forEach(p => {
        if (p.category_id) {
          const count = productCounts.get(p.category_id) || 0
          productCounts.set(p.category_id, count + 1)
        }
      })

      const categoriesWithCount: CategoryWithCount[] = (categoriesData || []).map(cat => ({
        ...cat,
        product_count: productCounts.get(cat.id) || 0,
      }))

      setCategories(categoriesWithCount)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching categories:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formData.name.trim()) return

    console.log('🔍 Submitting category:', formData)
    console.log('🔍 User ID:', user.id)
    console.log('🔍 Is Admin:', isAdmin)

    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        icon: formData.icon.trim() || null,
        color: formData.color.trim() || null,
        created_by: user.id,
      }

      console.log('🔍 Category Data:', categoryData)

      if (editingCategory) {
        console.log('🔍 Updating category:', editingCategory.id)
        const { data, error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id)
          .select()

        console.log('🔍 Update result:', { data, error })
        if (error) throw error
      } else {
        console.log('🔍 Inserting new category')
        const { data, error } = await supabase
          .from('categories')
          .insert(categoryData)
          .select()

        console.log('🔍 Insert result:', { data, error })
        if (error) throw error
      }

      console.log('✅ Category saved successfully')
      resetForm()
      fetchCategories()
    } catch (error: any) {
      console.error('❌ Error saving category:', error)
      console.error('❌ Error code:', error.code)
      console.error('❌ Error message:', error.message)
      console.error('❌ Error details:', error.details)
      
      if (error.code === '23505') {
        alert('A category with this name already exists')
      } else if (error.code === '42P01') {
        alert('Categories table does not exist. Please run CATEGORIES_QUICK_SETUP.sql in Supabase first.')
      } else if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        alert('Categories table not found. Please run the SQL script (CATEGORIES_QUICK_SETUP.sql) in Supabase SQL Editor.')
      } else {
        alert(`Failed to save category: ${error.message || 'Unknown error'}`)
      }
    }
  }

  const handleEdit = (category: CategoryWithCount) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
      color: category.color || '',
    })
    setIsSheetOpen(true)
  }

  const handleDelete = async (category: CategoryWithCount) => {
    if (!isAdmin) return
    
    if (category.product_count > 0) {
      alert(`Cannot delete "${category.name}" because it has ${category.product_count} products. Please reassign or delete those products first.`)
      return
    }

    if (!confirm(`Delete category "${category.name}"?`)) return

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id)

      if (error) throw error

      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '',
      color: '',
    })
    setEditingCategory(null)
    setIsSheetOpen(false)
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage product categories to organize your inventory
          </p>
          {isAdmin && (
            <p className="text-xs text-green-400 mt-1">
              ✓ Admin Access - Full permissions
            </p>
          )}
        </div>
        <Button onClick={() => setIsSheetOpen(true)} disabled={!isAdmin}>
          <Plus className="mr-2 h-4 w-4" />
          {isAdmin ? 'Add Category' : 'Add Category (Admin Only)'}
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-10">
            <p className="text-muted-foreground">Loading categories...</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
            <CardDescription>
              {categories.length} {categories.length === 1 ? 'category' : 'categories'} • Organize your products by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No categories yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click "Add Category" to create your first category
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <Card key={category.id} className="relative overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {category.icon && (
                              <span className="text-2xl">{category.icon}</span>
                            )}
                            <CardTitle className="text-lg">{category.name}</CardTitle>
                          </div>
                          <Badge variant="secondary">
                            {category.product_count} {category.product_count === 1 ? 'product' : 'products'}
                          </Badge>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(category)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(category)}
                              className="h-8 w-8 p-0"
                              disabled={category.product_count > 0}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    {category.description && (
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {category.description}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</SheetTitle>
            <SheetDescription>
              {editingCategory 
                ? 'Update the category information.' 
                : 'Create a new category to organize your products.'}
            </SheetDescription>
          </SheetHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="category-name" className="text-sm font-medium">
                Category Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="category-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Electronics, Clothing, Food"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-icon" className="text-sm font-medium">
                Icon (Optional)
              </Label>
              <Input
                id="category-icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="e.g., 💻 📱 👕 🍔"
                maxLength={2}
              />
              <p className="text-xs text-muted-foreground">
                Use an emoji icon (optional)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-color" className="text-sm font-medium">
                Color (Optional)
              </Label>
              <Input
                id="category-color"
                type="color"
                value={formData.color || '#3b82f6'}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Choose a color for this category
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-description" className="text-sm font-medium">
                Description (Optional)
              </Label>
              <Input
                id="category-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this category"
              />
            </div>

            <SheetFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}
