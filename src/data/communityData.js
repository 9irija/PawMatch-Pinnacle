// ── Community Groups ──────────────────────────────────────────────────────────
export const COMMUNITIES = [
  // ── Singapore Special ──
  {
    id: 'sg-specials',
    name: 'Singapore Specials SG',
    emoji: '🐕',
    type: 'breed',
    description: 'For owners and fans of Singapore\'s beloved mixed-breed street dogs. Share your Specials\' journey!',
    memberCount: 248,
    linkedBreeds: ['singapore-special'],
  },
  // ── Breed groups ──
  {
    id: 'shih-tzu',
    name: 'Shih Tzu Owners SG',
    emoji: '🐩',
    type: 'breed',
    description: 'Singapore\'s most popular HDB breed. Share grooming tips, vet recs, and adorable photos!',
    memberCount: 412,
    linkedBreeds: ['shih-tzu'],
  },
  {
    id: 'poodle',
    name: 'Poodle & Doodle SG',
    emoji: '🦮',
    type: 'breed',
    description: 'All things Poodle, Maltipoo, Cavapoo, and Doodle in Singapore. Low-shed HDB heroes!',
    memberCount: 189,
    linkedBreeds: ['toy-poodle', 'miniature-poodle'],
  },
  {
    id: 'pomeranian',
    name: 'Pomeranian SG',
    emoji: '🦊',
    type: 'breed',
    description: 'Fluffy, bold, and perfectly HDB-sized. Singapore\'s Pom community!',
    memberCount: 276,
    linkedBreeds: ['pomeranian'],
  },
  {
    id: 'jack-russell',
    name: 'Jack Russell SG',
    emoji: '🐾',
    type: 'breed',
    description: 'Feisty, fearless, and full of energy. JRT owners share training tips and run spots.',
    memberCount: 143,
    linkedBreeds: ['jack-russell-terrier'],
  },
  {
    id: 'dachshund',
    name: 'Dachshund SG',
    emoji: '🌭',
    type: 'breed',
    description: 'Long, low, and full of personality. Dachshund owners unite in Singapore!',
    memberCount: 167,
    linkedBreeds: ['dachshund'],
  },
  {
    id: 'corgi',
    name: 'Corgi Lovers SG',
    emoji: '🍑',
    type: 'breed',
    description: 'For Pembroke & Cardigan fans. Yes, they need landed housing — but we love them anyway.',
    memberCount: 92,
    linkedBreeds: ['pembroke-welsh-corgi'],
  },
  // ── MBTI groups ──
  {
    id: 'mbti-calm',
    name: 'Calm & Independent Owners',
    emoji: '🌿',
    type: 'mbti',
    description: 'For INTJ, INTP, ISTJ, ISTP owners matched with calm, independent dogs. Quality over quantity.',
    memberCount: 134,
    linkedMbti: ['INTJ', 'INTP', 'ISTJ', 'ISTP'],
  },
  {
    id: 'mbti-social',
    name: 'Social & Energetic Owners',
    emoji: '⚡',
    type: 'mbti',
    description: 'For ENFP, ENTP, ENFJ, ENTJ owners with high-energy dogs who love adventure and people.',
    memberCount: 201,
    linkedMbti: ['ENFP', 'ENTP', 'ENFJ', 'ENTJ'],
  },
  {
    id: 'mbti-caring',
    name: 'Steady & Caring Owners',
    emoji: '💚',
    type: 'mbti',
    description: 'For ISFJ, INFJ, ISFP, INFP owners — nurturing, patient, and deeply bonded with their pets.',
    memberCount: 178,
    linkedMbti: ['ISFJ', 'INFJ', 'ISFP', 'INFP'],
  },
  {
    id: 'mbti-driven',
    name: 'Practical & Driven Owners',
    emoji: '🎯',
    type: 'mbti',
    description: 'For ESTJ, ESFJ, ESTP, ESFP owners. Structured schedules, training goals, community events.',
    memberCount: 156,
    linkedMbti: ['ESTJ', 'ESFJ', 'ESTP', 'ESFP'],
  },
  // ── Topic groups ──
  {
    id: 'vet-recs',
    name: 'Vet Recommendations SG',
    emoji: '🏥',
    type: 'topic',
    description: 'Find the best vets in Singapore. Reviews, pricing, emergency after-hours — all here.',
    memberCount: 523,
  },
  {
    id: 'groomer-reviews',
    name: 'Groomer Reviews SG',
    emoji: '✂️',
    type: 'topic',
    description: 'Honest groomer reviews from real dog owners. Find your pup\'s new favourite salon.',
    memberCount: 389,
  },
  {
    id: 'success-stories',
    name: 'Adoption Success Stories',
    emoji: '🌟',
    type: 'topic',
    description: 'Share your adoption journey. Inspire others to give shelter dogs a second chance.',
    memberCount: 312,
  },
  {
    id: 'new-adopters',
    name: 'New Adopters Corner',
    emoji: '🌱',
    type: 'topic',
    description: 'First-time dog owner? This is your safe space. No question is too basic here.',
    memberCount: 445,
  },
];

