export default {
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.max(200).warning('Keep summaries punchy for the homepage.')
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true, // Allows you to crop images directly in the studio
      }
    },
    {
      name: 'editorialCategory',
      title: 'Editorial Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Select the most specific category (e.g., Transfers, Accra, AI).',
      validation: Rule => Rule.required()
    },
    {
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array', // This is Sanity's version of a rich text editor
      of: [
        { type: 'block' },
        { type: 'image' }
      ]
    }
  ]
}