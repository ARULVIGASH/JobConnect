import { useEffect, useState } from 'react'
import api from '../services/api'
import './AdminCategories.css'

function AdminCategories() {
const [categories, setCategories] = useState([])
const [name, setName] = useState('')
const [description, setDescription] = useState('')
const [editingId, setEditingId] = useState(null)
const [search, setSearch] = useState('')
const [loading, setLoading] = useState(true)
const [saving, setSaving] = useState(false)
const [error, setError] = useState('')

useEffect(() => {
loadCategories()
}, [])

const loadCategories = async () => {
try {
setLoading(true)
setError('')

  const response = await api.get('/admin/categories')
  setCategories(response.data)
} catch (error) {
  console.error('Categories Error:', error)

  setError(
    error.response?.data?.message ||
    'Unable to load categories'
  )
} finally {
  setLoading(false)
}

}

const handleSubmit = async (event) => {
event.preventDefault()

if (!name.trim()) {
  alert('Please enter category name')
  return
}

try {
  setSaving(true)

  const categoryData = {
    name: name.trim(),
    description: description.trim()
  }

  if (editingId) {
    const response = await api.put(
      `/admin/categories/${editingId}`,
      categoryData
    )

    setCategories(
      categories.map(category =>
        category.id === editingId
          ? response.data
          : category
      )
    )

    alert('Category updated successfully')
  } else {
    const response = await api.post(
      '/admin/categories',
      categoryData
    )

    setCategories([
      ...categories,
      response.data
    ])

    alert('Category added successfully')
  }

  clearForm()

} catch (error) {
  console.error('Category Save Error:', error)

  alert(
    error.response?.data?.message ||
    'Unable to save category'
  )
} finally {
  setSaving(false)
}

}

const handleEdit = (category) => {
setEditingId(category.id)
setName(category.name || '')
setDescription(category.description || '')

window.scrollTo({
  top: 0,
  behavior: 'smooth'
})

}

const handleDelete = async (id) => {
const confirmed = window.confirm(
'Are you sure you want to delete this category?'
)

if (!confirmed) {
  return
}

try {
  await api.delete(`/admin/categories/${id}`)

  setCategories(
    categories.filter(category => category.id !== id)
  )

  if (editingId === id) {
    clearForm()
  }

  alert('Category deleted successfully')

} catch (error) {
  console.error('Category Delete Error:', error)

  alert(
    error.response?.data?.message ||
    'Unable to delete category'
  )
}

}

const clearForm = () => {
setEditingId(null)
setName('')
setDescription('')
}

const filteredCategories = categories.filter(category => {
const searchText = search.toLowerCase()

return (
  category.name?.toLowerCase().includes(searchText) ||
  category.description?.toLowerCase().includes(searchText)
)

})

const totalCategories = categories.length

if (loading) {
return (
<div className="admin-category-loading">
<div className="category-loading-spinner"></div>
<h2>Loading Categories...</h2>
<p>Please wait while categories are being loaded.</p>
</div>
)
}

return (
<div className="admin-categories">

  <div className="admin-categories-header">

    <div>
      <span className="admin-category-badge">
        ADMIN PANEL
      </span>

      <h1>Category Management</h1>

      <p>
        Create, update and manage job categories
        on the JobConnect platform.
      </p>
    </div>

    <button
      className="category-refresh-button"
      onClick={loadCategories}
    >
      ↻ Refresh
    </button>

  </div>

  {error && (
    <div className="admin-category-error">
      <span>⚠</span>
      {error}
    </div>
  )}

  <div className="category-summary-grid">

    <div className="category-summary-card">

      <div className="category-summary-icon">
        📁
      </div>

      <div>
        <span>Total Categories</span>
        <strong>{totalCategories}</strong>
      </div>

    </div>

    <div className="category-summary-card">

      <div className="category-summary-icon">
        🔎
      </div>

      <div>
        <span>Search Results</span>
        <strong>{filteredCategories.length}</strong>
      </div>

    </div>

  </div>

  <div className="category-form-card">

    <div className="category-form-header">

      <div>
        <span className="category-section-label">
          {editingId ? 'EDIT MODE' : 'NEW CATEGORY'}
        </span>

        <h2>
          {editingId
            ? 'Edit Category'
            : 'Add New Category'}
        </h2>

        <p>
          {editingId
            ? 'Update the selected job category details.'
            : 'Add a new category for recruiters and job seekers.'}
        </p>
      </div>

    </div>

    <form onSubmit={handleSubmit}>

      <div className="category-form-grid">

        <div className="category-form-group">

          <label>Category Name</label>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="e.g. Software Development"
            maxLength="100"
          />

        </div>

        <div className="category-form-group">

          <label>Description</label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Enter category description"
            rows="4"
            maxLength="500"
          />

        </div>

      </div>

      <div className="category-form-actions">

        <button
          type="submit"
          className="category-save-button"
          disabled={saving}
        >
          {saving
            ? 'Saving...'
            : editingId
              ? 'Update Category'
              : 'Add Category'}
        </button>

        {editingId && (
          <button
            type="button"
            className="category-cancel-button"
            onClick={clearForm}
            disabled={saving}
          >
            Cancel
          </button>
        )}

      </div>

    </form>

  </div>

  <div className="category-list-card">

    <div className="category-list-header">

      <div>
        <span className="category-section-label">
          CATEGORY DIRECTORY
        </span>

        <h2>All Categories</h2>

        <p>
          Manage categories available across the
          JobConnect platform.
        </p>
      </div>

      <div className="category-count">
        {filteredCategories.length}
        <span>
          {filteredCategories.length === 1
            ? ' Category'
            : ' Categories'}
        </span>
      </div>

    </div>

    <div className="category-search-box">

      <div className="category-search-input-wrapper">

        <span>🔎</span>

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search categories by name or description..."
        />

      </div>

      {search && (
        <button
          className="category-clear-search"
          onClick={() => setSearch('')}
        >
          Clear
        </button>
      )}

    </div>

    {filteredCategories.length === 0 ? (

      <div className="no-categories">

        <div className="no-category-icon">
          📂
        </div>

        <h3>
          {categories.length === 0
            ? 'No Categories Found'
            : 'No Matching Categories'}
        </h3>

        <p>
          {categories.length === 0
            ? 'Add your first job category using the form above.'
            : 'Try changing your search keyword.'}
        </p>

        {search && (
          <button
            className="category-reset-button"
            onClick={() => setSearch('')}
          >
            Clear Search
          </button>
        )}

      </div>

    ) : (

      <div className="category-table-wrapper">

        <table className="category-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredCategories.map(category => (

              <tr key={category.id}>

                <td>
                  <span className="category-id">
                    #{category.id}
                  </span>
                </td>

                <td>

                  <div className="category-name-wrapper">

                    <div className="category-icon">
                      📁
                    </div>

                    <div>
                      <strong className="category-name">
                        {category.name}
                      </strong>

                      <small>
                        Job Category
                      </small>
                    </div>

                  </div>

                </td>

                <td>

                  <div className="category-description">
                    {category.description || (
                      <span className="empty-description">
                        No description available
                      </span>
                    )}
                  </div>

                </td>

                <td>

                  <div className="category-actions">

                    <button
                      className="category-edit-button"
                      onClick={() =>
                        handleEdit(category)
                      }
                    >
                      ✎ Edit
                    </button>

                    <button
                      className="category-delete-button"
                      onClick={() =>
                        handleDelete(category.id)
                      }
                    >
                      🗑 Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    )}

  </div>

  <div className="category-footer">
    <p>
      JobConnect Admin Panel • Category Management
    </p>
  </div>

</div>

)
}

export default AdminCategories