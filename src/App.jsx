import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Moon, 
  Sun, 
  Calendar, 
  FolderPlus, 
  CheckCircle2,
  Settings,
  Lock,
  Search,
  X
} from 'lucide-react';
import AuthModal from './components/AuthModal';
import WeeklyPlanner from './components/WeeklyPlanner';
import CategoryColumn from './components/CategoryColumn';
import CompletedModal from './components/CompletedModal';
import TabSettingsModal from './components/TabSettingsModal';
import NewTabModal from './components/NewTabModal';
import SearchResultsView from './components/SearchResultsView';

// Default Initial Tabs
const DEFAULT_TABS = [
  { id: 'personal', name: 'Personal' },
  { id: 'work', name: 'Work' },
  { id: 'ap', name: 'AP' }
];

// Initial Categories Loaded from PDF Data
const INITIAL_CATEGORIES = {
  personal: [
    { id: 'tasks', name: 'Tasks', icon: 'check-square', color: '#06b6d4' },
    { id: 'computer', name: 'Computer', icon: 'laptop', color: '#3b82f6' },
    { id: 'meetings', name: 'Meetings', icon: 'users', color: '#8b5cf6' },
    { id: 'amin', name: 'Amin', icon: 'star', color: '#f59e0b' },
    { id: 'swap', name: 'Swap', icon: 'tag', color: '#ec4899' },
    { id: 'tracking', name: 'Tracking', icon: 'target', color: '#10b981' },
    { id: 'fbmarketplace', name: 'FB Marketplace', icon: 'shopping-bag', color: '#f97316' }
  ],
  work: [
    { id: 'work-google', name: 'Google Core', icon: 'folder-kanban', color: '#4f46e5' },
    { id: 'work-grad', name: 'GRAD & Projects', icon: 'compass', color: '#6366f1' }
  ],
  ap: [
    { id: 'ap-tasks', name: 'Tasks', icon: 'check-square', color: '#10b981' },
    { id: 'ap-conversations', name: 'Conversations', icon: 'smile', color: '#8b5cf6' },
    { id: 'ap-roomclean', name: 'Room Clean', icon: 'sparkles', color: '#06b6d4' }
  ]
};

