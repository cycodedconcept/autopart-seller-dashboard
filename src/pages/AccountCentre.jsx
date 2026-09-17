import React, { useState, useMemo, useEffect, useRef } from 'react'
import {
  Search, MessageSquare, Phone, Mail, CheckCircle,
  Clock, AlertCircle, ChevronDown, ChevronRight,
  Package, ShoppingBag, CreditCard, Truck, User, Shield,
  BookOpen, FileText, Star, ThumbsUp, ThumbsDown,
  ArrowLeft, ArrowRight, HelpCircle, FolderOpen,
  X, ListOrdered
} from 'lucide-react'

const faqCategories = [
  {
    id: 'all', label: 'All Topics', icon: BookOpen,
    questions: [
      { id: 1, question: 'How do I update an order status?', lastUpdated: '2 weeks ago', readingTime: '2 min read', answer: 'To update an order status, go to the Orders page, select the order you want to update, and use the status dropdown menu to choose the new status. Don\'t forget to save your changes!' },
      { id: 2, question: 'Can I cancel an order after it\'s been placed?', lastUpdated: '3 weeks ago', readingTime: '1 min read', answer: 'Yes, you can cancel an order within 24 hours of placement if it hasn\'t been shipped yet. Go to the order details and click the Cancel Order button.' },
      { id: 5, question: 'How do I add a new product to my catalogue?', lastUpdated: '1 week ago', readingTime: '3 min read', answer: 'Go to Products, click Add Product, fill in all required product information including images, pricing, and inventory details, then click Save Product.' },
      { id: 7, question: 'What is the platform fee?', lastUpdated: '1 month ago', readingTime: '2 min read', answer: 'We charge a 5% commission fee on each successful sale, plus a small payment processing fee depending on your location.' },
      { id: 9, question: 'How do I offer free shipping on certain orders?', lastUpdated: '2 weeks ago', readingTime: '2 min read', answer: 'You can set up free shipping rules in your store settings, or offer it as a promotion for orders over a certain value.' },
      { id: 11, question: 'How do I change my account email address?', lastUpdated: '2 weeks ago', readingTime: '2 min read', answer: 'Go to Account Settings > Account, update your email address in the form, and verify it through the confirmation email.' },
    ]
  },
  {
    id: 'orders', label: 'Orders', icon: ShoppingBag,
    questions: [
      { id: 1, question: 'How do I update an order status?', lastUpdated: '2 weeks ago', readingTime: '2 min read', answer: 'To update an order status, go to the Orders page, select the order you want to update, and use the status dropdown menu to choose the new status. Don\'t forget to save your changes!' },
      { id: 2, question: 'Can I cancel an order after it\'s been placed?', lastUpdated: '3 weeks ago', readingTime: '1 min read', answer: 'Yes, you can cancel an order within 24 hours of placement if it hasn\'t been shipped yet. Go to the order details and click the Cancel Order button.' },
      { id: 3, question: 'How do I add a tracking number to an order?', lastUpdated: '1 month ago', readingTime: '2 min read', answer: 'Navigate to the order details page, find the Tracking section, and enter your tracking number along with the shipping carrier information.' },
      { id: 4, question: 'When will I receive my payout?', lastUpdated: '2 weeks ago', readingTime: '1 min read', answer: 'Payouts are processed weekly on Fridays. The exact timing depends on your payment method and bank processing times.' },
    ]
  },
  {
    id: 'products', label: 'Products', icon: Package,
    questions: [
      { id: 5, question: 'How do I add a new product to my catalogue?', lastUpdated: '1 week ago', readingTime: '3 min read', answer: 'Go to Products, click Add Product, fill in all required product information including images, pricing, and inventory details, then click Save Product.' },
      { id: 6, question: 'Why is my product showing as Out of Stock?', lastUpdated: '2 weeks ago', readingTime: '1 min read', answer: 'This happens when your inventory count reaches zero. Go to the product edit page and update the stock quantity to restock your item.' },
    ]
  },
  {
    id: 'payments', label: 'Payments', icon: CreditCard,
    questions: [
      { id: 7, question: 'What is the platform fee?', lastUpdated: '1 month ago', readingTime: '2 min read', answer: 'We charge a 5% commission fee on each successful sale, plus a small payment processing fee depending on your location.' },
      { id: 8, question: 'How do I add a new payment method?', lastUpdated: '3 weeks ago', readingTime: '2 min read', answer: 'Go to Account Settings > Security and follow the instructions to add and verify your new payment method.' },
    ]
  },
  {
    id: 'shipping', label: 'Shipping', icon: Truck,
    questions: [
      { id: 9, question: 'How do I offer free shipping on certain orders?', lastUpdated: '2 weeks ago', readingTime: '2 min read', answer: 'You can set up free shipping rules in your store settings, or offer it as a promotion for orders over a certain value.' },
      { id: 10, question: 'Can customers track their delivery?', lastUpdated: '1 week ago', readingTime: '1 min read', answer: 'Yes! Once you add a tracking number to an order, customers can track their delivery through their order history page.' },
    ]
  },
  {
    id: 'account', label: 'Account', icon: User,
    questions: [
      { id: 11, question: 'How do I change my account email address?', lastUpdated: '2 weeks ago', readingTime: '2 min read', answer: 'Go to Account Settings > Account, update your email address in the form, and verify it through the confirmation email.' },
      { id: 12, question: 'How do I enable two-factor authentication?', lastUpdated: '1 month ago', readingTime: '3 min read', answer: 'Navigate to Account Settings > Security and follow the step-by-step instructions to set up 2FA for your account.' },
    ]
  },
  {
    id: 'analytics', label: 'Analytics', icon: FileText,
    questions: [
      { id: 13, question: 'How do I view my sales reports?', lastUpdated: '2 weeks ago', readingTime: '2 min read', answer: 'Go to the Analytics page to view your sales reports, which include daily, weekly, and monthly breakdowns.' },
      { id: 14, question: 'How do I track my best-selling products?', lastUpdated: '3 weeks ago', readingTime: '2 min read', answer: 'Navigate to the Analytics page and select the "Products" tab to see your best-selling items.' },
    ]
  }
]

