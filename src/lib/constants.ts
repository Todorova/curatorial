export const MET_API_BASE = 'https://collectionapi.metmuseum.org/public/collection/v1'

export const ITEMS_PER_PAGE = 12

export const DEPARTMENTS = [
  { departmentId: 0, displayName: 'All' },
  { departmentId: 11, displayName: 'European Paintings' },
  { departmentId: 21, displayName: 'Modern Art' },
  { departmentId: 6, displayName: 'Asian Art' },
  { departmentId: 13, displayName: 'Greek and Roman Art' },
  { departmentId: 10, displayName: 'Egyptian Art' },
  { departmentId: 14, displayName: 'Islamic Art' },
  { departmentId: 1, displayName: 'American Decorative Arts' },
  { departmentId: 9, displayName: 'Drawings and Prints' },
  { departmentId: 15, displayName: 'Arts of Africa, Oceania, and the Americas' },
  { departmentId: 12, displayName: 'Medieval Art' },
  { departmentId: 19, displayName: 'Photographs' },
  { departmentId: 17, displayName: 'Musical Instruments' },
  { departmentId: 4, displayName: 'Arms and Armor' },
  { departmentId: 5, displayName: 'The Costume Institute' },
] as const
