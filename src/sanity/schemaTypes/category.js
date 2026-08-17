export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'parentCategory',
      title: 'Parent Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Leave blank for main pillars (e.g., Sports). Select a parent if this is a subcategory (e.g., Select "Football" if this is "Transfers").'
    }
  ],
  preview: {
    select: {
      title: 'name',
      parent: 'parentCategory.name'
    },
    prepare({ title, parent }) {
      return {
        title: title,
        subtitle: parent ? `Child of: ${parent}` : 'Main Section'
      }
    }
  }
}