const mockTickets = [
  {
    id: 'SPT-1432', subject: 'Payment not received for order #ORD-7891',
    status: 'urgent', priority: 'high', date: 'Jan 20, 2025',
    lastMessage: 'We\'re investigating your issue...', agent: 'Sarah K.',
    progress: 'investigating'
  },
  {
    id: 'SPT-1428', subject: 'Product images not uploading',
    status: 'in_progress', priority: 'medium', date: 'Jan 18, 2025',
    lastMessage: 'Can you try a different browser?', agent: 'Mike R.',
    progress: 'assigned'
  },
  {
    id: 'SPT-1415', subject: 'Refund request for order #ORD-7743',
    status: 'resolved', priority: 'low', date: 'Jan 15, 2025',
    lastMessage: 'Your issue has been resolved!', agent: 'Tina O.',
    progress: 'resolved'
  },
  {
    id: 'SPT-1409', subject: 'Shipping address update request',
    status: 'pending', priority: 'medium', date: 'Jan 22, 2025',
    lastMessage: 'Awaiting customer confirmation...', agent: 'Sarah K.',
    progress: 'waiting'
  }
]

const progressStages = ['submitted', 'assigned', 'investigating', 'waiting', 'resolved']

const helpArticles = [
  {
    id: 'art-1', title: 'Getting Started with Your Seller Dashboard',
    slug: 'getting-started', category: 'account', icon: BookOpen,
    summary: 'Learn the basics of navigating your seller dashboard, understanding key metrics, and setting up your store for success.',
    content: `## Dashboard Overview\n\nThe dashboard is your central hub for managing your online auto parts business. From here you can monitor sales, manage inventory, process orders, and track your performance.\n\n## Key Metrics\n\nYour dashboard displays important metrics including total revenue, orders, active listings, and customer satisfaction scores. These metrics update in real-time to give you an accurate picture of your business health.\n\n## Quick Actions\n\nUse the quick action buttons to perform common tasks like adding products, processing orders, or viewing your analytics report.\n\n## Getting Support\n\nIf you need help, visit the Help Centre or contact our support team. We are available 24/7 to assist you with any questions.`,
    readingTime: '4 min read', lastUpdated: 'Jan 10, 2025', featured: true, popular: true
  },
  {
    id: 'art-2', title: 'Understanding Your Revenue Reports', slug: 'revenue-reports',
    category: 'payments', icon: FileText,
    summary: 'A comprehensive guide to reading your revenue reports, understanding fees, and tracking your earnings over time.',
    content: `## Monthly Breakdown\n\nView your revenue broken down by month, with comparisons to previous periods. Track growth trends and identify seasonal patterns.\n\n## Fee Structure\n\nAutoParts Hub charges a 5% commission on each sale plus a small payment processing fee. All fees are clearly itemized in your reports.\n\n## Exporting Data\n\nYou can export your revenue data as CSV or PDF for your records or accounting purposes.\n\n## Payout Schedule\n\nPayouts are processed weekly every Friday. Funds are transferred to your registered bank account within 1-3 business days.`,
    readingTime: '3 min read', lastUpdated: 'Jan 8, 2025', featured: true, popular: true
  },
  {
    id: 'art-3', title: 'Managing Inventory & Stock Levels', slug: 'inventory-management',
    category: 'products', icon: Package,
    summary: 'Best practices for managing your inventory, setting stock alerts, and keeping your catalogue up to date.',
    content: `## Stock Alerts\n\nSet low stock thresholds to receive notifications when items need replenishment. This helps prevent out-of-stock situations.\n\n## Bulk Updates\n\nUse the bulk edit feature to update prices, quantities, or statuses across multiple products at once.\n\n## Inventory Reports\n\nRun inventory reports to identify slow-moving items, top sellers, and products that may need pricing adjustments.\n\n## Best Practices\n\nRegularly review your inventory to remove discontinued items and update pricing based on market conditions.`,
    readingTime: '5 min read', lastUpdated: 'Jan 5, 2025', featured: true, popular: true
  },
  {
    id: 'art-4', title: 'Processing Orders & Fulfillment', slug: 'order-fulfillment',
    category: 'orders', icon: ShoppingBag,
    summary: 'Step-by-step guide to processing orders, managing fulfillment, and handling shipping efficiently.',
    content: `## Order Workflow\n\nNew orders appear in your dashboard with a "Pending" status. Review the order details, confirm inventory availability, and process payment before proceeding to fulfillment.\n\n## Shipping Integration\n\nConnect your preferred shipping carrier to generate labels and tracking numbers directly from the platform.\n\n## Returns & Refunds\n\nHandle return requests through the Orders page. Review the customer\'s reason, approve or decline, and process the refund once items are received.`,
    readingTime: '6 min read', lastUpdated: 'Dec 28, 2024', featured: false, popular: true
  },
  {
    id: 'art-5', title: 'Setting Up Shipping Rules', slug: 'shipping-rules',
    category: 'shipping', icon: Truck,
    summary: 'Configure shipping zones, rates, and free shipping thresholds to match your business model.',
    content: `## Shipping Zones\n\nDefine shipping zones based on customer locations. Set different rates for local, regional, national, and international deliveries.\n\n## Rate Tables\n\nCreate rate tables with weight-based or price-based shipping calculations. Offer free shipping above a certain order value to encourage larger purchases.\n\n## Carrier Settings\n\nIntegrate with major carriers and configure your shipping preferences, packing slip formats, and default services.`,
    readingTime: '4 min read', lastUpdated: 'Jan 12, 2025', featured: false, popular: true
  },
  {
    id: 'art-6', title: 'Account Security Best Practices', slug: 'account-security',
    category: 'security', icon: Shield,
    summary: 'Protect your account with strong passwords, two-factor authentication, and security monitoring.',
    content: `## Two-Factor Authentication\n\nEnable 2FA for an extra layer of security. You can use authenticator apps like Google Authenticator or Authy.\n\n## Password Best Practices\n\nUse a strong, unique password with a mix of letters, numbers, and special characters. Avoid reusing passwords across different services.\n\n## Login Monitoring\n\nReview your recent login activity regularly. If you see any unfamiliar devices or locations, change your password immediately.`,
    readingTime: '3 min read', lastUpdated: 'Jan 3, 2025', featured: false, popular: false
  },
  {
    id: 'art-7', title: 'Managing Customer Communications', slug: 'customer-communications',
    category: 'account', icon: MessageSquare,
    summary: 'Learn how to use the inbox and messaging features to communicate effectively with your customers.',
    content: `## Inbox Overview\n\nYour inbox centralizes all customer messages. Respond directly from the platform and keep a record of all conversations.\n\n## Templates\n\nCreate message templates for common responses like order confirmations, shipping updates, and follow-ups to save time.\n\n## Notifications\n\nCustomize your notification preferences to receive alerts for new messages, order updates, and important customer inquiries.`,
    readingTime: '4 min read', lastUpdated: 'Dec 20, 2024', featured: false, popular: false
  },
  {
    id: 'art-8', title: 'Understanding Seller Fees & Payouts', slug: 'seller-fees',
    category: 'payments', icon: CreditCard,
    summary: 'A detailed breakdown of all seller fees, payout schedules, and how to read your payment statements.',
    content: `## Commission Structure\n\nAutoParts Hub charges a competitive 5% commission on each completed sale. This covers platform usage, payment processing, and customer support.\n\n## Payout Schedule\n\nPayouts are processed weekly every Friday. Funds are transferred to your registered bank account and may take 1-3 business days to appear depending on your bank.\n\n## Payment Statements\n\nAccess detailed payment statements from your Account Settings page showing each transaction, fee deduction, and net payout amount.`,
    readingTime: '5 min read', lastUpdated: 'Jan 14, 2025', featured: true, popular: false
  }
]