// ── Dummy Posts (shown when a community has no real Firestore posts yet) ────────
export const COMMUNITY_POSTS = {
  'sg-specials': [
    {
      id: 'd1', authorName: 'Priya M.', authorLetter: 'P', type: 'milestone',
      text: 'Milo hit 6 months with us today! 🎉 Rescued from SOSD last August — he was terrified of everything. Now he runs to greet every neighbour in our block. Singapore Specials are genuinely the most resilient dogs. Thank you to everyone who encouraged us through the first scary weeks.',
      likes: ['u1','u2','u3','u4','u5','u6','u7'], replyCount: 11, dummyTimeAgo: '2h ago',
    },
    {
      id: 'd2', authorName: 'Kevin T.', authorLetter: 'K', type: 'question',
      text: 'Our SG Special keeps eating grass at West Coast Park and then vomiting. Vet says she\'s fine but it happens every weekend. Anyone else deal with this? Any tips to redirect her?',
      likes: ['u1','u2','u3'], replyCount: 8, dummyTimeAgo: '5h ago',
    },
    {
      id: 'd3', authorName: 'Ling Hua', authorLetter: 'L', type: 'story',
      text: 'Just want to share — Biscuit was returned THREE times before we took him. Everyone said he was "too energetic" and "not affectionate enough." Six months in: he sleeps on my feet every night and follows me room to room. He just needed someone who wasn\'t looking for an easy dog. 🧡',
      likes: ['u1','u2','u3','u4','u5','u6','u7','u8','u9','u10','u11','u12'], replyCount: 19, dummyTimeAgo: '1d ago',
    },
    {
      id: 'd4', authorName: 'Raj S.', authorLetter: 'R', type: 'update',
      text: 'Passed our AVS licence renewal this morning — took about 15 minutes at the OneStop Animal Licensing counter at HDB Hub. Pro tip: bring your IC, the dog\'s microchip cert, and latest vaccination record. No appointment needed before 10am on weekdays.',
      likes: ['u1','u2','u3','u4'], replyCount: 5, dummyTimeAgo: '2d ago',
    },
    {
      id: 'd5', authorName: 'Amanda W.', authorLetter: 'A', type: 'question',
      text: 'Anyone found a good vet in the east that has experience with Singapore Specials? Our current vet at Tampines is retiring and I\'m looking for recommendations. Budget-conscious preferred but most importantly good with anxious dogs.',
      likes: ['u1','u2'], replyCount: 14, dummyTimeAgo: '3d ago',
    },
  ],
  'shih-tzu': [
    {
      id: 'd1', authorName: 'Grace K.', authorLetter: 'G', type: 'question',
      text: 'Which groomer in Singapore do you trust for Shih Tzus? My usual one at Bishan closed and I\'ve had two bad experiences with new places — both cut too short and nicked Mochi\'s ear once. Looking for someone gentle and experienced with the breed.',
      likes: ['u1','u2','u3','u4','u5'], replyCount: 16, dummyTimeAgo: '3h ago',
    },
    {
      id: 'd2', authorName: 'Ben L.', authorLetter: 'B', type: 'update',
      text: 'Hot tip: started mixing a small amount of bone broth (no onion/garlic) into Coco\'s kibble and her tear staining has improved noticeably over 3 weeks. Also switched to filtered water. Vet approved both. Not a cure but worth trying if you\'re fighting the staining battle.',
      likes: ['u1','u2','u3','u4','u5','u6','u7','u8'], replyCount: 9, dummyTimeAgo: '1d ago',
    },
    {
      id: 'd3', authorName: 'Mei Fong', authorLetter: 'M', type: 'milestone',
      text: 'Fluffy finally let me dry her ears with the blow dryer without the full drama production! 🎊 Only took 8 months of counter-conditioning with chicken treats. If your Shih Tzu hates grooming — don\'t give up. Patience + treats + very short sessions.',
      likes: ['u1','u2','u3','u4','u5','u6'], replyCount: 7, dummyTimeAgo: '2d ago',
    },
    {
      id: 'd4', authorName: 'Darren O.', authorLetter: 'D', type: 'question',
      text: 'Taro has been sneezing constantly for 3 days — vet says it\'s reverse sneezing and it\'s normal for the breed, but it sounds so alarming. Any Shih Tzu owners dealt with this? How did you manage it?',
      likes: ['u1','u2','u3'], replyCount: 12, dummyTimeAgo: '4d ago',
    },
  ],
  'pomeranian': [
    {
      id: 'd1', authorName: 'Hui Ting', authorLetter: 'H', type: 'update',
      text: 'Just survived Bao Bao\'s first full coat blow-out with a professional deshedding treatment at a groomer in Jurong. TWO garbage bags of undercoat. TWO. If you haven\'t done this with your Pom, you\'re living dangerously in Singapore\'s humidity. Worth every dollar.',
      likes: ['u1','u2','u3','u4','u5','u6','u7','u8','u9'], replyCount: 13, dummyTimeAgo: '4h ago',
    },
    {
      id: 'd2', authorName: 'Jason P.', authorLetter: 'J', type: 'question',
      text: 'My Pom has been scratching her paws like crazy after evening walks — vet checked for allergies (negative), no fleas. Thinking it\'s contact with something in the grass? Has anyone tried paw balm or foot soaks? What worked for you?',
      likes: ['u1','u2','u3'], replyCount: 9, dummyTimeAgo: '2d ago',
    },
    {
      id: 'd3', authorName: 'Selin A.', authorLetter: 'S', type: 'story',
      text: 'Moved from a condo to an HDB last year and was so worried about Ginger adjusting to the smaller space. Turns out she loves it — more corridor friends, more lift drama, more neighbours who give her treats. Poms are so adaptable. Just make sure they get their walks and they\'re happy anywhere.',
      likes: ['u1','u2','u3','u4','u5'], replyCount: 6, dummyTimeAgo: '5d ago',
    },
  ],
  'vet-recs': [
    {
      id: 'd1', authorName: 'Natalie C.', authorLetter: 'N', type: 'update',
      text: '⭐ Mount Pleasant (Whitley) — late night emergency with my dog on a Sunday. Wait was 40 min which felt like forever but the vet was thorough, explained everything, and didn\'t push unnecessary tests. Consultation: $85. Would go back. Having a 24hr clinic in SG is genuinely priceless.',
      likes: ['u1','u2','u3','u4','u5','u6','u7','u8','u9','u10'], replyCount: 8, dummyTimeAgo: '1h ago',
    },
    {
      id: 'd2', authorName: 'Thomas Y.', authorLetter: 'T', type: 'question',
      text: 'Anyone have experience with Amber Vet? Considering switching — current vet is good but 45 min away and Amber just opened a branch near me. Specifically need someone patient with an anxious rescue dog who hates being handled.',
      likes: ['u1','u2','u3','u4'], replyCount: 15, dummyTimeAgo: '6h ago',
    },
    {
      id: 'd3', authorName: 'Fiona S.', authorLetter: 'F', type: 'update',
      text: 'PSA: Jippo Vet at Punggol is genuinely one of the most affordable in SG without compromising quality. Basic consult is $45. They don\'t upsell. Dr. Chen takes her time and actually listens. 45-min wait time on weekends is the only downside. Bring a book.',
      likes: ['u1','u2','u3','u4','u5','u6','u7','u8'], replyCount: 11, dummyTimeAgo: '2d ago',
    },
    {
      id: 'd4', authorName: 'Marcus H.', authorLetter: 'M', type: 'question',
      text: 'Looking for a vet who offers payment plans or at least isn\'t going to quote $3,000 for exploratory surgery before trying anything else. My dog has a lump and I\'m worried. Is there a vet in the central/north area with fair pricing for working families?',
      likes: ['u1','u2','u3','u4','u5'], replyCount: 22, dummyTimeAgo: '3d ago',
    },
    {
      id: 'd5', authorName: 'Chloe W.', authorLetter: 'C', type: 'update',
      text: 'Reminder that SPCA runs subsidised vet clinics for lower-income households every Saturday morning. My neighbour (elderly auntie with a HDB dog) didn\'t know this existed for years. Please share with anyone who might need it.',
      likes: ['u1','u2','u3','u4','u5','u6','u7','u8','u9','u10','u11','u12','u13','u14'], replyCount: 17, dummyTimeAgo: '4d ago',
    },
  ],
  'new-adopters': [
    {
      id: 'd1', authorName: 'Weiling T.', authorLetter: 'W', type: 'question',
      text: 'Day 3 with our new dog. She\'s hiding under the bed and hasn\'t touched her food since we brought her home. The shelter said she was "friendly and outgoing" there. Is this normal? Should we be worried? We\'re trying not to force contact.',
      likes: ['u1','u2','u3','u4','u5'], replyCount: 18, dummyTimeAgo: '2h ago',
    },
    {
      id: 'd2', authorName: 'Alvin N.', authorLetter: 'A', type: 'update',
      text: 'Week 4 update: I was the person posting in a panic about toilet accidents everywhere. We had 3 weeks of daily disasters. This week? Zero accidents. What changed: every 2 hours outside, same grass patch, same word ("go potty"), treat IMMEDIATELY after. It just... clicked. Don\'t give up.',
      likes: ['u1','u2','u3','u4','u5','u6','u7','u8','u9','u10','u11'], replyCount: 14, dummyTimeAgo: '1d ago',
    },
    {
      id: 'd3', authorName: 'Jasmine R.', authorLetter: 'J', type: 'question',
      text: 'My neighbours complained about barking while I\'m at work. I\'m 2 weeks into adoption and she clearly has separation anxiety. I work 9-5 and feel terrible. Is a dog camera helpful? Has anyone used a dog trainer specifically for SA in Singapore?',
      likes: ['u1','u2','u3','u4'], replyCount: 21, dummyTimeAgo: '2d ago',
    },
    {
      id: 'd4', authorName: 'Patrick L.', authorLetter: 'P', type: 'milestone',
      text: 'Waffles slept through the night for the first time on Day 11! No crying, no howling. The thing that worked: an old t-shirt with my scent in his crate, a white noise machine on low, and honestly just waiting. It does get better. Hang in there, week-one people.',
      likes: ['u1','u2','u3','u4','u5','u6','u7','u8','u9'], replyCount: 9, dummyTimeAgo: '3d ago',
    },
  ],
  'success-stories': [
    {
      id: 'd1', authorName: 'Serene A.', authorLetter: 'S', type: 'story',
      text: 'Two years ago I almost returned Kopi to SOSD during week two. He had bitten me (fear bite — I didn\'t know), destroyed a cushion, and hadn\'t eaten in 5 days. Today he passed his basic obedience assessment and the trainer called him "one of the most emotionally attuned dogs" she\'d worked with. Every difficult dog is just a misunderstood one.',
      likes: ['u1','u2','u3','u4','u5','u6','u7','u8','u9','u10','u11','u12','u13','u14','u15'], replyCount: 28, dummyTimeAgo: '5h ago',
    },
    {
      id: 'd2', authorName: 'David K.', authorLetter: 'D', type: 'story',
      text: 'Adopted Poppy at age 9 — everyone said old dogs are "too hard" and "heartbreaking." She\'s been with us 14 months. She naps in a sunbeam every afternoon and waits by the door when she hears my keys. Senior dogs already know how to be dogs. They just need a place to finally rest.',
      likes: ['u1','u2','u3','u4','u5','u6','u7','u8','u9','u10','u11','u12','u13'], replyCount: 22, dummyTimeAgo: '1d ago',
    },
    {
      id: 'd3', authorName: 'Nurul H.', authorLetter: 'N', type: 'milestone',
      text: '365 days with Boba! She was labelled "not suitable for families with children" at the shelter. We have two kids (6 and 9). With slow introductions and clear rules, she\'s now their best friend and self-appointed nap companion. Labels are snapshots. They\'re not sentences.',
      likes: ['u1','u2','u3','u4','u5','u6','u7','u8','u9','u10','u11'], replyCount: 16, dummyTimeAgo: '2d ago',
    },
    {
      id: 'd4', authorName: 'Yi Xuan', authorLetter: 'Y', type: 'story',
      text: 'Quick appreciation post for ASD volunteers. When I was struggling in month one they texted weekly check-ins without me asking. When I had to travel they connected me with a foster volunteer to help. Shelters in Singapore don\'t just rehome dogs — they support the humans too. That support saved us.',
      likes: ['u1','u2','u3','u4','u5','u6','u7','u8','u9','u10','u11','u12','u13','u14','u15','u16','u17'], replyCount: 31, dummyTimeAgo: '4d ago',
    },
  ],
  'groomer-reviews': [
    {
      id: 'd1', authorName: 'Elaine C.', authorLetter: 'E', type: 'update',
      text: '⭐⭐⭐⭐⭐ Pawlicious (Buona Vista) — Daisy used to tremble the whole drive to the groomer. With this groomer she walks in on her own now. The groomer spends 10 min just letting the dog settle before touching anything. Small place, no rush, no cage dryers. Worth the waitlist.',
      likes: ['u1','u2','u3','u4','u5','u6','u7','u8'], replyCount: 7, dummyTimeAgo: '4h ago',
    },
    {
      id: 'd2', authorName: 'Ryan C.', authorLetter: 'R', type: 'question',
      text: 'Anyone tried mobile grooming in Singapore? I have an elderly dog who gets very stressed in the car and I think coming to us might help. Looking for recommendations for east or central. Any experience (good or bad) appreciated.',
      likes: ['u1','u2','u3','u4'], replyCount: 11, dummyTimeAgo: '2d ago',
    },
    {
      id: 'd3', authorName: 'Michelle T.', authorLetter: 'M', type: 'update',
      text: 'Gentle reminder to tip your groomers. They handle your dog for 2-3 hours, deal with scared/snappy dogs, work in hot conditions, and in Singapore are often freelance with no safety net. $10-20 on top of the bill goes a long way and means your dog gets the best groomer next time too.',
      likes: ['u1','u2','u3','u4','u5','u6','u7','u8','u9','u10','u11','u12'], replyCount: 8, dummyTimeAgo: '5d ago',
    },
  ],
  'mbti-calm': [
    {
      id: 'd1', authorName: 'Edmund T.', authorLetter: 'E', type: 'update',
      text: 'As an INTJ, I over-researched every decision before adopting. 47-item spreadsheet, three vet consultations, two trial fosters. And then Miso, a quiet 4-year-old Beagle mix, just sat next to me and that was it. The spreadsheet was irrelevant. Some decisions make themselves.',
      likes: ['u1','u2','u3','u4','u5','u6','u7','u8'], replyCount: 12, dummyTimeAgo: '1d ago',
    },
    {
      id: 'd2', authorName: 'Celine N.', authorLetter: 'C', type: 'question',
      text: 'Fellow introverts: how do you handle strangers constantly wanting to interact with your dog on walks? I matched with a calm dog precisely because I\'m not looking for a social icebreaker but Obi has become a void deck celebrity and now I have 20-minute neighbour conversations daily.',
      likes: ['u1','u2','u3','u4','u5'], replyCount: 19, dummyTimeAgo: '3d ago',
    },
  ],
  'jack-russell': [
    {
      id: 'd1', authorName: 'Samantha L.', authorLetter: 'S', type: 'update',
      text: 'Finally found the cure to Rocket\'s 6am zoomies: a 20-minute fetch session before 7am. He\'s dead tired by 7:30 and I get my morning back. JRT owners: the solution to every behaviour problem is almost always "more exercise than you think is possible."',
      likes: ['u1','u2','u3','u4','u5','u6','u7'], replyCount: 11, dummyTimeAgo: '3h ago',
    },
    {
      id: 'd2', authorName: 'Bryan F.', authorLetter: 'B', type: 'question',
      text: 'Pepper keeps escaping under the fence at my in-laws\' landed place. She can fit through gaps I\'d swear were impossible. Has anyone found a reliable fencing solution that doesn\'t cost as much as a renovation? She\'s 5kg of pure chaos.',
      likes: ['u1','u2','u3','u4'], replyCount: 14, dummyTimeAgo: '2d ago',
    },
  ],
};

