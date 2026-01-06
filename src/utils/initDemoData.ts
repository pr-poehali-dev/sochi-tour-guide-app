export const initDemoData = () => {
  const existingUsers = localStorage.getItem('sochi-users');
  
  if (!existingUsers || JSON.parse(existingUsers).length === 0) {
    const demoUsers = [
      {
        id: 'user-demo-1',
        email: 'anna@example.com',
        name: 'Анна Иванова',
        password: '123456',
        createdAt: new Date().toISOString(),
        preferences: {
          activities: ['beach', 'culture'],
          budget: 'premium' as const,
          travelStyle: 'relaxing' as const,
        },
      },
      {
        id: 'user-demo-2',
        email: 'dmitry@example.com',
        name: 'Дмитрий Петров',
        password: '123456',
        createdAt: new Date().toISOString(),
        preferences: {
          activities: ['active', 'nature'],
          budget: 'medium' as const,
          travelStyle: 'active' as const,
        },
      },
      {
        id: 'user-demo-3',
        email: 'elena@example.com',
        name: 'Елена Смирнова',
        password: '123456',
        createdAt: new Date().toISOString(),
        preferences: {
          activities: ['family', 'parks'],
          budget: 'medium' as const,
          travelStyle: 'family' as const,
        },
      },
    ];
    
    localStorage.setItem('sochi-users', JSON.stringify(demoUsers));
    
    localStorage.setItem('sochi-favorites-user-demo-1', JSON.stringify([1, 2, 3, 4, 5]));
    localStorage.setItem('sochi-favorites-user-demo-2', JSON.stringify([2, 4, 5, 6, 7]));
    localStorage.setItem('sochi-favorites-user-demo-3', JSON.stringify([1, 3, 7, 8, 9]));
  }
};