// Initial Tasks Loaded from "Al-Rahim To Do.pdf"
const INITIAL_TASKS = [
  // PERSONAL TAB
  { id: 'pdf-p1', title: 'Install Toyota Bulb', tabId: 'personal', categoryId: 'tasks', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-p2', title: 'Vitamins', tabId: 'personal', categoryId: 'tasks', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-p3', title: 'Technogym exercises', tabId: 'personal', categoryId: 'tasks', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-p4', title: 'Justin Rent', tabId: 'personal', categoryId: 'tasks', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-p5', title: 'PNFLA', tabId: 'personal', categoryId: 'tasks', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-p6', title: 'Southwest refunds', tabId: 'personal', categoryId: 'tasks', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-p7', title: 'Fix MX Vertical Mouse', tabId: 'personal', categoryId: 'tasks', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-p8', title: 'Fix MX Master 2 Mouse', tabId: 'personal', categoryId: 'tasks', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-p9', title: 'Cambria Care Package', tabId: 'personal', categoryId: 'tasks', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-p10', title: 'Alykhan iPad and Pencil', tabId: 'personal', categoryId: 'tasks', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-p11', title: 'Teva Shoe Glue', tabId: 'personal', categoryId: 'tasks', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-p12', title: 'Gap/ON/BRF & APPL GC', tabId: 'personal', categoryId: 'tasks', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-p13', title: 'Decide on MX Keys', tabId: 'personal', categoryId: 'tasks', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-p14', title: 'Patagonia about A/C deletion', tabId: 'personal', categoryId: 'tasks', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-p15', title: 'Barnes & Noble GC', tabId: 'personal', categoryId: 'tasks', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-p16', title: 'Steelcase Chair Repair', tabId: 'personal', categoryId: 'tasks', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },

  { id: 'pdf-pc1', title: 'Duplicate HD Copy', tabId: 'personal', categoryId: 'computer', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pc2', title: 'Clean out other G Computers', tabId: 'personal', categoryId: 'computer', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pc3', title: 'EOY Paychecks to HD', tabId: 'personal', categoryId: 'computer', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pc4', title: 'go/prosper documentation', tabId: 'personal', categoryId: 'computer', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pc5', title: 'Scan SRS-F to search PDF', tabId: 'personal', categoryId: 'computer', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pc6', title: 'BTK Orientation Notes', tabId: 'personal', categoryId: 'computer', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pc7', title: 'iPhone Notes', tabId: 'personal', categoryId: 'computer', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pc8', title: 'iPhone Voicemails', tabId: 'personal', categoryId: 'computer', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pc9', title: 'iPhone Voice notes', tabId: 'personal', categoryId: 'computer', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pc10', title: 'Google vs VTI', tabId: 'personal', categoryId: 'computer', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pc11', title: 'MBP 13" GP Mom HD upload', tabId: 'personal', categoryId: 'computer', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pc12', title: 'Pixel watch setup', tabId: 'personal', categoryId: 'computer', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pc13', title: 'Transfer 16P -> 15A', tabId: 'personal', categoryId: 'computer', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pc14', title: 'HSA receipts / scans to GP', tabId: 'personal', categoryId: 'computer', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pc15', title: 'Cell phone charge & update', tabId: 'personal', categoryId: 'computer', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },

  { id: 'pdf-pm1', title: 'Asif Makhani', tabId: 'personal', categoryId: 'meetings', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pm2', title: 'Farida Hemani', tabId: 'personal', categoryId: 'meetings', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pm3', title: 'Nick & Rachel', tabId: 'personal', categoryId: 'meetings', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pm4', title: 'Zoheb MWWP', tabId: 'personal', categoryId: 'meetings', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },

  { id: 'pdf-pa1', title: 'Geico Glass Update', tabId: 'personal', categoryId: 'amin', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pa2', title: 'DSND IRS Penalty', tabId: 'personal', categoryId: 'amin', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pa3', title: 'DSND IRS Trackers (interest)', tabId: 'personal', categoryId: 'amin', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pa4', title: 'MS Beneficiaries', tabId: 'personal', categoryId: 'amin', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pa5', title: 'Vegas', tabId: 'personal', categoryId: 'amin', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pa6', title: 'Vancouver / Toronto', tabId: 'personal', categoryId: 'amin', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },

  { id: 'pdf-ps1', title: 'Banana Republic White Linen', tabId: 'personal', categoryId: 'swap', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-ps2', title: 'Target Pants Order', tabId: 'personal', categoryId: 'swap', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },

  { id: 'pdf-pt1', title: 'Contact Solution', tabId: 'personal', categoryId: 'tracking', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pt2', title: 'WG Ear Wax Removal', tabId: 'personal', categoryId: 'tracking', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pt3', title: 'Vitamins', tabId: 'personal', categoryId: 'tracking', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pt4', title: 'Granola', tabId: 'personal', categoryId: 'tracking', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pt5', title: 'Costco Protein', tabId: 'personal', categoryId: 'tracking', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pt6', title: 'Target Face Wash', tabId: 'personal', categoryId: 'tracking', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },

  { id: 'pdf-pfb1', title: 'J Crew Clothes (new)', tabId: 'personal', categoryId: 'fbmarketplace', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pfb2', title: 'Brooks Brothers Clothes (new)', tabId: 'personal', categoryId: 'fbmarketplace', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pfb3', title: 'Goodmanbrand Clothes (new)', tabId: 'personal', categoryId: 'fbmarketplace', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pfb4', title: 'Alyna Chair', tabId: 'personal', categoryId: 'fbmarketplace', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-pfb5', title: 'Tech Stuff', tabId: 'personal', categoryId: 'fbmarketplace', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },

  // AP TAB
  { id: 'pdf-ap1', title: 'Snap Clean', tabId: 'ap', categoryId: 'ap-tasks', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-ap2', title: 'Whatsapp Groups Clean', tabId: 'ap', categoryId: 'ap-tasks', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-ap3', title: 'Instagram Saved', tabId: 'ap', categoryId: 'ap-tasks', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-ap4', title: 'Coasters', tabId: 'ap', categoryId: 'ap-tasks', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-ap5', title: 'Macrame', tabId: 'ap', categoryId: 'ap-tasks', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-ap6', title: 'ICH Painting', tabId: 'ap', categoryId: 'ap-tasks', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },

  { id: 'pdf-ac1', title: 'TPBTL', tabId: 'ap', categoryId: 'ap-conversations', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-ac2', title: 'Past', tabId: 'ap', categoryId: 'ap-conversations', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-ac3', title: 'MCO Stock from MS to Fidelity', tabId: 'ap', categoryId: 'ap-conversations', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-ac4', title: 'Email Reviews', tabId: 'ap', categoryId: 'ap-conversations', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-ac5', title: 'Paper filer', tabId: 'ap', categoryId: 'ap-conversations', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },

  { id: 'pdf-ar1', title: 'Suitcases', tabId: 'ap', categoryId: 'ap-roomclean', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-ar2', title: 'Corovan Boxes', tabId: 'ap', categoryId: 'ap-roomclean', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-ar3', title: 'Vita Health', tabId: 'ap', categoryId: 'ap-roomclean', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-ar4', title: 'Tech Stuff', tabId: 'ap', categoryId: 'ap-roomclean', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-ar5', title: 'Closet / Drawers', tabId: 'ap', categoryId: 'ap-roomclean', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-ar6', title: 'Under Bed', tabId: 'ap', categoryId: 'ap-roomclean', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-ar7', title: 'White Cabinet', tabId: 'ap', categoryId: 'ap-roomclean', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },

  // WORK TAB
  { id: 'pdf-w1', title: 'Portfolio', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w2', title: 'Resume', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w3', title: 'Team Perf/GRAD artifacts', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w4', title: 'Networking Meetings', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w5', title: 'UXR Handbook', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w6', title: 'Massage', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w7', title: 'Mariam Conversation', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w8', title: 'Spot Bonus $200', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w9', title: 'Google/IO', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w10', title: 'Meriah Top of Mind', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w11', title: 'John Lyndon (API Key, MCP, Skills, Gemini Enterprise, Blueprints)', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w12', title: 'Ben Colab R', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w13', title: 'UX Announce', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w14', title: 'Transformational Tuesdays', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w15', title: 'Builders Week', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w16', title: 'Methods Classes (AI Fluency)', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w17', title: 'go/aisavvygoogle', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w18', title: 'go/ml', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w19', title: 'go/uxw-signups', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w20', title: 'ML/AI resources', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w21', title: '100 ways to make your life...', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w22', title: 'Tyler IMEI', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w23', title: 'Betterup Manager Coaching', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-w24', title: 'Mgr Dev Series: Foundations', tabId: 'work', categoryId: 'work-google', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },

  { id: 'pdf-wg1', title: 'Home', tabId: 'work', categoryId: 'work-grad', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-wg2', title: 'UI Library', tabId: 'work', categoryId: 'work-grad', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-wg3', title: 'LisApps', tabId: 'work', categoryId: 'work-grad', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-wg4', title: 'Inspector', tabId: 'work', categoryId: 'work-grad', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-wg5', title: 'Annotations', tabId: 'work', categoryId: 'work-grad', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-wg6', title: 'Comments', tabId: 'work', categoryId: 'work-grad', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-wg7', title: 'Experiments', tabId: 'work', categoryId: 'work-grad', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-wg8', title: 'Previews', tabId: 'work', categoryId: 'work-grad', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-wg9', title: 'MEP 2025', tabId: 'work', categoryId: 'work-grad', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-wg10', title: 'Joanne (Brazil)', tabId: 'work', categoryId: 'work-grad', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-wg11', title: 'Emily (Counsel Assist)', tabId: 'work', categoryId: 'work-grad', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-wg12', title: 'Emily (RA Workshop)', tabId: 'work', categoryId: 'work-grad', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-wg13', title: 'Self Service Contracts', tabId: 'work', categoryId: 'work-grad', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null },
  { id: 'pdf-wg14', title: 'BH Survey (Abhinav)', tabId: 'work', categoryId: 'work-grad', isHighPriority: false, scheduledDay: null, isCompleted: false, completedAt: null }
];

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('artodo_authenticated') === 'true';
  });

  // Top-Level Tabs State
  const [tabs, setTabs] = useState(() => {
    const saved = localStorage.getItem('artodo_tabs_v3');
    return saved ? JSON.parse(saved) : DEFAULT_TABS;
  });

  // Active Tab State
  const [activeTab, setActiveTab] = useState(() => tabs[0]?.id || 'personal');

  // Search Query State (Global Search Across All Tabs)
  const [searchQuery, setSearchQuery] = useState('');

  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('artodo_theme') || 'light';
  });

  // Collapsible Weekly Planner View State
  const [isPlannerExpanded, setIsPlannerExpanded] = useState(true);

  // Completed Archive Modal State
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

  // Modals State
  const [isNewTabModalOpen, setIsNewTabModalOpen] = useState(false);
  const [isTabSettingsOpen, setIsTabSettingsOpen] = useState(false);

  // Categories State
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('artodo_categories_v3');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  // Tasks State
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('artodo_tasks_v3');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  // Archived Deleted Categories State
  const [archivedCategories, setArchivedCategories] = useState(() => {
    const saved = localStorage.getItem('artodo_archived_categories_v1');
    return saved ? JSON.parse(saved) : [];
  });

  // Archived Deleted Tabs State
  const [archivedTabs, setArchivedTabs] = useState(() => {
    const saved = localStorage.getItem('artodo_archived_tabs_v1');
    return saved ? JSON.parse(saved) : [];
  });

  // New Category Input State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCatInput, setShowNewCatInput] = useState(false);

  // Sync Theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('artodo_theme', theme);
  }, [theme]);

  // Persist State to LocalStorage (v3 key)
  useEffect(() => {
    localStorage.setItem('artodo_tabs_v3', JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    localStorage.setItem('artodo_categories_v3', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('artodo_tasks_v3', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('artodo_archived_categories_v1', JSON.stringify(archivedCategories));
  }, [archivedCategories]);

  useEffect(() => {
    localStorage.setItem('artodo_archived_tabs_v1', JSON.stringify(archivedTabs));
  }, [archivedTabs]);

  const handleAuthenticate = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('artodo_authenticated', 'true');
  };

  const handleLockApp = () => {
    sessionStorage.removeItem('artodo_authenticated');
    setIsAuthenticated(false);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Top Level Tab Handlers
  const handleCreateTab = (tabName) => {
    if (!tabName.trim()) return;

    const tabId = `tab-${Date.now()}`;
    const newTab = { id: tabId, name: tabName.trim() };

    setTabs(prev => [...prev, newTab]);
    setCategories(prev => ({ ...prev, [tabId]: [] }));
    setActiveTab(tabId);
  };

  const handleRenameTab = (tabId, newName) => {
    setTabs(prev => prev.map(t => {
      if (t.id === tabId) {
        return { ...t, name: newName };
      }
      return t;
    }));
  };

  const handleDeleteTab = (tabId) => {
    if (tabs.length <= 1) return;

    const tabToDelete = tabs.find(t => t.id === tabId);
    if (!tabToDelete) return;

    const tabCatList = categories[tabId] || [];
    const tabTaskList = tasks.filter(t => t.tabId === tabId);

    setArchivedTabs(prev => [...prev, { tab: tabToDelete, categories: tabCatList, tasks: tabTaskList }]);

    const remaining = tabs.filter(t => t.id !== tabId);
    setTabs(remaining);
    setTasks(prev => prev.filter(t => t.tabId !== tabId));
    setCategories(prev => {
      const copy = { ...prev };
      delete copy[tabId];
      return copy;
    });

    setActiveTab(remaining[0]?.id || 'personal');
  };

  const handleRestoreTab = (tabId) => {
    const archivedItem = archivedTabs.find(item => item.tab.id === tabId);
    if (!archivedItem) return;

    setTabs(prev => [...prev, archivedItem.tab]);
    setCategories(prev => ({
      ...prev,
      [tabId]: archivedItem.categories
    }));
    setTasks(prev => [...prev, ...archivedItem.tasks]);

    setArchivedTabs(prev => prev.filter(item => item.tab.id !== tabId));
    setActiveTab(tabId);
  };

  // Task Handlers
  const handleAddTask = (categoryId, title) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title,
      tabId: activeTab,
      categoryId,
      isHighPriority: false,
      scheduledDay: null,
      isCompleted: false,
      completedAt: null
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleToggleComplete = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          isCompleted: true,
          completedAt: Date.now()
        };
      }
      return t;
    }));
  };

  const handleRestoreTask = (taskId) => {
    const taskToRestore = tasks.find(t => t.id === taskId);
    if (!taskToRestore) return;

    const archivedCatItem = archivedCategories.find(c => c.category.id === taskToRestore.categoryId);
    if (archivedCatItem) {
      handleRestoreCategory(archivedCatItem.category.id);
    }

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          isCompleted: false,
          completedAt: null
        };
      }
      return t;
    }));
  };

  const handleClearCompletedHistory = () => {
    setTasks(prev => prev.filter(t => !t.isCompleted));
  };

  const handleTogglePriority = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, isHighPriority: !t.isHighPriority };
      }
      return t;
    }));
  };

  const handleUpdateTaskTitle = (taskId, newTitle) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, title: newTitle };
      }
      return t;
    }));
  };

  const handleUnscheduleTask = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, scheduledDay: null };
      }
      return t;
    }));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleDropTaskToCategory = (taskId, targetCategoryId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          categoryId: targetCategoryId,
          tabId: activeTab,
          scheduledDay: null
        };
      }
      return t;
    }));
  };

  const handleDropTaskToDay = (taskId, targetDayKey) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          scheduledDay: targetDayKey
        };
      }
      return t;
    }));
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const colors = ['#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6'];
    const icons = ['tag', 'star', 'sparkles', 'bookmark', 'coffee', 'zap', 'target'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];

    const newCat = {
      id: `cat-${Date.now()}`,
      name: newCategoryName.trim(),
      icon: randomIcon,
      color: randomColor
    };

    setCategories(prev => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newCat]
    }));

    setNewCategoryName('');
    setShowNewCatInput(false);
  };

  const handleDeleteCategory = (catId) => {
    const catList = categories[activeTab] || [];
    const catToDelete = catList.find(c => c.id === catId);
    if (!catToDelete) return;

    const catTasks = tasks.filter(t => t.categoryId === catId);

    setArchivedCategories(prev => [
      ...prev,
      { category: catToDelete, tabId: activeTab, tasks: catTasks }
    ]);

    setCategories(prev => ({
      ...prev,
      [activeTab]: catList.filter(c => c.id !== catId)
    }));

    setTasks(prev => prev.filter(t => t.categoryId !== catId));
  };

  const handleRestoreCategory = (catId) => {
    const archivedItem = archivedCategories.find(item => item.category.id === catId);
    if (!archivedItem) return;

    const targetTabId = archivedItem.tabId;

    if (!tabs.some(t => t.id === targetTabId)) {
      setTabs(prev => [...prev, { id: targetTabId, name: targetTabId.toUpperCase() }]);
    }

    setCategories(prev => ({
      ...prev,
      [targetTabId]: [...(prev[targetTabId] || []), archivedItem.category]
    }));

    setTasks(prev => [...prev, ...archivedItem.tasks]);

    setArchivedCategories(prev => prev.filter(item => item.category.id !== catId));
  };

  const handleUpdateCategoryName = (catId, newName) => {
    setCategories(prev => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).map(c => {
        if (c.id === catId) {
          return { ...c, name: newName };
        }
        return c;
      })
    }));
  };

  const handleUpdateCategoryIcon = (catId, { icon, color }) => {
    setCategories(prev => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).map(c => {
        if (c.id === catId) {
          return { ...c, icon: icon || c.icon, color: color || c.color };
        }
        return c;
      })
    }));
  };

  // Select Tab From Search Result Location Badge
  const handleSelectTabFromSearch = (tabId) => {
    setActiveTab(tabId);
    setSearchQuery('');
  };

  // Active Tab Object
  const currentTabObj = useMemo(() => {
    return tabs.find(t => t.id === activeTab) || tabs[0];
  }, [tabs, activeTab]);

  // Completed Tasks Sorted
  const completedTasksSorted = useMemo(() => {
    return tasks
      .filter(t => t.isCompleted)
      .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
  }, [tasks]);

  // Global Search Filter (Across ALL Tabs)
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return tasks.filter(t => !t.isCompleted && t.title.toLowerCase().includes(query));
  }, [tasks, searchQuery]);

  // Current Tab Categories & Tasks
  const currentCategories = useMemo(() => {
    return categories[activeTab] || [];
  }, [categories, activeTab]);

  const activeTabTasks = useMemo(() => {
    return tasks.filter(t => t.tabId === activeTab && !t.isCompleted);
  }, [tasks, activeTab]);

  // Urgent High Priority Tasks for Active Tab
  const urgentTabTasks = useMemo(() => {
    return activeTabTasks.filter(t => t.isHighPriority);
  }, [activeTabTasks]);

  const autoUrgentCategory = useMemo(() => ({
    id: 'urgent-auto-col',
    name: 'Urgent',
    icon: 'flame',
    color: '#ef4444',
    isAutoUrgent: true
  }), []);

  // If not authenticated, render password lock screen
  if (!isAuthenticated) {
    return <AuthModal onAuthenticate={handleAuthenticate} />;
  }

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <header className="app-header">
        <div className="header-brand">
          <img src="/ar_logo.png" alt="AR Logo" className="header-logo-img" />
          <h1 className="header-title">AR To Do</h1>
        </div>

        {/* Clean Top-Level Tabs */}
        <nav className="header-tabs" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchQuery('');
              }}
            >
              <span>{tab.name}</span>
              <span className="tab-count-badge">
                {tasks.filter(t => t.tabId === tab.id && !t.isCompleted).length}
              </span>
            </button>
          ))}

          {/* Add New Tab Plus Button */}
          <button 
            className="action-btn-sm" 
            onClick={() => setIsNewTabModalOpen(true)}
            title="Create New Top-Level Tab"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
          >
            <Plus size={14} />
          </button>
        </nav>

        {/* Header Search Input */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', margin: '0 0.5rem', flex: '0 1 240px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-dim)' }} />
          <input
            type="text"
            className="add-task-input"
            placeholder="Search all tabs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              paddingLeft: '30px', 
              paddingRight: searchQuery ? '28px' : '10px', 
              height: '32px', 
              fontSize: '0.78rem',
              width: '100%',
              borderRadius: '20px'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '8px',
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px'
              }}
              title="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Header Actions */}
        <div className="header-controls">
          {/* Completed Archive Button */}
          <button 
            className="action-btn-sm"
            onClick={() => setIsCompletedModalOpen(true)}
            title="View Completed Tasks & Archive"
          >
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>Archive ({completedTasksSorted.length + archivedCategories.length + archivedTabs.length})</span>
          </button>

          {/* Calendar View Toggle */}
          <button 
            className={`icon-btn ${isPlannerExpanded ? 'active-planner' : ''}`}
            onClick={() => setIsPlannerExpanded(prev => !prev)}
            title="Toggle Weekly Planning View"
          >
            <Calendar size={15} />
          </button>

          {/* Tab Settings Gear Icon */}
          <button
            className="icon-btn"
            onClick={() => setIsTabSettingsOpen(true)}
            title={`Tab Settings ("${currentTabObj?.name}")`}
          >
            <Settings size={15} />
          </button>

          {/* Theme Toggle Button */}
          <button 
            className="icon-btn" 
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {/* Padlock Lock Button */}
          <button
            className="icon-btn"
            onClick={handleLockApp}
            title="Lock Application"
          >
            <Lock size={15} />
          </button>
        </div>
      </header>

      {/* Main Body Area */}
      <main className="main-content">
        {/* ========================================================================= */}
        {/* WEEKLY PLANNING VIEW (7-DAY MONDAY THROUGH SUNDAY GRID)                  */}
        {/* ========================================================================= */}
        <WeeklyPlanner
          isExpanded={isPlannerExpanded}
          onToggleExpand={() => setIsPlannerExpanded(prev => !prev)}
          tasks={tasks.filter(t => !t.isCompleted)}
          onToggleComplete={handleToggleComplete}
          onTogglePriority={handleTogglePriority}
          onUpdateTaskTitle={handleUpdateTaskTitle}
          onUnscheduleTask={handleUnscheduleTask}
          onDeleteTask={handleDeleteTask}
          onDropTaskToDay={handleDropTaskToDay}
        />

        {/* ========================================================================= */}
        {/* CATEGORY COLUMNS GRID OR GLOBAL SEARCH RESULTS VIEW                       */}
        {/* ========================================================================= */}
        {searchQuery.trim() ? (
          <SearchResultsView
            searchQuery={searchQuery}
            results={searchResults}
            tabs={tabs}
            categories={categories}
            onToggleComplete={handleToggleComplete}
            onTogglePriority={handleTogglePriority}
            onUpdateTaskTitle={handleUpdateTaskTitle}
            onDeleteTask={handleDeleteTask}
            onSelectTab={handleSelectTabFromSearch}
          />
        ) : (
          <section>
            <div className="categories-grid-header">
              <h2 className="section-title">
                {currentTabObj?.name} Categories
              </h2>

              <button 
                className="action-btn-sm"
                onClick={() => setShowNewCatInput(prev => !prev)}
              >
                <FolderPlus size={13} />
                <span>Add Category</span>
              </button>
            </div>

            {/* New Category Inline Form */}
            {showNewCatInput && (
              <form onSubmit={handleAddCategory} className="add-task-form" style={{ marginTop: '0.65rem', maxWidth: '320px' }}>
                <input
                  type="text"
                  className="add-task-input"
                  placeholder="Category name..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="add-task-btn">
                  <Plus size={14} />
                </button>
              </form>
            )}

            <div className="categories-container" style={{ marginTop: '0.85rem' }}>
              {/* Left-most Urgent Column */}
              {urgentTabTasks.length > 0 && (
                <CategoryColumn
                  key="urgent-auto-col"
                  category={autoUrgentCategory}
                  tasks={urgentTabTasks}
                  onToggleComplete={handleToggleComplete}
                  onTogglePriority={handleTogglePriority}
                  onUpdateTaskTitle={handleUpdateTaskTitle}
                  onDeleteTask={handleDeleteTask}
                  onDropTaskToCategory={handleDropTaskToCategory}
                />
              )}

              {currentCategories.map(cat => {
                const catTasks = activeTabTasks
                  .filter(t => t.categoryId === cat.id)
                  .sort((a, b) => (b.isHighPriority ? 1 : 0) - (a.isHighPriority ? 1 : 0));
                
                return (
                  <CategoryColumn
                    key={cat.id}
                    category={cat}
                    tasks={catTasks}
                    onAddTask={handleAddTask}
                    onToggleComplete={handleToggleComplete}
                    onTogglePriority={handleTogglePriority}
                    onUpdateTaskTitle={handleUpdateTaskTitle}
                    onUpdateCategoryName={handleUpdateCategoryName}
                    onUpdateCategoryIcon={handleUpdateCategoryIcon}
                    onDeleteTask={handleDeleteTask}
                    onDropTaskToCategory={handleDropTaskToCategory}
                    onDeleteCategory={handleDeleteCategory}
                  />
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* New Tab Modal */}
      <NewTabModal
        isOpen={isNewTabModalOpen}
        onClose={() => setIsNewTabModalOpen(false)}
        onCreateTab={handleCreateTab}
      />

      {/* Tab Settings Modal */}
      <TabSettingsModal
        isOpen={isTabSettingsOpen}
        onClose={() => setIsTabSettingsOpen(false)}
        tab={currentTabObj}
        canDelete={tabs.length > 1}
        onRenameTab={handleRenameTab}
        onDeleteTab={handleDeleteTab}
      />

      {/* Completed & Archives Modal */}
      <CompletedModal
        isOpen={isCompletedModalOpen}
        onClose={() => setIsCompletedModalOpen(false)}
        completedTasks={completedTasksSorted}
        categories={categories}
        archivedCategories={archivedCategories}
        archivedTabs={archivedTabs}
        onRestoreTask={handleRestoreTask}
        onRestoreCategory={handleRestoreCategory}
        onRestoreTab={handleRestoreTab}
        onClearCompletedHistory={handleClearCompletedHistory}
      />
    </div>
  );
}