// ── Upcoming Events ───────────────────────────────────────────────────────────
// Dates are set relative to a reference — update annually for the live version
export const EVENTS = [
  {
    id: 'sosd-march',
    title: 'SOSD Monthly Adoption Drive',
    date: '15 Mar 2026',
    dateShort: '15 Mar',
    location: 'West Coast Park Dog Run',
    organizer: 'SOSD',
    description: 'Meet adoptable dogs from SOSD\'s foster network. Bring your family and find your match!',
    organizerUrl: 'https://sosd.org.sg',
  },
  {
    id: 'spca-walk',
    title: 'SPCA Community Walk',
    date: '22 Mar 2026',
    dateShort: '22 Mar',
    location: 'Bishan–Ang Mo Kio Park',
    organizer: 'SPCA Singapore',
    description: 'Annual community walk to raise awareness for animal welfare. Dogs welcome on leash!',
    organizerUrl: 'https://www.spca.org.sg',
  },
  {
    id: 'nea-dog-run',
    title: 'New Dog Run Opening',
    date: '5 Apr 2026',
    dateShort: '5 Apr',
    location: 'Punggol Waterway Park',
    organizer: 'NParks / NEA',
    description: 'Grand opening of Punggol\'s newest off-leash dog run with agility equipment.',
    organizerUrl: 'https://www.nparks.gov.sg',
  },
  {
    id: 'sg-dog-festival',
    title: 'Singapore Dog Festival 2026',
    date: '12 Apr 2026',
    dateShort: '12 Apr',
    location: 'Gardens by the Bay (Meadow)',
    organizer: 'Pawjourr',
    description: 'Singapore\'s biggest dog lifestyle event. Live demos, adoption drives, food trucks, and more.',
    organizerUrl: 'https://pawjourr.com',
  },
  {
    id: 'asd-fair',
    title: 'ASD Rehoming Fair',
    date: '19 Apr 2026',
    dateShort: '19 Apr',
    location: 'Pasir Ris Park',
    organizer: 'Action for Singapore Dogs',
    description: 'Meet ASD\'s adorable rescues looking for forever homes. Open to families and singles!',
    organizerUrl: 'https://asdsingapore.com',
  },
];

