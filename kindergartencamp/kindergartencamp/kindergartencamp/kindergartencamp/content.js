// =============================================================================
// KINDERGARTEN CAMP LEARNING CENTER (KCLC) — Site Content
// Extracted from kindergartencamp.com PDF pages (1–13)
// Structured for integration with DESIGN.md (BMW-inspired design system)
// =============================================================================

const siteContent = {

  // ---------------------------------------------------------------------------
  // BRAND & IDENTITY
  // ---------------------------------------------------------------------------
  brand: {
    name: "Kindergarten Camp Learning Center",
    shortName: "KCLC",
    tagline: "KCLC ANTIPOLO | KCLC MARIKINA — your child's learning camp of explorations",
    motto: "At KCLC, learning is always fun and children develop confidence in their skills through the support of their family, teachers and friends.",
    yearsOfService: 14,
    logo: "images/Hi-Res-KCLC-Logo.png",
    directress: "Ms. Lala Ticzon-Santos",
  },

  // ---------------------------------------------------------------------------
  // CONTACT INFORMATION
  // ---------------------------------------------------------------------------
  contact: {
    phones: {
      primary: ["+632 7796 2016", "+632 8650 4238"],
      secondary: ["+632 8986-7097", "+632 7796-2690"],
      mobile: ["+639175410608"],
    },
    directLine: "7796-2016",
    email: "info@kindergartencamp.com",
    officeHours: "Mon to Sat 7:30am to 5:30pm",
    staff: [
      { name: "Teacher Lala", phone: "0918-9258400" },
      { name: "Teacher Joanne", phone: "0917-5199858" },
    ],
  },

  // ---------------------------------------------------------------------------
  // LOCATIONS
  // ---------------------------------------------------------------------------
  locations: [
    {
      id: "antipolo",
      name: "KCLC — Antipolo",
      address: "47 Ticzon Park, P. Oliveros Street, Antipolo City, 1870 Rizal, Philippines",
    },
    {
      id: "marikina",
      name: "KCLC — Marikina",
      address: "103 Starlite St. Rancho 3 Estate, Concepcion Dos, Marikina City",
    },
  ],

  // ---------------------------------------------------------------------------
  // NAVIGATION
  // ---------------------------------------------------------------------------
  navigation: {
    main: [
      { label: "Home", href: "/" },
      { label: "Our Curriculum", href: "/our-curriculum" },
      { label: "Genuine Love for Reading", href: "/genuine-love-for-reading" },
      { label: "Readiness for Big School", href: "/readiness-for-big-school" },
      { label: "Confidence in Math", href: "/confidence-in-mathematics" },
      { label: "Online Enrollment", href: "/online-enrollment" },
      { label: "Contact Us", href: "/contact-us" },
    ],
  },

  // ---------------------------------------------------------------------------
  // IMAGES
  // ---------------------------------------------------------------------------
  images: {
    logo: "images/Hi-Res-KCLC-Logo.png",
    history: "images/KCLC History.jpg",
    heroSliders: [
      "images/slider1-min-1-1920x636.png",
      "images/slider3-min-1920x636.png",
      "images/slider10-min-1920x636.png",
      "images/adsummer-1920x636.jpg",
    ],
    landscape: "images/Optimized-3.5X2LANDSCAPE1-1-1.jpg",
    dayInKclc: [
      "images/adayinkclc1.png",
      "images/adayinkclc2.png",
      "images/adayinkclc3.png",
      "images/adayinkclc4.png",
      "images/adayinkclc5.png",
      "images/adayinkclc6.png",
      "images/adayinkclc7.png",
      "images/adayinkclc8.png",
      "images/adayinkclc9.png",
      "images/adayinkclc10.png",
    ],
    features: {
      brightStart: "images/bright-start-500x475.png",
      reading: "images/genuine love for reading.png",
      math: "images/math-buzz_final-500x475.png",
    },
  },

  // ---------------------------------------------------------------------------
  // PAGES
  // ---------------------------------------------------------------------------
  pages: {

    // =========================================================================
    // HOME PAGE
    // =========================================================================
    home: {
      id: "home",
      title: "Kindergarten Camp Learning Center",
      subtitle: "KCLC ANTIPOLO | KCLC MARIKINA — your child's learning camp of explorations",

      // Hero section — maps to DESIGN.md dark hero photography section
      hero: {
        heading: "Your Child's Learning Camp of Explorations",
        description: "At KCLC, learning is always fun and children develop confidence in their skills through the support of their family, teachers and friends.",
        sliderImages: [
          "images/slider1-min-1-1920x636.png",
          "images/slider3-min-1920x636.png",
          "images/slider10-min-1920x636.png",
          "images/adsummer-1920x636.jpg",
        ],
      },

      // Value propositions — maps to DESIGN.md white content section
      valueProps: [
        {
          icon: "self-directed",
          text: "Self-directed learners who are ready to learn and maximize their potential",
        },
        {
          icon: "social",
          text: "Geared towards social transformation and concern for environment",
        },
        {
          icon: "progressive",
          text: "Providing the best progressive education in the community for 14 years",
        },
      ],

      // Curriculum teaser — links to full curriculum page
      curriculumTeaser: {
        heading: "Our Curriculum",
        text: "At Kindergarten Camp (KCLC), the curriculum is based on a progressive approach focusing on content based instruction and interactive and integrative methods that are developmentally appropriate for children. It also adopts integrated thematic teaching and infuses the theory of multiple intelligences by Dr. Howard Gardner inside the classrooms, to discover each child's learning style and unique blend of intelligences.",
        cta: { label: "More About Us", href: "/our-curriculum" },
      },

      // Announcement banner
      announcement: {
        text: "ONLINE ENROLLMENT NOW AVAILABLE",
        href: "/online-enrollment",
      },

      // Feature cards — maps to DESIGN.md card components
      featureCards: [
        {
          id: "reading",
          heading: "Genuine Love for Reading",
          image: "images/genuine love for reading.png",
          summary: "KCLC is well-known for its Beginning Reading Program. As early as the toddler level, children are introduced to the fundamentals of Reading. KCLC aims to send an important message to children that reading is fun, exciting and worthwhile.",
          cta: { label: "Read More", href: "/genuine-love-for-reading" },
        },
        {
          id: "big-school",
          heading: "Readiness for Big School",
          image: "images/bright-start-500x475.png",
          summary: "KCLC graduates are primed for learning and success in grade school through a curriculum that fosters enhanced socio-emotional skills and independence. KCLC provides the perfect blend of fun and engaging activities as well as strong academic foundations in Reading and Math.",
          cta: { label: "Read More", href: "/readiness-for-big-school" },
        },
        {
          id: "math",
          heading: "Confidence in Math",
          image: "images/math-buzz_final-500x475.png",
          summary: "KCLC's approach to Numeracy emphasizes investigations in many different ways, building familiarity with numbers in playful multi-sensory situations carefully prepared by well-trained teachers and compatible with world-renowned math curriculum in Singapore and UK.",
          cta: { label: "Read More", href: "/confidence-in-mathematics" },
        },
      ],
    },

    // =========================================================================
    // OUR CURRICULUM
    // =========================================================================
    curriculum: {
      id: "our-curriculum",
      title: "Our Curriculum",
      content: [
        "At Kindergarten Camp (KCLC), the curriculum is based on a progressive approach focusing on content based instruction and interactive and integrative methods that are developmentally appropriate for children. It also adopts integrated thematic teaching and infuses the theory of multiple intelligences by Dr. Howard Gardner inside the classrooms, to discover each child's learning style and unique blend of intelligences. These forms enable learners to see the meaningful connections and interrelatedness across the content or skill areas that flow from the reality of their daily lives.",
        "Caring for the Environment and Social Studies are the cores of the curriculum. The school believes that every individual is connected and plays a vital role in the community. He/She must show concern for humanity and the environment. It is through the environment where each child explores and learns from.",
      ],
      highlights: [
        "Progressive approach with content-based instruction",
        "Interactive and integrative methods",
        "Developmentally appropriate for children",
        "Integrated thematic teaching",
        "Multiple intelligences theory by Dr. Howard Gardner",
        "Environment and Social Studies at the core",
      ],
    },

    // =========================================================================
    // GENUINE LOVE FOR READING
    // =========================================================================
    reading: {
      id: "genuine-love-for-reading",
      title: "Genuine Love for Reading",
      image: "images/genuine love for reading.png",
      content: [
        "KCLC is well-known for its Beginning Reading Program. As early as the toddler level, children are introduced to the fundamentals of Reading. KCLC aims to send an important message to children that reading is fun, exciting and worthwhile. They are exposed to a print rich environment, nature of storytelling as well as to a wide selection of appropriate and intellectually stimulating materials in school. Their early exposure excites their imagination and encourages them to understand the world around them. It enhances not only their listening skills and vocabulary but also reinforces their speaking skills.",
        "In another note, KCLC exerts its best effort to develop critical thinking skills among its students through its varied enticing teaching techniques. Children are trained to read with understanding and to follow directions thoroughly. They do not only learn how to read the conventional way but also get to exercise their minds on how to think out the box. These skills enable them to unlock the key to academic success. Their reading readiness allows them to comprehend lessons in other subject areas too. Due to this reason, majority of KCLC graduates cope up confidently with the demands and challenges in their chosen big schools because they are READERS!!! They carry along with them the solid foundation they received from their reading skills at KCLC. We take great pride and joy seeing them stand out among the rest!",
      ],
    },

    // =========================================================================
    // READINESS FOR BIG SCHOOL
    // =========================================================================
    bigSchool: {
      id: "readiness-for-big-school",
      title: "Readiness for Big School",
      image: "images/bright-start-500x475.png",
      content: [
        "KCLC graduates are primed for learning and success in grade school through a curriculum that fosters enhanced socio-emotional skills and independence. KCLC provides the perfect blend of fun and engaging activities as well as strong academic foundations in Reading and Math. Since these two subject areas are the cornerstones of learning, KCLC aims to have a remarkable outcome on each of its student on the basic competency in these studies. Children have their own unique blend of intelligences, aptitudes, and varying degree of attitudes. They achieve scholastic progress at different rates of speed. Due to this fact, nurturing atmosphere and developmentally appropriate materials are provided to their expanding knowledge and skills at KCLC.",
        "These necessities allow them to have enough confidence to persist in doing tasks independently, despite of any difficulty they may encounter. KCLC teaches its students to believe in themselves and to be the best that they can be. It is equally important that children develop all aspects of their physical, socio-emotional, and cognitive skills before they leap to the big schools of their choice. Let your children receive the same solid foundation and learning experience from KCLC which would definitely hone your child's abilities and be fully equipped to the challenges and demands of life.",
      ],
    },

    // =========================================================================
    // CONFIDENCE IN MATH
    // =========================================================================
    math: {
      id: "confidence-in-mathematics",
      title: "Confidence in Math",
      image: "images/math-buzz_final-500x475.png",
      content: [
        "KCLC's approach to Numeracy emphasizes investigations in many different ways, building familiarity with numbers in playful multi-sensory situations carefully prepared by well-trained teachers and compatible with world-renowned math curriculum in Singapore and UK.",
        "The essence of KCLC's math approach is its focus on hands-on activities as key to understanding math. Preschoolers use a variety of manipulatives which makes math learning more meaningful, practical and fun. With the use of manipulatives, students go beyond rote memorization of numbers and procedures and go deep into understanding number relationships, developing problem-solving skills and proficiency in calculations.",
        "Children are constantly challenged to make patterns, connections and articulate what they observe. They learn and speak the language of Math and can confidently explain math ideas and concepts to their peers and adults.",
        "Lastly, children exhibit confidence in math and problem-solving skills at an early age and acquire mathematical skills critical to life-long academic success.",
      ],
    },

    // =========================================================================
    // ONLINE ENROLLMENT ANNOUNCEMENT
    // =========================================================================
    onlineEnrollment: {
      id: "online-enrollment",
      title: "Announcement: Online Enrollment Now Available",
      content: [
        "Dear Parents,",
        "As a result of the Extended Community Quarantine due to the continuing COVID 19 pandemic, KCLC is now implementing online registration and enrollment for School Year 2020-2021. We are ascertaining the number of students for next SY. If you wish to reserve a slot or register and enroll online, kindly go to the enrollment page to fill out the online enrollment form. Upon receiving confirmation, you may pay reservation or enrollment fees directly through online payment or bank transfer.",
        "In case you have any queries regarding this new online registration and enrollment system, KCLC will be happy to get in touch with you to guide you through the process. New Schedule for the Opening of Classes will be further announced.",
      ],
      signOff: {
        closing: "Sincerely yours,",
        name: "Ms. Lala Ticzon-Santos",
        title: "School Directress",
      },
      cta: { label: "Go to Enrollment Form", href: "/enrollment-page" },
    },

    // =========================================================================
    // ENROLLMENT PAGE
    // =========================================================================
    enrollment: {
      id: "enrollment-page",
      title: "Enrollment Page",
      formDescription: "Fill out the online enrollment form below to reserve a slot or register and enroll your child.",
    },

    // =========================================================================
    // CONTACT US
    // =========================================================================
    contactUs: {
      id: "contact-us",
      title: "Contact Us",
      formIntro: "For your inquiries, kindly fill up this form:",
      visitHeading: "You may visit us at:",
      locations: [
        {
          name: "KCLC — Antipolo",
          address: "47 Ticzon Park, P. Oliveros Street, Antipolo City, Philippines",
        },
        {
          name: "KCLC — Marikina",
          address: "103 Starlite St. Rancho 3 Estate, Concepcion Dos, Marikina City",
        },
      ],
      callToAction: "Call or Text Teacher Lala at 0918-9258400 or Teacher Joanne at 0917-5199858.",
      directLine: "You may also call us through our direct line 7796-2016 to answer your queries.",
      emailLine: "Email us at info@kindergartencamp.com",
    },
  },

  // ---------------------------------------------------------------------------
  // FOOTER
  // ---------------------------------------------------------------------------
  footer: {
    addresses: [
      "103 Starlite St. Rancho 3, Marikina City",
      "P. Oliveros Street, 47, Ticzon Herbal Park, Antipolo, 1870 Rizal",
    ],
    contactLabel: "contact us for inquiries",
    contactHref: "/contact-us",
    phones: ["+632 8986-7097", "+632 7796-2690", "+639175410608"],
    email: "info@kindergartencamp.com",
  },
};

export default siteContent;