const categoryIcons = {
  orders: ShoppingBag, products: Package, payments: CreditCard,
  shipping: Truck, account: User, security: Shield
}

/* ─── Sub-components ─── */

function FAQAccordion({ question, answer, lastUpdated, readingTime, category }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}>
        <span className="faq-question-text">{question}</span>
        <ChevronDown size={18} className={`faq-chevron ${isOpen ? 'open' : ''}`} />
      </button>
      {isOpen && (
        <div className="faq-answer-wrapper">
          <div className="faq-answer">{answer}</div>
        </div>
      )}
    </div>
  )
}

function ArticleCard({ article, onSelect }) {
  const CatIcon = categoryIcons[article.category] || FileText
  return (
    <div className="article-card" onClick={() => onSelect(article)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onSelect(article)}>
      <div className="article-card-icon"><CatIcon size={20} /></div>
      <div className="article-card-body">
        <div className="article-card-top">
          <span className="article-badge">{article.category}</span>
          {article.popular && <span className="article-popular-badge">Popular</span>}
        </div>
        <h4 className="article-card-title">{article.title}</h4>
        <p className="article-card-summary">{article.summary}</p>
        <div className="article-card-meta">
          <span><Clock size={12} /> {article.readingTime}</span>
          <span>Updated {article.lastUpdated}</span>
        </div>
      </div>
      <ChevronRight size={18} className="article-card-arrow" />
    </div>
  )
}

