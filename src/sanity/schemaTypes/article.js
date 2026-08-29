export default {
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'summary',
      title: 'Summary',
      type: 'text',
      description: 'Short snippet used for the article intro and social media links',
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    
    // --- MAIN SECTION ---
    {
      name: 'category',
      title: 'Main Section',
      type: 'string',
      options: {
        list: [
          { title: 'Ghana', value: 'ghana' },
          { title: 'Politics', value: 'politics' },
          { title: 'Business', value: 'business' },
          { title: 'Sports', value: 'sports' },
          { title: 'STEM', value: 'stem' },
          { title: 'Entertainment', value: 'entertainment' },
          { title: 'World', value: 'world' },
          { title: 'Opinion', value: 'opinion' },
        ],
        layout: 'dropdown',
      },
    },
    
    // --- DYNAMIC SUBSECTIONS ---
    {
      name: 'subGhana',
      title: 'Ghana Subsection',
      type: 'string',
      hidden: ({ document }) => document?.category !== 'ghana',
      options: {
        list: [
          { title: 'Ghana: Latest', value: 'latest' },
          { title: 'Ghana: Accra', value: 'accra' },
          { title: 'Ghana: Regions', value: 'regions' },
          { title: 'Ghana: Society', value: 'society' },
          { title: 'Ghana: Education', value: 'education' },
          { title: 'Ghana: Health', value: 'health' },
          { title: 'Ghana: Crime & Security', value: 'crime-security' },
        ],
      },
    },
    {
      name: 'subPolitics',
      title: 'Politics Subsection',
      type: 'string',
      hidden: ({ document }) => document?.category !== 'politics',
      options: {
        list: [
          { title: 'Politics: Ghana Politics', value: 'ghana-politics' },
          { title: 'Politics: Government', value: 'government' },
          { title: 'Politics: Parliament', value: 'parliament' },
          { title: 'Politics: Elections', value: 'elections' },
          { title: 'Politics: Political Analysis', value: 'political-analysis' },
        ],
      },
    },
    {
      name: 'subSports',
      title: 'Sports Subsection',
      type: 'string',
      hidden: ({ document }) => document?.category !== 'sports',
      options: {
        list: [
          { title: 'Sports: Football', value: 'football' },
          { title: 'Sports: Transfers', value: 'transfers' },
          { title: 'Sports: Basketball', value: 'basketball' },
          { title: 'Sports: Tennis', value: 'tennis' },
          { title: 'Sports: Boxing', value: 'boxing' },
          { title: 'Sports: Athletics', value: 'athletics' },
          { title: 'Sports: Motorsport', value: 'motorsport' },
        ],
      },
    },
    {
      name: 'subStem',
      title: 'STEM Subsection',
      type: 'string',
      hidden: ({ document }) => document?.category !== 'stem',
      options: {
        list: [
          { title: 'STEM: Science', value: 'science' },
          { title: 'STEM: Technology', value: 'technology' },
          { title: 'STEM: Engineering', value: 'engineering' },
          { title: 'STEM: Mathematics', value: 'mathematics' },
          { title: 'STEM: AI', value: 'ai' },
          { title: 'STEM: Innovation', value: 'innovation' },
          { title: 'STEM: Space', value: 'space' },
        ],
      },
    },
    {
      name: 'subEntertainment',
      title: 'Entertainment Subsection',
      type: 'string',
      hidden: ({ document }) => document?.category !== 'entertainment',
      options: {
        list: [
          { title: 'Entertainment: Music', value: 'music' },
          { title: 'Entertainment: Movies & TV', value: 'movies-tv' },
          { title: 'Entertainment: Celebrity', value: 'celebrity' },
          { title: 'Entertainment: Arts', value: 'arts' },
          { title: 'Entertainment: Lifestyle', value: 'lifestyle' },
        ],
      },
    },
    {
      name: 'subWorld',
      title: 'World Subsection',
      type: 'string',
      hidden: ({ document }) => document?.category !== 'world',
      options: {
        list: [
          { title: 'World: Africa', value: 'africa' },
          { title: 'World: Europe', value: 'europe' },
          { title: 'World: Americas', value: 'americas' },
          { title: 'World: Asia', value: 'asia' },
          { title: 'World: Middle East', value: 'middle-east' },
          { title: 'World: International', value: 'international' },
        ],
      },
    },
    {
      name: 'subOpinion',
      title: 'Opinion Subsection',
      type: 'string',
      hidden: ({ document }) => document?.category !== 'opinion',
      options: {
        list: [
          { title: 'Opinion: Editorial', value: 'editorial' },
          { title: 'Opinion: Analysis', value: 'analysis' },
          { title: 'Opinion: Commentary', value: 'commentary' },
          { title: 'Opinion: Columns', value: 'columns' },
        ],
      },
    },
    {
      name: 'subBusiness',
      title: 'Business Subsection',
      type: 'string',
      hidden: ({ document }) => document?.category !== 'business',
      options: {
        list: [
          { title: 'Business: Finance', value: 'finance' },
          { title: 'Business: Economy', value: 'economy' },
          { title: 'Business: Markets', value: 'markets' },
        ],
      },
    },
    
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image' }
      ],
    },

    // --- LEGACY MIGRATION FIELDS ---
    {
      name: 'content',
      title: 'Legacy Content',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
      hidden: () => true,
    },
    {
      name: 'editorialCategory',
      title: 'Legacy Editorial Category',
      type: 'reference',
      to: [{ type: 'author' }], 
      weak: true,
      hidden: () => true,
    },
    {
      name: 'oldHygraphCategory',
      title: 'Old Hygraph Category',
      type: 'string',
      hidden: () => true,
    },
  ],
}