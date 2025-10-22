import type { Alumni, Post, Conversation, User } from './types';

export const CURRENT_USER_ID = 0; // Represents the system user/admin

export const CURRENT_USER: User = {
  id: CURRENT_USER_ID,
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@uniport-cs.edu',
  role: 'Admin',
};

export const INITIAL_ALUMNI_DATA: Alumni[] = [
  {
    id: 1,
    firstName: 'Adaora',
    lastName: 'Okafor',
    email: 'adaora.okafor@gmail.com',
    phone: '+234-801-234-5678',
    graduationYear: '2020',
    degree: 'MSc',
    program: 'Computer Science',
    currentPosition: 'Senior Software Engineer',
    company: 'Microsoft Nigeria',
    location: 'Lagos, Nigeria',
    salary: '8500000',
    linkedin: 'linkedin.com/in/adaora-okafor',
    achievements: ['Best Student Award 2020', 'Published 3 Research Papers', 'Tech Innovation Award'],
    isActive: true,
    lastLogin: '2 days ago',
    joinDate: '2020-06-15',
    skills: ['Python', 'Machine Learning', 'Cloud Computing'],
    openToMentoring: true,
  },
  {
    id: 2,
    firstName: 'Emeka',
    lastName: 'Nnadi',
    email: 'emeka.nnadi@research.org',
    phone: '+234-802-345-6789',
    graduationYear: '2019',
    degree: 'PhD',
    program: 'Computer Science',
    currentPosition: 'Lead Research Scientist',
    company: 'Google Research',
    location: 'Abuja, Nigeria',
    salary: '12000000',
    linkedin: 'linkedin.com/in/emeka-nnadi',
    achievements: ['Published 15 Research Papers', 'AI Innovation Award 2023', 'Distinguished Alumni Award'],
    isActive: true,
    lastLogin: '1 day ago',
    joinDate: '2019-08-22',
    skills: ['Artificial Intelligence', 'Deep Learning', 'Research'],
    openToMentoring: true,
  },
  {
    id: 3,
    firstName: 'Chioma',
    lastName: 'Agbor',
    email: 'chioma.agbor@startup.com',
    phone: '+234-803-456-7890',
    graduationYear: '2021',
    degree: 'MSc',
    program: 'Computer Science',
    currentPosition: 'Tech Entrepreneur & CEO',
    company: 'TechFlow Solutions',
    location: 'Port Harcourt, Nigeria',
    salary: '15000000',
    linkedin: 'linkedin.com/in/chioma-agbor',
    achievements: ['Started 2 Tech Companies', 'Forbes 30 Under 30', 'Entrepreneur of the Year 2023'],
    isActive: true,
    lastLogin: '5 hours ago',
    joinDate: '2021-07-10',
    skills: ['Entrepreneurship', 'Business Strategy', 'Product Development'],
    openToMentoring: false,
  },
  {
    id: 4,
    firstName: 'Kelechi',
    lastName: 'Okoro',
    email: 'kelechi.okoro@bank.com',
    phone: '+234-804-567-8901',
    graduationYear: '2018',
    degree: 'PhD',
    program: 'Computer Science',
    currentPosition: 'Chief Technology Officer',
    company: 'First Bank Nigeria',
    location: 'Lagos, Nigeria',
    salary: '20000000',
    linkedin: 'linkedin.com/in/kelechi-okoro',
    achievements: ['Digital Banking Innovation', 'Fintech Pioneer Award', 'CTO of the Year 2022'],
    isActive: false,
    lastLogin: '2 weeks ago',
    joinDate: '2018-05-20',
    skills: ['Fintech', 'Digital Banking', 'Leadership'],
    openToMentoring: false,
  },
  {
    id: 5,
    firstName: 'Ngozi',
    lastName: 'Eze',
    email: 'ngozi.eze@university.edu',
    phone: '+234-805-678-9012',
    graduationYear: '2022',
    degree: 'MSc',
    program: 'Computer Science',
    currentPosition: 'Assistant Professor',
    company: 'University of Lagos',
    location: 'Lagos, Nigeria',
    salary: '4500000',
    linkedin: 'linkedin.com/in/ngozi-eze',
    achievements: ['Young Researcher Award', 'Published 8 Research Papers', 'Teaching Excellence Award'],
    isActive: true,
    lastLogin: '3 hours ago',
    joinDate: '2022-09-01',
    skills: ['Academic Research', 'Data Science', 'Teaching'],
    openToMentoring: true,
  },
  {
    id: 6,
    firstName: 'Chukwudi',
    lastName: 'Okonkwo',
    email: 'chukwudi.okonkwo@tech.com',
    phone: '+234-806-789-0123',
    graduationYear: '2020',
    degree: 'MSc',
    program: 'Computer Science',
    currentPosition: 'Senior DevOps Engineer',
    company: 'Andela',
    location: 'Lagos, Nigeria',
    salary: '9200000',
    linkedin: 'linkedin.com/in/chukwudi-okonkwo',
    achievements: ['Cloud Architecture Certification', 'DevOps Expert Award'],
    isActive: true,
    lastLogin: '1 hour ago',
    joinDate: '2020-11-30',
    skills: ['DevOps', 'Cloud Computing', 'System Architecture'],
    openToMentoring: false,
  }
];

