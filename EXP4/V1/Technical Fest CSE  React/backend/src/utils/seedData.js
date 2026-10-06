// Initial content, transcribed from the existing frontend pages.
// Seeding only inserts what is missing, so re-running never overwrites edits made through the API.

export const settings = {
  eventName: "HASH '27",
  registrationOpen: true,
  registrationClosesAt: null, // no deadline until an admin sets one via PATCH /api/settings
  days: [
    { day: 1, weekday: 'Wednesday', dateLabel: 'October 14, 2027' },
    { day: 2, weekday: 'Thursday', dateLabel: 'October 15, 2027' },
    { day: 3, weekday: 'Friday', dateLabel: 'October 16, 2027' },
  ],
};

const ev = (day, sortOrder, slug, time, title, category, venue, extra = {}) => ({
  day, sortOrder, slug, time, title, category, venue, ...extra,
});

export const events = [
  ev(1, 1, 'hackathon', '09:00 AM', 'ByteCraft Hackathon Kickoff', 'Development', 'Software Lab 1', {
    badgeText: '24 HR', badgeStyle: 'live', isTeamEvent: true,
  }),
  ev(1, 2, 'web3-talk', '10:30 AM', 'Architecting the Metaverse: Web3 & Beyond', 'Keynote Talk', 'Pascal Hall'),
  ev(1, 3, 'figma-wars', '11:15 AM', 'UI/UX Figma Wars', 'Design Match', 'Language Lab'),
  ev(1, 4, 'dl-workshop', '01:30 PM', 'Neural Networks & Deep Learning Essentials', 'Workshop', 'AI Lab'),
  ev(1, 5, 'speed-coding', '03:00 PM', 'Algorithmic Combat (Speed Coding Sprint)', 'Competition', 'CCF'),

  ev(2, 1, 'hackathon-judge', '09:00 AM', 'Hackathon Judgement & Project Pitches', 'Evaluation', 'Software Lab 2'),
  ev(2, 2, 'ctf', '10:00 AM', 'Cyber Crypt (Capture The Flag Jeopardy)', 'Cybersecurity', 'Software Lab 4'),
  ev(2, 3, 'quantum-talk', '11:30 AM', 'The Quantum Leap: Next Gen AI', 'Expert Talk', 'Aryabhatta Hall'),
  ev(2, 4, 'prompt-masterclass', '01:30 PM', 'Prompt Engineering Masterclass', 'Hands-on Session', 'AI Lab'),
  ev(2, 5, 'ai-battle', '03:30 PM', 'AI Prompt Battle Arena', 'Competition', 'Software Lab 3'),

  ev(3, 1, 'robo-maze', '09:30 AM', 'Robo-Code: Autonomous Maze Solvers', 'Robotics', 'CCF'),
  ev(3, 2, 'startup-panel', '11:00 AM', 'Silicon Valley Mindset & Tech Startup Panel', 'Fireside Chat', 'Senatus Hall'),
  ev(3, 3, 'bug-hunt', '01:30 PM', 'Bug Hunting Championship', 'Debugging Race', 'Software Lab 1'),
  ev(3, 4, 'valedictory', '03:30 PM', "HASH '27 Valedictory & Award Ceremony", 'Closing Ceremony', 'Amenity Center', {
    badgeText: 'FINAL', badgeStyle: 'closing',
  }),
];

const CSE = 'Computer Science & Engineering';
const tm = (section, order, name, role, department, photo) => ({
  section, order, name, role, department, photoUrl: `/assets/${photo}`,
});