function ArticleDetail({ article, articles, onBack, onRelatedSelect }) {
  const [helpful, setHelpful] = useState(null)
  const [feedbackText, setFeedbackText] = useState('')
  const idx = articles.findIndex(a => a.id === article.id)
  const prev = idx > 0 ? articles[idx - 1] : null
  const next = idx < articles.length - 1 ? articles[idx + 1] : null
  const related = articles.filter(a => a.category === article.category && a.id !== article.id).slice(0, 3)

  const headings = article.content.split('\n').filter(l => l.startsWith('## '))

  const renderContent = () => {
    return article.content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} id={`section-${i}`}>{line.replace('## ', '')}</h2>
      if (line.startsWith('- ')) return <li key={i}>{line.replace('- ', '')}</li>
      if (line.trim() === '') return <div key={i} className="article-spacer" />
      return <p key={i}>{line}</p>
    })
  }

  return (
    <div className="article-detail">
      <button className="article-back-btn" onClick={onBack}>
        <ArrowLeft size={16} /> Back to Articles
      </button>

      <div className="article-breadcrumb">
        Help Center / Articles / {article.category} / {article.title}
      </div>

      <div className="article-detail-header">
        <h1>{article.title}</h1>
        <div className="article-detail-meta">
          <span className="article-badge">{article.category}</span>
          <span><Clock size={14} /> {article.readingTime}</span>
          <span>Updated {article.lastUpdated}</span>
        </div>
      </div>

      <div className="article-detail-body">
        <div className="article-detail-content">
          {headings.length > 1 && (
            <div className="article-toc">
              <span className="article-toc-label">On this page</span>
              {headings.map((h, i) => (
                <a key={i} className="article-toc-item" href={`#section-${i}`}>{h.replace('## ', '')}</a>
              ))}
            </div>
          )}
          {renderContent()}
        </div>
        {related.length > 0 && (
          <aside className="article-sidebar">
            <h4>Related Articles</h4>
            {related.map(r => (
              <button key={r.id} className="related-article-link" onClick={() => onRelatedSelect(r)}>
                <FileText size={14} />
                <span>{r.title}</span>
              </button>
            ))}
          </aside>
        )}
      </div>

      <div className="article-feedback">
        <p>Was this article helpful?</p>
        <div className="feedback-btns">
          <button className={`feedback-btn ${helpful === true ? 'active' : ''}`} onClick={() => setHelpful(true)} aria-label="Yes, this was helpful">
            <ThumbsUp size={16} /> Yes
          </button>
          <button className={`feedback-btn ${helpful === false ? 'active' : ''}`} onClick={() => setHelpful(false)} aria-label="No, this was not helpful">
            <ThumbsDown size={16} /> No
          </button>
        </div>
        {helpful === false && (
          <div className="feedback-form">
            <textarea placeholder="What was missing or unclear? Let us know how we can improve..." value={feedbackText} onChange={e => setFeedbackText(e.target.value)} aria-label="Feedback" />
            <button className="btn-save">Send Feedback</button>
          </div>
        )}
        {helpful === true && <p className="feedback-thanks">Thanks for your feedback!</p>}
      </div>

      <div className="article-nav">
        {prev && (
          <button className="article-nav-link prev" onClick={() => onRelatedSelect(prev)}>
            <ArrowLeft size={16} />
            <div><span className="article-nav-label">Previous</span><span className="article-nav-title">{prev.title}</span></div>
          </button>
        )}
        <div />
        {next && (
          <button className="article-nav-link next" onClick={() => onRelatedSelect(next)}>
            <div><span className="article-nav-label">Next</span><span className="article-nav-title">{next.title}</span></div>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

function EmptyState({ icon: Icon, title, message, action, onAction, secondary }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={48} className="empty-state-icon" />}
      <h3>{title}</h3>
      <p>{message}</p>
      {action && <button className="btn-save" onClick={onAction}>{action}</button>}
      {secondary && <span className="empty-state-secondary">{secondary}</span>}
    </div>
  )
}

function Toast({ message, visible }) {
  return (
    <div className={`toast ${visible ? 'visible' : ''}`}>
      <CheckCircle size={18} />
      <span>{message}</span>
    </div>
  )
}

/* ─── Main Component ─── */

export default function AccountCentre() {
  const [activeTab, setActiveTab] = useState('faqs')
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [ticketSearch, setTicketSearch] = useState('')
  const [ticketStatusFilter, setTicketStatusFilter] = useState('all')
  const [ticketSortBy, setTicketSortBy] = useState('date')
  const [activeTopic, setActiveTopic] = useState(null)
  const [articleSortBy, setArticleSortBy] = useState('popular')
  const [articleSearch, setArticleSearch] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const activeCategoryData = faqCategories.find(cat => cat.id === activeCategory)

  const filteredTickets = useMemo(() => {
    let result = [...mockTickets]
    if (ticketSearch) {
      const q = ticketSearch.toLowerCase()
      result = result.filter(t => t.id.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q))
    }
    if (ticketStatusFilter !== 'all') result = result.filter(t => t.status === ticketStatusFilter)
    if (ticketSortBy === 'date') result.sort((a, b) => new Date(b.date) - new Date(a.date))
    if (ticketSortBy === 'priority') result.sort((a, b) => ['urgent','high','medium','low'].indexOf(a.priority) - ['urgent','high','medium','low'].indexOf(b.priority))
    return result
  }, [ticketSearch, ticketStatusFilter, ticketSortBy])

  const popularTopics = ['Orders', 'Products', 'Payments', 'Shipping', 'Returns', 'Account']
  const handleTopicClick = (topic) => {
    const match = faqCategories.find(c => c.label.toLowerCase() === topic.toLowerCase())
    if (match) {
      setActiveTopic(topic)
      setActiveCategory(match.id)
      setActiveTab('faqs')
    }
  }

  const handleSearch = (e) => {
    const val = e.target.value
    setSearchQuery(val)
    if (val && activeTab !== 'faqs' && activeTab !== 'articles') setActiveTab('faqs')
  }

  const searchFilteredFaqs = useMemo(() => {
    if (!searchQuery) return null
    const q = searchQuery.toLowerCase()
    const results = faqCategories.flatMap(cat =>
      cat.questions
        .filter(qs => qs.question.toLowerCase().includes(q) || qs.answer.toLowerCase().includes(q))
        .map(qs => ({ ...qs, category: cat.label }))
    )
    return results.length > 0 ? results : []
  }, [searchQuery])

  const searchFilteredArticles = useMemo(() => {
    if (!searchQuery) return null
    const q = searchQuery.toLowerCase()
    const results = helpArticles.filter(a =>
      a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
    )
    return results.length > 0 ? results : []
  }, [searchQuery])

  const featuredArticles = helpArticles.filter(a => a.featured)
  const popularArticles = helpArticles.filter(a => a.popular)

  const allArticleCategories = [...new Set(helpArticles.map(a => a.category))]
  const [articleCategoryFilter, setArticleCategoryFilter] = useState('all')

  const processedArticles = useMemo(() => {
    let result = articleCategoryFilter === 'all' ? [...helpArticles] : helpArticles.filter(a => a.category === articleCategoryFilter)
    if (articleSearch) {
      const q = articleSearch.toLowerCase()
      result = result.filter(a => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q))
    }
    if (articleSortBy === 'popular') result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0))
    else if (articleSortBy === 'recent') result.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
    else if (articleSortBy === 'alpha') result.sort((a, b) => a.title.localeCompare(b.title))
    return result
  }, [articleCategoryFilter, articleSortBy, articleSearch])

  const handleSubmitTicket = () => {
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }

  const recentSearches = ['How to add a product', 'Shipping settings', 'Payment setup']

  if (selectedArticle) {
    return (
      <div className="account-centre-page">
        <ArticleDetail
          article={selectedArticle}
          articles={helpArticles}
          onBack={() => setSelectedArticle(null)}
          onRelatedSelect={(a) => setSelectedArticle(a)}
        />
      </div>
    )
  }

  return (
    <div className="account-centre-page">
      <Toast message="Ticket submitted successfully!" visible={toastVisible} />

      {/* Hero */}
      <div className="help-hero">
        <div className="help-hero-content">
          <h1>How can we help?</h1>
          <p>Search for answers or browse our help resources by topic</p>
          <div className="help-search">
            <Search size={20} className="help-search-icon" />
            <input ref={searchRef} type="text" placeholder="Search for answers..." value={searchQuery} onChange={handleSearch} onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 200)} />
            <span className="help-search-shortcut">Ctrl+K</span>
            {searchQuery && (
              <button className="help-search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">×</button>
            )}
          </div>

          {searchFocused && !searchQuery && (
            <div className="search-results">
              <div className="search-results-section">
                <h4>Recent Searches</h4>
                {recentSearches.map((s, i) => (
                  <button key={i} className="search-result-item" onClick={() => { setSearchQuery(s); handleSearch({ target: { value: s } }) }}>
                    <Clock size={16} />
                    <div><span>{s}</span></div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchQuery && searchFilteredFaqs !== null && (
            <div className="search-results">
              <div className="search-results-section">
                <h4>FAQs ({searchFilteredFaqs ? searchFilteredFaqs.length : 0})</h4>
                {searchFilteredFaqs.length > 0 ? (
                  searchFilteredFaqs.slice(0, 4).map(q => (
                    <button key={q.id} className="search-result-item" onClick={() => { setActiveCategory(faqCategories.find(c => c.label === q.category)?.id || 'orders'); setActiveTab('faqs'); setSearchQuery('') }}>
                      <FileText size={16} />
                      <div><span>{q.question}</span><small>{q.category}</small></div>
                    </button>
                  ))
                ) : (
                  <p className="search-no-results">No matching FAQs found</p>
                )}
              </div>
              {searchFilteredArticles && (
                <div className="search-results-section">
                  <h4>Articles ({searchFilteredArticles.length})</h4>
                  {searchFilteredArticles.length > 0 ? (
                    searchFilteredArticles.slice(0, 4).map(a => (
                      <button key={a.id} className="search-result-item" onClick={() => { setSelectedArticle(a); setSearchQuery('') }}>
                        <BookOpen size={16} />
                        <div><span>{a.title}</span><small>{a.category}</small></div>
                      </button>
                    ))
                  ) : (
                    <p className="search-no-results">No matching articles found</p>
                  )}
                </div>
              )}
              {(!searchFilteredFaqs || searchFilteredFaqs.length === 0) && (!searchFilteredArticles || searchFilteredArticles.length === 0) && (
                <EmptyState icon={Search} title="No results found" message={`No results for "${searchQuery}". Try a different search term.`} action="Browse Popular Topics" onAction={() => { setSearchQuery(''); setActiveTopic('Orders'); handleTopicClick('Orders') }} secondary="Or browse all FAQs and articles above" />
              )}
            </div>
          )}

          <div className="help-stat-cards">
            <div className="help-stat-card">
              <div className="help-stat-card-value">50+</div>
              <div className="help-stat-card-label">Articles</div>
            </div>
            <div className="help-stat-card">
              <div className="help-stat-card-value">14</div>
              <div className="help-stat-card-label">FAQs</div>
            </div>
            <div className="help-stat-card">
              <div className="help-stat-card-value">&lt;4 hrs</div>
              <div className="help-stat-card-label">Avg Response</div>
            </div>
          </div>


        </div>
      </div>

      {/* Tabs */}
      <div className="help-main">
        <div className="help-tabs" role="tablist">
          {['faqs', 'articles', 'contact', 'tickets'].map(tab => (
            <button key={tab} className={`help-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)} role="tab" aria-selected={activeTab === tab}>
              {tab === 'faqs' && 'FAQs'}
              {tab === 'articles' && 'Articles'}
              {tab === 'contact' && 'Contact Support'}
              {tab === 'tickets' && `My Tickets (${mockTickets.length})`}
            </button>
          ))}
        </div>

        <div className="help-tab-content">
          {/* ──────── FAQs Tab ──────── */}
          {activeTab === 'faqs' && (
            <div className="faqs-section">
              <div className="faqs-sidebar">
                {faqCategories.map(cat => {
                  const CatIcon = cat.icon
                  return (
                    <button key={cat.id} className={`faq-category-btn ${activeCategory === cat.id ? 'active' : ''}`} onClick={() => setActiveCategory(cat.id)}>
                      <CatIcon size={18} />
                      <span>{cat.label}</span>
                    </button>
                  )
                })}
              </div>
              <div className="faqs-list">
                {activeCategoryData?.questions.length > 0 ? (
                  activeCategoryData.questions.map(q => (
                    <FAQAccordion key={q.id} question={q.question} answer={q.answer} lastUpdated={q.lastUpdated} readingTime={q.readingTime} category={activeCategoryData.label} />
                  ))
                ) : (
                  <EmptyState icon={HelpCircle} title="No FAQs yet" message="There are no FAQs in this category yet." secondary="Try selecting a different category" />
                )}
              </div>
            </div>
          )}

          {/* ──────── Articles Tab ──────── */}
          {activeTab === 'articles' && (
            <div className="articles-section">
              <div className="articles-controls">
                <div className="articles-search-wrapper">
                  <Search size={16} />
                  <input type="text" placeholder="Search articles..." value={articleSearch} onChange={e => setArticleSearch(e.target.value)} className="articles-search-input" />
                </div>
                <select className="articles-sort-select" value={articleSortBy} onChange={e => setArticleSortBy(e.target.value)}>
                  <option value="popular">Most Popular</option>
                  <option value="recent">Recently Updated</option>
                  <option value="alpha">Alphabetical</option>
                </select>
              </div>

              {!articleSearch && featuredArticles.length > 0 && (
                <div className="articles-featured">
                  <h3 className="articles-section-title">Featured Articles</h3>
                  <div className="articles-featured-grid">
                    {featuredArticles.map(a => <ArticleCard key={a.id} article={a} onSelect={setSelectedArticle} />)}
                  </div>
                </div>
              )}

              {!articleSearch && popularArticles.length > 0 && (
                <div className="articles-popular">
                  <h3 className="articles-section-title">Popular Articles</h3>
                  <div className="articles-popular-grid">
                    {popularArticles.map(a => <ArticleCard key={a.id} article={a} onSelect={setSelectedArticle} />)}
                  </div>
                </div>
              )}

              <div className="articles-all">
                <div className="articles-all-header">
                  <h3 className="articles-section-title">All Articles</h3>
                  <div className="articles-filter-bar">
                    <button className={`article-filter-chip ${articleCategoryFilter === 'all' ? 'active' : ''}`} onClick={() => setArticleCategoryFilter('all')}>All</button>
                    {allArticleCategories.map(cat => (
                      <button key={cat} className={`article-filter-chip ${articleCategoryFilter === cat ? 'active' : ''}`} onClick={() => setArticleCategoryFilter(cat)}>{cat}</button>
                    ))}
                  </div>
                </div>
                <div className="articles-all-grid">
                  {processedArticles.length > 0 ? (
                    processedArticles.map(a => <ArticleCard key={a.id} article={a} onSelect={setSelectedArticle} />)
                  ) : (
                    <EmptyState icon={BookOpen} title="No articles found" message={articleSearch ? `No articles matching "${articleSearch}"` : `No articles in the "${articleCategoryFilter}" category.`} action={articleSearch ? undefined : "Browse all categories"} onAction={() => setArticleCategoryFilter('all')} secondary={articleSearch ? "Try a different search term" : undefined} />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ──────── Contact Support Tab ──────── */}
          {activeTab === 'contact' && (
            <div className="contact-section">
              <div className="contact-form-card">
                <h3>Submit a Support Ticket</h3>
                <div className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name</label>
                      <input type="text" placeholder="Your full name" />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Category</label>
                      <select>
                        <option>Select category</option>
                        <option>Orders</option>
                        <option>Products</option>
                        <option>Payments</option>
                        <option>Shipping</option>
                        <option>Account</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Priority</label>
                      <select>
                        <option>Normal</option>
                        <option>High</option>
                        <option>Urgent</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <input type="text" placeholder="Brief description of your issue" />
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea placeholder="Describe your issue in detail..." rows={5} />
                  </div>
                  <button className="btn-save" onClick={handleSubmitTicket}>Submit Request</button>
                </div>
              </div>
              <div className="support-options">
                <div className="support-option-card">
                  <MessageSquare size={24} className="support-icon" />
                  <h4>Live Chat</h4>
                  <p className="support-desc">Chat instantly with our support specialists.</p>
                  <span className="support-badge online">Online</span>
                </div>
                <div className="support-option-card">
                  <Mail size={24} className="support-icon" />
                  <h4>Email Support</h4>
                  <p className="support-desc">Get a response within 24 hours.</p>
                  <span className="support-badge">support@autopartshub.com</span>
                </div>
                <div className="support-option-card">
                  <Phone size={24} className="support-icon" />
                  <h4>Phone Support</h4>
                  <p className="support-desc">Speak directly with a support agent.</p>
                  <span className="support-badge">+234 800 123 4567</span>
                </div>
                <div className="support-option-card">
                  <Clock size={24} className="support-icon" />
                  <h4>Business Hours</h4>
                  <p className="support-desc">Mon–Fri, 8 AM – 6 PM WAT</p>
                  <span className="support-badge offline">Offline</span>
                </div>
              </div>
            </div>
          )}

          {/* ──────── My Tickets Tab ──────── */}
          {activeTab === 'tickets' && (
            <div className="tickets-section">
              <div className="ticket-controls">
                <div className="ticket-search-wrapper">
                  <Search size={16} />
                  <input type="text" placeholder="Search tickets..." value={ticketSearch} onChange={e => setTicketSearch(e.target.value)} className="ticket-search-input" />
                </div>
                <select className="ticket-filter-select" value={ticketStatusFilter} onChange={e => setTicketStatusFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="urgent">Urgent</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <select className="ticket-sort-select" value={ticketSortBy} onChange={e => setTicketSortBy(e.target.value)}>
                  <option value="date">Sort by Date</option>
                  <option value="priority">Sort by Priority</option>
                </select>
              </div>

              {filteredTickets.length > 0 ? (
                <div className="tickets-list">
                  {filteredTickets.map(ticket => {
                    const currentIdx = progressStages.indexOf(ticket.progress)
                    return (
                      <div key={ticket.id} className="ticket-card">
                        <div className="ticket-header">
                          <div className="ticket-id">{ticket.id}</div>
                          <div className={`ticket-status ${ticket.status}`}>
                            {ticket.status === 'urgent' && <AlertCircle size={14} />}
                            {ticket.status === 'pending' && <Clock size={14} />}
                            {ticket.status === 'in_progress' && <AlertCircle size={14} />}
                            {ticket.status === 'resolved' && <CheckCircle size={14} />}
                            <span>{ticket.status.replace('_', ' ')}</span>
                          </div>
                          <div className={`ticket-priority ${ticket.priority}`}>{ticket.priority}</div>
                          <div className="ticket-date">{ticket.date}</div>
                        </div>
                        <div className="ticket-progress">
                          {progressStages.map((stage, i) => (
                            <div key={stage} className={`ticket-progress-step ${i <= currentIdx ? 'active' : ''} ${i === currentIdx ? 'current' : ''}`}>
                              <div className="ticket-progress-dot" />
                              <span className="ticket-progress-label">{stage.replace('_', ' ')}</span>
                            </div>
                          ))}
                        </div>
                        <div className="ticket-body">
                          <h4>{ticket.subject}</h4>
                          <p>{ticket.lastMessage}</p>
                        </div>
                        <div className="ticket-footer">
                          <div className="ticket-agent">
                            <div className="ticket-agent-avatar">{ticket.agent.charAt(0)}</div>
                            <span>{ticket.agent}</span>
                          </div>
                          <button className="view-ticket-btn">View Ticket</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <EmptyState icon={MessageSquare} title="No tickets found" message={ticketSearch ? `No tickets matching "${ticketSearch}"` : 'No tickets match the selected filter.'} action="Clear Filters" onAction={() => { setTicketSearch(''); setTicketStatusFilter('all') }} secondary="Try adjusting your search or filter" />
              )}

              <div className="satisfaction-survey">
                <p>How satisfied are you with our support?</p>
                <div className="survey-stars">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} className="survey-star" aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}>★</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