export const INITIAL_STUDENT_DATA: User[] = [
    {
        id: 101,
        firstName: 'Femi',
        lastName: 'Adebayo',
        email: 'femi.adebayo@student.uniport.edu',
        role: 'Student',
    },
    {
        id: 102,
        firstName: 'Bisi',
        lastName: 'Akande',
        email: 'bisi.akande@student.uniport.edu',
        role: 'Student',
    }
];

export const NOTIFICATIONS = [
  { id: 1, text: "System backup completed successfully", time: "2 min ago", type: "success" },
  { id: 2, text: "5 new alumni registered this month", time: "1 hour ago", type: "info" },
  { id: 3, text: "Database optimization completed", time: "3 hours ago", type: "success" },
  { id: 4, text: "Email newsletter sent to 450 alumni", time: "1 day ago", type: "info" }
];

export const INITIAL_POSTS_DATA: Post[] = [
  {
    id: 1,
    authorId: 3,
    content: "Excited to announce that TechFlow Solutions has secured Series A funding! We're hiring for several roles, especially in product development. Check out our careers page or DM me if you're interested. #TechFlow #StartupLife #Hiring",
    timestamp: "2 hours ago",
    likes: [1, 2, 5, 6, 101],
    comments: [
      { id: 1, authorId: 1, content: "Huge congratulations, Chioma! This is amazing news.", timestamp: "1 hour ago" },
      { id: 2, authorId: 6, content: "Well deserved! I'll definitely check out the open roles.", timestamp: "30 minutes ago" },
    ]
  },
  {
    id: 2,
    authorId: 2,
    content: "Just published a new paper on federated learning models for healthcare data privacy. It's been a challenging but rewarding project. Grateful for my team at Google Research!",
    timestamp: "1 day ago",
    likes: [4, 5],
    comments: []
  },
  {
    id: 3,
    authorId: 5,
    content: "Presenting my latest research on Data Science in education at the upcoming IEEE conference in Abuja. It's great to see so much innovation in the field. Any other alumni attending?",
    timestamp: "2 days ago",
    likes: [1, 2, 102],
    comments: [
      { id: 3, authorId: 2, content: "Fantastic, Ngozi! I'll be there. Let's connect.", timestamp: "1 day ago" }
    ]
  },
  {
    id: 4,
    authorId: 6,
    content: "Just migrated our entire CI/CD pipeline to Kubernetes. What a learning curve! Happy to share some tips on managing stateful applications if anyone is interested. #DevOps #CloudNative",
    timestamp: "3 days ago",
    likes: [1, 3, 4],
    comments: []
  },
  {
    id: 5,
    authorId: 1,
    content: "Found this old photo from our final year project defense. Good times! Missing the uni days. How is everyone doing?",
    timestamp: "4 days ago",
    likes: [2, 3, 4, 5, 6],
    comments: [
      { id: 4, authorId: 3, content: "Wow, what a throwback! We look so young 😂", timestamp: "3 days ago" },
      { id: 5, authorId: 2, content: "I remember the stress of that day. Great memories though.", timestamp: "3 days ago" }
    ]
  }
];

export const INITIAL_CONVERSATIONS_DATA: Conversation[] = [
    {
        id: 1,
        participantIds: [CURRENT_USER_ID, 1],
        messages: [
            { id: 1, authorId: 1, content: "Hi! Thanks for reaching out. I'm doing great, Microsoft is an amazing place to work.", timestamp: "1 day ago", read: true, type: 'text' },
            { id: 2, authorId: CURRENT_USER_ID, content: "That's great to hear, Adaora. We're planning an alumni event and would love for you to be a speaker. Would you be interested?", timestamp: "23 hours ago", read: true, type: 'text' },
            { id: 3, authorId: 1, content: "I'd be honored! Send me the details.", timestamp: "15 hours ago", read: false, type: 'text' }
        ]
    },
    {
        id: 2,
        participantIds: [CURRENT_USER_ID, 4],
        messages: [
            { id: 1, authorId: 4, content: "Let's catch up soon.", timestamp: "3 days ago", read: true, type: 'text' }
        ]
    },
    {
        id: 3,
        participantIds: [CURRENT_USER_ID, 2],
        messages: [
            { id: 1, authorId: CURRENT_USER_ID, content: "Hi Dr. Nnadi, I saw your latest publication on federated learning. Incredible work!", timestamp: "2 days ago", read: true, type: 'text' },
            { id: 2, authorId: 2, content: "Thank you! I appreciate you reading it. It was a fascinating project.", timestamp: "1 day ago", read: true, type: 'text' },
            { id: 3, authorId: CURRENT_USER_ID, content: "We'd love to feature it in our next alumni newsletter if you're open to it.", timestamp: "1 day ago", read: true, type: 'text' },
            { id: 4, authorId: 2, content: "Certainly. I can send over a summary.", timestamp: "5 hours ago", read: false, type: 'text' }
        ]
    },
    {
        id: 4,
        participantIds: [CURRENT_USER_ID, 6],
        messages: [
            { id: 1, authorId: CURRENT_USER_ID, content: "Hi Chukwudi, your post about Kubernetes was very insightful. Our team is considering a similar migration.", timestamp: "4 days ago", read: true, type: 'text' },
            { id: 2, authorId: 6, content: "Glad you found it helpful! Let me know if you have any specific questions. It's a game-changer.", timestamp: "4 days ago", read: true, type: 'text' }
        ]
    }
];