// ── Shelter Spotlight ─────────────────────────────────────────────────────────
export const SHELTERS = [
  {
    id: 'sosd',
    name: 'SOSD',
    fullName: 'Save Our Street Dogs',
    emoji: '🐕',
    description: 'Singapore\'s largest dog rescue. Fosters 400+ dogs at any time, mostly Singapore Specials.',
    website: 'https://sosd.org.sg',
    facebook: 'https://www.facebook.com/SOSDsingapore',
    telegram: 'https://t.me/SOSDsingapore',
  },
  {
    id: 'spca',
    name: 'SPCA',
    fullName: 'Society for the Prevention of Cruelty to Animals',
    emoji: '🏠',
    description: 'Singapore\'s oldest animal welfare organisation. Dogs, cats, and small animals for adoption.',
    website: 'https://www.spca.org.sg',
    facebook: 'https://www.facebook.com/spca.singapore',
    telegram: 'https://t.me/spcasg',
  },
  {
    id: 'asd',
    name: 'ASD',
    fullName: 'Action for Singapore Dogs',
    emoji: '❤️',
    description: 'Volunteer-run rescue saving Singapore\'s stray and abandoned dogs since 2006.',
    website: 'https://asdsingapore.com',
    facebook: 'https://www.facebook.com/ActionForSingaporeDogs',
    telegram: null,
  },
  {
    id: 'oscas',
    name: 'OSCAS',
    fullName: 'Our Singapore Cats and Dogs',
    emoji: '🌟',
    description: 'Community-based rescue focused on TNR and rehoming strays across Singapore.',
    website: 'https://www.instagram.com/oscassg',
    facebook: 'https://www.facebook.com/oscas.sg',
    telegram: null,
  },
];
