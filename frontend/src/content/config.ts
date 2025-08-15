import { z, defineCollection } from 'astro:content';

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    layout: z.string(),
    hero: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      description: z.string().optional(),
    }).optional(),
    features: z.array(z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string(),
    })).optional(),
    products: z.array(z.object({
      title: z.string(),
      icon: z.string(),
      color: z.string(),
      description: z.string(),
      price: z.number(),
    })).optional(),
    contact_info: z.array(z.object({
      type: z.string(),
      icon: z.string(),
      title: z.string(),
      value: z.string(),
    })).optional(),
    form: z.object({
      title: z.string(),
      fields: z.array(z.object({
        name: z.string(),
        label: z.string(),
        type: z.string(),
        required: z.boolean(),
        placeholder: z.string().optional(),
      })),
      submit_button: z.string(),
    }).optional(),
    cta_section: z.object({
      title: z.string(),
      description: z.string().optional(),
      button: z.object({
        text: z.string(),
        link: z.string(),
      }),
    }).optional(),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    author: z.string(),
    featuredImage: z.string().optional(),
    tags: z.array(z.string())
  })
});

const servicesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    category: z.string().optional(),
    publishDate: z.date().optional(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional()
  })
});

const cmsSeoCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    author: z.string(),
    tags: z.array(z.string())
  })
});

const industrySeoCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    author: z.string(),
    tags: z.array(z.string())
  })
});

export const collections = {
  'pages': pagesCollection,
  'blog': blogCollection,
  'services': servicesCollection,
  'cms-seo': cmsSeoCollection,
  'industry-seo': industrySeoCollection
}; 