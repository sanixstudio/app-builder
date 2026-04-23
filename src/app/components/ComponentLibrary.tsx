import {
  Type, Image, Square, Layout, Columns, Grid3x3,
  Link, Heading1, Heading2, Heading3, AlignLeft,
  Play, Star, MessageSquare, Mail, Menu, CreditCard,
  CheckSquare, List, Minus, Users, Award, Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

const componentCategories = [
  {
    name: 'Typography',
    items: [
      { id: 'heading1', name: 'Heading 1', icon: Heading1, defaultProps: { text: 'Main Heading', level: 'h1', align: 'left', color: '#000000' } },
      { id: 'heading2', name: 'Heading 2', icon: Heading2, defaultProps: { text: 'Sub Heading', level: 'h2', align: 'left', color: '#000000' } },
      { id: 'heading3', name: 'Heading 3', icon: Heading3, defaultProps: { text: 'Section Heading', level: 'h3', align: 'left', color: '#000000' } },
      { id: 'paragraph', name: 'Paragraph', icon: AlignLeft, defaultProps: { text: 'Your paragraph text goes here. Edit this to add your content.', align: 'left', color: '#374151' } },
      { id: 'link', name: 'Link', icon: Link, defaultProps: { text: 'Click here', url: '#', color: '#2563eb', underline: true } },
    ]
  },
  {
    name: 'Layout',
    items: [
      { id: 'section', name: 'Section', icon: Layout, defaultProps: { bgColor: '#ffffff', padding: '48', fullWidth: true } },
      { id: 'container', name: 'Container', icon: Square, defaultProps: { maxWidth: '1200', padding: '24', bgColor: 'transparent' } },
      { id: 'columns', name: '2 Columns', icon: Columns, defaultProps: { columns: 2, gap: '24', bgColor: 'transparent' } },
      { id: 'grid', name: 'Grid', icon: Grid3x3, defaultProps: { columns: 3, gap: '16', bgColor: 'transparent' } },
      { id: 'spacer', name: 'Spacer', icon: Minus, defaultProps: { height: '32' } },
    ]
  },
  {
    name: 'Components',
    items: [
      { id: 'button', name: 'Button', icon: Square, defaultProps: { text: 'Click me', variant: 'primary', size: 'md', url: '#' } },
      { id: 'image', name: 'Image', icon: Image, defaultProps: { src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800', alt: 'Image', width: '100%', rounded: true } },
      { id: 'video', name: 'Video', icon: Play, defaultProps: { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', aspectRatio: '16/9' } },
      { id: 'icon', name: 'Icon', icon: Star, defaultProps: { iconType: 'star', size: '32', color: '#2563eb' } },
      { id: 'divider', name: 'Divider', icon: Minus, defaultProps: { color: '#e5e7eb', thickness: '1' } },
    ]
  },
  {
    name: 'Forms',
    items: [
      { id: 'input', name: 'Text Input', icon: AlignLeft, defaultProps: { label: 'Email', placeholder: 'Enter your email', type: 'email', required: true } },
      { id: 'textarea', name: 'Textarea', icon: MessageSquare, defaultProps: { label: 'Message', placeholder: 'Your message', rows: 4 } },
      { id: 'checkbox', name: 'Checkbox', icon: CheckSquare, defaultProps: { label: 'I agree to terms and conditions' } },
      { id: 'form', name: 'Form', icon: Mail, defaultProps: { submitText: 'Submit', action: '#' } },
    ]
  },
  {
    name: 'Blocks',
    items: [
      { id: 'hero', name: 'Hero Section', icon: Layout, defaultProps: { title: 'Welcome to Our Product', subtitle: 'Build amazing landing pages in minutes', ctaText: 'Get Started', bgColor: '#1e40af' } },
      { id: 'feature', name: 'Feature Card', icon: Award, defaultProps: { icon: 'zap', title: 'Fast Performance', description: 'Lightning fast load times and optimal performance.' } },
      { id: 'testimonial', name: 'Testimonial', icon: MessageSquare, defaultProps: { quote: 'This product changed my business!', author: 'John Doe', role: 'CEO, Company' } },
      { id: 'cta', name: 'Call to Action', icon: Zap, defaultProps: { title: 'Ready to get started?', description: 'Join thousands of satisfied customers', buttonText: 'Sign Up Now', bgColor: '#7c3aed' } },
      { id: 'pricing', name: 'Pricing Card', icon: CreditCard, defaultProps: { title: 'Pro Plan', price: '$29', period: '/month', features: ['Feature 1', 'Feature 2', 'Feature 3'] } },
      { id: 'navbar', name: 'Navigation', icon: Menu, defaultProps: { logo: 'Brand', links: ['Home', 'Features', 'Pricing', 'Contact'] } },
      { id: 'footer', name: 'Footer', icon: List, defaultProps: { copyright: '© 2026 Your Company', links: ['Privacy', 'Terms', 'Contact'] } },
      { id: 'team', name: 'Team Member', icon: Users, defaultProps: { name: 'Jane Smith', role: 'Product Designer', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' } },
    ]
  }
];

interface ComponentLibraryProps {
  onDragStart: (type: string, defaultProps: any, e: React.DragEvent) => void;
  onApplyTemplate: (template: "heroPage" | "landingPage") => void;
}

export function ComponentLibrary({ onDragStart, onApplyTemplate }: ComponentLibraryProps) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = componentCategories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

  useEffect(() => {
    if (activeCategory >= filteredCategories.length) {
      setActiveCategory(0);
    }
  }, [filteredCategories.length, activeCategory]);

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold">Components</h2>
      </div>

      <div className="space-y-3 p-4 border-b border-gray-200 bg-gray-50">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">Quick start</h3>
            <span className="text-xs text-gray-500">Use one-click templates</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">Begin with a ready-made landing page layout.</p>
        </div>

        <div className="grid gap-2">
          <button
            type="button"
            onClick={() => onApplyTemplate('heroPage')}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50"
          >
            Hero + Footer
          </button>
          <button
            type="button"
            onClick={() => onApplyTemplate('landingPage')}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50"
          >
            Full Landing Page
          </button>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200 bg-white">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search components"
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1 p-2 bg-gray-50">
        {filteredCategories.map((category, index) => (
          <button
            key={category.name}
            onClick={() => setActiveCategory(index)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all rounded-lg text-left ${
              activeCategory === index
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredCategories[activeCategory]?.items.length ? (
            filteredCategories[activeCategory].items.map((component) => {
              const Icon = component.icon;
              return (
                <div
                  key={component.id}
                  draggable
                  onDragStart={(e) => onDragStart(component.id, component.defaultProps, e)}
                  className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-move hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm transition-all"
                >
                  <Icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  <span className="text-sm">{component.name}</span>
                </div>
              );
            })
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500 text-center">
              No matching components found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