export const team = [
  tm('faculty-coordinator', 1, 'Ms. Chandrika Rajan', 'Faculty Coordinator', CSE, 'team-chandrika.jpg'),
  tm('student-coordinator', 1, 'E V Jishnu', 'Student Coordinator', CSE, 'team-jishnu.jpg'),

  tm('technical', 1, 'Amaldev S S', 'Technical Lead', 'Web & Infrastructure', 'team-amaldev.jpg'),
  tm('technical', 2, 'Harigovind S B', 'Technical Co-Lead', 'Backend & Systems', 'team-harigovind.jpg'),
  tm('technical', 3, 'Henok Anil Anton', 'Technical Support', 'Hardware & Networking', 'team-henok.jpg'),

  tm('event-management', 1, 'Diya Mathews', 'Events Head', 'Planning & Operations', 'team-diya.jpg'),
  tm('event-management', 2, 'Elza Sabu', 'Events Co-Head', 'Scheduling & Logistics', 'team-elza.png'),
  tm('event-management', 3, 'Nandini P Nair', 'Event Coordinator', 'Workshops & Talks', 'team-nandini.jpg'),

  tm('creative-design', 1, 'Anna Jose', 'Creative Lead', 'UI/UX & Visual Design', 'team-anna-jose.jpg'),
  tm('creative-design', 2, 'Anna George', 'Design Co-Lead', 'Graphics & Branding', 'team-anna-george.jpg'),
  tm('creative-design', 3, 'Aadarsh Narayan P S', 'Content Writer', 'Copy & Documentation', 'team-aadarsh.jpg'),

  tm('outreach-pr', 1, 'Sara Robin Baby', 'PR Lead', 'Sponsorship & Outreach', 'team-sara.jpg'),
  tm('outreach-pr', 2, 'Nayana Anna Binu', 'PR Co-Lead', 'Social Media & Comms', 'team-nayana.jpg'),
  tm('outreach-pr', 3, 'Danil R A', 'Media Coordinator', 'Photography & Coverage', 'team-danil.jpg'),

  tm('operations-support', 1, 'Aakash Chandran', 'Operations Lead', 'Venue & Infrastructure', 'team-aakash.jpg'),
  tm('operations-support', 2, 'Adithya P', 'Support Coordinator', 'Volunteers & Hospitality', 'team-adithya.jpg'),
];

const sp = (tier, order, name, tagline, logo) => ({ tier, order, name, tagline, logoUrl: `/assets/${logo}` });

export const sponsors = [
  sp('title', 1, 'TechCorp International', 'Leading the future of innovation', 'sponsor-title.png'),
  sp('platinum', 1, 'CloudSys Technologies', 'Cloud infrastructure partner', 'sponsor-platinum1.png'),
  sp('platinum', 2, 'DataForge Labs', 'AI & analytics partner', 'sponsor-platinum2.png'),
  sp('gold', 1, 'NeuralNet Systems', 'Machine learning solutions', 'sponsor-gold1.png'),
  sp('gold', 2, 'CodeBase Ventures', 'Developer tools partner', 'sponsor-gold2.png'),
  sp('gold', 3, 'QuantumEdge Inc.', 'Cybersecurity partner', 'sponsor-gold3.png'),
  sp('silver', 1, 'PixelForge Studio', 'Design & creative partner', 'sponsor-silver1.png'),
  sp('silver', 2, 'DevStream Media', 'Streaming & content partner', 'sponsor-silver2.png'),
  sp('silver', 3, 'InnoCafe', 'Food & refreshments partner', 'sponsor-silver3.png'),
  sp('silver', 4, 'PrintWave', 'Merchandise & print partner', 'sponsor-silver4.png'),
  sp('community', 1, 'TechMeetup Kerala', 'Community outreach', 'sponsor-community1.png'),
  sp('community', 2, 'StudentDev Hub', 'Student developer network', 'sponsor-community2.png'),
  sp('community', 3, 'Campus Connect', 'Inter-college network', 'sponsor-community3.png'),
];

const gl = (order, n, label, alt) => ({
  order, label, alt, edition: '2025', imageUrl: `/assets/gallery-teaser${n}.png`,
});

export const gallery = [
  gl(1, 1, "Hackathon '25", 'HASH 2025 Hackathon'),
  gl(2, 2, "Workshops '25", 'HASH 2025 Workshop'),
  gl(3, 3, "Competitions '25", 'HASH 2025 Competition'),
  gl(4, 4, "Guest Talks '25", 'HASH 2025 Guest Talk'),
  gl(5, 5, "The Crew '25", 'HASH 2025 Team'),
  gl(6, 6, "Robotics '25", 'HASH 2025 Robotics'),
  gl(7, 7, "Prize Night '25", 'HASH 2025 Prize Night'),
];
